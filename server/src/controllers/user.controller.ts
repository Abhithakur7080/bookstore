import { Request, Response } from "express";
import User from "../models/user.model";
import { StatusCode } from "../utils/statusCodes";
import { sendNewsletterSchema, toggleNewsletterSchema, updateUserSchema } from "../validatations/user.validatation";
import { extractZodErrors } from "../utils/zodErrorHelper";
import { sendMail } from "../utils/emailService";

class UserController {
  /**
   * Get currently authenticated user's profile
   */
  public getProfile = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const user = await User.findById(userId).select(
        "-password -resetPasswordToken -resetPasswordExpires -emailVerificationToken -emailVerificationExpires"
      );
      if (!user) {
        return res
          .status(StatusCode.NotFound)
          .json({ message: "User not found" });
      }
      return res.status(StatusCode.OK).json({ user });
    } catch (error) {
      console.error("📄 Get Profile Error:", error);
      return res
        .status(StatusCode.InternalServerError)
        .json({ message: "Internal server error" });
    }
  };

  /**
   * Update currently authenticated user's profile
   */
  public updateProfile = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res
          .status(StatusCode.Unauthorized)
          .json({ message: "Unauthorized request" });
      }

      const result = updateUserSchema.safeParse(req.body);
      if (!result.success) {
        const errors = extractZodErrors(result.error.errors);
        return res.status(StatusCode.BadRequest).json({ errors });
      }

      const { fullName, phone, gender, dob, avatarUrl, preferences } =
        result.data;

      const user = await User.findByIdAndUpdate(
        userId,
        { fullName, phone, gender, dob, avatarUrl, preferences },
        { new: true, runValidators: true, fields: { password: 0 } }
      );

      if (!user) {
        return res
          .status(StatusCode.NotFound)
          .json({ message: "User not found" });
      }

      return res.status(StatusCode.OK).json({ user });
    } catch (error) {
      console.error("✏️ Update Profile Error:", error);
      return res
        .status(StatusCode.InternalServerError)
        .json({ message: "Internal server error" });
    }
  };

  /**
   * Delete currently authenticated user's account
   */
  public deleteAccount = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        return res
          .status(StatusCode.NotFound)
          .json({ message: "User not found" });
      }
      return res
        .status(StatusCode.OK)
        .json({ message: "Account deleted successfully" });
    } catch (error) {
      console.error("🗑️ Delete Account Error:", error);
      return res
        .status(StatusCode.InternalServerError)
        .json({ message: "Internal server error" });
    }
  };
  /**
   * Toggle newsletter subscription (User action)
   */
  public toggleNewsletter = async (req: Request, res: Response) => {
        const result = toggleNewsletterSchema.safeParse(req.body);
        if (!result.success) {
          return res
            .status(StatusCode.BadRequest)
            .json({ errors: extractZodErrors(result.error.errors) });
        }
    try {
      const userId = req.user?.id;
      const { subscribed } = req.body;

      const user = await User.findByIdAndUpdate(
        userId,
        { "preferences.newsletterSubscribed": subscribed },
        { new: true }
      );

      if (!user) {
        return res
          .status(StatusCode.NotFound)
          .json({ message: "User not found" });
      }

      const message = subscribed
        ? "Subscribed to newsletter successfully"
        : "Unsubscribed from newsletter";

      return res.status(StatusCode.OK).json({ message });
    } catch (error) {
      console.error("📩 Toggle Newsletter Error:", error);
      return res
        .status(StatusCode.InternalServerError)
        .json({ message: "Internal server error" });
    }
  };
  /**
   * Admin sends newsletter to all subscribed users
   */
  public sendNewsletter = async (req: Request, res: Response) => {
        const result = sendNewsletterSchema.safeParse(req.body);
        if (!result.success) {
          return res
            .status(StatusCode.BadRequest)
            .json({ errors: extractZodErrors(result.error.errors) });
        }
    try {
      const { subject, html } = req.body;

      if (!subject || !html) {
        return res.status(StatusCode.BadRequest).json({
          message: "Subject and HTML content are required",
        });
      }

      const users = await User.find({
        "preferences.newsletterSubscribed": true,
      }).select("email");

      if (!users.length) {
        return res
          .status(StatusCode.NotFound)
          .json({ message: "No subscribed users found" });
      }

      const promises = users.map((user) =>
        sendMail({
          to: user.email,
          subject,
          html,
        })
      );

      await Promise.all(promises);

      return res
        .status(StatusCode.OK)
        .json({ message: `Newsletter sent to ${users.length} users.` });
    } catch (error) {
      console.error("📢 Send Newsletter Error:", error);
      return res
        .status(StatusCode.InternalServerError)
        .json({ message: "Failed to send newsletter" });
    }
  };
  /**
 * Admin - Get all users subscribed to the newsletter
 */
public getAllNewsletterSubscribers = async (req: Request, res: Response) => {
  try {
    // Optional: Check if requesting user is admin (you can move this to middleware if preferred)
    if (req.user?.role !== "admin") {
      return res.status(StatusCode.Forbidden).json({
        message: "Access denied. Admins only.",
      });
    }

    const users = await User.find({
      "preferences.newsletterSubscribed": true,
    }).select("fullName email preferences");

    if (!users.length) {
      return res
        .status(StatusCode.NotFound)
        .json({ message: "No subscribed users found" });
    }

    return res.status(StatusCode.OK).json({
      count: users.length,
      subscribers: users,
    });
  } catch (error) {
    console.error("📬 Get Newsletter Subscribers Error:", error);
    return res
      .status(StatusCode.InternalServerError)
      .json({ message: "Failed to retrieve subscribers" });
  }
};

}

export default new UserController();
