//  ====== Cabeçalho - [PageInicial] [Playlist] -|- [Login] [Registro] ===========

import Link from 'next/link'
import styles from '../styles/LoginNavbar.module.css'
import Image from 'next/image'
import Head from 'next/head'
import infos from "../infos.json"

import { GetServerSideProps } from "next";

import { signIn } from 'next-auth/react';
import { getSession } from 'next-auth/react';

import { signOut, useSession } from 'next-auth/react'
//import conectar from '../utils/database'
import { useEffect, useState } from 'react'
//import clientPromise from "../lib/mongodb";

export async function getServerSideProps(context) {
    const session = await getSession(context);
    return { props: { session } }
}

export default function newPage({ data }) {
    const { data: session } = useSession()

    /*
    let [user, setUser] = useState(null)

    

    useEffect(() => {        
        setTimeout(async () => {

            let userInfo = await fetch(`http://localhost:3000/api/users`)
            console.log(userInfo)
            setUser(userInfo)
        }, 1000)
    }, [])
    */

    //              {user && console.log(user)}


    if (session) {
        return (<>
            <head>
                <link rel='stylesheet' href='https://cdn-uicons.flaticon.com/uicons-solid-straight/css/uicons-solid-straight.css'></link>
            </head>


            <form className={styles.form}>
                <image width="300px" height="300px" src="../public/images/user.png"></image>
                <div className={styles.dropdown}>
                    <a className={styles.dropbtn}><img width='40px' className={styles.profile} src={infos.images.user}></img></a>
                    <div className={styles.dropdownContent}>

                        <a className={styles.username}>{session?.user?.name}</a>

                        <hr></hr>

                        <div>
                            <Link href={`/users/userProfile`}>
                                <a className={styles.clicks}>Perfil</a>
                            </Link>
                            <a onClick={() => signOut()} className={styles.clicks}>Sair</a>
                        </div>

                    </div>
                </div>

            </form>

        </>)
    } else {
        return (<>

            <Link href='/login'>
                <label className={styles.exit}>
                    <i class="material-icons">exit_to_app</i>
                    <a>Entrar</a>
                </label>
            </Link>

        </>)
    }

    /*
    if (dbUser && dbUser.plan !== 0) {

    } else {

    }
    */
}