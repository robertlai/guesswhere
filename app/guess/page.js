import GuessThing from "@/components/GuessThing";
import styles from "@/styles/page.module.scss";
import { connectToDatabase } from "@/util/mongodb";

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
        <section>
          <div>
            <h2>Instructions</h2>
            <p>
              For each photo, drag the marker to the location where you think
              the photo was taken and enter the name of the team member that you
              think the photo was submitted by.
            </p>
          </div>
        </section>
        <section>
          <div>
            <h2>Your name</h2>
            <input type="text" name="team_num" id="team_num" />
          </div>
        </section>
        {submissions.map((sub, i) => (
          <section key={sub.fileName}>
            <GuessThing fileName={sub.fileName} index={i} names={names} />
          </section>
        ))}
        <section>
          <input type="submit" value="Submit guesses" />
        </section>
      </form>
    </div>
  );
};

export default GuessPage;
