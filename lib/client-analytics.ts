'use client';

import { EnhancedAnalyticsData, getLocalIP } from './analytics';

// Client-side analytics collector that gathers browser-specific data
export async function collectClientAnalytics(): Promise<EnhancedAnalyticsData> {
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
    const vm = await detectVMClientSide();
    
    // Incognito detection
    const incognito = await detectIncognitoClientSide();
    
    // Get local IP
    const local_ip = await getLocalIP();
    
    // Battery API (if available)
    let battery_level: number | null = null;
    let charging_status: boolean | null = null;
    
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        battery_level = Math.round(battery.level * 100);
        charging_status = battery.charging;
      } catch (error) {
        console.log('Battery API not available or blocked');
      }
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
      local_ip
    };
  } catch (error) {
    console.error('Error collecting client analytics:', error);
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
async function detectVMClientSide(): Promise<boolean> {
  try {
    // Check for VM-specific properties
    const vmChecks = [
      // Check for reduced performance characteristics
      navigator.hardwareConcurrency < 2,
      
      // Check for VM-specific screen resolutions
      screen.width === 1024 && screen.height === 768,
      screen.width === 1366 && screen.height === 768,
      screen.width === 800 && screen.height === 600,
      
      // Check for VM-specific user agent strings
      navigator.userAgent.includes('VirtualBox') ||
      navigator.userAgent.includes('VMware') ||
      navigator.userAgent.includes('QEMU') ||
      navigator.userAgent.includes('KVM'),
      
      // Check timezone vs expected timezone (UTC often indicates VM)
      Math.abs(new Date().getTimezoneOffset()) === 0,
      
      // Check for missing hardware features
      !('ondevicelight' in window) &&
      !('ondeviceproximity' in window) &&
      !('ondevicemotion' in window),
      
      // Check for limited memory (VMs often have less RAM)
      (navigator as any).deviceMemory && (navigator as any).deviceMemory <= 2,
      
      // Check for virtualized graphics
      await checkVirtualizedGraphics()
    ];

    // If multiple indicators suggest VM, return true
    const vmIndicatorCount = vmChecks.filter(Boolean).length;
    return vmIndicatorCount >= 2;
  } catch (error) {
    console.error('Error in VM detection:', error);
    return false;
  }
}

// Check for virtualized graphics
async function checkVirtualizedGraphics(): Promise<boolean> {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) return false;
    
    const renderer = gl.getParameter(gl.RENDERER) || '';
    const vendor = gl.getParameter(gl.VENDOR) || '';
    
    const virtualGraphics = [
      'VMware', 'VirtualBox', 'Parallels', 'QEMU', 'Virtual',
      'Microsoft Basic Render Driver', 'llvmpipe'
    ];
    
    return virtualGraphics.some(indicator => 
      renderer.includes(indicator) || vendor.includes(indicator)
    );
  } catch (error) {
    return false;
  }
}

// Incognito/Private Window Detection (client-side)
async function detectIncognitoClientSide(): Promise<boolean> {
  try {
    // Multiple detection methods for different browsers
    const isChrome = 'chrome' in window && 'webkitRequestFileSystem' in window;
    const isFirefox = 'InstallTrigger' in window;
    const isSafari = /constructor/i.test(window.HTMLElement as any) || 
                    (window as any).safari?.pushNotification?.toString() === '[object SafariRemoteNotification]';
    const isEdge = navigator.userAgent.includes('Edge') || navigator.userAgent.includes('Edg');

    if (isChrome || isEdge) {
      // Chrome/Edge incognito detection
      return new Promise<boolean>((resolve) => {
        if ('webkitRequestFileSystem' in window) {
          (window as any).webkitRequestFileSystem(
            (window as any).TEMPORARY, 1,
            () => resolve(false),
            () => resolve(true)
          );
        } else {
          // Fallback for newer Chrome versions
          try {
            if ('storage' in navigator && 'estimate' in navigator.storage) {
              navigator.storage.estimate().then(estimate => {
                resolve(estimate.quota && estimate.quota < 120000000); // Less than ~120MB suggests incognito
              });
            } else {
              resolve(false);
            }
          } catch {
            resolve(false);
          }
        }
      });
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

    // Generic detection methods
    try {
      // Check if localStorage throws an error
      window.localStorage.setItem('test', '1');
      window.localStorage.removeItem('test');
      
      // Check if sessionStorage throws an error
      window.sessionStorage.setItem('test', '1');
      window.sessionStorage.removeItem('test');
      
      // If both work, probably not incognito
      return false;
    } catch {
      return true;
    }
  } catch (error) {
    console.error('Error detecting incognito mode:', error);
    return false;
  }
}

// Send analytics data to server
export async function sendAnalyticsToServer(shortCode: string, clickId: string | null, clientData: EnhancedAnalyticsData) {
  try {
    const response = await fetch('/api/short-url/analytics/client', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        shortCode,
        clickId,
        clientData
      })
    });

    if (!response.ok) {
      console.error('Failed to send analytics to server');
    }
  } catch (error) {
    console.error('Error sending analytics to server:', error);
  }
}
