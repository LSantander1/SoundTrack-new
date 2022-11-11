import styles from '../styles/Home.module.css'
import Head from 'next/head'
import Link from 'next/link'
import { resolve } from 'styled-jsx/css'
import { useSession } from 'next-auth/react'
//import conectar from '../utils/database'

const shortNum = require('number-shortener')

import Skeleton from "react-loading-skeleton";
import { useEffect, useState } from 'react'
//import 'react-loading-skeleton/dist/skeleton.css'

//import Skeleton from "react-loading-skeleton"

export default function Home({ dados, props }) {

    var topInter = dados.TopInter
    var topBrasil = dados.TopBrasil
    var topLatino = dados.TopLatino

    var musica

    {
        /*
        dados.TopInter.map((musica) => {
            (<Link href={`/musics/${musica.id}`}>
            <div className={styles.card}>
                <img src={musica.snippet.thumbnails.medium.url} width='163px' className={styles.img}></img>
                <a title={topInter[0].snippet.title} className={styles.titleMusic}>{musica.snippet.title}</a>
                <div className={styles.infosMusic}>
                    <div><i class="fas fa-solid fa-user"></i> <a title={topInter[1].snippet.channelTitle} className={styles.autor}>{musica.snippet.channelTitle}</a></div>
                    <div><i class="fas fa-solid fa-clock"></i> <a>{musica.time}</a></div>
                    <div><i class="fas fa-solid fa-heart"></i> <a>{musica.likes}</a></div>
                </div>
            </div>
        </Link>)
        })*/
    }

    //   <!-- [5 músicas em alta internacional] [5 músicas em alta BR] [10 músicas lançamento internacinal] [10 músicas lançamento br] -|- [5 músicas dos artistas das 3 mus em alta internacional] [5 músicas dos artistas das 3 mus em alta br] ====== -->


    return (<>
        <Head>
            <title>Página Inicial - SoundTrack</title>
            <link rel="icon" href="/favicon.ico" />
            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css" integrity="sha384-DyZ88mC6Up2uqS4h/KRgHuoeGwBcD4Ng9SiP4dIRy0EXTlnuz47vAwmeGwVChigm" crossorigin="anonymous" />
        </Head>

        <div className={styles.apresentacao}>
            <img src='images/logo-st-icon-branco.png'></img>
            <h1>SoundTrack</h1>
            <a className={styles.part1}>Bem vindo ao <b>SoundTrack</b>, sua mais nova plataforma de Streaming Musical</a>
            <a className={styles.part2}>Qualquer dúvida, acompanhe a nossa breve apresentação do aplicativo</a>
            <Link href="/faq/welcome">
                <a className={styles.conhecerBtn}>Ver apresentação</a>
            </Link>

        </div>

        <div className={styles.page}>
            <Skeleton duration={1} height={30} width={300} />
            <h1>Populares Internacional</h1>
            <div className={styles.packMusics}>
                {
                    dados.TopInter.map((music) => (

                        <Link href={`/musics/${music.id}&origin=Home`}>
                            <div className={styles.card}>
                                <img src={music.snippet.thumbnails.medium.url} width='163px' className={styles.img}></img>
                                <a title={music.snippet.title} className={styles.titleMusic}>{music.titulo || <Skeleton/>}</a>
                                <div className={styles.infosMusic}>
                                    <div><i class="fas fa-solid fa-user"></i> <a title={music.snippet.channelTitle} className={styles.autor}>{music.snippet.channelTitle || <Skeleton/>}</a></div>
                                    <div><i class="fas fa-solid fa-clock"></i> <a>{music.time  || <Skeleton/>}</a></div>
                                    <div><i class="fas fa-solid fa-heart"></i> <a>{music.likes  || <Skeleton/>}</a></div>
                                </div>
                            </div>
                        </Link>
                    ))
                }
            </div>

            <h1>Populares Brasil</h1>
            <div className={styles.packMusics}>

                {
                    dados.TopBrasil.map((music) => (
                        <Link href={`/musics/${music.id}&origin=Home`}>
                            <div className={styles.card}>
                                <img src={music.snippet.thumbnails.medium.url} width='163px' className={styles.img}></img>
                                <a title={music.snippet.title} className={styles.titleMusic}>{music.titulo}</a>
                                <div className={styles.infosMusic}>
                                    <div><i class="fas fa-solid fa-user"></i> <a title={music.snippet.channelTitle} className={styles.autor}>{music.snippet.channelTitle}</a></div>
                                    <div><i class="fas fa-solid fa-clock"></i> <a>{music.time}</a></div>
                                    <div><i class="fas fa-solid fa-heart"></i> <a>{music.likes}</a></div>
                                </div>
                            </div>
                        </Link>
                    ))
                }
            </div>

            <h1>Populares Latino</h1>
            <div className={styles.packMusics}>

                {
                    dados.TopLatino.map((music) => (
                        <Link href={`/musics/${music.id}&origin=Home`}>
                            <div className={styles.card}>
                                <img src={music.snippet.thumbnails.medium.url} width='163px' className={styles.img}></img>
                                <a title={music.snippet.title} className={styles.titleMusic}>{music.titulo}</a>
                                <div className={styles.infosMusic}>
                                    <div><i className="fas fa-solid fa-user"></i> <a title={music.snippet.channelTitle} className={styles.autor}>{music.snippet.channelTitle}</a></div>
                                    <div><i className="fas fa-solid fa-clock"></i> <a>{music.time}</a></div>
                                    <div><i className="fas fa-solid fa-heart"></i> <a>{music.likes}</a></div>
                                </div>
                            </div>
                        </Link>
                    ))
                }
            </div>

        </div>

    </>)
}

