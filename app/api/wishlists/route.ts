import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  try {
    const filePath = path.join(process.cwd(), 'data', 'users', `${userId}.json`);
    const fileContents = await fs.readFile(filePath, 'utf-8');
    const userData = JSON.parse(fileContents);

    return NextResponse.json({ wishlists: userData.wishlists });
  } catch (error) {
    console.error('Error in wishlist request:', error);
    return new NextResponse('Error in wishlist request:', { status: 404 });
  }
}

