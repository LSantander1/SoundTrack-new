import React from 'react'
import { getSession, useSession } from 'next-auth/react';
import clientPromise from "../../../lib/mongodb";

function code({ timeDuration }) {

    if (!timeDuration) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "30px",
            }}>
                <div style={{
                    backgroundColor: "rgb(40, 40, 40)",
                    borderRadius: "15px",
                    padding: "50px",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: "20px",
                    }} >
                        <img src="/images/erro.png" width="150px" />
                    </div>
                    <h1>Código inválido!</h1>
                    <a>Código de assinatura não existente</a>
                </div>
            </div>
        )
    }

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "30px",
        }}>
            <div style={{
                backgroundColor: "rgb(40, 40, 40)",
                borderRadius: "15px",
                padding: "50px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "20px",
                }} >
                    <img src="/images/logo-st-premium-icon.png" width="150px" />
                </div>
                <h1>Sucesso!</h1>
                <a>Curta e aproveite seus dias de premium!</a>
                <a>Você acaba de ganhar <b>{timeDuration} dias</b> como assinante na SoundTrack.</a>
            </div>
        </div>
    )
}

export default code

export async function getServerSideProps(context) {
    const session = await getSession(context);
    let code = context.query.code

    const client = await clientPromise;
    const db = client.db("SoundTrack");

    let userJSON = await fetch(`http://localhost:3000/api/users/${session?.user?.email}`)
    let user = await userJSON.json()

    let codeDB = await db.collection("codes").findOne({ code })
    let timeDuration = codeDB?.timePlan || null


    let premiumUserDB = await db.collection("premium").findOne({ id: user.id })
    let premiumUser = premiumUserDB?.countAssing || 0

    let timeEnd = Date.now() + (1000 * 60 * 60 * 24 * timeDuration)

    if (premiumUserDB) {

        if (premiumUserDB.ativo) {
            db.collection("premium").updateOne(
                { id: user.id },
                {
                    $set: {
                        end: premiumUserDB.end + (1000 * 60 * 60 * 24 * timeDuration),
                        ativo: true,
                        countAssing: premiumUser + 1
                    }
                }
            );
        } else {
            db.collection("premium").updateOne(
                { id: user.id },
                {
                    $set: {
                        end: timeEnd,
                        ativo: true,
                        countAssing: premiumUser + 1
                    }
                }
            );
        }

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

    if(codeDB?.usos-1 === 0) {
        db.collection("codes").deleteOne({ code: codeDB?.code })
    } else {
        db.collection("codes").updateOne(
            { code: codeDB?.code },
            {
                $set: {
                    usos: codeDB?.usos-1
                }
            }
        );
    }

    

    return { props: { timeDuration } }
}