export async function getStaticProps() {

    await new Promise((resolve) => {
        setTimeout(resolve, 500)
    })



    let dados = {
        TopInter: [],
        TopBrasil: [],
        TopLatino: []
    }

    // Top Internacional - 5
    var dataFetch = await fetch("https://youtube.googleapis.com/youtube/v3/videos?part=snippet&part=statistics&part=contentDetails&chart=mostPopular&maxResults=20&regionCode=us&videoCategoryId=10&fields=items(id%2Csnippet(thumbnails%2Ctitle%2CchannelTitle)%2CcontentDetails(duration)%2Cstatistics(likeCount))&key=AIzaSyBt6QUXTgALK-r0THl-pbE09oFFdfCvwU4")
    var dataJson = await dataFetch.json()
    var dataItems = await dataJson.items
    dataItems.map(music => {
        let temp = music.contentDetails.duration.replace('PT', '').replace('M', ':').replace('S', '')
        if (temp.endsWith(':')) temp = temp + '00'
        if (!music.contentDetails.duration.includes('M')) temp = '0:' + temp
        music.time = temp

        var likesCount = shortNum(music.statistics.likeCount).replace('+', "")
        music.likes = likesCount

        var autor = music.snippet.channelTitle;
        var title = music.snippet.title.replace(autor, "");
        music.titulo = title

        dados.TopInter.push(music)
    })

    // Top Brasil - 5
    var dataFetch = await fetch("https://youtube.googleapis.com/youtube/v3/videos?part=snippet&part=statistics&part=contentDetails&chart=mostPopular&maxResults=20&regionCode=br&videoCategoryId=10&fields=items(id%2Csnippet(thumbnails%2Ctitle%2CchannelTitle)%2CcontentDetails(duration)%2Cstatistics(likeCount))&key=AIzaSyBt6QUXTgALK-r0THl-pbE09oFFdfCvwU4") // (thumbnails%2Ctitle%2CchannelTitle)%2CcontentDetails(duration)%2Cstatistics(likeCount)
    var dataJson = await dataFetch.json()
    var dataItems = await dataJson.items
    dataItems.map(music => {
        let temp = music.contentDetails.duration.replace('PT', '').replace('M', ':').replace('S', '')
        if (temp.endsWith(':')) temp = temp + '00'
        if (!music.contentDetails.duration.includes('M')) temp = '0:' + temp
        music.time = temp

        var likesCount = shortNum(music.statistics.likeCount).replace('+', "")
        music.likes = likesCount

        var autor = music.snippet.channelTitle;
        var title = music.snippet.title.replace(autor, "");
        music.titulo = title

        dados.TopBrasil.push(music)
    })

    // Top Latino - 5
    var dataFetch = await fetch("https://youtube.googleapis.com/youtube/v3/videos?part=snippet&part=statistics&part=contentDetails&chart=mostPopular&maxResults=20&regionCode=es&videoCategoryId=10&fields=items(id%2Csnippet(thumbnails%2Ctitle%2CchannelTitle)%2CcontentDetails(duration)%2Cstatistics(likeCount))&key=AIzaSyBt6QUXTgALK-r0THl-pbE09oFFdfCvwU4") // (thumbnails%2Ctitle%2CchannelTitle)%2CcontentDetails(duration)%2Cstatistics(likeCount)
    var dataJson = await dataFetch.json()
    var dataItems = await dataJson.items
    dataItems.map(music => {
        let temp = music.contentDetails.duration.replace('PT', '').replace('M', ':').replace('S', '')
        if (temp.endsWith(':')) temp = temp + '00'
        if (!music.contentDetails.duration.includes('M')) temp = '0:' + temp
        music.time = temp

        var likesCount = shortNum(music.statistics.likeCount).replace('+', "")
        music.likes = likesCount

        var autor = music.snippet.channelTitle;
        var title = music.snippet.title.replace(autor, "");
        music.titulo = title

        dados.TopLatino.push(music)
    })

    return { props: { dados } }
}


//-----------------


