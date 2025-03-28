import { connectToDatabase } from "util/mongodb";
import Result from "components/Result";
import styles from "styles/SubmitPage.module.scss";

const ResultsPage = async () => {
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
        <div key={submission.fileName}>
          <h2>Photo {i + 1}</h2>
          <Result submission={submission} guesses={guesses[i]} />
        </div>
      ))}
    </div>
  );
};

export default ResultsPage;
