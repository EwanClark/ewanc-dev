import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import bcrypt from "bcryptjs";
import {
  getLocationFromIP,
  parseUserAgent,
  formatDeviceType,
} from "@/lib/analytics";

interface PageProps {
  params: Promise<{ shortCode: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function trackClick(
  headersList: Headers,
  shortUrlId: string,
  authorized: boolean | null
): Promise<string | null> {
  try {
    // Use service role for system operations (bypasses RLS)
    const { createClient: createServiceClient } = await import("@supabase/supabase-js");
    const supabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get client IP from headers
    const forwardedFor = headersList.get("x-forwarded-for");
    const realIp = headersList.get("x-real-ip");
    const clientIp =
      forwardedFor?.split(",")[0]?.trim() || realIp || "127.0.0.1";

    // Get user agent from headers
    const userAgent = headersList.get("user-agent") || "";

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

export default async function ShortCodePage({ params, searchParams }: PageProps) {
  const supabase = await createClient();
  const headersList = await headers();
  const { shortCode } = await params;
  const searchParamsData = await searchParams;
  const providedPassword = searchParamsData.password as string;
  const clickId = searchParamsData.clickId as string;

  // Get the short URL from database
  let shortUrl;
  try {
    const { data, error: fetchError } = await supabase
      .from("short_urls")
      .select("*")
      .eq("short_code", shortCode)
      .eq("is_active", true)
      .single();

    if (fetchError || !data) {
      // This will show your custom not-found.tsx page
      notFound();
    }
    
    shortUrl = data;
  } catch (error) {
    console.error("Error fetching short URL:", error);
    notFound();
  }

  // Handle password protection
  if (shortUrl.password_hash) {
    if (!providedPassword) {
      // Track unauthorized attempt and get clickId for updating later
      const newClickId = await trackClick(headersList, shortUrl.id, false);

      // Redirect to password form with clickId
      redirect(
        `/password-required?shortCode=${shortCode}&clickId=${newClickId}`
      );
    }

    let isPasswordValid;
    try {
      isPasswordValid = await bcrypt.compare(
        providedPassword,
        shortUrl.password_hash
      );
    } catch (error) {
      console.error("Error validating password:", error);
      notFound();
    }
    
    if (!isPasswordValid) {
      // Track failed attempt if no existing click ID, otherwise keep existing
      if (!clickId) {
        const newClickId = await trackClick(headersList, shortUrl.id, false);
        redirect(
          `/password-required?shortCode=${shortCode}&error=invalid&clickId=${newClickId}`
        );
      } else {
        redirect(
          `/password-required?shortCode=${shortCode}&error=invalid&clickId=${clickId}`
        );
      }
    }

    // Password is valid - update existing click record to authorized
    if (clickId) {
      // Update existing record asynchronously to avoid blocking redirect
      updateClickAuthorization(clickId, true).catch(error => 
        console.error("Background click authorization update failed:", error)
      );
    } else {
      // Track successful attempt if no existing click ID (fallback)
      trackClick(headersList, shortUrl.id, true).catch(error =>
        console.error("Background click tracking failed:", error)
      );
    }
  } else {
    // Track regular click for non-password protected URLs asynchronously
    trackClick(headersList, shortUrl.id, null).catch(error =>
      console.error("Background click tracking failed:", error)
    );
  }

  // Redirect to the original URL - this will throw a redirect error which is normal
  redirect(shortUrl.original_url);
} 