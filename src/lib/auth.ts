import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Role } from "./roles";

// Demo users only – no database
const demoUsers = [
  {
    id: "superadmin-1",
    email: "superadmin@example.com",
    name: "Super Admin",
    password: "superadmin123",
    role: Role.SUPERADMIN,
  },
  {
    id: "admin-1",
    email: "admin@example.com",
    name: "Admin",
    password: "admin123",
    role: Role.ADMIN,
  },
  {
    id: "teacher-1",
    email: "teacher@example.com",
    name: "Teacher",
    password: "teacher123",
    role: Role.TEACHER,
  },
];

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "teacher@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = demoUsers.find(
          (u) =>
            u.email.toLowerCase() === credentials.email.toLowerCase() &&
            u.password === credentials.password,
        );

        if (!user) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ token, session }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role ?? Role.TEACHER;
      }
      return session;
    },
  },
};

