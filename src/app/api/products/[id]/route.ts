import clientPromise from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import addProductSchema from "@/app/validation/productValidation";
import { cloudinary } from "@/lib/cloudinary";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * @method GET
 * @route ~/api/product/[id]
 * @description get single product
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
        { error: "Invalid product ID format" },
        { status: 400 }
      );
    }

    const product = await db.collection("products").findOne({
      _id: new ObjectId(id),
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      product,
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// export async function PUT(
//   request: Request,
//    context: RouteContext
// ) {
//   try {
//     const { id } = await context.params;

//     if (!ObjectId.isValid(id)) {
//       return NextResponse.json(
//         { error: "Invalid product ID" },
//         { status: 400 }
//       );
//     }

//     const productData = await request.json();

//     // Validate required fields
//     if (!productData.name || !productData.description || productData.price === undefined) {
//       return NextResponse.json(
//         { error: "Name, description, and price are required" },
//         { status: 400 }
//       );
//     }

//     const client = await clientPromise;
//     const db = client.db("eComDB");

//     // Update product
//     const result = await db.collection("products").updateOne(
//       { _id: new ObjectId(id) },
//       {
//         $set: {
//           ...productData,
//           updatedAt: new Date(),
//         }
//       }
//     );

//     if (result.matchedCount === 0) {
//       return NextResponse.json(
//         { error: "Product not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       message: "Product updated successfully",
//       status: 200,
//     });
//   } catch (error) {
//     console.error("PUT Error:", error);
//     return NextResponse.json(
//       { error: "Failed to update product" },
//       { status: 500 }
//     );
//   }
// }
/**
 * @method PUT
 * @route ~/api/product/[id]
 * @description edit product info
 * @access private Just Admin can do this
 */
/**
 * @method PUT
 * @route ~/api/products/[id]
 * @description Update an existing product
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db("eComDB");
    // const { ObjectId } = require("mongodb");

    // Get FormData
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const priceStr = formData.get("price") as string;
    const price = parseFloat(priceStr);
    const imageFile = formData.get("image") as File | null;
    const categoryId = formData.get("categoryId") as string;

     const propertiesString = formData.get("properties") as string;
    const properties = propertiesString ? JSON.parse(propertiesString) : [];

    // Validate product data
    const validation = addProductSchema.safeParse({
      name,
      description,
      price,
      categoryId,
    });

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
       properties,
      updatedAt: new Date(),
    };

    // Handle new image upload if provided
    if (imageFile && imageFile.size > 0) {
      // Validate file type
      const validImageTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!validImageTypes.includes(imageFile.type)) {
        return NextResponse.json(
          {
            error: "Invalid file type",
            message: "Only JPEG, PNG, and WebP images are allowed",
          },
          { status: 400 }
        );
      }

      // Validate file size
      const maxSize = 5 * 1024 * 1024;
      if (imageFile.size > maxSize) {
        return NextResponse.json(
          {
            error: "File too large",
            message: "Image size must be less than 5MB",
          },
          { status: 400 }
        );
      }

      try {
        // ✅ Get old product to delete old image
        const oldProduct = await db.collection("products").findOne({
          _id: new ObjectId(id),
        });

        // Convert file to base64 and upload
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = `data:${imageFile.type};base64,${buffer.toString(
          "base64"
        )}`;

        const uploadResult = await cloudinary.uploader.upload(base64Image, {
          folder: "ecommerce-products",
          resource_type: "image",
          transformation: [
            { width: 1000, height: 1000, crop: "limit" },
            { quality: "auto" },
            { fetch_format: "auto" },
          ],
        });

        updateData.image = uploadResult.secure_url;
        updateData.cloudinaryPublicId = uploadResult.public_id;

        // ✅ Delete old image from Cloudinary if it exists
        if (oldProduct?.cloudinaryPublicId) {
          try {
            await cloudinary.uploader.destroy(oldProduct.cloudinaryPublicId);
          } catch (deleteError) {
            console.error("Failed to delete old image:", deleteError);
            // Don't fail the request if deletion fails
          }
        }
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return NextResponse.json(
          {
            error: "Image upload failed",
            message: "Failed to upload image to cloud storage",
          },
          { status: 500 }
        );
      }
    }

    // Update product in database
    const result = await db
      .collection("products")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      {
        error: "Failed to update product",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * @method DELETE
 * @route ~/api/products/[id]
 * @description Delete a product and its image
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db("eComDB");
    // const { ObjectId } = require("mongodb");

    // ✅ Get product to delete image from Cloudinary
    const product = await db.collection("products").findOne({
      _id: new ObjectId(id),
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // ✅ Delete image from Cloudinary if it exists
    if (product.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(product.cloudinaryPublicId);
      } catch (deleteError) {
        console.error("Failed to delete image from Cloudinary:", deleteError);
        // Continue with product deletion even if image deletion fails
      }
    }

    // Delete product from database
    await db.collection("products").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json(
      {
        success: true,
        message: "Product deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      {
        error: "Failed to delete product",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
