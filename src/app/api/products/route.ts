import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import clientPromise from "@/lib/db";
import addProductSchema from "@/app/validation/productValidation";

/**
 * @method POST
 * @rote ~/api/product
 * @description create a new products
 *
 */
export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("eComDB");

    // Get FormData instead of JSON
    const formData = await request.formData();

    // Extract fields
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const priceStr = formData.get("price") as string;
    const price = parseFloat(priceStr);
    const imageFile = formData.get("image") as File | null;

    // Prepare data for validation (without file for now)
    const productData = {
      name,
      description,
      price,
    };

    // Validate basic fields with Zod
    const validation = addProductSchema
      .omit({ image: true })
      .safeParse(productData);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: validation.error.issues[0].message,
          status: 400,
        },
        { status: 400 }
      );
    }

    let imagePath = "";

    // Handle image upload if provided
    if (imageFile && imageFile.size > 0) {
      // Validate file type
      const validImageTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!validImageTypes.includes(imageFile.type)) {
        return NextResponse.json(
          {
            message:
              "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.",
            status: 400,
          },
          { status: 400 }
        );
      }

      // Validate file size (e.g., max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (imageFile.size > maxSize) {
        return NextResponse.json(
          {
            message: "File size too large. Maximum size is 5MB.",
            status: 400,
          },
          { status: 400 }
        );
      }

      // Create unique filename
      const timestamp = Date.now();
      const fileExtension = imageFile.name.split(".").pop();
      const fileName = `product_${timestamp}.${fileExtension}`;

      // Define upload directory
      const uploadDir = join(process.cwd(), "public", "uploads", "products");

      // Create directory if it doesn't exist
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      // Convert file to buffer and save
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = join(uploadDir, fileName);

      await writeFile(filePath, buffer);

      // Store relative path for database
      imagePath = `/uploads/products/${fileName}`;
    }

    // Insert product into database
    const productToInsert = {
      ...validation.data,
      image: imagePath || null,
      createdAt: new Date(),
    };

    const result = await db.collection("products").insertOne(productToInsert);

    return NextResponse.json(
      {
        message: "Product created successfully",
        productId: result.insertedId,
        status: 201,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      {
        error: "Failed to create product",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * @method GET
 * @route ~/api/product
 * @description get all products
 */
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("eComDB");
    const products = await db.collection("products").find().toArray();

    return NextResponse.json({
      products,
      count: products.length,
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
