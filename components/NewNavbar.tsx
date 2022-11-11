import React from 'react'

import Link from 'next/link'
import Image from 'next/image'

import styles from '../styles/NewNavbar.module.css'
import Login from "./login"
import { getSession, useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react'
import getUser from '../src/getUser'

function NewNavbar() {
    const { data: session } = useSession()

    let [user, setUser] = useState(null)

    useEffect(() => {
        setTimeout(async () => {
            var infoUser = await getUser(session?.user?.email)
            setUser(infoUser)
        }, 1000)
    }, [])

    function Search() {
        let text = document.body.querySelector("#textSearch").value
        window.location.href = `/search/${text}`
    }

    return (
        <div className={styles.nav}>
            <head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
            </head>

            <input type='checkbox' id="check" className={styles.check}></input>
            <label for="check" className={styles.checkbtn}>
                <i class="fa fa-reorder"></i>
            </label>



            <label className={styles.logo}>
                <Link href="/">
                    <img className={styles.image} id={styles.imgg} src="/images/logo-st-icon.png"
                        width="60px"
                        height="60px"
                        alt='[Logo SoundTrack]'
                        id="logo"
                    />
                </Link>
                <Link href="/">
                    <a className={styles.sound}>Sound</a>
                </Link>
                <Link href="/">
                    <i className={styles.track}>Track</i>
                </Link>
            </label>

            {
                session ?

                    <ul className={styles.list}>
                        <div>
                            <div className={styles.search}>
                                <div className={styles.searchIcon} onClick={() => {
                                    Search()
                                }}>
                                    <Image src="/images/icon-search.png" width="17.5px" height="17.5px"></Image>
                                </div>
                                <div>
                                    <input type='text' placeholder='Procurar...' className={styles.searchText} id="textSearch" onKeyPress={(key) => {
                                        if (key.key === "Enter") {
                                            Search()
                                        }
                                    }}></input>
                                </div>
                            </div>
                        </div>
                        <div className={styles.hr}><hr></hr></div>
                        <li><a href={`/users/userProfile`}>Perfil</a></li>
                        <li><a href={`/users/playlist`}>Playlists</a></li>
                        <li><a href={`/listplay`}>Lista de Reprodução</a></li>
                        <li><a href={`/faq`}>FAQ</a></li>
                        {
                            user && user.plan > 0 ?

                                <li><c className={styles.assinaturaCheck}>Assinado!</c></li>

                                :
                                <Link href='/assinatura'>
                                    <li><b className={styles.assinatura}>Assinar</b></li>
                                </Link>



                        }
                        <div className={styles.hr}><hr></hr></div>
                        <li><a onClick={() => signOut()} className={styles.clicks}>Sair</a></li>
                    </ul>

                    :

                    <ul className={styles.list}>
                        <li><a href={`$`}>FAQ</a></li>
                        <Link href='/assinatura'>
                            <li><b className={styles.assinatura}>Assinar</b></li>
                        </Link>
                        <div className={styles.hr}><hr></hr></div>
                        <li><a href={`$`}>Entrar</a></li>
                    </ul>
            }



            <Login></Login>
        </div>
    )
}

export default NewNavbar