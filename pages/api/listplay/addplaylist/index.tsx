import clientPromise from "../../../../lib/mongodb";

export default async (req, res) => {
    try {
        let data = JSON.parse(req.body)

        if (data?.function === 'addListplay') {
            const client = await clientPromise;
            const db = client.db("SoundTrack");

            await db.collection("listplay").insertOne({
                user: data.user,
                musicId: 1,
                youtubeId: data.musicId,
            })
        }

        res.json('list');
    } catch (e) {
        console.error(e);
    }
};