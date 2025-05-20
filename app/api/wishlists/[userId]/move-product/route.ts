import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;
  const { productId, fromWishlistId, toWishlistId } = await req.json(); // frontend info

  if (!productId || !fromWishlistId || !toWishlistId) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), "data", "users", `${userId}.json`);
    const fileContents = await fs.readFile(filePath, "utf-8");
    const userData = JSON.parse(fileContents);

    // if wishlists are "valid"
    const fromWishlist = userData.wishlists?.find((w: any) => w.id === fromWishlistId);
    const toWishlist = userData.wishlists?.find((w: any) => w.id === toWishlistId);

    if (!fromWishlist || !toWishlist) {
      return new NextResponse("Wishlist(s) not found", { status: 404 });
    }

    const productIndex = fromWishlist.products?.findIndex((p: any) => p.productId === productId);
    if (productIndex === -1 || productIndex === undefined) {
      return new NextResponse("Product not found in source wishlist", { status: 404 });
    }

    const product = fromWishlist.products[productIndex];

    // Remove from orogonal wishlist
    fromWishlist.products.splice(productIndex, 1);

    // Add to target wishlist
    const existingInTarget = toWishlist.products?.find((p: any) => p.productId === productId);
    if (existingInTarget) {
      existingInTarget.quantity += product.quantity; // exists -> increase quantity of this product in target wishlist
    } else {
      toWishlist.products.push(product);
    }

    await fs.writeFile(filePath, JSON.stringify(userData, null, 2), "utf-8");

    return new NextResponse("Product moved successfully!", { status: 200 });
  } catch (error) {
    console.error("Error moving product between wishlists:", error);
    return new NextResponse("Failed to move product:(", { status: 500 });
  }
}
