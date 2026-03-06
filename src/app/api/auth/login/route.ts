import { NextRequest, NextResponse } from "next/server";

const USER_EMAIL_COOKIE = "connection-ladder-user-email";

/**
 * Handles POST from login form (e.g., native form submit before JS hydrates).
 * Sets email in cookie so client can set current user, then redirects to dashboard.
 */
export async function POST(request: NextRequest) {
  const formData = await request.formData().catch(() => null);
  const email = formData
    ? (formData.get("email") as string)?.trim()?.toLowerCase() ?? ""
    : "";

  const response = NextResponse.redirect(new URL("/dashboard", request.url), 302);

  if (email) {
    response.cookies.set(USER_EMAIL_COOKIE, email, {
      path: "/",
      maxAge: 60 * 60 * 24,
      httpOnly: false,
      sameSite: "lax",
    });
  }

  return response;
}
