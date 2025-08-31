'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { collectClientAnalytics, sendAnalyticsToServer } from '@/lib/client-analytics';

export default function RedirectPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const shortCode = params.shortCode as string;
  const clickId = searchParams.get('clickId');
  const targetUrl = searchParams.get('url');

  useEffect(() => {
    async function handleRedirect() {
      if (!targetUrl || !clickId) {
        // If missing required params, redirect to 404
        router.push('/not-found');
        return;
      }

      setIsRedirecting(true);

      try {
        // Collect client-side analytics data
        const clientData = await collectClientAnalytics();
        
        // Send analytics to server (don't wait for response to avoid delay)
        sendAnalyticsToServer(shortCode, clickId, clientData).catch(error => {
          console.error('Failed to send analytics:', error);
        });

        // Small delay to ensure analytics collection completes
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Redirect to the target URL
        window.location.href = decodeURIComponent(targetUrl);
      } catch (error) {
        console.error('Error during redirect process:', error);
        // Still redirect even if analytics fail
        window.location.href = decodeURIComponent(targetUrl);
      }
    }

    handleRedirect();
  }, [shortCode, clickId, targetUrl, router]);

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      backgroundColor: '#ffffff',
      margin: 0,
      padding: 0,
      overflow: 'hidden'
    }}>
      {/* Completely invisible analytics collection */}
      {/* Fallback link for users with JavaScript disabled - hidden but accessible */}
      <noscript>
        <meta
          httpEquiv="refresh"
          content={`0; url=${targetUrl ? decodeURIComponent(targetUrl) : '/'}`}
        />
      </noscript>
    </div>
  );
}
