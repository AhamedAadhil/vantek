export const PASSWORDRESET_EMAIL_TEMPLATE = (
  resetUrl: string,
  userName: string
) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Password Reset</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f6f9fc;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.06);
    }
    .header {
      text-align: center;
      margin-bottom: 24px;
    }
    .header h2 {
      color: #1a202c;
    }
    .content {
      font-size: 16px;
      line-height: 1.6;
    }
    .btn {
      display: inline-block;
      padding: 12px 24px;
      margin-top: 24px;
      background-color: #2563eb;
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
    }
    .footer {
      margin-top: 40px;
      font-size: 13px;
      text-align: center;
      color: #888;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Password Reset Request</h2>
    </div>
    <div class="content">
      <p>Hi ${userName},</p>
      <p>We received a request to reset your password. Click the button below to set a new one:</p>
      <p style="text-align: center;">
        <a href="${resetUrl}" class="btn">Reset Password</a>
      </p>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p><a href="${resetUrl}" style="color: #2563eb;">${resetUrl}</a></p>
      <p>This link will expire in 15 minutes for security reasons.</p>
      <p>If you didn’t request a password reset, please ignore this email.</p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Vantek. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = (name: string) => `
  <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; border: 1px solid #e0e0e0; border-radius: 10px;">
    <h2 style="color: #2E86C1;">Hi ${name},</h2>
    <p style="font-size: 16px; color: #333;">
      Your password has been <strong>successfully reset</strong>.
    </p>
    <p style="font-size: 15px; color: #555;">
      If you didn't perform this action, please contact our support team immediately.
    </p>
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #ccc;" />
    <p style="font-size: 14px; color: #888;">
      If you have any questions, feel free to reach out to our support team.
    </p>
    <p style="font-size: 14px; color: #888;">
      Thank you,<br/>
      <strong>The VANTEK Support Team</strong>
    </p>
  </div>
`;

export const ORDER_PLACED_TEMPLATE = (
  customerName: any,
  orderId: any,
  items: any,
  deliveryAddress: any,
  subtotal: any,
  shippingFee: any,
  discount: any,
  couponCode: any,
  total: any
) => {
  const itemsHtml = items
    .map(
      (item) => `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            item.product.name
          }</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${
            item.quantity
          }</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">$${item.price.toFixed(
            2
          )}</td>
        </tr>
      `
    )
    .join("");

  return `
    <div style="max-width: 700px; margin: auto; padding: 20px; font-family: Arial, sans-serif; border: 1px solid #e0e0e0; border-radius: 10px;">
      <h2 style="color: #2E86C1;">Hi ${customerName},</h2>
      <p style="font-size: 16px; color: #333;">Thank you for your order! Your order <strong>#${orderId}</strong> has been placed successfully.</p>

      <h3 style="color: #444; margin-top: 30px;">Order Summary</h3>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <thead>
          <tr>
            <th style="padding: 10px; background-color: #f2f2f2; border: 1px solid #ddd;">Product</th>
            <th style="padding: 10px; background-color: #f2f2f2; border: 1px solid #ddd;">Quantity</th>
            <th style="padding: 10px; background-color: #f2f2f2; border: 1px solid #ddd;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <h3 style="margin-top: 30px; color: #444;">Delivery Address</h3>
      <p style="font-size: 15px; color: #555; line-height: 1.6;">
        ${customerName}<br/>
        ${deliveryAddress.street}, ${deliveryAddress.city}<br/>
        ${deliveryAddress.zipCode}, ${deliveryAddress.country}<br/>
        Phone: ${deliveryAddress.phone}
      </p>

      <h3 style="margin-top: 30px; color: #444;">Payment Details</h3>
      <table style="width: 100%; font-size: 15px;">
        <tr>
          <td style="padding: 5px;">Subtotal:</td>
          <td style="padding: 5px; text-align: right;">$${subtotal.toFixed(
            2
          )}</td>
        </tr>
        <tr>
          <td style="padding: 5px;">Shipping Fee:</td>
          <td style="padding: 5px; text-align: right;">$${shippingFee.toFixed(
            2
          )}</td>
        </tr>
        ${
          couponCode
            ? `<tr>
                <td style="padding: 5px;">Coupon (${couponCode}):</td>
                <td style="padding: 5px; text-align: right;">- $${discount.toFixed(
                  2
                )}</td>
              </tr>`
            : ""
        }
        <tr style="font-weight: bold;">
          <td style="padding: 5px;">Total:</td>
          <td style="padding: 5px; text-align: right;">$${total.toFixed(2)}</td>
        </tr>
      </table>

      <p style="font-size: 14px; color: #888; margin-top: 30px;">
        You'll receive another email when your order is shipped.
      </p>

      <p style="font-size: 14px; color: #888;">
        If you have any questions, feel free to contact our support team.
      </p>

      <p style="font-size: 14px; color: #888;">
        Thank you,<br/>
        <strong>The VANTEK Team</strong>
      </p>
    </div>
  `;
};
