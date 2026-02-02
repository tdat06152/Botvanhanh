import { NextRequest, NextResponse } from "next/server";
import { getKB, cosineSimilarity } from "@/lib/store";
import { chatWithContext, getEmbedding } from "@/lib/ai";

export async function POST(req: NextRequest) {
    try {
        const { message, history } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: "Server API Key is not configured" }, { status: 500 });
        }

        // 1. Get KB
        const kb = getKB();

        // 2. Embed user query
        const queryEmb = await getEmbedding(apiKey, message);

        // 3. Search KB
        const hits = kb
            .filter(item => item.embedding)
            .map(item => ({
                ...item,
                score: cosineSimilarity(queryEmb, item.embedding!)
            }))
            .filter(item => item.score > 0.45)
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);

        const context = hits.length > 0
            ? hits.map(h => `[${h.topic}] HỎI: ${h.question}\nTRẢ LỜI: ${h.answer}`).join("\n---\n")
            : "Không tìm thấy thông tin phù hợp.";

        // 4. Generate Answer
        const answer = await chatWithContext(apiKey, message, context, history);

        return NextResponse.json({ answer, hits: hits.map(h => ({ question: h.question, score: h.score })) });
    } catch (error: any) {
        console.error("Chat Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
