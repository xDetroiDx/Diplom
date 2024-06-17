import { NextResponse } from 'next/server';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE },
});

const uploadMiddleware = upload.single('file');

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export const runtime = 'nodejs';  // Указываем, что этот API Route должен выполняться на сервере

export async function POST(req, res) {
  try {
    await runMiddleware(req, res, uploadMiddleware);
    if (!req.file) {
      return res.status(500).json({ error: 'File not uploaded' });
    }
    console.log("Запрос", )

    const filePath = `/uploads/${req.file.filename}`;
    return res.status(200).json({ filePath });
  } catch (error) {
    console.error('Error uploading file:', error);
    return res.status(500).json({ error: 'File upload failed' });
  }
}
