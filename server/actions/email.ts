"use server";

import getBaseURL from "@/lib/base-url";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = getBaseURL();

// send 2 factor token to email  ---------------------------

export const sendTwoFactorTokenByEmail = async (
  email: string,
  token: string
) => {
  const { data, error } = await resend.emails.send({
    from: "onBoarding@resend.dev",
    to: email,
    subject: "get & buy - Your 2 Factor Token",
    html: `<p>Your Confirmation code is ${token}</p>`,
  });

  if (error) {
    return console.log(error);
  }

  if (data) {
    return data;
  }
};

// send register verification to email  ---------------------------

export const sendVerficitaionEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;
  const { data, error } = await resend.emails.send({
    from: "onBoarding@resend.dev",
    to: email,
    subject: "get & buy - Confirmation Email",
    html: `<p>Click to <a href=${confirmLink}>Confirm your email</a></p>`,
  });

  if (error) {
    return console.log(error);
  }

  if (data) {
    return data;
  }
};

// send reset email password to email  ---------------------------

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-password?token=${token}`;
  const { data, error } = await resend.emails.send({
    from: "onBoarding@resend.dev",
    to: email,
    subject: "get & buy - Confirmation Email",
    html: `<p>Click here <a href=${confirmLink}>Reset your password</a></p>`,
  });

  if (error) {
    return console.log(error);
  }

  if (data) {
    return data;
  }
};
