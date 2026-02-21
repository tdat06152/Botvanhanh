import { google } from 'googleapis';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SHEET_ID = '18DrFZsubUWHdaiVR3cGSOs6E5OkICb7Zmwde0fTucW8';

async function test() {
    try {
        const keyFile = path.join(__dirname, 'service-account.json');
        console.log('Reading keyFile:', keyFile);
        const creds = JSON.parse(fs.readFileSync(keyFile, 'utf8'));
        console.log('Service Account Email:', creds.client_email);

        const auth = new google.auth.GoogleAuth({
            keyFile,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });
        const response = await sheets.spreadsheets.get({
            spreadsheetId: SHEET_ID,
        });

        console.log('✅ Kết nối thành công!');
        console.log('Tên file:', response.data.properties.title);
        console.log('Danh sách các tab:', response.data.sheets.map(s => s.properties.title));
    } catch (error) {
        console.error('❌ Lỗi chi tiết:');
        if (error.response && error.response.data) {
            console.error(JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error);
        }
    }
}

test();
