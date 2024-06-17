import { PrismaClient } from '@prisma/client';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const uploadDir = path.join(process.cwd(), 'public/uploads');

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({ uploadDir, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err);
      return res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }

    console.log('Fields:', fields);
    console.log('Files:', files);

    try {
      const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
      const body = Array.isArray(fields.body) ? fields.body[0] : fields.body;

      // Обработка загрузки основного изображения рецепта
      let imageUrl = null;
      if (files.image) {
        const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
        console.log('Processing image file:', imageFile);

        const imageFileName = `${Date.now()}-${imageFile.originalFilename}`;
        const newFilePath = path.join(uploadDir, imageFileName);
        fs.renameSync(imageFile.filepath, newFilePath);
        imageUrl = imageFileName;  // сохраняем только имя файла
      }

      const recipe = await prisma.recipe.create({
        data: {
          title,
          body,
          imageUrl,  // сохраняем только имя файла в базе данных
        },
      });

      const stepsData = [];
      const ingredientsData = [];

      Object.keys(fields).forEach((key) => {
        if (key.startsWith('steps[') && key.endsWith('][description]')) {
          const index = key.match(/\d+/)[0];
          const description = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
          const stepFileKey = `steps[${index}][file]`;

          if (files[stepFileKey]) {
            const stepFile = Array.isArray(files[stepFileKey]) ? files[stepFileKey][0] : files[stepFileKey];
            console.log('Processing step file:', stepFile);
          
            const stepFileName = `${Date.now()}-${stepFile.originalFilename}`;
            const newStepFilePath = path.join(uploadDir, stepFileName);
            fs.renameSync(stepFile.filepath, newStepFilePath);
            stepsData.push({
              description,
              imageUrl: stepFileName,  // сохраняем только имя файла в базе данных
              recipeId: recipe.id,
            });
          } else {
            stepsData.push({
              description,
              imageUrl: null,
              recipeId: recipe.id,
            });
          }
        } else if (key.startsWith('ingredients[') && key.endsWith('][name]')) {
          const index = key.match(/\d+/)[0];
          const name = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
          const quantityKey = `ingredients[${index}][quantity]`;
          const quantity = Array.isArray(fields[quantityKey]) ? fields[quantityKey][0] : fields[quantityKey];
          ingredientsData.push({
            name,
            quantity,
            recipeId: recipe.id,
          });
        }
      });

      if (stepsData.length > 0) {
        await prisma.step.createMany({
          data: stepsData,
        });
      }

      if (ingredientsData.length > 0) {
        await prisma.ingredient.createMany({
          data: ingredientsData,
        });
      }

      console.log('Recipe, steps, and ingredients created successfully');
      return res.status(201).json({ message: 'Recipe created successfully' });
    } catch (error) {
      console.error('Error saving recipe:', error);
      return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  });
};

export default handler;