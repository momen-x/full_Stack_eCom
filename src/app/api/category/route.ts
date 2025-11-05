import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { addCategortySchema } from "@/app/validation/categoryValidation";

/**
 * @method POST
 * @route ~/api/category
 * @description Create a new category
 * @access private - only admin can add new category
 */
export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("eComDB");

    // ✅ Get JSON data (not FormData since no file upload)
    const body = await request.json();


    // Validate category data with Zod
    const validation = addCategortySchema.safeParse(body);

    if (!validation.success) {
      console.error("❌ Validation error:", validation.error.issues);
      return NextResponse.json(
        {
          error: "Validation failed",
          message: validation.error.issues[0].message,
        },
        { status: 400 }
      );
    }

    // ✅ Check for duplicate category title
    const existingCategory = await db.collection("category").findOne({
      title: { $regex: new RegExp(`^${validation.data.title}$`, "i") },
    });

    if (existingCategory) {
      return NextResponse.json(
        {
          error: "Duplicate category",
          message: "A category with this title already exists",
        },
        { status: 409 } // Conflict
      );
    }

    // Insert category into database
    const categoryToInsert = {
      ...validation.data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("category").insertOne(categoryToInsert);


    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully",
        data: {
          categoryId: result.insertedId,
          title: validation.data.title,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error creating category:", error);
    return NextResponse.json(
      {
        error: "Failed to create category",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * @method GET
 * @route ~/api/category
 * @description Get all categories
 */
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("eComDB");

    const categories = await db
      .collection("category")
      .find()
      .sort({ createdAt: -1 }) // ✅ Sort by newest first
      .toArray();

    return NextResponse.json(
      {
        success: true,
        categories,
        count: categories.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch categories",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
