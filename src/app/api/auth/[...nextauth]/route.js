import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../../../models/users";
import bcrypt from "bcryptjs";
import { connectMongoDb } from "../../../../../lib/mongodb";
import jwt from "jsonwebtoken";
import { useSession } from "next-auth/react";
import { withAuth} from "next-auth/middleware";


const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        const { email, password } = credentials;

        // Validate input
        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        await connectMongoDb();
        const user = await User.findOne({ email });

        // Validate user existence
        if (!user) {
          throw new Error("User not found");
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        // Generate tokens
        const accessToken = jwt.sign(
          { id: user._id, email: user.email, role: user.role },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" } // Access token expires in 15 minutes
        );

        const refreshToken = jwt.sign(
          { id: user._id },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "7d" } // Refresh token expires in 7 days
        );

        return {
          id: user._id,
          name: user.username,
          email: user.email,
          role: user.role,
          accessToken,
          refreshToken,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // JWT session expiration (1 hour)
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Add user and token details to the JWT
        console.log("User Data:", user);
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      console.log("JWT Token:", token);
      return token;
    },
    async session({ session, token }) {
      // Attach token data to the session
      console.log("Session Token:", token);
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.role = token.role;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/error", // Redirect here on error
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST  }
