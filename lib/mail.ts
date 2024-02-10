import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendTwoFactorTokenEmail = async (
  email: string,
  token: string,
) => {
  await resend.emails.send( {
    from: "mail@heroldesteves.de",
    to: email,
    subject: "2-Factor Authentification",
    html: `<p>Your 2-Factor Authentification code: ${token}</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "mail@heroldesteves.de",
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "mail@heroldesteves.de",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  });
};

export const sendVerificationEmailOrganization = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification-organization?token=${token}`;

  await resend.emails.send({
    from: "mail@heroldesteves.de",
    to: email,
    subject: "Confirm your email to join your Organization",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm the email to join your organization and set your password.</p>`,
  });
};