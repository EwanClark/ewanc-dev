import { UAParser } from 'ua-parser-js';

// Helper function to check if IP is in the 172.16.0.0/12 private range
function isPrivate172Range(ip: string): boolean {
  if (!ip.startsWith('172.')) return false;
  
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  
  const secondOctet = parseInt(parts[1], 10);
  return secondOctet >= 16 && secondOctet <= 31;
}

export interface LocationData {
  country: string | null;
  region: string | null;
  city: string | null;
  isp: string | null;
}

export interface DeviceData {
  device: string | null;
  browser: string | null;
  os: string | null;
}

// Get location data from IP using ipinfo.io
export async function getLocationFromIP(ip: string): Promise<LocationData> {
  try {
    // Skip localhost and private IPs
    if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.') || isPrivate172Range(ip)) {
      return {
        country: 'Local',
        region: 'Local',
        city: 'Local',
        isp: 'Local Network'
      };
    }

    const token = process.env.IP_LOCATOR_TOKEN;
    if (!token) {
      console.warn('IP_LOCATOR_TOKEN not found in environment variables');
      return {
        country: null,
        region: null,
        city: null,
        isp: null
      };
    }

    const response = await fetch(`https://ipinfo.io/${ip}?token=${token}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      country: data.country || null,
      region: data.region || null,
      city: data.city || null,
      isp: data.org || null
    };
  } catch (error) {
    console.error('Error fetching location data:', error);
    return {
      country: null,
      region: null,
      city: null,
      isp: null
    };
  }
}

// Parse user agent to get device information
export function parseUserAgent(userAgent: string): DeviceData {
  try {
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    return {
      device: result.device.type || 'Desktop',
      browser: result.browser.name || null,
      os: result.os.name ? `${result.os.name} ${result.os.version || ''}`.trim() : null
    };
  } catch (error) {
    console.error('Error parsing user agent:', error);
    return {
      device: null,
      browser: null,
      os: null
    };
  }
}

// Capitalize first letter of device type
export function formatDeviceType(device: string | null): string {
  if (!device) return 'Unknown';
  
  // Map common device types
  const deviceMap: { [key: string]: string } = {
    'mobile': 'Mobile',
    'tablet': 'Tablet',
    'desktop': 'Desktop',
    'smarttv': 'Smart TV',
    'wearable': 'Wearable',
    'console': 'Console'
  };

  return deviceMap[device.toLowerCase()] || 'Desktop';
} 