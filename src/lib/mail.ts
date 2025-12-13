import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // Or use 'host' and 'port' if not using Gmail service directly
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export const sendOtpEmail = async (email: string, code: string, type: "REGISTER" | "RESET") => {
  console.log("DEBUG: EMAIL_SERVER_USER present?", !!process.env.EMAIL_SERVER_USER);
  console.log("DEBUG: EMAIL_SERVER_PASSWORD present?", !!process.env.EMAIL_SERVER_PASSWORD);

  const subject = type === "REGISTER"
    ? "Verify your email for UM Entreprise"
    : "Reset your password for UM Entreprise";

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>${type === "REGISTER" ? "Welcome to UM Entreprise!" : "Password Reset Request"}</h2>
      <p>Use the following code to ${type === "REGISTER" ? "verify your email address" : "reset your password"}:</p>
      <div style="background-color: #f4f4f4; padding: 12px; font-size: 24px; letter-spacing: 4px; font-weight: bold; text-align: center; border-radius: 6px; margin: 20px 0;">
        ${code}
      </div>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_SERVER_USER,
    to: email,
    subject,
    html,
  });
};

export const sendOrderNotification = async (order: any, userEmail: string) => {
  const subject = `New Order Received! #${order.id.slice(-6)}`;

  const itemsList = order.items
    .map(
      (item: any) =>
        `<li>${item.product.name} (x${item.quantity}) - ₹${item.priceAtPurchase}</li>`
    )
    .join("");

  const html = `
    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #1e293b;">New Order Alert 📦</h2>
      <p><strong>Order ID:</strong> #${order.id}</p>
      <p><strong>Customer:</strong> ${userEmail}</p>
      <p><strong>Amount:</strong> ₹${order.totalAmount}</p>
      <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
      
      <h3>Items:</h3>
      <ul>${itemsList}</ul>

      <div style="margin-top: 24px;">
        <a href="${process.env.NEXTAUTH_URL}/admin/orders" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View Order</a>
      </div>
    </div>
  `;

  try {
    // Send to Admin
    await transporter.sendMail({
      from: process.env.EMAIL_SERVER_USER,
      to: process.env.EMAIL_SERVER_USER,
      subject,
      html,
    });
  } catch (error) {
    console.error("Failed to send order notification:", error);
  }
};
