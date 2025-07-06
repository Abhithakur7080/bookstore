"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
require("dotenv/config");
const transporter = nodemailer_1.default.createTransport({
    host: process.env.MAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.MAIL_PORT) || 465,
    secure: true, // true for port 465, false for 587
    auth: {
        user: process.env.MAIL_USER || "abhijeetthakur7080@gmail.com",
        pass: process.env.MAIL_PASS || "udca odyl lazb gvty",
    },
});
const sendMail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, subject, html, }) {
    try {
        const info = yield transporter.sendMail({
            from: `The Book Store <${process.env.MAIL_USER}>`,
            to,
            subject,
            html,
        });
        console.log("📨 Email sent:", info.messageId);
        return info;
    }
    catch (error) {
        console.error("❌ Error sending email:", error);
        throw error;
    }
});
exports.sendMail = sendMail;
