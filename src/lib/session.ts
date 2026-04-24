import { SignJWT, jwtVerify } from "jose";
import type { NextRequest, NextResponse } from "next/server";

import { env } from "@/lib/env";

export const SESSION_COOKIE_NAME = "gp_session";

export type SessionRole = "USER" | "ADMIN";

export type SessionPayload = {
  userId: string;
  role: SessionRole;
  email?: string;
};

function getSecret() {
  return new TextEncoder().encode(env.JWT_SECRET);
}

export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySessionToken(token?: string) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });
}

export async function getRequestSession(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}
