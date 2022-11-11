import clientPromise from "../../../lib/mongodb";

export default async (req, res) => {
    let id = Number(req.query.idPlaylist)
    try {
        const client = await clientPromise;
        const db = client.db("SoundTrack");

        const users = await db
            .collection("playlists")
            .findOne({ id: id})

        res.json(users);
    } catch (e) {
        console.error(e);
    }
};