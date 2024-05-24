import { promises as fs } from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Adjust the limit according to your needs
    },
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { file } = req.body;
      const base64Data = file.replace(/^data:image\/\w+;base64,/, "");
      const filePath = path.join(process.cwd(), 'public/uploads', `${Date.now()}.png`);
      await fs.writeFile(filePath, base64Data, 'base64');
      res.status(200).json({ filePath: `/uploads/${path.basename(filePath)}` });
    } catch (error) {
      res.status(500).json({ error: 'Failed to upload file' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
