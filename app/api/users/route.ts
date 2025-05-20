import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

//NOTE - from here get also wishlists ?
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
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

    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error("Error getting user data:", error);
    return new NextResponse("User not found", { status: 404 });
  }
}

// Create new user
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    const isValidUserId =
      typeof userId === "string" && /^[a-z0-9\-]+$/.test(userId);

    if (!isValidUserId) {
      return new NextResponse("Invalid user ID format", { status: 400 });
    }

    console.log(userId);

    const userFilePath = path.join(
      process.cwd(),
      "data",
      "users",
      `${userId}.json`
    );

    // if user exists
    try {
      await fs.access(userFilePath);
      return new NextResponse("User already exists", { status: 409 });
    } catch {
      // continue
    }

    const newUserData = {
      userId,
      wishlists: [],
    };

    await fs.writeFile(
      userFilePath,
      JSON.stringify(newUserData, null, 2),
      "utf-8"
    );

    return NextResponse.json({ message: "User created!", userId });
  } catch (error) {
    console.error("Error while creating user:", error);
    return new NextResponse("Internal server error:(", { status: 500 });
  }
}
