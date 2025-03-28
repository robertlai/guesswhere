import { connectToDatabase } from "@/util/mongodb";

export async function POST(req) {
  const formData = await req.formData();

  const { db } = await connectToDatabase();
  const submissions = await db
    .collection("submissions")
    .find()
    .sort({ fileName: 1 })
    .toArray();

  await db.collection("teams").insertOne({
    num: formData.get("team_num"),
  });

  const guesses = submissions.map((sub, i) => ({
    teamNum: formData.get("team_num"),
    fileName: sub.fileName,
    coords: formData.get(`coords_${i}`),
    name: formData.get(`name_${i}`),
  }));

  await db.collection("guesses").insertMany(guesses);

  return new Response("Guesses received. Thanks!", { status: 200 });
}
