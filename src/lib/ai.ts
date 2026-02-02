import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;

export function getAI(apiKey: string) {
    if (!genAI || (genAI as any).apiKey !== apiKey) {
        genAI = new GoogleGenerativeAI(apiKey);
    }
    return genAI;
}

export async function getEmbedding(apiKey: string, text: string) {
    const ai = getAI(apiKey);
    const model = ai.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(text);
    return result.embedding.values;
}

export async function chatWithContext(
    apiKey: string,
    query: string,
    context: string,
    history: { role: "user" | "model"; parts: { text: string }[] }[] = []
) {
    const ai = getAI(apiKey);
    const model = ai.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: `Bạn là Trợ lý nội bộ thông minh hỗ trợ vận hành bưu cục.
QUY TẮC:
1. Chỉ trả lời dựa trên CONTEXT được cung cấp.
2. Nếu không có trong CONTEXT, hãy lịch sự báo 'Hiện tại dữ liệu bưu cục chưa có thông tin này, vui lòng liên hệ quản lý'.
3. Trình bày đẹp mắt bằng markdown, dùng bold để nhấn mạnh ý chính.
4. Trả lời trực tiếp, không lặp lại câu hỏi.

CONTEXT:
${context}`
    });

    const chat = model.startChat({
        history: history,
    });

    const result = await chat.sendMessage(query);
    return result.response.text();
}
