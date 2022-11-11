import NextAuth from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb-login";

import GoogleProvider from 'next-auth/providers/google'

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: '179076864036-pb1l8qsari9k9io4ko3932nh4klt88ve.apps.googleusercontent.com',
            clientSecret: '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'
        })
    ],
    debug: process.env.NODE_ENV === "development",
    adapter: MongoDBAdapter(clientPromise),

    pages: {
      signIn: "/auth",
    },
    session: {
      strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
})



//  AcessApp:0000