/**
 * PRODUCT(s) API Routes
 *
 * POST /api/products/[productId] - add product to app
 * DELETE /api/products/[productId] - deletes product from app
 *
 */

import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const productsFilePath = path.join(process.cwd(), "data", "products.json");

// add new product

export async function POST(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  const { productId } = params;

  let body;
  try {
    body = await req.json();
  } catch (err) {
    return new NextResponse("Invalid or missing JSON body", { status: 400 });
  }

  const { name, description, price } = body;

  if (!name || !description || typeof price !== "number") {
    return new NextResponse("Missing or invalid product data", {
      status: 400,
    });
  }

  try {
    const fileContents = await fs.readFile(productsFilePath, "utf-8");
    const products = JSON.parse(fileContents);

    if (products.find((p: any) => p.id === productId)) {
      return new NextResponse("Product with this ID already exists!", {
        status: 409,
      });
    }

    products.push({ id: productId, name, description, price });

    await fs.writeFile(
      productsFilePath,
      JSON.stringify(products, null, 2),
      "utf-8"
    );

    return NextResponse.json("Product added successfully", { status: 201 });
  } catch (error) {
    console.error("Error adding product:", error);
    return new NextResponse("Failed to add product", { status: 500 });
  }
}

// removes product in general from app
export async function DELETE(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  const { productId } = params;

  try {
    const fileContents = await fs.readFile(productsFilePath, "utf-8");
    const products = JSON.parse(fileContents);

    const updatedProducts = products.filter((p: any) => p.id !== productId);

    if (updatedProducts.length === products.length) {
      return new NextResponse("Product not found:(", { status: 404 });
    }

    await fs.writeFile(
      productsFilePath,
      JSON.stringify(updatedProducts, null, 2),
      "utf-8"
    );

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting product:", error);

    return new NextResponse("Failed to delete product", { status: 500 });
  }
}
