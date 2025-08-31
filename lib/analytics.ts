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

export interface EnhancedAnalyticsData {
  vpn: boolean | null;
  tor: boolean | null;
  vm: boolean | null;
  incognito: boolean | null;
  timezone: string | null;
  language: string | null;
  screen_size: string | null;
  battery_level: number | null;
  charging_status: boolean | null;
  connection_type: string | null;
  local_ip: string | null;
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

// SEO and performance tracking utilities

export function trackPageView(url: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_location: url,
    })
  }
}

export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// SEO-focused events
export function trackSEOEvents() {
  // Track external link clicks
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    const link = target.closest('a')
    
    if (link && link.href && !link.href.startsWith(window.location.origin)) {
      trackEvent('click', 'external_link', link.href)
    }
  })

  // Track email clicks
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    const link = target.closest('a')
    
    if (link && link.href && link.href.startsWith('mailto:')) {
      trackEvent('click', 'email', link.href.replace('mailto:', ''))
    }
  })

  const contactButtons = document.querySelectorAll('[data-contact]')
  contactButtons.forEach(button => {
    button.addEventListener('click', () => {
      trackEvent('click', 'contact', button.getAttribute('data-contact') || 'unknown')
    })
  })
}

// VPN/Proxy Detection using multiple heuristics
export async function detectVPN(ip: string, headers: { [key: string]: string | null }): Promise<boolean> {
  try {
    // Check common VPN/proxy headers
    const proxyHeaders = [
      'x-forwarded-for',
      'x-real-ip',
      'x-proxy-id',
      'http_x_forwarded_for',
      'http_x_forwarded',
      'http_forwarded_for',
      'http_forwarded',
      'http_via',
      'http_x_coming_from',
      'http_x_real_ip'
    ];

    const hasProxyHeaders = proxyHeaders.some(header => 
      headers[header] !== undefined && headers[header] !== null
    );

    // Check for known VPN/proxy services using ipinfo.io org field
    const token = process.env.IP_LOCATOR_TOKEN;
    if (token && ip && !ip.startsWith('192.168.') && !ip.startsWith('10.') && !isPrivate172Range(ip) && ip !== '127.0.0.1') {
      const response = await fetch(`https://ipinfo.io/${ip}?token=${token}`);
      if (response.ok) {
        const data = await response.json();
        const org = (data.org || '').toLowerCase();
        
        // Check for common VPN/proxy service indicators
        const vpnIndicators = [
          'vpn', 'proxy', 'tor', 'hosting', 'cloud', 'datacenter', 'virtual private',
          'amazon', 'google cloud', 'microsoft azure', 'digital ocean', 'vultr',
          'linode', 'ovh', 'hetzner', 'surfshark', 'nordvpn', 'expressvpn',
          'cyberghost', 'privateinternetaccess', 'protonvpn', 'windscribe'
        ];
        
        const isVpnProvider = vpnIndicators.some(indicator => org.includes(indicator));
        if (isVpnProvider) {
          return true;
        }
      }
    }

    return hasProxyHeaders;
  } catch (error) {
    console.error('Error detecting VPN:', error);
    return false;
  }
}

// Tor Detection
export async function detectTor(ip: string): Promise<boolean> {
  try {
    // Skip local/private IPs
    if (!ip || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.') || isPrivate172Range(ip)) {
      return false;
    }

    // Check against Tor exit node list (simplified check using known patterns)
    // In production, you'd want to use a more comprehensive Tor exit node list
    const response = await fetch(`https://check.torproject.org/api/ip`);
    if (response.ok) {
      const data = await response.json();
      return data.IsTor === true;
    }

    // Fallback: Check for common Tor indicators in reverse DNS
    try {
      // This is a simplified check - in production you'd want a more robust method
      return false;
    } catch {
      return false;
    }
  } catch (error) {
    console.error('Error detecting Tor:', error);
    return false;
  }
}

// Virtual Machine Detection (server-side)
export function detectVMFromUserAgent(userAgent: string): boolean {
  try {
    const vmIndicators = [
      'virtualbox', 'vmware', 'qemu', 'kvm', 'xen', 'hyper-v',
      'parallels', 'virtual machine', 'vm', 'vbox', 'bochs'
    ];
    
    const lowerUA = userAgent.toLowerCase();
    return vmIndicators.some(indicator => lowerUA.includes(indicator));
  } catch (error) {
    console.error('Error detecting VM from user agent:', error);
    return false;
  }
}

