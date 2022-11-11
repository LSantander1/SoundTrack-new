import React from 'react'
import clientPromise from "../../lib/mongodb";

function url({ resp, code, email }) {

    if (resp == "aceito") {
        return (
            <div>
                <h1>Aceito!!</h1>
            </div>
        )
    }

    if (resp == "recusado") {
        return (
            <div style={{
                padding: "50px",
            }}>
                <input type='text' id="textMotivo" style={{
                    padding: "10px",
                    color: "black",
                    marginRight: "10px",
                }}></input>
                <button onClick={() => {
                    let motivoDoc = document.body.querySelector("#textMotivo")?.value

                    let data = {
                        code,
                        email,
                        motivo: motivoDoc ? `"${motivoDoc}"` : "Motivo não informado"
                    }

                    fetch(`http://localhost:3000/api/payment/reject`, {
                        method: "post",
                        body: JSON.stringify(data)
                    }).then(async res => {
                        let resp = await res.json()

                        if(resp.error) {
                            alert(`ERRO!\n\n${resp.error.response}`)
                        } else {
                            alert(`Resposta enviada com sucesso!`)
                        }
                    })

                }} style={{
                    padding: "10px",
                    color: "black",
                    marginRight: "10px",
                }}
                >Enviar</button>
            </div>
        )
    }

    return (
        <div>
            <h1>CÓDIGO INVALIDO!</h1>
        </div>
    )
}

export default url

export async function getServerSideProps(context) {
    var url = context.query.url
    var code = url.replace("&command=accept", "").replace("&command=reject", "")
    let resp = ""

    const client = await clientPromise;
    const collection = client.db("SoundTrack").collection("verificationPayments");
    let db = await collection.findOne({ code })
    if (!db) return { props: { resp } }

    let email = db?.user

    var nodemailer = require("nodemailer")
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        secure: false,
        port: 587,
        auth: {
            user: 'willow42@ethereal.email',
            pass: 'NXWFCYMy33AEWZQu6D'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    if (url.endsWith("&command=accept")) {
        resp = "aceito"

        var emailASerEnviado = {
            from: "willow42@ethereal.email",
            to: email,
            subject: "Assinatura pendente!",
            html: `
            <h1>Sua assinatura foi aprovada!</h1>
            <a>Bem vindo(a) ao SoundTrack</a>
            `,
        };

        let data = {
            code,
            email,
            plan: db.plan,
        }

        fetch(`http://localhost:3000/api/payment/acept`, {
                        method: "post",
                        body: JSON.stringify(data)
                    }).then(async res => {
                        let resp = await res.json()

                        if(resp.error) {
                            console.log(`ERRO!\n\n${resp.error.response}`)
                        } else {
                            console.log(`Resposta enviada com sucesso!`)
                        }
                    })

        //await transporter.sendMail(emailASerEnviado)
    }

    if (url.endsWith("&command=reject")) {
        resp = "recusado"
    }

    return { props: { resp, code, email } }
}