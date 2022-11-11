import styles from '../../styles/FAQ.module.css'
import Link from 'next/link'

function page() {
    return (
        <div className={styles.page}>

            <div className={styles.header}>
                <h1>Perguntas e respostas</h1>
                <a>Está com alguma dúvida ou precisa de uma ajuda ao utilizar nossos serviços?</a>
                <a>Consulte o nosso FAQ, um lista com explicações sobre nossos sistemas</a>
            </div>

            <div className={styles.hr}><hr></hr></div>
            

            <div className={styles.body}>

            <li>
                <Link href="faq/music"><ul>Música</ul></Link>
            </li>

            </div>

            <div className={styles.footer}>
            </div>

        </div>
    )
}

export default page