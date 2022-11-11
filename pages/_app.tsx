import '../styles/globals.css'
import { GetServerSideProps } from "next";
import MainContainer from '../components/MainContainer'
import { SessionProvider } from 'next-auth/react'
import { getSession } from 'next-auth/react';
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import Head from "next/head"
//import clientPromise from "../lib/mongodb";
import Navbar from '../components/NewNavbar'
import Footer from '../components/Footer'
import styles from '../styles/MainContainer.module.css'

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Navbar/>
      <div className={styles.spaceNavbar}></div>
      <Link href="/listplay">
        <div className={styles.listPlayButton}>
          <Image title="Lista de Reprodução" src="/images/listplay.png" width="75px" height="75px"></Image>
        </div>
        </Link>
        <Component {...pageProps} />
      
      <Footer />

    </SessionProvider>
  )
}


export async function getServerSideProps(context) {
  const session = await getSession(context);

  return { props: { session } }
}
