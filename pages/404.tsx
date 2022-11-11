import Head from 'next/head'
import Link from 'next/link'

import styles from '../styles/Erro404.module.css'

export default function newPage() {
  return <>
    <Head>
      <title>Página 404 - SoundTrack</title>
    </Head>

    <div className={styles.page}>
      <img src='/images/404.png'></img>
      <h1>Página não encontrada</h1>
      <h3>Houve um erro no carregamento da página.</h3>
      <h3>Verifique a URL</h3>
    </div>

  </>
}