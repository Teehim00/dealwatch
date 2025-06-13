// import NextAuth from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';

// const handler = NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         username: {},
//         password: {},
//       },
//       async authorize(credentials) {
//         if (credentials?.username === 'admin' && credentials?.password === 'admin123') {
//           return { id: '1', name: 'Admin' };
//         }
//         return null;
//       },
//     }),
//   ],
//   pages: {
//     signIn: '/login',
//   },
// });

// export { handler as GET, handler as POST };
