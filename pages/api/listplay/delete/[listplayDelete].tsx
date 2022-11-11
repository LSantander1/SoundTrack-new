import clientPromise from "../../../../lib/mongodb";

export default async (req, res) => {
    let id = Number(req.query.listplaySearch)
    let data = JSON.parse(req.body)
    try {
        const client = await clientPromise;
        const db = client.db("SoundTrack");

        const list = await db
            .collection("listplay")
            .deleteOne({
                user: data.user,
                youtubeId: data.music
            })

        res.json('list');
    } catch (e) {
        console.error(e);
    }
};