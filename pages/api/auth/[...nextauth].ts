import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

export default (req, res) =>
  NextAuth({
    req,
    res,
    session: {
      jwt: true,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
    },
    providers: [
      Providers.Github({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
      }),
    ],
    database: process.env.DATABAE_URL,
    pages: {
      signIn: '/signin',
    },
  })