// Incognito/Private Window Detection (client-side only)
export function detectIncognitoClientSide(): boolean {
  try {
    // This can only be reliably detected on the client side
    // We'll pass this detection to the client and receive it back
    if (typeof window === 'undefined') return false;
    
    // Multiple detection methods for different browsers
    const isChrome = 'chrome' in window && 'webkitRequestFileSystem' in window;
    const isFirefox = 'InstallTrigger' in window;
    const isSafari = /constructor/i.test(window.HTMLElement as any) || 
                    (window as any).safari?.pushNotification?.toString() === '[object SafariRemoteNotification]';

    if (isChrome) {
      // Chrome incognito detection
      return new Promise<boolean>((resolve) => {
        (window as any).webkitRequestFileSystem(
          (window as any).TEMPORARY, 1,
          () => resolve(false),
          () => resolve(true)
        );
      }) as any;
    }

    if (isFirefox) {
      // Firefox private mode detection
      return !window.indexedDB;
    }

    if (isSafari) {
      // Safari private mode detection
      try {
        window.localStorage.setItem('test', '1');
        window.localStorage.removeItem('test');
        return false;
      } catch {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('Error detecting incognito mode:', error);
    return false;
  }
}

// Get client-side analytics data (to be called from the client)
export function getClientSideAnalytics(): EnhancedAnalyticsData {
  if (typeof window === 'undefined') {
    return {
      vpn: null,
      tor: null,
      vm: null,
      incognito: null,
      timezone: null,
      language: null,
      screen_size: null,
      battery_level: null,
      charging_status: null,
      connection_type: null,
      local_ip: null
    };
  }

  try {
    // Get timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Get language
    const language = navigator.language || (navigator as any).userLanguage;
    
    // Get screen size
    const screen_size = `${screen.width}x${screen.height}`;
    
    // Get connection type
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    const connection_type = connection ? connection.effectiveType || connection.type : null;
    
    // VM Detection (client-side checks)
    const vm = detectVMClientSide();
    
    // Incognito detection
    const incognito = detectIncognitoClientSide();
    
    // Battery API (if available)
    let battery_level: number | null = null;
    let charging_status: boolean | null = null;
    
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        battery_level = Math.round(battery.level * 100);
        charging_status = battery.charging;
      }).catch(() => {
        // Battery API not available or blocked
      });
    }

    return {
      vpn: null, // Will be detected server-side
      tor: null, // Will be detected server-side
      vm,
      incognito,
      timezone,
      language,
      screen_size,
      battery_level,
      charging_status,
      connection_type,
      local_ip: null // Will be detected server-side
    };
  } catch (error) {
    console.error('Error getting client-side analytics:', error);
    return {
      vpn: null,
      tor: null,
      vm: null,
      incognito: null,
      timezone: null,
      language: null,
      screen_size: null,
      battery_level: null,
      charging_status: null,
      connection_type: null,
      local_ip: null
    };
  }
}

// VM Detection (client-side)
function detectVMClientSide(): boolean {
  try {
    // Check for VM-specific properties
    const vmChecks = [
      // Check for reduced performance characteristics
      performance.hardwareConcurrency < 2,
      
      // Check for VM-specific screen resolutions
      screen.width === 1024 && screen.height === 768,
      screen.width === 1366 && screen.height === 768,
      
      // Check for VM-specific user agent strings
      navigator.userAgent.includes('VirtualBox') ||
      navigator.userAgent.includes('VMware') ||
      navigator.userAgent.includes('QEMU'),
      
      // Check timezone vs expected timezone
      Math.abs(new Date().getTimezoneOffset()) === 0, // UTC timezone often indicates VM
      
      // Check for missing hardware features
      !('ondevicelight' in window) &&
      !('ondeviceproximity' in window) &&
      !('ondevicemotion' in window)
    ];

    // If multiple indicators suggest VM, return true
    const vmIndicatorCount = vmChecks.filter(Boolean).length;
    return vmIndicatorCount >= 2;
  } catch (error) {
    console.error('Error in VM detection:', error);
    return false;
  }
}

// Get local IP address (WebRTC method)
export async function getLocalIP(): Promise<string | null> {
  try {
    if (typeof window === 'undefined') return null;
    
    return new Promise<string | null>((resolve) => {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });
      
      pc.createDataChannel('');
      
      pc.onicecandidate = (ice) => {
        if (!ice || !ice.candidate || !ice.candidate.candidate) return;
        const myIP = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate);
        if (myIP) {
          resolve(myIP[1]);
          pc.close();
        }
      };
      
      pc.createOffer().then(offer => pc.setLocalDescription(offer));
      
      // Timeout after 3 seconds
      setTimeout(() => {
        pc.close();
        resolve(null);
      }, 3000);
    });
  } catch (error) {
    console.error('Error getting local IP:', error);
    return null;
  }
}

// Initialize tracking on page load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', trackSEOEvents)
} 