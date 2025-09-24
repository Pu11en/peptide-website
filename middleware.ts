import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const host = req.headers.get("x-forwarded-host") ?? url.host;
  const proto = req.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "");

  // Force HTTPS
  if (proto !== "https") {
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }

  // Canonical host: move www -> apex
  if (host === "www.incrediblepeptide.com") {
    url.host = "incrediblepeptide.com";
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}