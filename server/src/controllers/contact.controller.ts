import { Request, Response } from "express";
import { StatusCode } from "../utils/statusCodes";
import { sendMail } from "../utils/emailService";
import { extractZodErrors } from "../utils/zodErrorHelper";
import { contactSchema } from "../validatations/contact.validatation";

class ContactController {
  public sendContact = async (req: Request, res: Response) => {
    try {
      const result = contactSchema.safeParse(req.body);
      if (!result.success) {
        const errors = extractZodErrors(result.error.errors);
        return res.status(StatusCode.BadRequest).json({ errors });
      }
      const { name, email, subject, message } = result.data;

      if (!name || !email || !message) {
        return res.status(StatusCode.BadRequest).json({
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

      await sendMail({
        to: "abhijeetthakur7080@gmail.com",
        subject: `New Contact Message: ${subject || "No Subject"}`,
        html,
      });

      return res.status(StatusCode.OK).json({
        success: true,
        message: "Your message has been sent successfully.",
      });
    } catch (error) {
      console.error("❌ Contact form error:", error);
      return res.status(StatusCode.InternalServerError).json({
        success: false,
        message: "Failed to send your message.",
      });
    }
  };
}

export default new ContactController();
