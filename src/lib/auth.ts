import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

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

  socialProviders: {
    google: {
      accessType: "offline",
      prompt: "select_account consent",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: '"Prisma Blog" <prismablog@gmail.com>',
          to: user.email,
          subject: "Verify your email address",
          html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Email Verification</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, sans-serif;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:40px auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.05);">
      
      <!-- Header -->
      <tr>
        <td style="background-color:#4f46e5; padding:30px; text-align:center;">
          <h1 style="color:#ffffff; margin:0; font-size:24px;">
            Prisma Blog
          </h1>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:40px 30px; color:#333333;">
          <h2 style="margin-top:0; font-size:20px;">
          Hello! ${user.name} <br>
           Please, Verify Your Email Address
          </h2>
          <p style="font-size:16px; line-height:1.6; margin:20px 0;">
            Thanks for signing up! Please confirm your email address by clicking the button below.
          </p>

          <!-- Button -->
          <div style="text-align:center; margin:30px 0;">
            <a href="${verificationUrl}" 
               style="background-color:#4f46e5; color:#ffffff; padding:14px 28px; text-decoration:none; font-size:16px; border-radius:6px; display:inline-block;">
              Verify Email
            </a>
          </div>

          <p style="font-size:14px; color:#666666; line-height:1.6;">
            If the button above doesn’t work, copy and paste the following link into your browser:
          </p>

          <p style="word-break:break-all; font-size:14px; color:#4f46e5;">
            ${url}
          </p>

          <p style="font-size:14px; color:#666666; margin-top:30px;">
            If you didn’t create an account, you can safely ignore this email.
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#f9fafb; padding:20px; text-align:center; font-size:12px; color:#999999;">
          © 2026 Prisma Blog. All rights reserved.
        </td>
      </tr>
    </table>
  </body>
</html>`,
        });

        console.log("Message sent:", info.messageId);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },
});
