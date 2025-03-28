import { readdir, unlink } from "fs/promises";
import path from "path";
import { connectToDatabase } from "@/util/mongodb";

export async function POST(req) {
  const { db } = await connectToDatabase();
  await db.collection("submissions").deleteMany({});
  await db.collection("guesses").deleteMany({});
  await db.collection("teams").deleteMany({});

  // Clear the uploads folder
  const uploadsDir = path.join(process.cwd(), "uploads");
  const files = await readdir(uploadsDir);
  await Promise.all(files.map((file) => unlink(path.join(uploadsDir, file))));

  return new Response("Reset complete!", { status: 200 });
}
