import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";

export async function getServerSession() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function getApiSession(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}
