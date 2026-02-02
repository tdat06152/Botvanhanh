import TelegramBot from 'node-telegram-bot-api';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

// ===== CẤU HÌNH =====
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const SHEET_ID = '10Dxx2PN5udPtsI3YG3PnwgLWTnMOT1h746dxMwvKJqo';
const RANGE = 'Answer!A2:E';

// API Keys Gemini (xoay vòng)
const API_KEYS = process.env.VITE_GEMINI_API_KEYS ? process.env.VITE_GEMINI_API_KEYS.split(',') : [];
let currentKeyIndex = 0;

function getGenAI() {
    const key = API_KEYS[currentKeyIndex % API_KEYS.length];
    return new GoogleGenerativeAI(key);
}

function rotateKey() {
    currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
    console.log(`🔄 Đã xoay sang API Key index: ${currentKeyIndex}`);
}

// ===== KẾT NỐI GOOGLE SHEETS =====
let auth;
if (process.env.GOOGLE_CREDS) {
    const credentials = JSON.parse(process.env.GOOGLE_CREDS);
    auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
} else {
    // Fallback: đọc file local
    auth = new google.auth.GoogleAuth({
        keyFile: './service-account.json',
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
}

const sheets = google.sheets({ version: 'v4', auth });

// ===== LẤY DỮ LIỆU TỪ GOOGLE SHEETS =====
async function getKnowledge() {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: RANGE,
        });
        const rows = response.data.values || [];
        return rows.map((row) => ({
            q: row[0] || '',
            topic: row[1] || '',
            a: row[2] || '',
            embedding: row[3] ? JSON.parse(row[3]) : null,
        }));
    } catch (error) {
        console.error('Lỗi lấy dữ liệu từ Google Sheets:', error);
        return [];
    }
}

// ===== TÍNH COSINE SIMILARITY =====
function cosineSimilarity(vecA, vecB) {
    let dotProduct = 0, mA = 0, mB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        mA += vecA[i] * vecA[i];
        mB += vecB[i] * vecB[i];
    }
    return dotProduct / (Math.sqrt(mA) * Math.sqrt(mB));
}

// ===== COMPUTE EMBEDDING =====
async function computeEmbedding(text) {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
    const result = await model.embedContent(text);
    return result.embedding.values;
}

// ===== TÌM KIẾM CONTEXT =====
async function retrieveContext(query, topK = 3) {
    const queryEmb = await computeEmbedding(query);
    const kb = await getKnowledge();

    const scoredKB = kb.map(item => {
        if (!item.embedding) return { ...item, score: 0 };
        return {
            ...item,
            score: cosineSimilarity(queryEmb, item.embedding)
        };
    });

    return scoredKB
        .sort((a, b) => b.score - a.score)
        .slice(0, topK);
}

// ===== HỎI ĐÁP BOT =====
async function askBot(query) {
    try {
        const hits = await retrieveContext(query);
        const relevantHits = hits.filter(h => h.score > 0.35);

        let context = "Không có thông tin phù hợp.";
        if (relevantHits.length > 0) {
            context = relevantHits.map(h => `[${h.topic}] ${h.q}: ${h.a}`).join("\n---\n");
        }

        const genAI = getGenAI();
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction: "Bạn là trợ lý hỗ trợ vận hành GHN. Trả lời câu hỏi một cách trực tiếp, ngắn gọn và đúng trọng tâm.\nLƯU Ý QUAN TRỌNG:\n- KHÔNG bao giờ nói 'Dựa trên context' hay 'Theo thông tin cung cấp'. Hãy trả lời như thể đó là kiến thức của bạn.\n- Nếu thông tin có trong quy trình, hãy hướng dẫn chi tiết từng bước.\n- Tuyệt đối không bịa đặt thông tin nếu không biết.\n- Trình bày RÕ RÀNG: Dùng gạch đầu dòng (-) hoặc số (1. 2. 3.) cho các bước. In đậm (**từ khóa**) các ý quan trọng."
        });

        const prompt = `CONTEXT:\n${context}\n\nCÂU HỎI: ${query}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;

        return {
            text: response.text(),
            sources: relevantHits
        };
    } catch (error) {
        if (error.message?.includes('429') || error.message?.includes('quota')) {
            rotateKey();
            return askBot(query); // Retry với key mới
        }
        return { text: "⚠️ Lỗi: " + error.message, sources: [] };
    }
}

// ===== TELEGRAM BOT =====
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

console.log('🤖 Telegram Bot đang chạy...');

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userMessage = msg.text;

    if (!userMessage) return;

    // Gửi typing indicator
    bot.sendChatAction(chatId, 'typing');

    try {
        const response = await askBot(userMessage);

        let replyText = response.text;

        // Format lại text: Thay **text** thành <b>text</b>
        replyText = replyText.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

        await bot.sendMessage(chatId, replyText, { parse_mode: 'HTML' });
    } catch (error) {
        console.error('Lỗi xử lý tin nhắn:', error);
        await bot.sendMessage(chatId, '⚠️ Đã xảy ra lỗi khi xử lý câu hỏi của bạn.');
    }
});

bot.on('polling_error', (error) => {
    console.error('Polling error:', error);
});
