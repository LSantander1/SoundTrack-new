import clientPromise from '../../lib/mongodb'
import { getSession, useSession } from 'next-auth/react';
import { checkout } from "../../src/checkout"
var uniqid = require('uniqid');

export default function newPage({ code }) {
    const { data: session } = useSession()

    checkout({
        lineItems: [
            {
                price: "price_1LopmEJFdabvAAaoYyjhTZWs",
                quantity: 1
            }
        ],
        code
    })


    return <>

    </>
}

export async function getServerSideProps(context) {
    const session = await getSession(context);
    let code = await uniqid()

    const client = await clientPromise
    const db = await client.db("SoundTrack")
    db.collection("checkouts").insertOne({
        email: session?.user?.email,
        checkCode: code,
        plan: 5
    })



    return { props: { session, code } }
}