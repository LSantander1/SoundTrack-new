import React, { useEffect } from 'react'
import Link from 'next/link'
import verifStyles from '../styles/Autorizacoes.module.css'
import { getSession, useSession } from 'next-auth/react';
import { useState } from 'react'

function VerifLoginPremium() {
    const { data: session } = useSession()

    let [verif, setVerif] = useState()

    useEffect(() => {
        async function getUser() {
            var result = {
                Login: false,
                Assinatura: false
            }

            let userJSON = await fetch(`http://localhost:3000/api/users`)
            let userF = await userJSON.json()
            console.log(userF)

            if (session) {
                verif.Login = true
        
                let dbUser = userF.find(user => user.email === session?.user?.email)
                if (dbUser?.plan !== 0) {
                    verif.Assinatura = true
                }
            }

            setVerif(result)
        }

        setTimeout(getUser, 500)
    }, [])

    let siteLogin = (<>
        <div className={verifStyles.body}>
            <div className={verifStyles.card}>
                <h1>Para prosseguir é necessário entrar em sua conta</h1>
                <Link href='/login'>
                    <a className={verifStyles.button}>Entrar</a>
                </Link>
            </div>
        </div>
    </>)

    let sitePremium = (<>
        <div className={verifStyles.body}>
            <div className={verifStyles.card}>
                <h1>Você precisa ser assinante para acessar</h1>
                <Link href='/assinatura'>
                    <a className={verifStyles.button}>Se tornar assinante</a>
                </Link>
            </div>
        </div>
    </>)

    {!verif && <><div></div></>}
    {verif && !verif?.Login ? siteLogin : !verif?.Assinatura ? sitePremium : ''}

    return (
        <div>

        </div>
    )
}

export default VerifLoginPremium