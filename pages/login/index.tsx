
import { GetServerSideProps } from "next";

import { signIn } from 'next-auth/react';
import { getSession } from 'next-auth/react';
import styles from "../../styles/Login.module.css"
import clientPromise from "../../lib/mongodb";
import infos from "../../infos.json"

function newPage({ props }) {

    //console.log(props)

    return <>

        <header>
            <title>Entrar - SoundTrack</title>
            <meta name='keywords' content='acessar, conta, logar, entrar'></meta>
            <meta name='description' content='Sua música, sua vibe!'></meta>
        </header>

        <div className={styles.page}>

            <div className={styles.form}>
                <div onClick={() => signIn('google')} className={styles.google}>
                    <img src="./images/google-fundo.png" width="50px"></img>
                    <a>Entrar com Google</a>
                </div>
                <hr></hr>
                <a>Por enquanto as contas são conectadas apenas via Google.</a>
                <a className={styles.embreve}>Em breve mais opções...</a>
            </div>

            <div className={styles.alert}>
                <h3>Aviso!</h3>
                <a>É importante alertar que o perfil de usuário e as playlists são publicas, ou seja qualquer pessoa poderá encontrar.</a>
            </div>
        </div>

    </>
}

/*


export async function getServerSideProps(context) {
    console.log(context)
    const session = await getSession(context);

    console.log(session)

    return { props: { } }
}
*/

export async function getServerSideProps(context) {
    const session = await getSession(context);

    if (session) {

        const client = await clientPromise;
        const db = client.db("SoundTrack")
        let usersCount = await db.collection("users").find().toArray()
        let user = await db.collection("users").findOne({ email: session?.user?.email })
        if (user?.id > 1) {
        } else {
            await db.collection("users").updateOne({ email: session?.user?.email }, {
                $set: {
                    id: usersCount.length == 1 ? 1 : usersCount[usersCount.length - 2].id + 1,
                    premium: false,
                    playCount: 0,
                    profilePic: infos.images.user,
                }
            })
        }

        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }

    }

    return { props: { session } }
}

/*
export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    console.log(session)

    if(session) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }
    
    return { props: { session } }

    
}
*/

export default newPage

