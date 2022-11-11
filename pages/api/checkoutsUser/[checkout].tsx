import clientPromise from "../../../lib/mongodb";

export default async (req, res) => {
   let id = req.query.checkout
   try {
       const client = await clientPromise;
       const db = client.db("SoundTrack");

       const users = await db
           .collection("checkouts")
           .findOne({ email: id })

       res.json(users);
   } catch (e) {
       console.error(e);
   }
};