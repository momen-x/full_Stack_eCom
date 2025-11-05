import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { cloudinary } from "@/lib/cloudinary";
import addProductSchema from "@/app/validation/productValidation";

/**
 * @method POST
 * @route ~/api/products
 * @description Create a new product with Cloudinary image upload
 */
export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("eComDB");

    // Get FormData
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const priceStr = formData.get("price") as string;
    const price = parseFloat(priceStr);
    const categoryId = formData.get("categoryId");

    const imageFile = formData.get("image") as File | null;
    const properties = formData.get("properties");
    const parsedProperties = properties ? JSON.parse(properties as string) : [];

    // // Store in database
    // await db.collection("products").insertOne({
    //   name,
    //   description,
    //   price,
    //   categoryId,
    //   image,
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // });

    // Validate product data with Zod
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

    let imageUrl = "";
    let cloudinaryPublicId = "";

    // Handle image upload if provided
    if (imageFile && imageFile.size > 0) {
      // ✅ Validate file type
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

      // ✅ Validate file size (max 5MB)
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
        // Convert file to buffer and then to base64
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = `data:${imageFile.type};base64,${buffer.toString(
          "base64"
        )}`;

        // ✅ Upload to Cloudinary with optimizations
        const uploadResult = await cloudinary.uploader.upload(base64Image, {
          folder: "ecommerce-products",
          resource_type: "image",
          transformation: [
            { width: 1000, height: 1000, crop: "limit" }, // Max dimensions
            { quality: "auto" }, // Auto quality
            { fetch_format: "auto" }, // Auto format (WebP when supported)
          ],
        });

        imageUrl = uploadResult.secure_url;
        cloudinaryPublicId = uploadResult.public_id; // ✅ Save for potential deletion later
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

    // ✅ Insert product into database with additional metadata
    const productToInsert = {
      ...validation.data,
      properties: parsedProperties, // Add this
      image: imageUrl || null,
      cloudinaryPublicId: cloudinaryPublicId || null, // Store for deletion
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("products").insertOne(productToInsert);

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        data: {
          productId: result.insertedId,
          imageUrl: imageUrl || null,
        },
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
// export async function POST(request: NextRequest) {
//   try {
//     const client = await clientPromise;
//     const db = client.db("eComDB");

//     // Get FormData instead of JSON
//     const formData = await request.formData();

//     // Extract fields
//     const name = formData.get("name") as string;
//     const description = formData.get("description") as string;
//     const priceStr = formData.get("price") as string;
//     const price = parseFloat(priceStr);
//     const imageFile = formData.get("image") as File | null;

//     // Prepare data for validation (without file for now)
//     const productData = {
//       name,
//       description,
//       price,
//     };

//     // Validate basic fields with Zod
//     const validation = addProductSchema
//       .omit({ image: true })
//       .safeParse(productData);

//     if (!validation.success) {
//       return NextResponse.json(
//         {
//           message: validation.error.issues[0].message,
//           status: 400,
//         },
//         { status: 400 }
//       );
//     }

//     let imagePath = "";

//     // Handle image upload if provided
//     if (imageFile && imageFile.size > 0) {
//       // Validate file type
//       const validImageTypes = [
//         "image/jpeg",
//         "image/jpg",
//         "image/png",
//         "image/webp",
//         "image/gif",
//       ];
//       if (!validImageTypes.includes(imageFile.type)) {
//         return NextResponse.json(
//           {
//             message:
//               "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.",
//             status: 400,
//           },
//           { status: 400 }
//         );
//       }

//       // Validate file size (e.g., max 5MB)
//       const maxSize = 5 * 1024 * 1024; // 5MB
//       if (imageFile.size > maxSize) {
//         return NextResponse.json(
//           {
//             message: "File size too large. Maximum size is 5MB.",
//             status: 400,
//           },
//           { status: 400 }
//         );
//       }

//       // Create unique filename
//       const timestamp = Date.now();
//       const fileExtension = imageFile.name.split(".").pop();
//       const fileName = `product_${timestamp}.${fileExtension}`;

//       // Define upload directory
//       const uploadDir = join(process.cwd(), "public", "uploads", "products");

//       // Create directory if it doesn't exist
//       if (!existsSync(uploadDir)) {
//         await mkdir(uploadDir, { recursive: true });
//       }

//       // Convert file to buffer and save
//       const bytes = await imageFile.arrayBuffer();
//       const buffer = Buffer.from(bytes);
//       const filePath = join(uploadDir, fileName);

//       await writeFile(filePath, buffer);

//       // Store relative path for database
//       imagePath = `/uploads/products/${fileName}`;
//     }

//     // Insert product into database
//     const productToInsert = {
//       ...validation.data,
//       image: imagePath || null,
//       createdAt: new Date(),
//     };

//     const result = await db.collection("products").insertOne(productToInsert);

//     return NextResponse.json(
//       {
//         message: "Product created successfully",
//         productId: result.insertedId,
//         status: 201,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error creating product:", error);
//     return NextResponse.json(
//       {
//         error: "Failed to create product",
//         message: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 }
//     );
//   }
// }

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
