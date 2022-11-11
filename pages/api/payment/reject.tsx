import clientPromise from "../../../lib/mongodb";

export default async (req, res) => {
    let infos = JSON.parse(req.body)

    try {

        const client = await clientPromise;
        const db = client.db("SoundTrack");

        var nodemailer = require("nodemailer")
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            secure: false,
            port: 587,
            auth: {
                user: 'soundtrack.dev@hotmail.com',
                pass: '2 806#4755mc'
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        var emailASerEnviado = {
            from: "soundtrack.dev@hotmail.com",
            to: infos.email,
            subject: "SoundTra - Assinatura",
            html: `

        <div style="
        background-color: #02b2d4;

        padding: 10px;
        ">

            <div style="
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            color: white;
            ">
                <img src="/public/images/logo-st-icon-branco.png" width="50px" height="50px" />
                <a href="http://localhost:3000" style="
                margin-left: 10px;
                text-decoration: none;
                font-size: 30px;
                color: white;
                ">SoundTrack</a>
            </div>

        </div>

        <div style="
            text-align: center;
            padding: 25px;
            display: flex;
            flex-direction: column;
            ">

            <h2>Assinatura Recusada!</h2>
            <hr style="border: 1px solid rgb(189, 189, 189); width: 90%;" />

            <a style="margin-bottom: 40px; margin-top: 15px; font-size: 23.5px;">Ah, sinto munto, mas a assinatura de um plano premium na
                SoundTrack não pode ser realizada.</a>
            <a style="margin-bottom: 40px; font-size: 23.5px;">Se preciso, entre em contato conosco pelo email soundtrack.equipe@gmail.com
                ou responda esta mensagem de email para resolvermos seu problema.</a>

            <a style="font-size: 23.5px">Saiba mais sobre o motivo da sua assinatura não ter sido aprovada:</a>
            <div style="
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top: 10px;
                ">
                <div style="background-color: rgb(183, 183, 183);
                padding: 15px;
                border-radius: 10px;">
                    <a>${infos.motivo}</a>
                </div>
            </div>

        </div>
            `,
        };

        await transporter.sendMail(emailASerEnviado)

        db.collection("verificationPayments").deleteOne({
            code: infos.code
        })

        res.json({ error: false });
    } catch (err) {
        res.json({ error: err });
    }


};