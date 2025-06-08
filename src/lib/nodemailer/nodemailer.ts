import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host:
    process.env.NODE_ENV === "production"
      ? process.env.SMTP_HOST_PRODUCTION
      : process.env.SMTP_HOST,
  port:
    process.env.NODE_ENV === "production"
      ? parseInt(process.env.SMTP_PORT_PRODUCTION)
      : parseInt(process.env.SMTP_PORT),
  secure: process.env.NODE_ENV === "production",
  auth: {
    user:
      process.env.NODE_ENV === "production"
        ? process.env.SMTP_USER_PRODUCTION
        : process.env.SMTP_USER,
    pass:
      process.env.NODE_ENV === "production"
        ? process.env.SMTP_PASS_PRODUCTION
        : process.env.SMTP_PASS,
  },
});

/**
 * Send an email
 * @param to - Recipient email
 * @param subject - Email subject
 * @param html - Email body in HTML format
 * @returns Promise<{ success: boolean; message?: string; error?: any }>
 */

export const sendMail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ success: boolean; message?: string; error?: any }> => {
  try {
    const mailOptions = {
      from: `"VANTEK Support" <${
        process.env.NODE_ENV === "production"
          ? process.env.SMTP_USER_PRODUCTION
          : process.env.SMTP_USER
      }>`,
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
