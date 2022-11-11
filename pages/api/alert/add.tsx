import clientPromise from "../../../lib/mongodb";

export default async (req, res) => {
   let data = JSON.parse(req.body)
   try {
       const client = await clientPromise;
       const db = client.db("SoundTrack");

       let userJSON = await fetch(`http://localhost:3000/api/users/${data.email}`)
       let user = await userJSON.json()

       db.collection("alerts").insertOne({
        id: user?.id,
        type: data.type
       })

       res.json({
        correct: true,
        add: data.email,
        to: data.type
       })
   } catch (e) {
       console.error(e);
   }
};