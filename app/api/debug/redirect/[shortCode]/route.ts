import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const supabase = await createClient();
    const { shortCode } = await params;
    const url = new URL(request.url);

    // Get the short URL from database
    const { data: shortUrl, error: fetchError } = await supabase
      .from("short_urls")
      .select("*")
      .eq("short_code", shortCode)
      .eq("is_active", true)
      .single();

    const userAgent = request.headers.get("user-agent") || "";
    const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isSafari = /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent);

    return NextResponse.json({
      shortCode,
      found: !!shortUrl,
      isPasswordProtected: !!shortUrl?.password_hash,
      originalUrl: shortUrl?.original_url,
      providedPassword: url.searchParams.get("password"),
      userAgent,
      isMobile,
      isSafari,
      headers: Object.fromEntries(request.headers.entries()),
      searchParams: Object.fromEntries(url.searchParams.entries()),
      error: fetchError?.message,
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
} 