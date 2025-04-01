import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send an email
 * @param to - Recipient email
 * @param subject - Email subject
 * @param html - Email body in HTML format
 * @returns Promise<{ success: boolean; message?: string; error?: any }>
 */

export const sendMail = async (
  to: string,
  subject: string,
  html: string
): Promise<{ success: boolean; message?: string; error?: any }> => {
  try {
    const mailOptions = {
      from: `"VANTEK Support" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    };
    await transporter.sendMail(mailOptions);
    return {
      success: true,
      message: "Email sent successfully",
    };
  } catch (error) {
    return { success: false, error };
  }
};
