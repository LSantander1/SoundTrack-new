import { getSession } from 'next-auth/react';

import styles from '../../styles/Erro404.module.css'

export default function newPage({ verif }) {
    if (!verif.Login) {
        return (<>
            <header>
                <title>Página 404 - SoundTrack</title>
            </header>

            <div className={styles.page}>
                <img src='/images/404.png'></img>
                <h1>Página não encontrada</h1>
                <h3>Houve um erro no carregamento da página.</h3>
                <h3>Verifique a URL</h3>
            </div>

        </>)
    }

    if (!verif.Assinatura) {
        return (<>
            <header>
                <title>Página 404 - SoundTrack</title>
            </header>

            <div className={styles.page}>
                <img src='/images/404.png'></img>
                <h1>Página não encontrada</h1>
                <h3>Houve um erro no carregamento da página.</h3>
                <h3>Verifique a URL</h3>
            </div>

        </>)
    }


    return (<>
        <h1>AAAAAAA</h1>
    </>)
}

export async function getServerSideProps(context) {
    const session = await getSession(context);

    var verif = {
        Login: false,
        Assinatura: false
    }


    if (session) {
        verif.Login = true
        const { db } = await conectar()
        const dbUser = await db.collection("users").findOne({ email: session?.user?.email })
        if (dbUser?.plan !== 0) {
            verif.Assinatura = true
        }
    }

    return { props: { verif } }
}