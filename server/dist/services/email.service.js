"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendStaffInviteEmail = sendStaffInviteEmail;
exports.sendOtpEmail = sendOtpEmail;
const resend_1 = require("resend");
const env_1 = require("../config/env");
const error_middleware_1 = require("../middleware/error.middleware");
const resend = new resend_1.Resend(env_1.env.RESEND_API_KEY);
async function sendEmail(params) {
    try {
        const { data, error } = await resend.emails.send(params);
        if (error) {
            console.error("Resend email failed:", error);
            throw new error_middleware_1.AppError(`Email could not be sent: ${error.message ?? "Resend rejected the request"}`, 502);
        }
        if (env_1.env.NODE_ENV !== "production") {
            console.log(`Email queued via Resend: ${data?.id ?? "unknown id"} -> ${params.to}`);
        }
    }
    catch (error) {
        if (error instanceof error_middleware_1.AppError)
            throw error;
        console.error("Email service failed:", error);
        throw new error_middleware_1.AppError("Email service failed. Check RESEND_API_KEY and EMAIL_FROM.", 502);
    }
}
// ─── Branded email wrapper ────────────────────────────────────────────────────
function emailWrapper(content) {
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
async function sendStaffInviteEmail(params) {
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
        from: env_1.env.EMAIL_FROM,
        to: toEmail,
        subject: "You've been invited to VolteX Admin",
        html: emailWrapper(content),
    });
}
// ─── Email: Staff OTP Login ───────────────────────────────────────────────────
async function sendOtpEmail(params) {
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
        from: env_1.env.EMAIL_FROM,
        to: toEmail,
        subject: `${otp} — Your VolteX login code`,
        html: emailWrapper(content),
    });
}
//# sourceMappingURL=email.service.js.map