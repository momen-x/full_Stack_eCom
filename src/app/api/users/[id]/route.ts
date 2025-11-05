import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

interface RouteContext {
  params: Promise<{ id: string }>;
}
/**
 * @method GET
 * @route ~/api/users/[id]
 * @description display user info
 * @access private just by user or by admin
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const client = await clientPromise;
    const db = client.db("eComDB");
    const { id } = await context.params;

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    const user = await db.collection("users").findOne({
      _id: new ObjectId(id),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user,
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
