import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { SiweMessage } from 'siwe';

export default async function auth(req: any, res: any) {
  const providers = [
    CredentialsProvider({
      name: 'Ethereum',
      credentials: {
        message: {
          label: 'Message',
          type: 'text',
          placeholder: '0x0',
        },
        signature: {
          label: 'Signature',
          type: 'text',
          placeholder: '0x0',
        },
      },

      async authorize(credentials) {
        try {
          const siwe = new SiweMessage(
            JSON.parse(credentials?.message || '{}')
          );
          const validatedMessage = await siwe.validate(credentials?.signature);

          if (
            validatedMessage.nonce &&
            validatedMessage.nonce ===
              JSON.parse(credentials?.message || '{}').nonce
          ) {
            return {
              id: siwe.address,
            };
          }
          return null;
        } catch (err) {
          return null;
        }
      },
    }),
  ];

  return await NextAuth(req, res, {
    // https://next-auth.js.org/configuration/providers/oauth
    providers,
    session: {
      strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async session({ session, token }: { session: any; token: any }) {
        session.address = token.sub;
        return session;
      },
    },
  });
}
