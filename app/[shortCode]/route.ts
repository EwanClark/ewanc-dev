import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import bcrypt from "bcryptjs";
import {
  getLocationFromIP,
  parseUserAgent,
  formatDeviceType,
} from "@/lib/analytics";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const supabase = await createClient();
    const { shortCode } = await params;

    // Get the short URL from database
    const { data: shortUrl, error: fetchError } = await supabase
      .from("short_urls")
      .select("*")
      .eq("short_code", shortCode)
      .eq("is_active", true)
      .single();

    if (fetchError || !shortUrl) {
      // Return 404 page instead of JSON for better UX
      return NextResponse.redirect(new URL("/not-found", request.url));
    }

    // Handle password protection
    if (shortUrl.password_hash) {
      const url = new URL(request.url);
      const providedPassword = url.searchParams.get("password");
      const clickId = url.searchParams.get("clickId");

      if (!providedPassword) {
        // Track unauthorized attempt and get clickId for updating later
        const newClickId = await trackClick(request, shortUrl.id, false);

        // Redirect to password form with clickId
        return NextResponse.redirect(
          new URL(
            `/password-required?shortCode=${shortCode}&clickId=${newClickId}`,
            request.url
          )
        );
      }

      const isPasswordValid = await bcrypt.compare(
        providedPassword,
        shortUrl.password_hash
      );
      if (!isPasswordValid) {
        // Track failed attempt if no existing click ID, otherwise keep existing
        if (!clickId) {
          const newClickId = await trackClick(request, shortUrl.id, false);
          return NextResponse.redirect(
            new URL(
              `/password-required?shortCode=${shortCode}&error=invalid&clickId=${newClickId}`,
              request.url
            )
          );
        } else {
          return NextResponse.redirect(
            new URL(
              `/password-required?shortCode=${shortCode}&error=invalid&clickId=${clickId}`,
              request.url
            )
          );
        }
      }

      // Password is valid - update existing click record to authorized
      if (clickId) {
        // Update existing record asynchronously to avoid blocking redirect
        updateClickAuthorizationAsync(clickId, true);
      } else {
        // Track successful attempt if no existing click ID (fallback)
        trackClickAsync(request, shortUrl.id, true);
      }
    } else {
      // Track regular click for non-password protected URLs asynchronously
      trackClickAsync(request, shortUrl.id, null);
    }

    // Add mobile browser specific headers for better redirect handling
    const userAgent = request.headers.get("user-agent") || "";
    const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isSafari = /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent);
    
    const response = NextResponse.redirect(shortUrl.original_url, { status: 302 });
    
    if (isMobile || isSafari) {
      // Add headers to help mobile browsers handle the redirect properly
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
    }

    return response;
  } catch (error) {
    console.error("Error in redirect:", error);
    return NextResponse.redirect(new URL("/not-found", request.url));
  }
}

// Async function to track clicks without blocking redirects
async function trackClickAsync(
  request: NextRequest,
  shortUrlId: string,
  authorized: boolean | null
): Promise<void> {
  // Don't await this - let it run in background
  setTimeout(async () => {
    try {
      await trackClick(request, shortUrlId, authorized);
    } catch (error) {
      console.error("Background click tracking failed:", error);
    }
  }, 0);
}

// Async function to update click authorization without blocking redirects
async function updateClickAuthorizationAsync(
  clickId: string,
  authorized: boolean
): Promise<void> {
  // Don't await this - let it run in background
  setTimeout(async () => {
    try {
      await updateClickAuthorization(clickId, authorized);
    } catch (error) {
      console.error("Background click authorization update failed:", error);
    }
  }, 0);
}

async function trackClick(
  request: NextRequest,
  shortUrlId: string,
  authorized: boolean | null
): Promise<string | null> {
  try {
    const supabase = await createClient();

    // Get client IP
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const clientIp =
      forwardedFor?.split(",")[0]?.trim() || realIp || "127.0.0.1";

    // Get user agent
    const userAgent = request.headers.get("user-agent") || "";

    // Get location data from IP with timeout to prevent blocking
    let locationData = { country: null, region: null, city: null, isp: null };
    try {
      locationData = await Promise.race([
        getLocationFromIP(clientIp),
        new Promise<any>((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 2000)
        )
      ]);
    } catch (error) {
      console.log("Location lookup timed out or failed, using defaults");
    }

    // Parse user agent for device info
    const deviceData = parseUserAgent(userAgent);

    // Insert click record with enhanced data
    const { data, error } = await supabase
      .from("short_url_analytics")
      .insert({
        short_url_id: shortUrlId,
        ip_address: clientIp,
        user_agent: userAgent,
        authorized: authorized,
        country: locationData.country,
        region: locationData.region,
        city: locationData.city,
        isp: locationData.isp,
        device: formatDeviceType(deviceData.device),
        browser: deviceData.browser,
        os: deviceData.os,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error tracking click:", error);
      return null;
    }

    const clickId = data?.id || null;
    return clickId;
  } catch (error) {
    console.error("Error in trackClick:", error);
    return null;
  }
}

async function updateClickAuthorization(
  clickId: string,
  authorized: boolean
): Promise<boolean> {
  try {
    // Use service role for system operations (bypasses RLS)
    const { createClient } = await import("@supabase/supabase-js");
    const supabaseService = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabaseService
      .from("short_url_analytics")
      .update({ authorized: authorized })
      .eq("id", clickId)
      .select();

    if (error) {
      console.error("Error updating click authorization:", error);
      return false;
    }

    if (!data || data.length === 0) {
      console.error(
        "No rows were updated - click record may not exist or RLS policy blocking update"
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in updateClickAuthorization:", error);
    return false;
  }
}
