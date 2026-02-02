import express from 'express';
import cors from 'cors';
import { google } from 'googleapis';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// CẤU HÌNH GOOGLE SHEET
const SHEET_ID = '10Dxx2PN5udPtsI3YG3PnwgLWTnMOT1h746dxMwvKJqo'; // ID Sheet mới
const RANGE = 'Answer!A2:E'; // Đọc từ dòng 2 (bỏ header) cột A đến E

// Khởi tạo Auth
const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, 'service-account.json'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

/**
 * Lấy dữ liệu từ Google Sheets
 */
app.get('/api/knowledge', async (req, res) => {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: RANGE,
        });

        const rows = response.data.values || [];
        // Chuyển đổi từ mảng của Google Sheet sang Object cho Frontend
        const data = rows.map((row, index) => ({
            q: row[0] || '',
            topic: row[1] || '',
            a: row[2] || '',
            embedding: row[3] ? JSON.parse(row[3]) : null,
            id: 'gsheet-' + index
        }));

        res.json(data);
    } catch (error) {
        console.error('Lỗi đọc Sheet:', error);
        res.status(500).json({ error: 'Không thể đọc dữ liệu từ Google Sheets. Hãy kiểm tra file service-account.json và quyền truy cập sheet.' });
    }
});

/**
 * Ghi dữ liệu lên Google Sheets (Ghi đè hoặc thêm mới tùy logic)
 */
app.post('/api/knowledge', async (req, res) => {
    try {
        const knowledge = req.body;

        // Chuyển đổi ngược lại từ Object sang mảng cho Google Sheet
        const values = knowledge.map(item => [
            item.q,
            item.topic,
            item.a,
            item.embedding ? JSON.stringify(item.embedding) : ''
        ]);

        // Hiện tại chúng ta dùng phương pháp ghi đè toàn bộ vùng dữ liệu để đồng bộ 100%
        await sheets.spreadsheets.values.update({
            spreadsheetId: SHEET_ID,
            range: RANGE,
            valueInputOption: 'RAW',
            requestBody: { values },
        });

        res.json({ message: 'Đã đồng bộ lên Google Sheets thành công!' });
    } catch (error) {
        console.error('Lỗi ghi Sheet:', error);
        res.status(500).json({ error: 'Không thể ghi dữ liệu lên Google Sheets.' });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🚀 Backend (Google Sheets Mode) đang chạy tại http://localhost:${PORT}`);
});
