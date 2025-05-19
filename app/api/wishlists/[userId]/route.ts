import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';


export async function GET(
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  try {
    const filePath = path.join(process.cwd(), 'data', 'users', `${userId}.json`);
    const fileContents = await fs.readFile(filePath, 'utf-8');
    const userData = JSON.parse(fileContents);

    return NextResponse.json({ wishlists: userData.wishlists });
  } catch (error) {
    console.error('Error getting wishlists:', error);
    return new NextResponse('Error in wishlist request:', { status: 404 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;
  const body = await req.json();
  const { name, description = '' } = body;

  if (!name || typeof name !== 'string') {
    return new NextResponse('Wishlist name is required and must be a string', { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), 'data', 'users', `${userId}.json`);
    const fileContents = await fs.readFile(filePath, 'utf-8');
    const userData = JSON.parse(fileContents);

    const newWishlist = {
      id: uuidv4(),
      userId,
      name,
      description,
      products: [],
      isPublic: false,
      createdAt: new Date().toISOString()
    };

    userData.wishlists = userData.wishlists || [];
    userData.wishlists.push(newWishlist);

    await fs.writeFile(filePath, JSON.stringify(userData, null, 2), 'utf-8');

    return NextResponse.json({ wishlist: newWishlist }, { status: 201 });
  } catch (error) {
    console.error('Error creating wishlist:', error);
    return new NextResponse('Failed to create wishlist.', { status: 500 });
  }
}

