import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

 console.log("📧 sendEmail config:", {
  host: process.env.SMTP_HOST,
   port: process.env.SMTP_PORT,
   user: process.env.SMTP_USER,
 from: process.env.SMTP_FROM,
 });

export const sendEmail = async ({ options }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  return await transporter.sendMail(options);
};
