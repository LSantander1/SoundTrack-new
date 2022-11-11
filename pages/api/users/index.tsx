import clientPromise from "../../../lib/mongodb";

export default async (req, res) => {
   let id = req.query.userId
   try {
       const client = await clientPromise;
       const db = client.db("SoundTrack");

       const users = await db
           .collection("users")
           .find()
           .toArray()

       res.json(users);
   } catch (e) {
       console.error(e);
   }
};