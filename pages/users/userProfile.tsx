import clientPromise from "../../lib/mongodb";
import { signOut, useSession, getSession } from 'next-auth/react'

export default function page({user}) {
    return (<><a>{user.name}</a></>)
}

export async function getServerSideProps(context) {
    const session = await getSession(context);

    let userJSON = await fetch(`http://localhost:3000/api/users/${session?.user?.email}`)
    let user = await userJSON.json()

    return {
        redirect: {
            destination: `/users/${user.id}`,
            permanent: false
        }
    }
}