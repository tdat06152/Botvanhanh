import fs from 'fs';
import path from 'path';

export interface KBEntry {
  id: string;
  question: string;
  topic: string;
  answer: string;
  embedding?: number[];
}

const STORE_PATH = path.join(process.cwd(), 'data', 'kb.json');

export function getKB(): KBEntry[] {
  if (!fs.existsSync(path.dirname(STORE_PATH))) {
    fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
  }
  
  if (!fs.existsSync(STORE_PATH)) {
    // Initial data based on the user's uploaded image
    const initialData: KBEntry[] = [
      { id: '1', question: 'GHN', topic: 'Khái niệm', answer: 'Giao Hàng Nhanh' },
      { id: '2', question: 'NVPTTT', topic: 'Khái niệm', answer: 'Nhân viên Phát triển thị trường' },
      { id: '3', question: 'NVXL', topic: 'Khái niệm', answer: 'Nhân viên xử lý' },
      { id: '4', question: 'POD là gì ?', topic: 'POD', answer: 'Là hình ảnh chứng minh quá trình giao nhận hàng hoá...' },
      { id: '5', question: 'Giao thành công là gì ?', topic: 'Khái niệm', answer: 'Giao Thành Công (viết tắt là GTC) là việc Nhân viên Phát triển thị trường giao đơn hàng cho người nhận...' },
    ];
    fs.writeFileSync(STORE_PATH, JSON.stringify(initialData, null, 2));
    return initialData;
  }

  const data = fs.readFileSync(STORE_PATH, 'utf-8');
  return JSON.parse(data);
}

export function saveKB(kb: KBEntry[]) {
  fs.writeFileSync(STORE_PATH, JSON.stringify(kb, null, 2));
}

export function cosineSimilarity(a: number[], b: number[]) {
  let dotProduct = 0;
  let mA = 0;
  let mB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    mA += a[i] * a[i];
    mB += b[i] * b[i];
  }
  mA = Math.sqrt(mA);
  mB = Math.sqrt(mB);
  if (mA === 0 || mB === 0) return 0;
  return dotProduct / (mA * mB);
}
