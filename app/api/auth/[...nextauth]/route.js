import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const { db } = await connectToDatabase();
          
          // Find user by email
          const user = await db.collection('users').findOne({ email: credentials.email });
          
          if (!user) {
            throw new Error('No user found with this email');
          }

          // Check password
          const isValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isValid) {
            throw new Error('Invalid password');
          }

          // Check if doctor is verified
          if (user.role === 'doctor' && user.status !== 'active') {
            throw new Error('Your account is pending verification');
          }

          // For debugging
          console.log('User data:', {
            ...user,
            password: '[REDACTED]'
          });

          // Return user object without password
          const userData = {
            id: user._id.toString(),
            email: user.email,
            name: user.fullName,
            role: user.role,
            status: user.status,
            specialization: user.specialization,
            profilePicture: user.profilePicture
          };

          // For debugging
          console.log('Returning user data:', userData);

          return userData;
        } catch (error) {
          console.error('Authorization error:', error);
          throw new Error(error.message);
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // For debugging
      console.log('JWT Callback - Input:', { token, user });

      if (user) {
        token.role = user.role;
        token.status = user.status;
        token.specialization = user.specialization;
        token.profilePicture = user.profilePicture;
      }

      // For debugging
      console.log('JWT Callback - Output token:', token);

      return token;
    },
    async session({ session, token }) {
      // For debugging
      console.log('Session Callback - Input:', { session, token });

      if (token) {
        session.user.role = token.role;
        session.user.status = token.status;
        session.user.specialization = token.specialization;
        session.user.profilePicture = token.profilePicture;
      }

      // For debugging
      console.log('Session Callback - Output session:', session);

      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug mode
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 