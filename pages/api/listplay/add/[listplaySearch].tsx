import clientPromise from "../../../../lib/mongodb";

export default async (req, res) => {
    let id = Number(req.query.listplaySearch)

    try {
        const client = await clientPromise;
        const db = client.db("SoundTrack");

        const list = await db
            .collection("listplay")
            .find({ user: id }).toArray()

        res.json(list);
    } catch (e) {
        console.error(e);
    }
};