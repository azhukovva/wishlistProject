/**
 *
 * PATCH /api/wishlists/[userId]/[wishlistId]/visibility - change visibility of specified wishlist
 *
 */

import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string; wishlistId: string } }
) {
  const { userId, wishlistId } = params;
  const { isPublic } = await req.json(); // wanted visibility

  //REVIEW - type control? need?
  if (typeof isPublic !== "boolean") {
    return new NextResponse("isPublic must be a boolean", { status: 400 });
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

    const wishlist = userData.wishlists?.find((w: any) => w.id === wishlistId);
    if (!wishlist) {
      return new NextResponse("Wishlist not found", { status: 404 });
    }

    wishlist.isPublic = isPublic;

    await fs.writeFile(filePath, JSON.stringify(userData, null, 2), "utf-8");

    return NextResponse.json({ wishlist }, { status: 200 });
  } catch (error) {
    console.error("Error updating wishlist visibility:", error);
    return new NextResponse("Failed to update visibility", { status: 500 });
  }
}
