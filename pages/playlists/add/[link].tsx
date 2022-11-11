import Link from 'next/link'
import clientPromise from '../../../lib/mongodb'

export default function musicPL({ infos }) {
    return (<>
    </>)
}

export async function getServerSideProps(context) {
    const link = context.query.link
    let infos = link?.split("+--SoundTrackAdd--+")

    let db = (await clientPromise).db("SoundTrack").collection("playlists-musics")
    let plCount = await (await clientPromise).db("SoundTrack").collection("playlists-musics").find().toArray()
    
    let id = infos[1].replace('&BackOff', '')

    console.log(id)
    
    db.insertOne({
        music: id,
        playlist: Number(infos[0]),
        id: !plCount[0] ? 1 : plCount[plCount.length-1].id+1
    })


        return {
            redirect: {
              destination: `/musics/${id}`,
              permanent: false,
            },
        }

    return { props: { infos }}
}