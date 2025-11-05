import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { auth } from "@/auth";
import { ObjectId } from "mongodb";
import { selectTypeOfEdit } from "@/app/validation/UserSelectDataEdit";

/**
 * @method GET
 * @description display user data
 * @route ~/api/users
 * @access private - only admin can access user data
 */
export async function GET(request: NextRequest) {
  try {
    // // Check if user is admin
    // const session = await auth();
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json(
    //     { error: "Unauthorized - Admin access required" },
    //     { status: 403 }
    //   );
    // }

    const client = await clientPromise;
    const db = client.db("eComDB");
    const users = await db.collection("users").find().toArray();

    return NextResponse.json(
      {
        success: true,
        users,
        count: users.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch users",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * @method PATCH
 * @description Update user admin status
 * @route ~/api/users
 * @access private - only admin can modify admin status
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = selectTypeOfEdit.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { process } = validation.data;
    if (process === "editIsAdmin") {
      const session = await auth();
      const { userId, isAdmin } = validation.data;
      if (!session?.user?.isAdmin) {
        return NextResponse.json(
          { error: "Unauthorized - Admin access required" },
          { status: 403 }
        );
      }

      // const { process, isAdmin, userId } = await request.json();

      if (!userId) {
        return NextResponse.json(
          { error: "User ID is required" },
          { status: 400 }
        );
      }

      if (typeof isAdmin !== "boolean") {
        return NextResponse.json(
          { error: "isAdmin must be a boolean" },
          { status: 400 }
        );
      }

      // Prevent admin from removing their own admin status
      if (session.user.id === userId && !isAdmin) {
        return NextResponse.json(
          { error: "You cannot remove your own admin status" },
          { status: 400 }
        );
      }

      const client = await clientPromise;
      const db = client.db("eComDB");

      const result = await db
        .collection("users")
        .updateOne(
          { _id: new ObjectId(userId) },
          { $set: { isAdmin: isAdmin } }
        );

      if (result.matchedCount === 0) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      console.log(`✅ Updated user ${userId} admin status to: ${isAdmin}`);

      return NextResponse.json(
        {
          success: true,
          message: "User updated successfully",
          isAdmin,
          isSelf: session.user.id === userId, // Important for frontend
        },
        { status: 200 }
      );
    }

    if (process === "addOrRemoveItemFromWichlist") {
      const { userId, wishlist, productId } = validation.data;

      if (!userId) {
        return NextResponse.json(
          { error: "User ID is required" },
          { status: 400 }
        );
      }
      if (!wishlist) {
        return NextResponse.json(
          { error: "wishlist does not exist" },
          { status: 400 }
        );
      }
      if (!productId) {
        return NextResponse.json(
          { error: "product ID is required to add to wishlist" },
          { status: 400 }
        );
      }

      const client = await clientPromise;
      const db = client.db("eComDB");

      const checkList = wishlist.some((product) => product === productId);

      let updatedWishlist: string[];
      let actionType: "add" | "remove";

      if (checkList) {
        // Remove from wishlist
        updatedWishlist = wishlist.filter((product) => product !== productId);
        actionType = "remove";
      } else {
        // Add to wishlist
        updatedWishlist = [...wishlist, productId];
        actionType = "add";
      }

      // Update in database
      const result = await db
        .collection("users")
        .updateOne(
          { _id: new ObjectId(userId) },
          { $set: { wishlist: updatedWishlist } }
        );

      if (result.matchedCount === 0) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json(
        {
          success: true,
          type: actionType,
          productId: productId,
          wishlist: updatedWishlist,
        },
        { status: 200 }
      );
    } else {
      NextResponse.json(
        { message: "this process does not define" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("❌ Error updating user:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
