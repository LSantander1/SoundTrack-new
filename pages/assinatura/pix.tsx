import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Head from 'next/head'


import styles from '../../styles/Card.module.css'
import Link from 'next/link'
import { checkout } from "../../src/checkout"
//import clientPromise from '../../lib/mongodb'
import { getSession, useSession } from 'next-auth/react';
//var uniqid = require('uniqid');

export default function newPage() {
    const { data: session } = useSession()

    return <>
        <Head>
            <title>Pagamento - SoundTrack</title>
        </Head>



        <div className={styles.body}>

            <h1 className={styles.title}>Escolha um plano:</h1>

            <div className={styles.grid}>
                <div className={styles.card}>
                    <h2>1 Mês</h2>
                    <p>Duração de 30 dias</p>
                    <p>Valor de R$5,00</p>
                    <a href='/assinatura/payment/pix&plan=2' className={styles.button}>Assinar</a>
                </div>

                <div className={styles.card}>
                    <h2>3 Meses</h2>
                    <p>Duração de 90 dias</p>
                    <p><a className={styles.oldValor}>R$15,00</a> <a className={styles.newValor}>R$12,75</a></p>
                    <div>
                        <p>Valor de R$12,75 com</p>
                        <p>economia de R$2,25</p>
                    </div>
                    <a href='/assinatura/payment/pix&plan=3' className={styles.button}>Assinar</a>
                </div>

                <div className={styles.card}>
                    <h2>6 Meses</h2>
                    <p>Duração de 180 dias</p>
                    <p><a className={styles.oldValor}>R$30,00</a> <a className={styles.newValor}>R$24,00</a></p>
                    <div>
                        <p>Valor de R$24,00 com</p>
                        <p>economia de R$6,00</p>
                    </div>
                    <a href='/assinatura/payment/pix&plan=4' className={styles.button}>Assinar</a>
                </div>

                <div className={styles.bestPrice}>
                    <a className={styles.bestText}>Melhor custo-benefício</a>
                    <div className={styles.card} id={styles.bestPrice}>
                        <h2>12 Meses</h2>
                        <p>Duração de 360 dias</p>
                        <p><a className={styles.oldValor}>R$60,00</a> <a className={styles.newValor}>R$45,00</a></p>
                        <div>
                            <p>Valor de R$45,00 com</p>
                            <p>economia de R$15,00</p>
                        </div>
                        <a href='/assinatura/payment/pix&plan=5' className={styles.button}>Assinar</a>
                    </div>
                </div>
            </div>

        </div>
    </>
}

export async function getStaticProps(context) {
    const session = await getSession(context);

    return { props: { session } }
}

/*

<div className={styles.grid}>
                <div className={styles.card}>
                    <h2>1 Mês</h2>
                    <p>Duração de 30 dias</p>
                    <p>Valor de R$10,00</p>
                    <a href='/assinatura/payment/pix&plan=2' className={styles.button}>Assinar</a>
                </div>

                <div className={styles.card}>
                    <h2>3 Meses</h2>
                    <p>Duração de 90 dias</p>
                    <p><a className={styles.oldValor}>R$30,00</a> <a className={styles.newValor}>R$25,50</a></p>
                    <div>
                        <p>Valor de R$25,50 com</p>
                        <p>economia de R$4,50</p>
                    </div>
                    <a href='/assinatura/payment/pix&plan=3' className={styles.button}>Assinar</a>
                </div>

                <div className={styles.card}>
                    <h2>6 Meses</h2>
                    <p>Duração de 180 dias</p>
                    <p><a className={styles.oldValor}>R$60,00</a> <a className={styles.newValor}>R$48,00</a></p>
                    <div>
                        <p>Valor de R$48,00 com</p>
                        <p>economia de R$12,00</p>
                    </div>
                    <a href='/assinatura/payment/pix&plan=4' className={styles.button}>Assinar</a>
                </div>

                <div className={styles.bestPrice}>
                    <a className={styles.bestText}>Melhor custo-benefício</a>
                    <div className={styles.card} id={styles.bestPrice}>
                        <h2>12 Meses</h2>
                        <p>Duração de 360 dias</p>
                        <p><a className={styles.oldValor}>R$120,00</a> <a className={styles.newValor}>R$90,00</a></p>
                        <div>
                            <p>Valor de R$90,00 com</p>
                            <p>economia de R$30,00</p>
                        </div>
                        <a href='/assinatura/payment/pix&plan=5' className={styles.button}>Assinar</a>
                    </div>
                </div>
            </div>

*/