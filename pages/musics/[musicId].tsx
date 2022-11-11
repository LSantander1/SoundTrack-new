import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getSession, useSession } from 'next-auth/react';
const shortNum = require('number-shortener')
import { useEffect, useState } from "react";
import clientPromise from '../../lib/mongodb';
import path from 'path'
const ytdl = require('ytdl-core');
const download = require("download-in-browser")
import fs from "fs"

import styles from '../../styles/Music.module.css'
import stylesModal from "../../styles/ModalPL.module.css"
import verifStyles from '../../styles/Autorizacoes.module.css'



import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { storage } from "../../src/firebase"

function page({ musicPASS, playlists, verif, musicUrl, originHome }) {
    const { data: session } = useSession()

    if (!verif.Login) {
        return (<>
            <div className={verifStyles.body}>
                <div className={verifStyles.card}>
                    <h1>Para prosseguir é necessário entrar em sua conta</h1>
                    <Link href='/login'>
                        <a className={verifStyles.button}>Entrar</a>
                    </Link>
                </div>
            </div>
        </>)
    }

    if (!verif.Assinatura) {
        return (<>
            <div className={verifStyles.body}>
                <div className={verifStyles.card}>
                    <h1>Você precisa ser assinante para acessar</h1>
                    <Link href='/assinatura'>
                        <a className={verifStyles.button}>Se tornar assinante</a>
                    </Link>
                </div>
            </div>
        </>)
    }

    //  console.log(musicPASS.items[0].snippet)

    if(!musicUrl) {
        return (<div>
            <h1>Audio não encontrado</h1>
        </div>)
    }

    if (!originHome) {
        if (!musicPASS || musicPASS?.items[0]?.snippet?.categoryId !== '10') {
            return (
                <div style={{
                    "padding": "100px",
                    "display": "flex",
                    "flexDirection": "column",
                    "justifyContent": "center",
                    "alignItems": "center",
                    "textAlign": "center",
                }}>
                    <div style={{
                        "backgroundColor": "rgb(40, 40, 40)",
                        "borderRadius": "10px"
                    }}>
                        <Image src="/images/fone-quebrado.png" width="150px" height="150px"></Image>
                    </div>
                    <div style={{
                        "padding": "15px",
                        "backgroundColor": "rgb(40, 40, 40)",
                        "borderRadius": "5px",
                        "marginTop": "20px"
                    }}>
                        <h1>Música não encontrada!</h1>
                        <h4>Verifique a URL e tente novamente</h4>
                    </div>
                </div>
            )
        }
    }


    let music = musicPASS.items[0]
    let musicId = music.id

    let view = shortNum(music.statistics.viewCount).replace('+', "")
    let likes = shortNum(music.statistics.likeCount).replace('+', "")

    let musicWidth = ''
    let musicHeight = ''
    let musicImgURL = ''

    let pathMusic = music.snippet.thumbnails
    if (pathMusic.maxres) {
        musicWidth = pathMusic.maxres.width
        musicHeight = pathMusic.maxres.height
        musicImgURL = pathMusic.maxres.url
    } else if (pathMusic.standard) {
        musicWidth = pathMusic.standard.width
        musicHeight = pathMusic.standard.height
        musicImgURL = pathMusic.standard.url
    } else if (pathMusic.high) {
        musicWidth = pathMusic.high.width
        musicHeight = pathMusic.high.height
        musicImgURL = pathMusic.high.url
    } else if (pathMusic.medium) {
        musicWidth = pathMusic.medium.width
        musicHeight = pathMusic.medium.height
        musicImgURL = pathMusic.medium.url
    } else if (pathMusic.default) {
        musicWidth = pathMusic.default.width
        musicHeight = pathMusic.default.height
        musicImgURL = pathMusic.default.url
    }

    function Modal({ closeModal }) {
        var msg = ""

        if (!playlists[0]) {
            msg = (<a className={stylesModal.vazio}>Nenhuma Playlist</a>)
        }

        return (
            <div className={stylesModal.modalBackground}>
                <div className={stylesModal.modalContainer}>
                    <div className={stylesModal.title}>

                        <h1>Escolha uma playlist</h1>
                        <div className={stylesModal.camp}>
                            <a className={stylesModal.x} onClick={() => {
                                closeModal(false)
                            }}> X </a>
                        </div>

                    </div>
                    <hr></hr>
                    <div className={stylesModal.body}>
                        {
                            playlists.map(playlist => (
                                <>
                                    <div className={stylesModal.card} onClick={() => {
                                        let text = document.body.querySelector("#confirmSpace")
                                        text.innerHTML = `\
                        <div className={stylesModal.confirm} id="confirm" style="background-color: rgb(107, 255, 102);
                        padding: 10px;
                        border-radius: 10px;
                        border: 2px solid #036100;
                    
                        display: flex;
                        justify-content: center;
                        align-items: center;">\
    
                        <Image className={stylesModal.confirmIMG} src="/images/veri-1.png" width="20px" height="20px" id="confirmIMG"></Image>\
                        <a className={stylesModal.confirmTEXT} id="confirmTEXT" style="    color: rgb(3, 97, 0);
                        margin-left: 7.5px;">Adicionando à playlist...</a>\
                      </div>\
                      `

                                        setTimeout(() => {
                                            window.location.href = `/playlists/add/${playlist.id}+--SoundTrackAdd--+${musicId}`
                                        }, 2000);

                                    }}>
                                        <a className={stylesModal.cardName}>{playlist.name}</a>
                                    </div>
                                </>
                            ))
                        }

                        {msg}
                    </div>
                    <hr></hr>
                    <div className={stylesModal.footer}>
                        <Link href={`/playlists/create&musicBack=${musicId}`}>
                            <div className={stylesModal.addPlaylist}>
                                <a className={stylesModal.mais}>+</a>
                                <a className={stylesModal.create}>Criar Playlist</a>
                            </div>
                        </Link>
                    </div>

                    <div id="confirmSpace">

                    </div>
                </div>
            </div>
        )
    }

    const [openModal, setOpenModal] = useState(false)

    return (
        <div className={styles.page}>

            <Link href="/faq/music#download">
                <div className={styles.aviso} id="aviso">
                    <h2>Baixar Música</h2>
                    <a>Clique aqui para saber melhor<br></br>como funciona o download de músicas</a>
                </div>
            </Link>

            {openModal && <Modal closeModal={setOpenModal} />}

            <div className={styles.aa}>
                <div className={styles.infosSpace}>
                    <Image src={musicImgURL} width={musicWidth} height={musicHeight} id='capa' style={{ "borderRadius": "10px" }} onClick={() => {
                        let musicState = document.body.querySelector('#audio')

                        if (musicState.paused) {
                            musicState.play()
                        } else {
                            musicState.pause()
                        }
                    }}></Image>
                    <h1>{music.snippet.title}</h1>
                    <h3>{music.snippet.channelTitle}</h3>
                </div>

                <div className={styles.playerSpace}>
                    <div className={styles.duracao}>
                        <audio src={musicUrl} controls preload controlsList="nodownload noplaybackrate" onLoadStart={()=> {


                            let intervalPlay = setInterval(() => {
                                let musicField = document.body.querySelector("#audio")
                                musicField.play().then(() => {
                                    clearInterval(intervalPlay)
                                })
                            }, 100)


                        }} id="audio"></audio>
                    </div>
                    <div className={styles.player}>
                        <div className={styles.dados}>
                            <div className={styles.statistic}>
                                <i title="Curtidas" class="fas fa-solid fa-heart" id={styles.icon}></i>
                                <a id={styles.number}>{likes}</a>
                            </div>

                            <div className={styles.statistic}>
                                <i title="Vezes tocadas" class="fas fa-solid fa-eye" id={styles.icon}></i>
                                <a id={styles.number}>{view}</a>
                            </div>
                        </div>

                        <div className={styles.hr}><hr></hr></div>


                        <a href="" id="downlink" style={{ "display": "none" }} download={`${music.snippet.title}.mp3`}></a>

                        <div className={styles.dados}>
                            <div className={styles.function}>
                                <i title="Baixar música" class="fas fa-solid fa-download" onClick={(e) => {
                                    let data = {
                                        email: session?.user?.email,
                                        type: 'downloadMusic'
                                    }

                                    fetch('http://localhost:3000/api/alert/get', {
                                        method: 'post',
                                        body: JSON.stringify(data),
                                    }).then(async (res) => {
                                        let response = await res.json()
                                        if (!response?.existe) {
                                            document.body.querySelector("#aviso").style.display = 'block';

                                            fetch('http://localhost:3000/api/alert/add', {
                                                method: 'post',
                                                body: JSON.stringify(data)
                                            })
                                        }
                                    })

                                    var link = document.getElementById('downlink')
                                    link?.setAttribute("href", 'https://firebasestorage.googleapis.com/v0/b/soundtrack-dev.appspot.com/o/files%2FoF8f3U7J5RI.mp3?alt=media&token=9b1be2b0-e8f0-4a12-8964-d61236b450bd.mp3')
                                    link?.setAttribute('download', music.snippet.title + '.mp3')
                                    link?.click()

                                }}></i>
                            </div>

                            <div className={styles.function}>
                                <i title="Adicionar a uma playlist" class="fas fa-solid fa-list" onClick={() => setOpenModal(true)}></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page

export async function getServerSideProps(context) {
    const session = await getSession(context);
    var musicId = context.query.musicId
    var originHome = false

    if (context.query.musicId.endsWith("&origin=Home")) {
        musicId = context.query.musicId.replace("&origin=Home", "")
        originHome = true
    }

    var verif = {
        Login: false,
        Assinatura: false
    }

    const client = await clientPromise
    const db = client.db("SoundTrack")


    if (session) {
        verif.Login = true
        const dbUser = await db.collection("users").findOne({ email: session?.user?.email })
        if (dbUser?.premium) {
            verif.Assinatura = true
        } else {
            return { props: { verif } }
        }
    } else {
        return { props: { verif } }
    }


    let userJSON = await fetch(`http://localhost:3000/api/users/${session?.user?.email}`)
    let user = await userJSON.json()
    let listplayJSON = await fetch(`http://localhost:3000/api/listplay/add/${user?.id}`)
    let listplay = await listplayJSON.json()
    let listplayIDs = listplay.map(music => music.youtubeId)
    if (!listplayIDs.includes(musicId)) {
        await db.collection("listplay").insertOne({
            user: user?.id,
            musicId: 1,
            youtubeId: musicId,
        })
    }


    //  pegar musica do youtube
    let musicJSON = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2C%20statistics%2C%20contentDetails&id=${musicId}&t&key=AIzaSyBt6QUXTgALK-r0THl-pbE09oFFdfCvwU4`)
    let musicPASS = await musicJSON.json()

    let metadataMusic = await ytdl.getInfo(`https://youtube.com/watch?v=${musicId}`)
    //  console.log(metadataMusic.formats)
    let musicUrl = metadataMusic.formats.find(music => music.mimeType == 'audio/webm; codecs="opus"')?.url
    if(!musicUrl) musicUrl =  metadataMusic.formats.find(music => music.mimeType == 'audio/mp4; codecs="mp4a.40.2"')?.url
    if(!musicUrl) musicUrl = null

    //  separar playlists para exibir na aba "add a uma playlist"
    let playlistsJSON = await fetch("http://localhost:3000/api/playlists")
    let playlistsList = await playlistsJSON.json()
    let userDB_JSON = await fetch(`http://localhost:3000/api/users/${session?.user?.email}`)
    let userDB = await userDB_JSON.json()
    let playlists = playlistsList.filter(playlist => playlist.idAuthor === userDB.id)

    //  contador de Músicas Tocadas
    db.collection("users").updateOne({ email: session?.user?.email }, {
        $set: {
            playCount: userDB.playCount + 1
        }
    })

    //  Add musica
    db.collection("musics").insertOne({
        id: musicId,
        url: musicUrl,
        title: musicPASS.items[0].snippet.title,
        author: musicPASS.items[0].snippet.channelTitle,
    })

    return { props: { musicPASS, playlists, verif, musicUrl, originHome } }
}