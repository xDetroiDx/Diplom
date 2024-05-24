import { NextResponse } from 'next/server';
import multer from 'multer';
import { promisify } from 'util';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { mkdir, access } from 'fs/promises';

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    try {
      await access(uploadDir);
    } catch (error) {
      await mkdir(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`);
  },
});

const upload = multer({ storage });
const uploadMiddleware = promisify(upload.single('file'));

export async function POST(req) {
  try {
    await uploadMiddleware(req);

    if (!req.file) {
      return NextResponse.json({ error: 'File not provided' }, { status: 400 });
    }

    const filePath = `/uploads/${req.file.filename}`;
    return NextResponse.json({ filePath });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
