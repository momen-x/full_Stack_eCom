// scripts/fix-admin-types.ts
import clientPromise from "@/lib/db";

async function fixAdminTypes() {
  const client = await clientPromise;
  const db = client.db("eComDB");

  // Convert string "true"/"false" to boolean
  await db
    .collection("users")
    .updateMany({ isAdmin: "true" }, { $set: { isAdmin: true } });

  await db
    .collection("users")
    .updateMany({ isAdmin: "false" }, { $set: { isAdmin: false } });

  // Set default for users without isAdmin field
  await db
    .collection("users")
    .updateMany({ isAdmin: { $exists: false } }, { $set: { isAdmin: false } });

}

fixAdminTypes();
