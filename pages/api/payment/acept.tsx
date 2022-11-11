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
                user: 'willow42@ethereal.email',
                pass: 'NXWFCYMy33AEWZQu6D'
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        var emailASerEnviado = {
            from: "willow42@ethereal.email",
            to: infos.email,
            subject: "SoundTrack - Assinatura",
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

            <h2>Assinatura Aprovada!</h2>
            <hr style="border: 1px solid rgb(189, 189, 189); width: 90%;" />

            <a style="margin-bottom: 40px; margin-top: 15px; font-size: 23.5px;">Agora você é o mais novo integrante da nossa comunidade premium!</a>
            <a style="margin-bottom: 40px; font-size: 23.5px;">Seu comprovante de pagamento foi verificado e aceito pela equipe da SoundTrack, se precisar de um suporte, entre em contato conosco pelo email soundtrack.equipe@gmail.com
                ou responda esta mensagem de email que iremos lhe ajudar.</a>
        </div>
            `,
        };

        await transporter.sendMail(emailASerEnviado)

        db.collection("verificationPayments").deleteOne({
            code: infos.code
        })

        let userJSON = await fetch(`http://localhost:3000/api/users/${infos.email}`)
        let user = await userJSON.json()

        let premiumUserDB = await db.collection("premium").findOne({ id: user.id })
        console.log(premiumUserDB)
        let premiumUser = premiumUserDB?.countAssing || 0
        console.log(premiumUser)

        let plan = Number(infos.plan)
        let timeEnd = Date.now()
        if (plan === 2) timeEnd = timeEnd + 1000 * 60 * 60 * 24 * 30 * 1
        if (plan === 3) timeEnd = timeEnd + 1000 * 60 * 60 * 24 * 30 * 3
        if (plan === 4) timeEnd = timeEnd + 1000 * 60 * 60 * 24 * 30 * 6
        if (plan === 5) timeEnd = timeEnd + 1000 * 60 * 60 * 24 * 30 * 12

        if (premiumUserDB) {
            db.collection("premium").updateOne(
                { id: user.id },
                {
                    $set: {
                        end: timeEnd,
                        start: Date.now(),
                        ativo: true,
                        countAssing: premiumUser + 1
                    }
                }
            );
        } else {
            db.collection("premium").insertOne({
                id: user.id,
                end: timeEnd,
                start: Date.now(),
                ativo: true,
                countAssing: premiumUser + 1
            })
        }

        db.collection("users").updateOne(
            { id: user.id },
            {
                $set: {
                    premium: true
                }
            }
        );

        res.json({ error: false });
    } catch (err) {
        res.json({ error: err });
    }


};