import { connectToDatabase } from 'util/mongodb'
import Result from 'components/Result';
import styles from 'styles/SubmitPage.module.scss';

const ResultsPage = ({ submissions, guesses }) => {
  return (
    <div className={styles.container}>
        {submissions.map((submission, i) => (
            <Result submission={submission} guesses={guesses[i]} />
        ))}
    </div>
  );
};

export const getServerSideProps = async context => {
    const { db } = await connectToDatabase();

    const submissions = await db
        .collection('submissions')
        .find()
        .sort({ fileName: 1 })
        .toArray();

    const guesses = await Promise.all(submissions.map(async submission => {
        const guessesForSubmission = await db
            .collection('guesses')
            .find({ fileName: submission.fileName })
            .sort({ teamNum: 1 })
            .toArray();
        return guessesForSubmission.map(({ teamNum, fileName, coords, name }) => ({ teamNum, fileName, coords, name }));
    }));

    return {
        props: {
            submissions: submissions.map(({ fileName, name, coords }) => ({ fileName, name, coords })),
            guesses,
        },
    };
};

export default ResultsPage;
