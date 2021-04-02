import { connectToDatabase } from 'util/mongodb'

import GuessThing from 'components/GuessThing';
import styles from 'styles/SubmitPage.module.scss';

const GuessPage = ({ submissions, names }) => {
    return (
        <div className={styles.container}>
            <form action="/api/guess" method="post">
                <h2>Instructions</h2>
                <p>
                    For each photo, drag the marker to the location where you think
                    the photo was taken and enter the name of the team member that
                    you think the photo was submitted by.
                </p>
                <br />
                <h2>Team number</h2>
                <input type="number" name="team_num" id="team_num" />
                <br /><br />
                {submissions.map((sub, i) => (
                    <GuessThing key={sub.fileName} fileName={sub.fileName} index={i} names={names} />
                ))}
                <input type="submit" value="Submit guesses" />
            </form>
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

    const names = submissions.reduce((acc, cur) => {
        if (!acc.includes(cur.name)) {
            acc.push(cur.name);
        }
        return acc;
    }, []);

    return {
        props: {
            submissions: submissions.map(({ fileName }) => ({
                fileName,
            })),
            names,
        },
    };
};

export default GuessPage;
