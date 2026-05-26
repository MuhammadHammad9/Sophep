import { supabaseAdmin } from './supabase';

/**
 * Supabase-backed rate limiter.
 *
 * Uses a `rate_limits` table with a sliding 1-hour window.
 * The service_role key is required (bypasses RLS), so this must
 * only ever be called from server-side code.
 *
 * @param ip       - The client's IP address
 * @param endpoint - A key identifying which endpoint is being limited (e.g. "upload", "register")
 * @param limit    - Max allowed calls in the window (default: 5)
 * @param windowMs - Window size in milliseconds (default: 1 hour)
 * @returns `{ allowed: boolean, remaining: number }`
 */
export async function checkRateLimit(
  ip: string,
  endpoint: string,
  limit = 5,
  windowMs = 60 * 60 * 1000,
): Promise<{ allowed: boolean; remaining: number }> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - windowMs);

  try {
    // Fetch existing record
    const { data, error } = await supabaseAdmin
      .from('rate_limits')
      .select('count, window_start')
      .eq('ip', ip)
      .eq('endpoint', endpoint)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = row not found — expected on first request
      console.error('[RateLimit] Supabase read error:', error.message);
      // Fail closed to prevent abuse if DB is down
      return { allowed: false, remaining: 0 };
    }

    if (!data || new Date(data.window_start) < windowStart) {
      // No record OR window has expired → reset
      await supabaseAdmin.from('rate_limits').upsert(
        { ip, endpoint, count: 1, window_start: now.toISOString() },
        { onConflict: 'ip,endpoint' },
      );
      return { allowed: true, remaining: limit - 1 };
    }

    const newCount = (data.count ?? 0) + 1;

    if (newCount > limit) {
      return { allowed: false, remaining: 0 };
    }

    // Increment counter within the existing window
    await supabaseAdmin
      .from('rate_limits')
      .update({ count: newCount })
      .eq('ip', ip)
      .eq('endpoint', endpoint);

    return { allowed: true, remaining: Math.max(0, limit - newCount) };
  } catch (err) {
    console.error('[RateLimit] Unexpected error:', err);
    return { allowed: false, remaining: 0 }; // fail closed
  }
}

/**
 * Extract the real client IP from Next.js request headers,
 * falling back through common reverse-proxy headers.
 */
export function getClientIp(headers: Headers): string {
  return (
    headers.get('x-real-ip') ??
    headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    '0.0.0.0'
  );
}
