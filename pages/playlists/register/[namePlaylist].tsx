import { getSession, useSession } from 'next-auth/react';
import clientPromise from '../../../lib/mongodb';

export default ({json, newId, musicBack}) => {
    let name = JSON.parse(json)

    setTimeout(() => {
        if(musicBack === 'Null-mb-st') {
            window.location.href = `/playlists/${newId}`
        } else {
            window.location.href = `/playlists/add/${newId}+--SoundTrackAdd--+${musicBack}`
        }
    }, 1500)

    return <>
        Registrando "{name}"... Aguarde
    </>
}

export async function getServerSideProps(context) {
    const session = await getSession(context);
    const url = context.query.namePlaylist.split('&musicBack=')
    const name = url[0]
    const musicBack = url[1]

    let userJSON = await fetch(`http://localhost:3000/api/users/${session?.user?.email}`)
    let author = await userJSON.json()

    let client = await clientPromise
    let db = client.db("SoundTrack")
    let plCount = await db.collection("playlists").find().toArray()
    let newId = plCount.length == 0 ? 1 : plCount[plCount.length-1].id+1
    db.collection("playlists").insertOne({
        name,
        author: session?.user?.email,
        capa: 'https://imgur.com/fgV6YNs.png',
        idAuthor: author.id,
        id: newId,
    }).then(() => {
        if(musicBack !== 'Null-mb-st') {
            
        }
        
    })
    

    // Upar imagem no AWS e pegar a URL 
    // let imageURL = AWS.url

    let json = JSON.stringify(name)

    return { props: {json, newId, musicBack} }
}