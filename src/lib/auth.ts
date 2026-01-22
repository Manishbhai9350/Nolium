import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
import { polar, checkout, portal } from '@polar-sh/better-auth';
import { polarClient } from './polar'


export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins:[
    polar({
      client: polarClient,
      createCustomerOnSignUp:true,
      use:[
        checkout({
          products:[
            {
              productId:'785240f3-8365-4883-b69c-e8bc9f789b7a',
              slug:'pro'
            }
          ],
          authenticatedUsersOnly:true,
          successUrl:process.env.POLAR_SUCCESS_URL
        }),
        portal()
      ]
    })
  ],
  emailAndPassword: { 
    enabled: true, 
    autoSignIn: true
  }, 
  socialProviders: { 
    github: { 
      clientId: process.env.GITHUB_CLIENT_ID as string, 
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
    }, 
  }, 
});
