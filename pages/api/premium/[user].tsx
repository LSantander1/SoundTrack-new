import clientPromise from "../../../lib/mongodb";

export default async (req, res) => {
    let email = req.query.user
    try {
        const client = await clientPromise;
        const db = client.db("SoundTrack");

        let userJSON = await fetch(`http://localhost:3000/api/users/${email}`)
        let user = await userJSON.json()

        const users = await db
            .collection("premium")
            .findOne({ id: user.id })

        res.json(users);
    } catch (e) {
        console.error(e);
    }
};