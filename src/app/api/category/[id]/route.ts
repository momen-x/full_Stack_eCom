import clientPromise from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import {
  addCategortySchema,
  TCategory,
} from "@/app/validation/categoryValidation";
// import { cloudinary } from "@/lib/cloudinary";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * @method GET
 * @route ~/api/category/[id]
 * @description get single category
 * @access public
 */
export async function GET(request: Request, context: RouteContext) {
  try {
    const client = await clientPromise;
    const db = client.db("eComDB");
    const { id } = await context.params;

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid category ID format" },
        { status: 400 }
      );
    }

    const category = await db.collection("category").findOne({
      _id: new ObjectId(id),
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      category,
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

/**
 * @method PUT
 * @route ~/api/category/[id]
 * @description Update an existing category
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db("eComDB");
    const body = (await request.json()) as TCategory;
    // Validate category data

    const validation = addCategortySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          message: validation.error.issues[0].message,
        },
        { status: 400 }
      );
    }

    // Prepare update object
    const updateData: any = {
      ...validation.data,
      updatedAt: new Date(),
    };

    const result = await db
      .collection("category")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "category updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      {
        error: "Failed to update category",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}


/**
 * @method DELETE
 * @route ~/api/category/[id]
 * @description Delete a category, its image, and all associated products
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db("eComDB");

    // ✅ Get category to delete image from Cloudinary
    const category = await db.collection("category").findOne({
      _id: new ObjectId(id),
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // ✅ Delete image from Cloudinary if it exists
    // if (category.cloudinaryPublicId) {
    //   try {
    //     await cloudinary.uploader.destroy(category.cloudinaryPublicId);
    //   } catch (deleteError) {
    //     console.error("Failed to delete image from Cloudinary:", deleteError);
    //     // Continue with category deletion even if image deletion fails
    //   }
    // }

    // ✅ Find all products associated with this category
    const products = await db
      .collection("products")
      .find({ categoryId: id })
      .toArray();

    // ✅ Delete images from Cloudinary for all products (if using Cloudinary)
    // if (products.length > 0) {
    //   for (const product of products) {
    //     if (product.cloudinaryPublicId) {
    //       try {
    //         await cloudinary.uploader.destroy(product.cloudinaryPublicId);
    //       } catch (deleteError) {
    //         console.error(
    //           `Failed to delete product image from Cloudinary for product ${product._id}:`,
    //           deleteError
    //         );
    //       }
    //     }
    //   }
    // }

    // ✅ Delete all products associated with this category
    const deleteProductsResult = await db
      .collection("products")
      .deleteMany({ categoryId: id });

    // ✅ Delete category from database
    await db.collection("category").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json(
      {
        success: true,
        message: "Category deleted successfully",
        deletedProductsCount: deleteProductsResult.deletedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      {
        error: "Failed to delete category",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}