/**
 * PRODUCT(s) API Routes
 *
 * GET /api/wishlists/[userId]/[wishlistId]/products/[productId] - info about specified product
 * POST /api/wishlists/[userId]/[wishlistId]/products/[productId] - add product to wishlist - with productId
 * DELETE /api/wishlists/[userId]/[wishlistId]/products/[productId] - deletes product from wishlist
 *
 */

import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// info about specified product
export async function GET(
  req: NextRequest,
  {
    params,
  }: { params: { userId: string; wishlistId: string; productId: string } }
) {
  const { userId, wishlistId, productId } = params;

  try {
    const filePath = path.join(
      process.cwd(),
      "data",
      "users",
      `${userId}.json`
    );
    const fileContents = await fs.readFile(filePath, "utf-8");
    const userData = JSON.parse(fileContents);

    const wishlist = userData.wishlists?.find((w: any) => w.id === wishlistId);
    if (!wishlist) {
      return new NextResponse("Wishlist not found", { status: 404 });
    }

    const product = wishlist.products?.find(
      (p: any) => p.productId === productId
    );
    if (!product) {
      return new NextResponse("Product not found in wishlist", { status: 404 });
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error("Error getting product from wishlist:", error);
    return new NextResponse("Failed to get product", { status: 500 });
  }
}

// Add product to wishlist
export async function POST(
  req: NextRequest,
  {
    params,
  }: { params: { userId: string; wishlistId: string; productId: string } }
) {
  const { userId, wishlistId, productId } = params;

  try {
    const filePath = path.join(
      process.cwd(),
      "data",
      "users",
      `${userId}.json`
    );
    const fileContents = await fs.readFile(filePath, "utf-8");
    const userData = JSON.parse(fileContents);

    const wishlist = userData.wishlists?.find((w: any) => w.id === wishlistId);
    if (!wishlist) {
      return new NextResponse("Wishlist not found", { status: 404 });
    }

    const existingProduct = wishlist.products.find(
      (p: any) => p.productId === productId
    );
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      wishlist.products.push({ productId, quantity: 1 });
    }

    await fs.writeFile(filePath, JSON.stringify(userData, null, 2), "utf-8");

    return NextResponse.json({ wishlist }, { status: 200 });
  } catch (error) {
    console.error("Error adding product to wishlist:", error);
    return new NextResponse("Failed to add product", { status: 500 });
  }
}

// Remove product from wishlist
export async function DELETE(
  req: NextRequest,
  {
    params,
  }: { params: { userId: string; wishlistId: string; productId: string } }
) {
  const { userId, wishlistId, productId } = params;

  try {
    const filePath = path.join(
      process.cwd(),
      "data",
      "users",
      `${userId}.json`
    );
    const fileContents = await fs.readFile(filePath, "utf-8");
    const userData = JSON.parse(fileContents);

    const wishlist = userData.wishlists?.find((w: any) => w.id === wishlistId);
    if (!wishlist) {
      return new NextResponse("Wishlist not found", { status: 404 });
    }

    const productIndex = wishlist.products.findIndex(
      (p: any) => p.productId === productId
    );
    if (productIndex === -1) {
      return new NextResponse("Product not found in wishlist", { status: 404 });
    }
    // exists
    const product = wishlist.products[productIndex];
    if (product.quantity > 1) {
      product.quantity -= 1; // there is some same products
    } else {
      wishlist.products.splice(productIndex, 1);
    }

    await fs.writeFile(filePath, JSON.stringify(userData, null, 2), "utf-8");

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error removing product from wishlist:", error);
    return new NextResponse("Failed to remove product", { status: 500 });
  }
}
