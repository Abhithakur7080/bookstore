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
Object.defineProperty(exports, "__esModule", { value: true });
const statusCodes_1 = require("../utils/statusCodes");
const emailService_1 = require("../utils/emailService");
const zodErrorHelper_1 = require("../utils/zodErrorHelper");
const contact_validatation_1 = require("../validatations/contact.validatation");
class ContactController {
    constructor() {
        this.sendContact = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = contact_validatation_1.contactSchema.safeParse(req.body);
                if (!result.success) {
                    const errors = (0, zodErrorHelper_1.extractZodErrors)(result.error.errors);
                    return res.status(statusCodes_1.StatusCode.BadRequest).json({ errors });
                }
                const { name, email, subject, message } = result.data;
                if (!name || !email || !message) {
                    return res.status(statusCodes_1.StatusCode.BadRequest).json({
                        success: false,
                        message: "Name, email, and message are required.",
                    });
                }
                const html = `
        <h2>📩 New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || "(No Subject)"}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `;
                yield (0, emailService_1.sendMail)({
                    to: "abhijeetthakur7080@gmail.com",
                    subject: `New Contact Message: ${subject || "No Subject"}`,
                    html,
                });
                return res.status(statusCodes_1.StatusCode.OK).json({
                    success: true,
                    message: "Your message has been sent successfully.",
                });
            }
            catch (error) {
                console.error("❌ Contact form error:", error);
                return res.status(statusCodes_1.StatusCode.InternalServerError).json({
                    success: false,
                    message: "Failed to send your message.",
                });
            }
        });
    }
}
exports.default = new ContactController();
