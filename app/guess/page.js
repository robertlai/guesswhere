import { connectToDatabase } from "util/mongodb";

import GuessThing from "components/GuessThing";
import styles from "styles/SubmitPage.module.scss";

const GuessPage = async () => {
  const { db } = await connectToDatabase();

  const submissions = await db
    .collection("submissions")
    .find()
    .sort({ fileName: 1 })
    .toArray();

  const names = submissions.reduce((acc, cur) => {
    if (!acc.includes(cur.name)) {
      acc.push(cur.name);
    }
    return acc;
  }, []);

  return (
    <div className={styles.container}>
      <form action="/api/guess" method="post">
        <h2>Instructions</h2>
        <p>
          For each photo, drag the marker to the location where you think the
          photo was taken and enter the name of the team member that you think
          the photo was submitted by.
        </p>
        <br />
        <h2>Guesser</h2>
        <input type="text" name="team_num" id="team_num" />
        <br />
        <br />
        {submissions.map((sub, i) => (
          <GuessThing
            key={sub.fileName}
            fileName={sub.fileName}
            index={i}
            names={names}
          />
        ))}
        <input type="submit" value="Submit guesses" />
      </form>
    </div>
  );
};

export default GuessPage;
