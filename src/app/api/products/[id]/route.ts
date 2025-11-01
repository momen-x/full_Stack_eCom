import clientPromise from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { join } from "path";
import { existsSync, mkdir, writeFile } from "fs";
import addProductSchema from "@/app/validation/productValidation";

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

    // Extract fields
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const priceStr = formData.get("price") as string;
    const price = parseFloat(priceStr);
    const imageFile = formData.get("image") as File | null;

    // Prepare data for validation
    const productData = {
      name,
      description,
      price,
    };

    // Validate basic fields
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

    // Prepare update object
    const updateData: any = {
      ...validation.data,
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

      // Validate file size
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
        await new Promise<void>((resolve, reject) => {
          mkdir(uploadDir, { recursive: true }, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      }

      // Save new file
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = join(uploadDir, fileName);

      await writeFile(filePath, buffer, (err) => {
        if (err) throw err;
      });

      // Add image path to update data
      updateData.image = `/uploads/products/${fileName}`;

      // Optional: Delete old image file here if needed
      // const oldProduct = await db.collection("products").findOne({ _id: new ObjectId(id) });
      // if (oldProduct?.image) {
      //   const oldImagePath = join(process.cwd(), "public", oldProduct.image);
      //   if (existsSync(oldImagePath)) {
      //     await unlink(oldImagePath);
      //   }
      // }
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
        message: "Product updated successfully",
        status: 200,
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
 * @route ~/api/product/[id]
 * @description delete single product
 * @access private - Only admin can do this
 */
export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    // console.log("DELETE route called with ID:", id);

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      // console.log("Invalid ObjectId format");
      return NextResponse.json(
        { error: "Invalid product ID format" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("eComDB");

    // console.log("Attempting to delete product with _id:", id);

    // Delete the product
    const result = await db.collection("products").deleteOne({
      _id: new ObjectId(id),
    });

    // console.log("Delete result:", result);
    // console.log("Deleted count:", result.deletedCount);

    // Check if product was found and deleted
    if (result.deletedCount === 0) {
      // console.log("Product not found");
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // console.log("Product deleted successfully");

    return NextResponse.json(
      {
        message: "Product deleted successfully",
        deletedId: id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
