import nodemailer from "nodemailer";
import "dotenv/config"

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.MAIL_PORT) || 465,
  secure: true, // true for port 465, false for 587
  auth: {
    user: process.env.MAIL_USER || "abhijeetthakur7080@gmail.com",
    pass: process.env.MAIL_PASS || "udca odyl lazb gvty",
  },
});

export const sendMail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  try {
    const info = await transporter.sendMail({
      from: `The Book Store <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("📨 Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};
