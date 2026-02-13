import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
    trustedOrigins: [process.env.APP_URL || "http://localhost:4000"],
    
    database: prismaAdapter(prisma, {
        provider: "postgresql", 
    }),
    user:{
      additionalFields:{
        role:{
          type: 'string',
          defaultValue: "USER",
          required: false
        },
        phone:{
          type: "string",
          required: false
        },
        status:{
          type: 'string',
          defaultValue: "ACTIVE",
          required: false
        }
      }
    },
    emailAndPassword: { 
    enabled: true, 
    autoSignIn: false,
    requireEmailVerification: true
  }, 
  emailVerification: {
    sendVerificationEmail: async ( { user, url, token }, request) => {
      const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`
      const info = await transporter.sendMail({
    from: '"Prisma Blog" <prismablog@gmail.com>',
    to: "debajitroy544@gmail.com",
    subject: "Hello ✔",
    text: "Hello world?", // Plain-text version of the message
    html: "<b>Hello world?</b>", // HTML version of the message
  });

  console.log("Message sent:", info.messageId);

    },
  },
});