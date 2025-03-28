import Result from "@/components/Result";
import styles from "@/styles/page.module.scss";
import { connectToDatabase } from "@/util/mongodb";

export default async function ResultsPage() {
  const { db } = await connectToDatabase();

  const submissions = await db
    .collection("submissions")
    .find()
    .sort({ fileName: 1 })
    .toArray();
  submissions.forEach((submission) => {
    delete submission._id;
  });

  const guesses = await Promise.all(
    submissions.map(async (submission) => {
      const guessesForSubmission = await db
        .collection("guesses")
        .find({ fileName: submission.fileName })
        .sort({ teamNum: 1 })
        .toArray();
      return guessesForSubmission.map(
        ({ teamNum, fileName, coords, name }) => ({
          teamNum,
          fileName,
          coords,
          name,
        })
      );
    })
  );

  return (
    <div className={styles.container}>
      {submissions.map((submission, i) => (
        <section key={submission.fileName}>
          <h2>Photo {i + 1}</h2>
          <Result submission={submission} guesses={guesses[i]} />
        </section>
      ))}
    </div>
  );
}

export const dynamic = "force-dynamic";
