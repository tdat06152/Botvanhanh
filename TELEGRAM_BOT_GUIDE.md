# Hướng dẫn chạy Telegram Bot

## Bước 1: Tạo Telegram Bot

1. Mở Telegram và tìm kiếm **@BotFather**
2. Gửi lệnh `/newbot`
3. Đặt tên cho bot (ví dụ: "Trợ lý GHN")
4. Đặt username cho bot (phải kết thúc bằng `bot`, ví dụ: `ghn_helper_bot`)
5. BotFather sẽ trả về **Token** (dạng: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)
6. Copy token này

## Bước 2: Cấu hình Token

1. Mở file `.env` trong thư mục project
2. Tìm dòng `TELEGRAM_BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN_HERE`
3. Thay `YOUR_TELEGRAM_BOT_TOKEN_HERE` bằng token vừa copy
4. Lưu file

## Bước 3: Chạy Bot

```bash
npm run telegram
```

Hoặc:

```bash
node telegram-bot.js
```

## Bước 4: Test Bot

1. Mở Telegram
2. Tìm kiếm bot của bạn (username vừa tạo)
3. Bấm **Start**
4. Gửi câu hỏi, ví dụ: "Quy trình xuất tải là gì?"
5. Bot sẽ trả lời dựa trên dữ liệu trong Google Sheets

## Lưu ý

- Bot cần chạy liên tục để hoạt động
- Nếu muốn chạy 24/7, bạn cần deploy lên server (VPS, Railway, Render, v.v.)
- Bot sử dụng cùng dữ liệu Google Sheets với Web App
- Hỗ trợ xoay vòng API Keys tự động khi gặp rate limit

## Troubleshooting

### Lỗi "Unauthorized"
- Kiểm tra lại Token trong file `.env`
- Đảm bảo không có khoảng trắng thừa

### Bot không trả lời
- Kiểm tra console xem có lỗi gì không
- Đảm bảo file `service-account.json` tồn tại
- Kiểm tra VITE_GEMINI_API_KEYS trong `.env`

### Lỗi "Cannot find module"
- Chạy lại `npm install`
