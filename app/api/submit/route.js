import path from "path";
import { writeFile } from "fs/promises";
import crypto from "crypto";
import { connectToDatabase } from "util/mongodb";
import { DEFAULT_CENTER } from "util/constants";

export const POST = async (req, res) => {
  const formData = await req.formData();

  const name = formData.get("name");
  if (!name) {
    return new Response("Please enter your name!", { status: 400 });
  }

  const file1 = formData.get("photo_1");
  const file2 = formData.get("photo_2");
  if (!file1 || !file2) {
    return new Response("Please upload 2 photos!", { status: 400 });
  }

  const coords1 = formData.get("coords_1");
  const coords2 = formData.get("coords_2");
  if (
    coords1 === JSON.stringify(DEFAULT_CENTER) ||
    coords2 === JSON.stringify(DEFAULT_CENTER)
  ) {
    return new Response("Please set both locations!", { status: 400 });
  }

  const buffer1 = Buffer.from(await file1.arrayBuffer());
  const buffer2 = Buffer.from(await file2.arrayBuffer());

  const hash1 = crypto.createHash("sha256").update(buffer1).digest("hex");
  const hash2 = crypto.createHash("sha256").update(buffer2).digest("hex");
  const extension1 = file1.name.split(".").pop();
  const extension2 = file2.name.split(".").pop();
  const filename1 = hash1 + "." + extension1;
  const filename2 = hash2 + "." + extension2;

  try {
    await writeFile(
      path.join(process.cwd(), "public/uploads/" + filename1),
      buffer1
    );
    await writeFile(
      path.join(process.cwd(), "public/uploads/" + filename2),
      buffer2
    );

    const { db } = await connectToDatabase();
    const result = await db.collection("submissions").insertMany([
      {
        fileName: filename1,
        name: name,
        coords: coords1,
        createdAt: Date.now(),
      },
      {
        fileName: filename2,
        name: name,
        coords: coords2,
        createdAt: Date.now(),
      },
    ]);
  } catch (error) {
    console.log("Error occured ", error);
    return new Response("Submission failed :(", { status: 500 });
  }

  return new Response("Submission received. Thanks!", { status: 200 });
};
