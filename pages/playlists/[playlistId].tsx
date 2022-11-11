import styles from "../../styles/Playlist.module.css"
import styles404 from "../../styles/Erro404.module.css"
import stylesCreate from "../../styles/PlaylistCreate.module.css"
import { getSession, useSession } from 'next-auth/react';
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from "react";
import { profile } from "console";
import clientPromise from '../../lib/mongodb';

export default ({ empacotadoINFOS, playlists, author, existe, type, musicBack }) => {
    const { data: session } = useSession()

    if (type === 'create') {
        
        return <>
            <div className={stylesCreate.body}>
                <div className={stylesCreate.form}>
                    <form className={stylesCreate.fields}>
                        <div className={stylesCreate.field}>
                            <a className={stylesCreate.titleField} id="teste">Nome da Playlist</a>
                            <a className={stylesCreate.alert} id="alert"></a>
                            <input type="text" className={stylesCreate.textField} id="inputName" placeholder="Funk Pesadão, Pagóde do Seu Zé, etc..." />
                        </div>
                    </form>
                    <div className={stylesCreate.btnDiv}>
                    <a className={stylesCreate.button} onClick={async () => {
                        let name = document.body.querySelector("#inputName").value
                        if (!name) {
                            document.body.querySelector("#inputName").style.border = "2px solid red"
                            document.body.querySelector("#alert").innerHTML = "Coloque um nome para a sua playlist!"
                        } else {
                            if(musicBack) {
                                window.location.href = `/playlists/register/${name}&musicBack=${musicBack}`
                            } else {
                                window.location.href = `/playlists/register/${name}&musicBack=Null-mb-st`
                            }
                            
                        }
                    }}>Criar</a>
                    </div>
                </div>
            </div>
        </>
    }

    if (!existe) {
        return (<>
            <header>
                <title>Página 404 - SoundTrack</title>
            </header>

            <div className={styles404.page}>
                <img src='/images/404.png'></img>
                <h1>Página não encontrada</h1>
                <h3>Houve um erro no carregamento da página.</h3>
                <h3>Verifique a URL</h3>
            </div>

        </>)
    }

    let infos = JSON.parse(empacotadoINFOS)

    let msg = ""
    const [musics, setMusicas] = useState(null)
    useEffect(() => {
        let musics = []

        playlists.map(async (musicDB) => {
            const musicaJSON = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2C%20statistics%2C%20contentDetails&id=${musicDB.music}&t&key=AIzaSyBt6QUXTgALK-r0THl-pbE09oFFdfCvwU4`)
            const musicaYT = await musicaJSON.json()
            const musicas = musicaYT.items[0]

            let temp = musicas.contentDetails.duration.replace('PT', '').replace('M', ':').replace('S', '')
            if (temp.endsWith(':')) temp = temp + '00'
            if (!musicas.contentDetails.duration.includes('M')) temp = '0:' + temp
            //console.log(musicas)

            let musica = {
                title: musicas?.snippet?.title,
                author: musicas?.snippet?.channelTitle,
                time: temp,
                capa: musicas?.snippet?.thumbnails?.default?.url,
                id: musicDB.id,
                music: musicas?.id
            }

            musics.push(musica)
        })

        setTimeout(async () => {
            let res = musics.sort(function (a, b) {
                if (a.id > b.id) {
                    return 1;
                }
                if (a.id < b.id) {
                    return -1;
                }
                // a must be equal to b
                return 0;
            })

            if (res[0]) {
                msg = ""
            }

            setMusicas(res)
        }, 3000)
    }, [])


    if (musics && !musics[0]) {
        msg = (<a className={styles.vazio}>Nenhuma Música</a>)
    }

    async function addListplay() {
        //  Dados do ListPlay

        let userJSON = await fetch(`http://localhost:3000/api/users/${session?.user?.email}`)
        let user = await userJSON.json()


        //  Dados da Playlist
        musics.map(async (music) => {
            let NEWlistplayJSON = await fetch(`http://localhost:3000/api/listplay/add/${user?.id}`)
            let NEWlistplay = await NEWlistplayJSON.json()
            let NEWlistplayIDs = NEWlistplay.map(music => music.youtubeId)
            console.log(`${NEWlistplayIDs} => ${music.music}`)
            if (!NEWlistplayIDs.includes(music.music)) {
                if (!NEWlistplayIDs[0] === music.music) {


                    let data = {
                        function: 'addListplay',
                        user: user.id,
                        musicId: music.music
                    }

                    await fetch(`http://localhost:3000/api/listplay/addplaylist`, { // USER=${user.id}&MUSIC=${music.id}
                        method: 'post',
                        body: JSON.stringify(data)
                    })
                }
            }
        })
    }

    return (
        <>
            <div className={styles.body}>

                <div className={styles.head}>
                    <img src={infos.capa} className={styles.capa}></img>
                    <div className={styles.infos}>
                        <h2 className={styles.infoName}>{infos.name}</h2>
                        <h3 className={styles.infoAuthor}>Criado por <a href={`/users/${author.id}`} className={styles.playlistAuthor}>{author.name}</a></h3>
                        <h3 className={styles.infoCount}>
                            {!musics && <div className={styles.loadingCount}>Carregando...</div>}
                            {musics && (
                                <div>
                                    <h3>{musics.length} {musics.length > 1 ? 'Músicas' : 'Música'}</h3>
                                    <div className={styles.buttonPlay} onClick={addListplay}>
                                        <Image src="/images/logo-st-icon-branco.png" width="20px" height="20px"></Image>
                                        <a>Tocar</a>
                                    </div>
                                </div>
                            )}</h3>
                    </div>
                </div>

                <h1>Músicas</h1>

                {!musics && <div className={styles.loading}>Carregando...</div>}

                {
                    musics && musics.map((music) => (
                        <Link href={`/musics/${music.music}`}>
                            <div className={styles.card}>
                                <div className={styles.place}>
                                    <div className={styles.divisor}>
                                        <img src={music.capa} id={styles.cardCapa}></img>
                                        <div className={styles.cardInfos}>
                                            <div className={styles.cardText}>
                                                <a className={styles.cardName}>{music.title}</a>
                                                <a className={styles.cardAuthor}>{music.author}</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.cardTime}><a>{music.time}</a></div>
                                </div>
                            </div>
                        </Link>
                    ))
                }
                {musics && msg}
            </div>

        </>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context);
    const id = Number(context.query.playlistId)
    let type = ''

    if (context.query.playlistId.startsWith('create')) {
        type = 'create'
        if(context.query.playlistId.includes('create&musicBack=')) {
            let musicBack = context.query.playlistId.replace('create&musicBack=', '')
            return { props: { session, type, musicBack } }
        } else {
            let musicBack = ''
            return { props: { session, type, musicBack } }
        }
        
    } else {
        type = 'playlist'


        let infosJSON = await fetch(`http://localhost:3000/api/playlists/${id}`)
        let infos = await infosJSON.json()

        let existe = true
        if (!infos) {
            existe = false
            return {
                props: { existe }
            }
        }

        let authorJSON = await fetch(`http://localhost:3000/api/users/${infos.author}`)
        let author = await authorJSON.json()

        let playlistsJSON = await fetch(`http://localhost:3000/api/playlistsMusics`)
        let playlistsALL = await playlistsJSON.json()
        let playlists = playlistsALL.filter(pl => pl.playlist === id)

        let empacotadoINFOS = JSON.stringify(infos)

        return { props: { session, empacotadoINFOS, playlists, author, existe, type } }
    }
}