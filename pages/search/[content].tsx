import Image from 'next/image'
import Link from 'next/link'
import styles from '../../styles/Search.module.css'
import playlists from '../api/playlists'
import infos from '../../infos.json'

export default function page({ content, search, playlists, playlistsMusics, users }) {
    let erroAlert = false
    if (search?.error) erroAlert = true
    console.log(search)

    let videos = search.items

    let videosS = [
        {
            snippet: {
                title: "Dua Lipa: Tiny Desk (Home) Concert",
                channelTitle: "NPR Music"
            }
        },
        {
            snippet: {
                title: "Elton John, Dua Lipa - Cold Heart",
                channelTitle: "EltonJohnVEVO"
            }
        },
        {
            snippet: {
                title: "Calvin Harris, Dua Lipa - One Kiss (Official Video)",
                channelTitle: "CalvinHarrisVEVO"
            }
        }
    ]

    return (<>
        <div className={styles.page}>

            <head>
                <title>Buscando: {content} - SoundTrack</title>
            </head>


            <div className={styles.header}>
                <h2>
                    <a>Exibindo resultados para</a> <b>{content}</b>
                </h2>
                <div className={styles.filter}>
                    <div><a>Procurar por </a> <a href="#musics" className={styles.filterName}>Músicas</a></div>
                    <div><a>Procurar por </a> <a href="#playlists" className={styles.filterName}>Playlists</a></div>
                    <div><a>Procurar por </a> <a href="#users" className={styles.filterName}>Usuários</a></div>
                </div>
            </div>

            <div className={styles.body}>
                <div className={styles.tag}>
                    <h1 id="musics">Músicas</h1>

                    <div className={styles.musicList}>
                        {
                            search.error ? (<>
                                <div className={styles.erro}>
                                    <h1 className={styles.msgErro}>Ops! Ocorreu um erro ao buscar músicas 😐</h1>

                                    <div className={styles.codeArea}>
                                        <div><h3>Código</h3> <a>{search.error.code}</a></div>
                                        <div><h3>Mensagem</h3> <a>{search.error.message}</a></div>
                                    </div>

                                    <h1 className={styles.erroSuport}>Se possível, alerte ao suporte da SoundTrack sobre o erro, para que assim o mesmo possa ser corrigido.<br></br>Obrigado e desculpe pela inconveniência</h1>
                                </div>
                            </>) : videos?.[0] ?
                                videos.map(video => (
                                    <>
                                        <Link href={`/musics/${video.id.videoId}`}>
                                            <div className={styles.result}>
                                                <img src={infos.images.music} width="70px" height="70px" id={styles.img}></img>
                                                <div className={styles.text}>
                                                    <a className={styles.title}>{video.snippet.title}</a>
                                                    <a className={styles.author}>{video.snippet.channelTitle}</a>
                                                </div>
                                            </div>
                                        </Link>
                                    </>
                                )) : (<a className={styles.vazio}>Nenhuma Música</a>)
                        }
                    </div>
                </div>

                <div className={styles.tag}>
                    <h1 id="playlists">Playlists</h1>

                    {
                        playlists[0] ?
                            playlists.map(playlist => (
                                <>
                                    <>
                                        <Link href={`/playlists/${playlist.id}`}>
                                            <div className={styles.result}>
                                                <Image src={playlist.capa || infos.images.playlist} width="70px" height="70px" id={styles.img}></Image>
                                                <div className={styles.text}>
                                                    <a className={styles.title}>{playlist.name}</a>
                                                    <a className={styles.author}>{playlistsMusics[playlist.id]} Músicas</a>
                                                </div>
                                            </div>
                                        </Link>
                                    </>
                                </>
                            )) : (<a className={styles.vazio}>Nenhuma Playlist</a>)
                    }
                </div>

                <div className={styles.tag}>
                    <h1 id="users">Usuários</h1>

                    {
                        users[0] ?
                            users.map(user => (
                                <>
                                    <>
                                        <Link href={`/users/${user.id}`}>
                                            <div className={styles.result}>
                                                <Image src={users.profilePic || infos.images.user} width="70px" height="70px" id={styles.img}></Image>
                                                <div className={styles.text}>
                                                    <a className={styles.title}>{user.name}</a>
                                                </div>
                                            </div>
                                        </Link>
                                    </>
                                </>
                            )) : (<a className={styles.vazio}>Nenhum Usuário</a>)
                    }
                </div>

            </div>


            <div className={styles.footer}>
            </div>


        </div>
    </>)
}

export async function getServerSideProps(context) {
    let content = context.query.content
    let contentResumo = content.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()

    //  MUSICAS
    let searchJSON = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=40&q=${content}-topic&safeSearch=strict&type=video&videoCategoryId=10&key=AIzaSyBt6QUXTgALK-r0THl-pbE09oFFdfCvwU4`)
    let search = await searchJSON.json()

    //  PLAYLIST
    let playlistJSON = await fetch(`http://localhost:3000/api/playlists`)
    let playlistList = await playlistJSON.json()
    let playlists = await playlistList.filter(pl => pl.name.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(contentResumo))

    //  MUSICAS DAS PLAYLIST
    let playlistsMusicsJSON = await fetch(`http://localhost:3000/api/playlistsMusics`)
    let playlistsMusicsList = await playlistsMusicsJSON.json()
    let playlistsMusics = {}

    playlists.map((pl) => {
        let musicsList = playlistsMusicsList.filter(music => music.playlist === pl.id)
        let ID = pl.id
        playlistsMusics[ID] = musicsList.length
    })

    //  USUARIOS
    let usersJSON = await fetch(`http://localhost:3000/api/users/`)
    let usersList = await usersJSON.json()
    let users = usersList.filter(user => user.name.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(contentResumo))

    return { props: { content, search, playlists, playlistsMusics, users } }
}