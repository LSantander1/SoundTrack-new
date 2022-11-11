import clientPromise from "../../../lib/mongodb";

export default async (req, res) => {
    let infos = JSON.parse(req.body)

    try {
        const client = await clientPromise;
        const db = client.db("SoundTrack");

        var voucher_codes = require('voucher-code-generator');

        let codeGerado = voucher_codes.generate({
            length: 200
        });

        const result = await db
            .collection("verificationPayments")
            .insertOne({
                user: infos.user,
                plan: infos.plan,
                created: infos.created,
                comprovante: infos.comprovante,
                code: codeGerado[0]
            })

        let accept = `http://localhost:3000/st-developer-validate-payment/${codeGerado}&command=accept`
        let reject = `http://localhost:3000/st-developer-validate-payment/${codeGerado}&command=reject`

        var nodemailer = require("nodemailer")

        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',//'smtp.office365.com',
            secure: false,
            port: 587,
            auth: {
                user: 'willow42@ethereal.email',//'soundtrack.dev@hotmail.com',
                pass: 'NXWFCYMy33AEWZQu6D', //'2806#4755mc'
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        var emailASerEnviado = {
            from: "willow42@ethereal.email",
            to: "joas.mycraft@gmail.com",
            subject: "Assinatura pendente!!",
            html: `
            <h1>Cliente aguardando...</h1>
            <hr/>
            <a>Email:</a> <b>${infos.user}</b><br/>
            <a>Plano:</a> <b>${infos.plan}</b><br/>
            <h3>Comprovante:</h3><br/>
            <img src="${infos.comprovante}" width="200px"/>
            <div style="margin-top: 10px;">
            <a href=${accept} style="
            background-color: rgb(0, 175, 47);
            padding: 10px;
            color: white;
            border-radius: 5px;
        text-decoration: none;
            ">Aceitar</a>
        <a href=${reject} style="
        background-color: rgb(194, 0, 0);
        padding: 10px;
        color: white;
        border-radius: 5px;
        text-decoration: none;
        ">Recusar</a>
    </div>
    <hr/>
    <h2>Aceitar</h2>
    <a>${accept}</a>
    <h2>Recusar</h2>
    <a>${reject}</a>
            `,
        };

            let email = await transporter.sendMail(emailASerEnviado)

            if(email.accepted && email.accepted[0]) {
                res.json({ error: false, msg: "" });
            } else {
                res.json({ error: true, msg: "Email destino não aceito" });
            }
        
    } catch (err) {
        res.json({ error: true, msg: err });
    }
};