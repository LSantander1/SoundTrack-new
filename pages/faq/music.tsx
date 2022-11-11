import styles from '../../styles/FAQ.module.css'

function page() {
    return (
        <div className={styles.page}>

            <div className={styles.header}>
                <h1>Música</h1>
            </div>

            <div className={styles.hr}><hr></hr></div>
            

            <div className={styles.body}>

                <div className={styles.content}>
                    <h1>Como funciona a <a>Página de Músicas</a></h1>
                    <a>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sunt, nostrum? Enim aut cumque veritatis possimus consectetur ut corporis beatae quos fugiat adipisci? Perspiciatis voluptates maiores ducimus quos quaerat ipsam rerum!</a>
                </div>
                
                <div className={styles.content} id="">
                    <h1>Sobre as <a>Curtidas</a></h1>
                    <a>Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus est autem molestias recusandae animi placeat eligendi repudiandae quasi, rerum deleniti at delectus saepe velit? Omnis praesentium necessitatibus dicta aut fugiat!</a>
                </div>

                <div className={styles.content} id="">
                    <h1>Sobre as <a>Vezes tocadas</a></h1>
                    <a>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores fuga laborum porro sit harum, repudiandae alias quidem nihil blanditiis natus? Cupiditate obcaecati voluptatibus ex repudiandae? Placeat tempora aliquam aut aspernatur.</a>
                </div>

                <div className={styles.content} id="download">
                    <h1>Sobre <a>Baixar</a></h1>
                    <a>Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia laudantium quasi tempora eos porro possimus ab enim, similique ipsam repellendus eius, dolorum voluptates qui sint provident accusamus quo. Voluptate, aspernatur.</a>
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