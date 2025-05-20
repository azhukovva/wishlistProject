/**
 * WISHLIST(s) API Routes
 *
 * GET /api/wishlists/[userId] - all wishlist for specified user
 * POST /api/wishlists/[userId] - creates new wishlist for specified user
 * PATCH /api/wishlists/[userId]/[wishlistId] - change name and(or) description
 * DELETE /api/wishlists/[userId]/[wishlistId] - deletes wishlist
 *
 */

import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function GET({ params }: { params: { userId: string } }) {
  const { userId } = params;

  try {
    const filePath = path.join(
      process.cwd(),
      "data",
      "users",
      `${userId}.json`
    );
    const fileContents = await fs.readFile(filePath, "utf-8");
    const userData = JSON.parse(fileContents);

    return NextResponse.json({ wishlists: userData.wishlists });
  } catch (error) {
    console.error("Error getting wishlists:", error);
    return new NextResponse("Error in wishlist request:", { status: 404 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;
  const body = await req.json();
  const { name, description = "" } = body;

  if (!name || typeof name !== "string") {
    return new NextResponse("Wishlist name is required and must be a string", {
      status: 400,
    });
  }

  try {
    const filePath = path.join(
      process.cwd(),
      "data",
      "users",
      `${userId}.json`
    );
    const fileContents = await fs.readFile(filePath, "utf-8");
    const userData = JSON.parse(fileContents);

    const newWishlist = {
      id: uuidv4(),
      userId,
      name,
      description,
      products: [],
      isPublic: false,
      createdAt: new Date().toISOString(),
    };

    userData.wishlists = userData.wishlists || [];
    userData.wishlists.push(newWishlist);

    await fs.writeFile(filePath, JSON.stringify(userData, null, 2), "utf-8");

    return NextResponse.json({ wishlist: newWishlist }, { status: 201 });
  } catch (error) {
    console.error("Error creating wishlist:", error);
    return new NextResponse("Failed to create wishlist", { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string; wishlistId: string } }
) {
  const { userId, wishlistId } = params;
  const body = await req.json(); // data we send from frontend
  const { name, description } = body;

  if (!name || typeof name !== "string") {
    return new NextResponse("Wishlist name is required and must be a string", {
      status: 400,
    });
  }

  try {
    // check user's file
    const filePath = path.join(
      process.cwd(),
      "data",
      "users",
      `${userId}.json`
    );
    const fileContents = await fs.readFile(filePath, "utf-8");
    const userData = JSON.parse(fileContents);

    // desired wishlist
    const wishlist = userData.wishlists?.find((w: any) => w.id === wishlistId);
    if (!wishlist) {
      return new NextResponse("Wishlist not found", { status: 404 });
    }
    //REVIEW - control for empty name/description on BE or FE
    wishlist.name = name;
    if (description && typeof description === "string")
      wishlist.description = description;

    await fs.writeFile(filePath, JSON.stringify(userData, null, 2), "utf-8");

    return NextResponse.json({ wishlist }, { status: 200 });
  } catch (error) {
    console.error("Error updating wishlist:", error);
    return new NextResponse("Failed to update wishlist", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { userId: string; wishlistId: string } }
) {
  const { userId, wishlistId } = params;

  try {
    const filePath = path.join(
      process.cwd(),
      "data",
      "users",
      `${userId}.json`
    );
    const fileContents = await fs.readFile(filePath, "utf-8");
    const userData = JSON.parse(fileContents);

    const wishlistExists = userData.wishlists?.some(
      (w: any) => w.id === wishlistId
    );

    if (!wishlistExists)
      return new NextResponse("Wishlist not found", { status: 404 });

    userData.wishlists = userData.wishlists?.filter(
      (w: any) => w.id !== wishlistId
    );

    await fs.writeFile(filePath, JSON.stringify(userData, null, 2), "utf-8");
    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error("Error deliting wishlist:", error);
    return new NextResponse("Failed to delete wishlist", { status: 500 });
  }
}
