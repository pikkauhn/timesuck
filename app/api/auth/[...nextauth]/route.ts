import NextAuth from "next-auth/next";
import { authoptions } from "../authOptions/authoptions";

const handler = NextAuth(authoptions)

export {handler as GET, handler as POST}