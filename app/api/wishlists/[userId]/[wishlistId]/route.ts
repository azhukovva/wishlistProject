import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// info about specified wishlist
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