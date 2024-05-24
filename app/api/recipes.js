import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, body, steps } = req.body;
    try {
      const recipe = await prisma.recipes.create({
        data: {
          title,
          body,
          steps: {
            create: steps.map(step => ({
              description: step.description,
              imageUrl: step.imageUrl,
            })),
          },
        },
      });
      res.status(200).json(recipe);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create recipe' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
