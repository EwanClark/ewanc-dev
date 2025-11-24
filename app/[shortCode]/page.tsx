import { notFound, redirect, after } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import bcrypt from "bcryptjs";
import {
  getLocationFromIP,
  parseUserAgent,
  formatDeviceType,
  detectVPN,
  detectTor,
  detectVMFromUserAgent,
} from "@/lib/analytics";

interface PageProps {
  params: Promise<{ shortCode: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Extract client info from headers (synchronous, no external calls)
function extractClientInfo(headersList: Headers) {
  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");
  const clientIp = forwardedFor?.split(",")[0]?.trim() || realIp || "127.0.0.1";
  const userAgent = headersList.get("user-agent") || "";
  
  // Collect headers for VPN analysis
  const headersObject: { [key: string]: string | null } = {};
  headersList.forEach((value, key) => {
    headersObject[key.toLowerCase()] = value;
  });
  
  return { clientIp, userAgent, headersObject };
}

// Fast click tracking - inserts basic data immediately without external API calls
async function trackClickImmediate(
  clientIp: string,
  userAgent: string,
  shortUrlId: string,
  authorized: boolean | null
): Promise<string | null> {
  try {
    const { createClient: createServiceClient } = await import("@supabase/supabase-js");
    const supabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Parse user agent for device info (local, fast)
    const deviceData = parseUserAgent(userAgent);
    const isVM = detectVMFromUserAgent(userAgent);

    // Insert basic click record - no external API calls
    const { data, error } = await supabase
      .from("short_url_analytics")
      .insert({
        short_url_id: shortUrlId,
        ip_address: clientIp,
        user_agent: userAgent,
        authorized: authorized,
        device: formatDeviceType(deviceData.device),
        browser: deviceData.browser,
        os: deviceData.os,
        vm: isVM,
        // These will be enriched asynchronously after redirect
        country: null,
        region: null,
        city: null,
        isp: null,
        vpn: null,
        tor: null,
        incognito: null,
        timezone: null,
        language: null,
        screen_size: null,
        battery_level: null,
        charging_status: null,
        connection_type: null,
        local_ip: null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error tracking click:", error);
      return null;
    }

    return data?.id || null;
  } catch (error) {
    console.error("Error in trackClickImmediate:", error);
    return null;
  }
}

// Background enrichment - runs after redirect via after()
async function enrichClickData(
  clickId: string,
  clientIp: string,
  headersObject: { [key: string]: string | null }
): Promise<void> {
  try {
    const { createClient: createServiceClient } = await import("@supabase/supabase-js");
    const supabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Run all enrichment calls in parallel with timeouts
    const [locationData, isVPN, isTor] = await Promise.all([
      Promise.race([
        getLocationFromIP(clientIp),
        new Promise<{ country: null; region: null; city: null; isp: null }>((resolve) =>
          setTimeout(() => resolve({ country: null, region: null, city: null, isp: null }), 5000)
        ),
      ]),
      Promise.race([
        detectVPN(clientIp, headersObject),
        new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 5000)),
      ]),
      Promise.race([
        detectTor(clientIp),
        new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 5000)),
      ]),
    ]);

    // Update the click record with enriched data
    const { error } = await supabase
      .from("short_url_analytics")
      .update({
        country: locationData.country,
        region: locationData.region,
        city: locationData.city,
        isp: locationData.isp,
        vpn: isVPN,
        tor: isTor,
      })
      .eq("id", clickId);

    if (error) {
      console.error("Error enriching click data:", error);
    }
  } catch (error) {
    console.error("Error in enrichClickData:", error);
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

  // Extract client info once (fast, no external calls)
  const { clientIp, userAgent, headersObject } = extractClientInfo(headersList);

  // Get the short URL from database
  let shortUrl;
  try {
    const { data, error: fetchError } = await supabase
      .from("short_urls")
      .select("*")
      .ilike("short_code", shortCode)
      .eq("is_active", true)
      .single();

    if (fetchError || !data) {
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
      // Track unauthorized attempt immediately (no external API calls)
      const newClickId = await trackClickImmediate(clientIp, userAgent, shortUrl.id, false);

      // Schedule enrichment to run after redirect
      if (newClickId) {
        after(() => enrichClickData(newClickId, clientIp, headersObject));
      }

      // Only include clickId if tracking succeeded
      const clickIdParam = newClickId ? `&clickId=${newClickId}` : '';
      redirect(`/password-required?shortCode=${shortCode}${clickIdParam}`);
    }

    let isPasswordValid;
    try {
      isPasswordValid = await bcrypt.compare(providedPassword, shortUrl.password_hash);
    } catch (error) {
      console.error("Error validating password:", error);
      notFound();
    }
    
    if (!isPasswordValid) {
      if (!clickId) {
        const newClickId = await trackClickImmediate(clientIp, userAgent, shortUrl.id, false);
        
        if (newClickId) {
          after(() => enrichClickData(newClickId, clientIp, headersObject));
        }
        
        // Only include clickId if tracking succeeded
        const clickIdParam = newClickId ? `&clickId=${newClickId}` : '';
        redirect(`/password-required?shortCode=${shortCode}&error=invalid${clickIdParam}`);
      } else {
        redirect(`/password-required?shortCode=${shortCode}&error=invalid&clickId=${clickId}`);
      }
    }

    // Password is valid - update existing click record to authorized
    if (clickId) {
      // Schedule authorization update to run after redirect
      after(() => updateClickAuthorization(clickId, true));
      
      const encodedUrl = encodeURIComponent(shortUrl.original_url);
      redirect(`/${shortCode}/redirect?url=${encodedUrl}&clickId=${clickId}`);
    } else {
      // Track successful attempt immediately
      const newClickId = await trackClickImmediate(clientIp, userAgent, shortUrl.id, true);
      
      if (newClickId) {
        after(() => enrichClickData(newClickId, clientIp, headersObject));
      }
      
      const encodedUrl = encodeURIComponent(shortUrl.original_url);
      const clickIdParam = newClickId ? `&clickId=${newClickId}` : '';
      redirect(`/${shortCode}/redirect?url=${encodedUrl}${clickIdParam}`);
    }
  } else {
    // Track regular click immediately (no external API calls blocking redirect)
    const newClickId = await trackClickImmediate(clientIp, userAgent, shortUrl.id, null);
    
    // Schedule enrichment to run AFTER the redirect response is sent
    if (newClickId) {
      after(() => enrichClickData(newClickId, clientIp, headersObject));
    }
    
    const encodedUrl = encodeURIComponent(shortUrl.original_url);
    const clickIdParam = newClickId ? `&clickId=${newClickId}` : '';
    redirect(`/${shortCode}/redirect?url=${encodedUrl}${clickIdParam}`);
  }
} 