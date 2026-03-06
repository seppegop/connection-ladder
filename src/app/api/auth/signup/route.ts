import { NextRequest, NextResponse } from "next/server";

const USER_NAME_COOKIE = "connection-ladder-user-name";
const USER_EMAIL_COOKIE = "connection-ladder-user-email";

/**
 * Handles POST from signup form (e.g., native form submit before JS hydrates).
 * Sets name and email in cookies so the client can create a fresh user record.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = (formData.get("name") as string)?.trim() ?? "";
    const email = (formData.get("email") as string)?.trim()?.toLowerCase() ?? "";

    const response = NextResponse.redirect(
      new URL("/onboarding", request.url),
      302
    );

    if (name) {
      response.cookies.set(USER_NAME_COOKIE, name, {
        path: "/",
        maxAge: 60 * 60 * 24, // 24 hours
        httpOnly: false,
        sameSite: "lax",
      });
    }
    if (email) {
      response.cookies.set(USER_EMAIL_COOKIE, email, {
        path: "/",
        maxAge: 60 * 60 * 24,
        httpOnly: false,
        sameSite: "lax",
      });
    }

    return response;
  } catch {
    return NextResponse.redirect(new URL("/auth/signup", request.url), 302);
  }
}
