import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"

export const authoptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Enter Username" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.username && credentials?.password) {
        try {
          // Add logic here to look up the user from the credentials supplied          
          const res = await fetch(process.env.NEXT_PUBLIC_NEXTAUTH_URL + "/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: credentials?.username,
              password: credentials?.password
            }),
          });

          const user = await res.json();

          if (user) {
            return user
          } else {
            console.error("Invalid credentials");
          }
        } catch (error) {
          console.error('Login Failed');
        }
      } else {
        console.error("Not all fields completed")
      }
      }
    })
  ]
};