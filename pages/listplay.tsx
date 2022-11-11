import React from 'react'
import styles from './../styles/ListPlay.module.css'
import { getSession, useSession } from 'next-auth/react';
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from "react";
import clientPromise from '../lib/mongodb';
const ytdl = require('ytdl-core');

function listplay({ user, musics, musicUrl }) {
  let msg = ""
  const [musicsList, setMusicasList] = useState(null)
  useEffect(() => {
    let musicsAdd = []

    musics.map(async (musicDB) => {
      const musicaJSON = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2C%20statistics%2C%20contentDetails&id=${musicDB.youtubeId}&t&key=AIzaSyBt6QUXTgALK-r0THl-pbE09oFFdfCvwU4`)
      const musicaYT = await musicaJSON.json()
      const musicas = musicaYT.items[0]

      let temp = musicas?.contentDetails.duration.replace('PT', '').replace('M', ':').replace('S', '')
      if (temp?.endsWith(':')) temp = temp + '00'
      if (!musicas?.contentDetails.duration.includes('M')) temp = '0:' + temp

      let musica = {
        title: musicas?.snippet?.title,
        author: musicas?.snippet?.channelTitle,
        time: temp,
        capa: musicas?.snippet?.thumbnails?.default?.url,
        id: musicDB.id,
        music: musicas?.id
      }

      musicsAdd.push(musica)
    })

    setTimeout(async () => {
      let res = musicsAdd.sort(function (a, b) {
        if (a.id > b.id) {
          return 1;
        }
        if (a.id < b.id) {
          return -1;
        }
        // a must be equal to b
        return 0;
      })

      res.reverse()

      if (res[0]) {
        msg = ""
      }

      setMusicasList(res)
    }, 1000)
  }, [])

  if (musicsList && !musicsList[0]) {
    msg = (<a className={styles.vazio}>Nenhuma Música</a>)
  }

  return (
    <div className={styles.page}>
      {musicsList &&
        <div className={styles.header}>
          <div>
          </div>
          <div className={styles.control}>

            <audio src={musicUrl} controls preload onLoadStart={() => {
              let audioStart = document.body.querySelector("#controlAudio")
              audioStart.play()

              setInterval(() => {
                let audio = document.body.querySelector("#controlAudio")?.ended
                if (audio) {
                  let data = {
                    music: musicsList[0]?.music,
                    user: user.id
                  }

                  fetch(`http://localhost:3000/api/listplay/delete/${musicsList[0]?.music}`, {
                    method: 'post',
                    body: JSON.stringify(data)
                  }).then(() => {
                    window.location.reload()
                  })
                }
              }, 500)
            }} controlsList="nodownload noplaybackrate" id='controlAudio' autoPlay={true}></audio>
            <i class="fas fa-solid fa-forward" onClick={() => {

              let data = {
                music: musicsList[0]?.music,
                user: user.id
              }

              fetch(`http://localhost:3000/api/listplay/delete/${musicsList[0]?.music}`, {
                method: 'post',
                body: JSON.stringify(data)
              })

              setTimeout(() => {
                window.location.reload()
              }, 1500);



            }}></i>
            <i id={styles.icon} title="Baixar música" class="fas fa-solid fa-download"></i>
            <i id={styles.icon} title="Adicionar a uma playlist" class="fas fa-solid fa-list" onClick={() => setOpenModal(true)}></i>
            <input type='checkbox' for="relatedMusic" id="boxRelatedMusic" checked={() => {

            }}></input>
          </div>
          <h2 className={styles.atualMusicName}>{musicsList[0]?.title}</h2>
          <h3 className={styles.atualMusicAuthor}>{musicsList[0]?.author}</h3>
        </div>
      }


      <h1>Próximas Músicas</h1>

      <div className={styles.musics}>

        {!musics && <div className={styles.loading}>Carregando...</div>}

        {
          musicsList && musicsList.map(music => (
            <a href={`/musics/${music.music}`}>
              <div id={"fieldMusic" + music.music} className={musicsList[0].music === music.music ? styles.cardFirst : styles.card}>
                <div className={styles.place}>
                  <div className={styles.divisor}>
                    <Image src={musicsList[0].music === music.music ? '/images/audio-vibrando.gif' : music.capa} width="65px" height="65px" id={musicsList[0].music === music.music ? styles.cardCapaFirst : styles.cardCapa}></Image>
                    <div className={styles.cardInfos}>
                      <div className={styles.cardText}>
                        <a className={styles.cardName}>{music.title}</a>
                        <a className={styles.cardAuthor}>{music.author}</a>
                      </div>
                    </div>
                  </div>
                  <div className={styles.cardTime}>
                    <a id={musicsList[0].music === music.music ? styles.trashFirst : styles.trash} onClick={(e) => {
                      e.preventDefault()

                      let data = {
                        music: music.music,
                        user: user.id
                      }

                      fetch(`http://localhost:3000/api/listplay/delete/${music.music}`, {
                        method: 'post',
                        body: JSON.stringify(data)
                      })

                      let cardMusic = document.body.querySelector(`#fieldMusic${music.music}`)
                      cardMusic.style.display = 'none'

                    }}><Image src="/images/lata-de-lixo.png" width="22.5px" height="22.5px"></Image></a>
                    <a>{music.time}</a>
                  </div>
                </div>
              </div>
            </a>

          ))
        }
        {musicsList && msg}

        {

        }

        <div>
        <hr/>

        
        </div>

        



      </div>

    </div >
  )
}

export default listplay

export async function getServerSideProps(context) {
  const session = await getSession(context);

  let userJSON = await fetch(`http://localhost:3000/api/users/${session?.user?.email}`)
  let user = await userJSON.json()
  let musicsJSON = await fetch(`http://localhost:3000/api/listplay/add/${user?.id}`)
  let musics = await musicsJSON.json()

  if(musics[0]) {
    let metadataMusic = await ytdl.getInfo(`https://youtube.com/watch?v=${musics[0].youtubeId}`)
    var musicUrl = metadataMusic.formats.find(music => music.mimeType == 'audio/webm; codecs="opus"').url
  }else{
    var musicUrl = ''
  }


  const client = await clientPromise
  const db = client.db("SoundTrack")
  db.collection("users").updateOne({ email: session?.user?.email }, {
    $set: {
      playCount: user.playCount + 1
    }
  })

  //    let relatedVideosJSON = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=8&q=${musics[0].youtubeId}&relatedToVideoId=${musics[0].youtubeId}&videoCategoryId=10&key=AIzaSyBt6QUXTgALK-r0THl-pbE09oFFdfCvwU4`)

  
  let relatedVideosJSON = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet&part=statistics&type=video&part=contentDetails&chart=mostPopular&relatedToVideoId=${musics[0].youtubeId}&maxResults=10&videoCategoryId=10&fields=items(id%2Csnippet(thumbnails%2Ctitle%2CchannelTitle)%2CcontentDetails(duration)%2Cstatistics(likeCount))&key=AIzaSyBt6QUXTgALK-r0THl-pbE09oFFdfCvwU4`)
  let relatedVideos = await relatedVideosJSON.json()
  console.log(relatedVideos)
  


  return { props: { user, musics, musicUrl } }
}