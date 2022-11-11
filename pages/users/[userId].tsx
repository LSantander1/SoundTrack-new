import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../../styles/Profile.module.css'
import styles404 from '../../styles/Erro404.module.css'
import { getSession, useSession } from 'next-auth/react';
import playlistsMusics from '../api/playlistsMusics'

export default function newPage({ data, empacotado, playlists, playlistsMusics }) {
    const { data: session } = useSession()
    let desempacotado = JSON.parse(empacotado)
    let user = desempacotado

    if (!user) {
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

    let plan = (<><a>Gratuito</a></>)

    if (user.premium) {
        plan = (<><a>Premium</a></>)
    }

    let myProfile = false
    if (user.email === session?.user?.email) myProfile = true

    let addPlaylist = (<></>)

    if (myProfile) {
        addPlaylist = (<>
            <Link href="/playlists/create&musicBack=Null-mb-st">
                <div className={styles.addPlaylist}>
                    <a className={styles.mais}>+</a>
                    <a className={styles.create}>Criar Playlist</a>
                </div>
            </Link>
        </>)
    }

    return <>
        <head>
            <title>{user.name} - SoundTrack</title>
            <meta name='keywords' content='acessar, conta, logar, entrar'></meta>
            <meta name='description' content='Sua música, sua vibe!'></meta>
        </head>

        <div className={styles.body}>
            <div className={styles.content}>
                <div className={styles.head}>
                    <Image src={user.image} width="180px" height="180px" className={styles.picture}></Image>
                    <div className={styles.infos}>
                        <h2 className={styles.infoName}>{user.name}</h2>
                        <div>
                            <h3 className={styles.infoAuthor}>Plano atual <a>{plan}</a></h3>
                        </div>
                        <div>
                            <h3>Músicas tocadas <a>{user.playCount}</a></h3>
                        </div>
                    </div>
                </div>

                {/*
                <div className={styles.place}>
                    <div className={styles.imagePic}>
                        <Image src={user.image} width="200px" height="200px" className={styles.picture} alt="foto"></Image>
                    </div>
                    <div className={styles.infos}>
                        <div className={styles.cima}>
                            <h1>{user.name}</h1>
                        </div>
                        <div className={styles.baixo}>
                            <div>
                                <h2 className={styles.titlePlan}>Plano</h2>
                                <p className={styles.valorPlan}>{plan}</p>
                            </div>
                            <div>
                                <h2 className={styles.titlePlan}>Músicas<br></br>Ouvidas</h2>
                                <p className={styles.valorPlan}>1000</p>
                            </div>
                        </div>
                    </div>
                </div>
                */}

                <h1 className={styles.titlePL}>Playlists</h1>

                <div className={styles.playlists} className="playlists">


                    {
                        playlists.map((pl) => (
                            <Link href={`/playlists/${pl.id}`}>
                                <div className={styles.card}>
                                    <div className={styles.playlist}>
                                        <Image src={pl.capa} width="70px" height="70px" className={styles.capa}></Image>
                                        <div className={styles.infosPlaylist}>
                                            <a className={styles.namePL}>{pl.name}</a>
                                            <a className={styles.countMusics}>{playlistsMusics[pl.id]} Músicas</a>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    }



                </div>

                <div>
                    {addPlaylist}
                </div>
            </div>
        </div>
    </>
}

export async function getServerSideProps(context) {
    const session = await getSession(context);
    const userId = Number(context.query.userId)

    let userJSON = await fetch(`http://localhost:3000/api/users`)
    let users = await userJSON.json()
    let user = users.find(user => user.id === userId)

    let playlistJSON = await fetch(`http://localhost:3000/api/playlists`)
    let playlistList = await playlistJSON.json()
    let playlists = await playlistList.filter(pl => pl.idAuthor === user.id)

    let playlistsMusicsJSON = await fetch(`http://localhost:3000/api/playlistsMusics`)
    let playlistsMusicsList = await playlistsMusicsJSON.json()
    let playlistsMusics = {}

    playlists.map((pl) => {
        let musicsList = playlistsMusicsList.filter(music => music.playlist === pl.id)
        let ID = pl.id
        playlistsMusics[ID] = musicsList.length
    })

    let empacotado = JSON.stringify(user)

    return { props: { session, empacotado, playlists, playlistsMusics } }
}