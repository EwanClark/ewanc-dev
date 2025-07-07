/**
 * Reserved route prefixes that conflict with short URL routing
 * Update this list when adding new top-level routes
 */
export const RESERVED_ROUTE_PREFIXES = [
  'api',
  'auth',
  'projects',
  'about',
  'contact',
  'experience',
  'login',
  'signup',
  'profile',
  'reset-password',
  'forgot-password',
  'password-required',
  'signup-success',
  'not-found'
] as const;

/**
 * Check if a given path segment conflicts with reserved routes
 */
export function isReservedRoute(segment: string): boolean {
  return RESERVED_ROUTE_PREFIXES.includes(segment.toLowerCase() as any);
}

/**
 * Check if a pathname starts with any reserved route prefix
 */
export function startsWithReservedRoute(pathname: string): boolean {
  return RESERVED_ROUTE_PREFIXES.some(prefix => pathname.startsWith(`/${prefix}`));
} 