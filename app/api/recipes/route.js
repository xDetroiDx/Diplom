// app/api/recipes/route.js

import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function POST(request) {
  const data = await request.json();
  const { title, body, steps } = data;

  const recipe = await prisma.recipe.create({
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

  return NextResponse.json(recipe);
}
