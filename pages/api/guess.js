import { connectToDatabase } from 'util/mongodb'

export default async (req, res) => {
    const { db } = await connectToDatabase();

    const submissions = await db
        .collection('submissions')
        .find()
        .sort({ fileName: 1 })
        .toArray();

    const xd = await db
        .collection('teams')
        .insertOne({
            num: req.body.team_num,
        });

    const guesses = submissions.map((sub, i) => ({
        team: xd.insertedId,
        fileName: sub.fileName,
        coords: req.body[`coords_${i}`],
        name: req.body[`name_${i}`],
    }));

    const result = await db
        .collection('guesses')
        .insertMany(guesses);

    return res.status(200).send('Guesses received. Thanks!')
};
