import nodemailer from "nodemailer";

function getTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

function mustGetFrontendUrl() {
  const url = String(process.env.FRONTEND_URL || "").trim().replace(/\/$/, "");
  if (!url) {
    throw new Error("FRONTEND_URL is not configured");
  }
  return url;
}

function getFromAddress() {
  return `"ERP System" <${process.env.EMAIL_USER}>`;
}

export async function sendVerifyEmail(email, rawToken) {
  const transporter = getTransporter();
  const verifyLink = `${mustGetFrontendUrl()}/verify-email?token=${rawToken}`;

  await transporter.sendMail({
    from: getFromAddress(),
    to: email,
    subject: "Verify your email",
    html: `<p>Please verify your email to continue:</p>
           <a href="${verifyLink}">${verifyLink}</a>`,
  });
}

export async function sendSetPasswordEmail(email, rawToken) {
  const transporter = getTransporter();
  const setPasswordLink = `${mustGetFrontendUrl()}/set-password?token=${rawToken}`;

  await transporter.sendMail({
    from: getFromAddress(),
    to: email,
    subject: "Set your password",
    html: `<p>Your email is verified. Set your password to activate your account:</p>
           <a href="${setPasswordLink}">${setPasswordLink}</a>`,
  });
}

export async function sendResetEmail(email, rawToken) {
  const transporter = getTransporter();
  const resetLink = `${mustGetFrontendUrl()}/set-password?token=${rawToken}`;

  await transporter.sendMail({
    from: getFromAddress(),
    to: email,
    subject: "Password Reset",
    html: `<p>Click below to reset your password:</p>
           <a href="${resetLink}">${resetLink}</a>`,
  });
}

export async function sendWelcomeCredentialsEmail({
  email,
  fullName,
  username,
  password,
  role,
}) {
  const transporter = getTransporter();

  const safeName = fullName || username || email;

  const html = `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background:#f5f7fb; padding:24px;">
      <div style="max-width:640px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 12px 30px rgba(15,23,42,0.08);">
        <div style="background:linear-gradient(135deg,#0f172a,#1d4ed8); padding:24px 32px; color:#e5e7eb;">
          <h1 style="margin:0; font-size:22px; font-weight:600;">Welcome to Bright MTS Inventory</h1>
          <p style="margin:6px 0 0; font-size:14px; opacity:0.9;">Your professional account is ready</p>
        </div>
        <div style="padding:24px 32px; color:#0f172a; font-size:14px; line-height:1.6;">
          <p style="margin:0 0 16px;">Hello <strong>${safeName}</strong>,</p>
          <p style="margin:0 0 16px;">
            Your account has been created with the role <strong>${role}</strong>.
            Please use the credentials below to log in to the Bright MTS Inventory System.
          </p>
          <div style="margin:24px 0; border-radius:10px; border:1px solid #e5e7eb; background:#f9fafb;">
            <div style="display:flex; padding:12px 16px; border-bottom:1px solid #e5e7eb;">
              <div style="flex:1; font-size:12px; letter-spacing:0.06em; text-transform:uppercase; color:#6b7280;">Username</div>
              <div style="flex:1; font-weight:600; color:#111827; text-align:right;">${username}</div>
            </div>
            <div style="display:flex; padding:12px 16px;">
              <div style="flex:1; font-size:12px; letter-spacing:0.06em; text-transform:uppercase; color:#6b7280;">Password</div>
              <div style="flex:1; font-weight:600; color:#111827; text-align:right;">${password}</div>
            </div>
          </div>
          <p style="margin:0 0 12px; font-size:13px; color:#ef4444;">
            <strong>Important:</strong> For security, please change your password immediately after your first login.
          </p>
          <p style="margin:0 0 4px; font-size:12px; color:#6b7280;">
            This is an automated message from Bright MTS Inventory System.
          </p>
        </div>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: getFromAddress(),
    to: email,
    subject: "Welcome to Bright MTS Inventory – Your Account Credentials",
    html,
  });
}
