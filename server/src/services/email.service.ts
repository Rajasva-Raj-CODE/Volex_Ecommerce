import { Resend } from "resend";
import { env } from "../config/env";
import { AppError } from "../middleware/error.middleware";

const resend = new Resend(env.RESEND_API_KEY);

async function sendEmail(params: {
  from: string;
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  try {
    const { data, error } = await resend.emails.send(params);

    if (error) {
      console.error("Resend email failed:", error);
      throw new AppError(
        `Email could not be sent: ${error.message ?? "Resend rejected the request"}`,
        502
      );
    }

    if (env.NODE_ENV !== "production") {
      console.log(`Email queued via Resend: ${data?.id ?? "unknown id"} -> ${params.to}`);
    }
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error("Email service failed:", error);
    throw new AppError("Email service failed. Check RESEND_API_KEY and EMAIL_FROM.", 502);
  }
}

// ─── Branded email wrapper ────────────────────────────────────────────────────

function emailWrapper(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>VolteX</title>
</head>
<body style="margin:0;padding:0;background-color:#0f0f0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f0f;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background-color:#1a1a1a;border-radius:12px;overflow:hidden;border:1px solid #2a2a2a;">

          <!-- Header -->
          <tr>
            <td style="background-color:#0d2e20;padding:28px 40px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#2d7a5a;border-radius:8px;padding:8px 10px;display:inline-block;">
                    <span style="color:#0f0f0f;font-size:16px;font-weight:900;">⚡</span>
                  </td>
                  <td style="padding-left:10px;">
                    <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.5px;">VolteX</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid #2a2a2a;">
              <p style="margin:0;color:#555;font-size:12px;">
                This email was sent by VolteX. If you didn't request this, please ignore it.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// ─── Email: Staff Invitation ──────────────────────────────────────────────────

export async function sendStaffInviteEmail(params: {
  toEmail: string;
  invitedByName: string;
  adminUrl: string;
}): Promise<void> {
  const { toEmail, invitedByName, adminUrl } = params;

  const content = `
    <h2 style="margin:0 0 8px;color:#ffffff;font-size:22px;font-weight:700;">You've been invited 🎉</h2>
    <p style="margin:0 0 24px;color:#888;font-size:14px;line-height:1.6;">
      <strong style="color:#ccc;">${invitedByName}</strong> has invited you to join the
      <strong style="color:#ccc;">VolteX</strong> admin team.
    </p>

    <p style="margin:0 0 12px;color:#888;font-size:14px;line-height:1.6;">
      To accept your invitation and get started:
    </p>

    <ol style="margin:0 0 28px;padding-left:20px;color:#888;font-size:14px;line-height:2;">
      <li>Go to the VolteX Admin Panel</li>
      <li>Click <strong style="color:#ccc;">"Login with OTP"</strong></li>
      <li>Enter your email: <strong style="color:#ccc;">${toEmail}</strong></li>
      <li>Enter the OTP sent to your inbox</li>
    </ol>

    <a href="${adminUrl}/login"
       style="display:inline-block;background-color:#2d7a5a;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;letter-spacing:0.3px;">
      Go to Admin Panel →
    </a>
  `;

  await sendEmail({
    from: env.EMAIL_FROM,
    to: toEmail,
    subject: "You've been invited to VolteX Admin",
    html: emailWrapper(content),
  });
}

// ─── Email: Staff OTP Login ───────────────────────────────────────────────────

export async function sendOtpEmail(params: {
  toEmail: string;
  otp: string;
}): Promise<void> {
  const { toEmail, otp } = params;

  // Format OTP with spaces for readability: "123456" → "123 456"
  const formattedOtp = `${otp.slice(0, 3)} ${otp.slice(3)}`;

  const content = `
    <h2 style="margin:0 0 8px;color:#ffffff;font-size:22px;font-weight:700;">Your login code</h2>
    <p style="margin:0 0 32px;color:#888;font-size:14px;line-height:1.6;">
      Use the code below to sign in to your VolteX admin account.
      This code expires in <strong style="color:#ccc;">15 minutes</strong>.
    </p>

    <!-- OTP Box -->
    <div style="background-color:#0d2e20;border:1px solid #2d7a5a;border-radius:10px;padding:28px;text-align:center;margin-bottom:28px;">
      <p style="margin:0 0 6px;color:#666;font-size:11px;text-transform:uppercase;letter-spacing:2px;">One-time password</p>
      <p style="margin:0;color:#ffffff;font-size:40px;font-weight:900;letter-spacing:8px;font-family:'Courier New',monospace;">${formattedOtp}</p>
    </div>

    <p style="margin:0;color:#555;font-size:13px;line-height:1.6;">
      ⚠️ Never share this code with anyone. VolteX will never ask for your OTP.
    </p>
  `;

  await sendEmail({
    from: env.EMAIL_FROM,
    to: toEmail,
    subject: `${otp} — Your VolteX login code`,
    html: emailWrapper(content),
  });
}

// ─── Email: Password Reset ───────────────────────────────────────────────────

export async function sendPasswordResetEmail(params: {
  toEmail: string;
  otp: string;
}): Promise<void> {
  const { toEmail, otp } = params;
  const formattedOtp = `${otp.slice(0, 3)} ${otp.slice(3)}`;

  const content = `
    <h2 style="margin:0 0 8px;color:#ffffff;font-size:22px;font-weight:700;">Reset your password</h2>
    <p style="margin:0 0 32px;color:#888;font-size:14px;line-height:1.6;">
      Use the code below to reset your VolteX account password.
      This code expires in <strong style="color:#ccc;">15 minutes</strong>.
    </p>

    <!-- OTP Box -->
    <div style="background-color:#0d2e20;border:1px solid #2d7a5a;border-radius:10px;padding:28px;text-align:center;margin-bottom:28px;">
      <p style="margin:0 0 6px;color:#666;font-size:11px;text-transform:uppercase;letter-spacing:2px;">Reset code</p>
      <p style="margin:0;color:#ffffff;font-size:40px;font-weight:900;letter-spacing:8px;font-family:'Courier New',monospace;">${formattedOtp}</p>
    </div>

    <p style="margin:0;color:#555;font-size:13px;line-height:1.6;">
      If you didn't request a password reset, you can safely ignore this email.
    </p>
  `;

  await sendEmail({
    from: env.EMAIL_FROM,
    to: toEmail,
    subject: `${otp} — Reset your VolteX password`,
    html: emailWrapper(content),
  });
}

// ─── Email: Order Confirmation ───────────────────────────────────────────────

export async function sendOrderConfirmationEmail(params: {
  toEmail: string;
  toName: string | null;
  orderId: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  totalAmount: number;
  paymentMethod: string;
  address: { line1: string; city: string; state: string; pincode: string };
}): Promise<void> {
  const { toEmail, toName, orderId, items, totalAmount, paymentMethod, address } = params;
  const displayName = toName || "there";
  const shortId = orderId.slice(0, 8).toUpperCase();

  const itemRows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;color:#ccc;font-size:14px;">${item.name}</td>
        <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;color:#888;font-size:14px;text-align:center;">x${item.quantity}</td>
        <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;color:#ccc;font-size:14px;text-align:right;">₹${(item.price * item.quantity).toLocaleString("en-IN")}</td>
      </tr>`
    )
    .join("");

  const content = `
    <h2 style="margin:0 0 8px;color:#ffffff;font-size:22px;font-weight:700;">Order Confirmed!</h2>
    <p style="margin:0 0 24px;color:#888;font-size:14px;line-height:1.6;">
      Hi <strong style="color:#ccc;">${displayName}</strong>, your order <strong style="color:#ccc;">#${shortId}</strong> has been placed successfully.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <thead>
        <tr>
          <th style="text-align:left;padding-bottom:8px;border-bottom:1px solid #2a2a2a;color:#666;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Item</th>
          <th style="text-align:center;padding-bottom:8px;border-bottom:1px solid #2a2a2a;color:#666;font-size:11px;text-transform:uppercase;">Qty</th>
          <th style="text-align:right;padding-bottom:8px;border-bottom:1px solid #2a2a2a;color:#666;font-size:11px;text-transform:uppercase;">Price</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>

    <div style="background-color:#0d2e20;border:1px solid #2d7a5a;border-radius:10px;padding:20px;margin-bottom:24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="color:#888;font-size:14px;">Total</td>
          <td style="color:#ffffff;font-size:20px;font-weight:700;text-align:right;">₹${totalAmount.toLocaleString("en-IN")}</td>
        </tr>
        <tr>
          <td style="color:#666;font-size:12px;padding-top:8px;">Payment</td>
          <td style="color:#888;font-size:12px;padding-top:8px;text-align:right;">${paymentMethod === "COD" ? "Cash on Delivery" : "Paid via Razorpay"}</td>
        </tr>
      </table>
    </div>

    <div style="margin-bottom:24px;">
      <p style="margin:0 0 4px;color:#666;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Delivery Address</p>
      <p style="margin:0;color:#ccc;font-size:14px;line-height:1.5;">
        ${address.line1}<br/>
        ${address.city}, ${address.state} — ${address.pincode}
      </p>
    </div>

    <a href="${env.CLIENT_URL}/orders/${orderId}"
       style="display:inline-block;background-color:#2d7a5a;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;">
      View Order →
    </a>
  `;

  await sendEmail({
    from: env.EMAIL_FROM,
    to: toEmail,
    subject: `Order Confirmed — #${shortId}`,
    html: emailWrapper(content),
  });
}

