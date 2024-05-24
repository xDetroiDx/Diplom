import prisma from '../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { title, body, steps } = await req.json();

    const recipe = await prisma.recipe.create({
      data: {
        title,
        body,
        steps: {
          create: steps.map((step, index) => ({
            number: index + 1,
            description: step.description,
            imageUrl: step.imageUrl
          }))
        }
      }
    });

    return NextResponse.json(recipe);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error saving recipe' }, { status: 500 });
  }
}
