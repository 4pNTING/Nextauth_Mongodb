import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../../../models/users";
import bcrypt from "bcryptjs";
import { connectMongoDb } from "../../../../../lib/mongodb";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      async authorize(credentials, req) {
        const { email, password } = credentials;

        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        try {
          await connectMongoDb();

          // ค้นหาผู้ใช้ในฐานข้อมูล
          const user = await User.findOne({ email });
          if (!user) {
            throw new Error("User not found");
          }

          // ตรวจสอบรหัสผ่าน
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }

          console.log(user, "--------------User");

          // คืนค่าข้อมูลผู้ใช้
          return {
            id: user._id,
            name: user.username, // ใช้ username เป็น name
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          throw new Error(error.message);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.name = user.name; // ใช้ name ที่ส่งมาจาก authorize
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user.id = token.id;
      session.user.name = token.name; // ใช้ name ที่ส่งจาก jwt
      session.user.email = token.email;
      session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/logout", // ตั้งค่าหน้า signOut (ถ้าจำเป็น)
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
