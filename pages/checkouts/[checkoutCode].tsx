import clientPromise from "../../lib/mongodb"
import { getSession, useSession } from 'next-auth/react';

export default function page({ completed }) {
    console.log(completed)

    if (completed) {
        return {
            redirect: {
                destination: `/assinatura/completed`,
                permanent: false
            }
        }
    } else {
        return (<>
            <h1>Ocorreu um erro ao realizar a assinatura!</h1>
        </>)
    }
}

export async function getServerSideProps(context) {
    const session = await getSession(context);
    const urlParam = context.query.checkoutCode

    let checkJSON = await fetch(`http://localhost:3000/api/checkouts/${urlParam}`)
    let check = await checkJSON.json()

    let codeUserJSON = await fetch(`http://localhost:3000/api/checkoutsUser/${session?.user?.email}`)
    let codeUser = await codeUserJSON.json()

    let completed = false

    if (check && codeUser) {
        if (check.checkoutCode === codeUser.checkoutCode) {
            completed = true

            let client = await clientPromise
            let db = await client.db("SoundTrack")
            db.collection("users")
                .updateOne(
                    { email: check.email },
                    { $set: { 'premium': true } })

            db.collection("checkouts")
                .deleteOne({ checkCode: check.checkCode })
        }
    }

    return { props: { completed } }
}