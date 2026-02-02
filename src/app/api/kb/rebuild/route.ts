import { NextRequest, NextResponse } from "next/server";
import { getKB, saveKB } from "@/lib/store";
import { getEmbedding } from "@/lib/ai";

export async function POST(req: NextRequest) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return NextResponse.json({ error: "Server API Key is not configured" }, { status: 500 });

        const kb = getKB();
        const updatedKB = [];

        for (const entry of kb) {
            if (!entry.embedding) {
                const text = `Hỏi: ${entry.question}\nTrả lời: ${entry.answer}`;
                entry.embedding = await getEmbedding(apiKey, text);
            }
            updatedKB.push(entry);
        }

        saveKB(updatedKB);
        return NextResponse.json({ success: true, count: updatedKB.length });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
