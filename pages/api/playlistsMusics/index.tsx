import clientPromise from "../../../lib/mongodb";

export default async (req, res) => {
   try {
       const client = await clientPromise;
       const db = client.db("SoundTrack");

       const users = await db
           .collection("playlists-musics")
           .find()
           .toArray()

       res.json(users);
   } catch (e) {
       console.error(e);
   }
};