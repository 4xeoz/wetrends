import { NextRequest, NextResponse } from "next/server";

/**
 * Validates the x-api-key header against N8N_API_KEY env var.
 * Optionally checks client IP against N8N_ALLOWED_IPS (comma-separated).
 */
export function validateApiKey(request: NextRequest):
  | { authorized: true }
  | { authorized: false; response: NextResponse } {
  // 1. Check API key
  const apiKey = request.headers.get("x-api-key");
  const expectedKey = process.env.N8N_API_KEY;

  if (!expectedKey) {
    console.error("[API Auth] N8N_API_KEY is not set in environment");
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      ),
    };
  }

  if (!apiKey || apiKey !== expectedKey) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  // 2. Optional IP allowlist
  const allowedIPs = process.env.N8N_ALLOWED_IPS;
  if (allowedIPs) {
    const clientIP =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const whitelist = allowedIPs.split(",").map((ip) => ip.trim());
    if (!whitelist.includes(clientIP)) {
      return {
        authorized: false,
        response: NextResponse.json(
          { success: false, message: "Forbidden" },
          { status: 403 }
        ),
      };
    }
  }

  return { authorized: true };
}
