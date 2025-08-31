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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          {isRedirecting ? 'Redirecting...' : 'Loading...'}
        </h1>
        <p className="text-gray-600">
          Please wait while we redirect you to your destination.
        </p>
        <p className="text-sm text-gray-500 mt-4">
          If you are not redirected automatically, 
          <a 
            href={targetUrl ? decodeURIComponent(targetUrl) : '#'} 
            className="text-blue-600 hover:underline ml-1"
          >
            click here
          </a>
        </p>
      </div>
    </div>
  );
}
