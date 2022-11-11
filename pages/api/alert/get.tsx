import clientPromise from "../../../lib/mongodb";

export default async (req, res) => {
    let data = JSON.parse(req.body)
    try {
        const client = await clientPromise;
        const db = client.db("SoundTrack");

        let userJSON = await fetch(`http://localhost:3000/api/users/${data.email}`)
        let user = await userJSON.json()

        let search = await db.collection("alerts").findOne({
            id: user?.id,
            type: data.type
        })

        if (search) {
            res.json({
                existe: true,
                add: search?.id,
                to: search?.type
            })
        } else {
            res.json({
                existe: false,
            })
        }


    } catch (e) {
        console.error(e);
    }
};