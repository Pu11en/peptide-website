import { NextResponse } from "next/server";
import * as Sentry from '@sentry/nextjs'
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const host = req.headers.get("x-forwarded-host") ?? url.host;
    const proto = req.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "");
    const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');

    // Force HTTPS only in production (not for localhost)
    if (proto !== "https" && !isLocalhost) {
      url.protocol = "https:";
      return NextResponse.redirect(url, 308);
    }

    // Canonical host: move www -> apex (only in production)
    if (host === "www.incrediblepeptide.com") {
      url.host = "incrediblepeptide.com";
      return NextResponse.redirect(url, 308);
    }

    return NextResponse.next();
  } catch (error) {
    try { Sentry.captureException(error) } catch {}
    return NextResponse.next();
  }
}