// ─── Email: Order Status Update ──────────────────────────────────────────────

export async function sendOrderStatusUpdateEmail(params: {
  toEmail: string;
  toName: string | null;
  orderId: string;
  newStatus: string;
}): Promise<void> {
  const { toEmail, toName, orderId, newStatus } = params;
  const displayName = toName || "there";
  const shortId = orderId.slice(0, 8).toUpperCase();

  const statusMessages: Record<string, string> = {
    CONFIRMED: "Your order has been confirmed and is being prepared.",
    SHIPPED: "Your order is on its way!",
    DELIVERED: "Your order has been delivered. Enjoy!",
    CANCELLED: "Your order has been cancelled.",
  };

  const content = `
    <h2 style="margin:0 0 8px;color:#ffffff;font-size:22px;font-weight:700;">Order Update</h2>
    <p style="margin:0 0 24px;color:#888;font-size:14px;line-height:1.6;">
      Hi <strong style="color:#ccc;">${displayName}</strong>, your order <strong style="color:#ccc;">#${shortId}</strong> status has been updated.
    </p>

    <div style="background-color:#0d2e20;border:1px solid #2d7a5a;border-radius:10px;padding:24px;text-align:center;margin-bottom:24px;">
      <p style="margin:0 0 6px;color:#666;font-size:11px;text-transform:uppercase;letter-spacing:2px;">New Status</p>
      <p style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">${newStatus}</p>
    </div>

    <p style="margin:0 0 24px;color:#888;font-size:14px;">
      ${statusMessages[newStatus] || "Your order status has changed."}
    </p>

    <a href="${env.CLIENT_URL}/orders/${orderId}"
       style="display:inline-block;background-color:#2d7a5a;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;">
      View Order →
    </a>
  `;

  await sendEmail({
    from: env.EMAIL_FROM,
    to: toEmail,
    subject: `Order #${shortId} — ${newStatus}`,
    html: emailWrapper(content),
  });
}
