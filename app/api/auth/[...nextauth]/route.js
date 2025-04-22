import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        login: { label: "Email/Phone", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Add your authentication logic here
        // This should match your existing loginUser logic
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" }
          });
          const user = await res.json();
          
          if (user) {
            return user;
          }
          return null;
        } catch (e) {
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/login',
  },
});

export { handler as GET, handler as POST }; 