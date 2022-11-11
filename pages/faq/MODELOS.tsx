import styles from '../../styles/FAQ.module.css'

function page() {
    return (
        <div className={styles.page}>

            <div className={styles.header}>
                <h1>Assunto</h1>
            </div>

            <div className={styles.hr}><hr></hr></div>
            

            <div className={styles.body}>

                <div className={styles.content}>
                    <h1>Como funciona <a></a></h1>
                    <a></a>
                </div>
                
                <div className={styles.content} id="">
                    <h1>Sobre <a></a></h1>
                    <a></a>
                </div>

                <div className={styles.content} id="">
                    <h1>Sobre <a></a></h1>
                    <a></a>
                </div>

            </div>

            <div className={styles.hr}><hr></hr></div>

            <div className={styles.footer}>
                <h3>Esse artigo foi útil?</h3>
                <h5>Futuramente este artigo terá um meio de contato direto para você tirar todas suas dúvidas</h5>
            </div>

        </div>
    )
}

export default page