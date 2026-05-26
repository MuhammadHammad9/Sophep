'use server';

import { supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';
import { headers } from 'next/headers';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface WaitlistParams {
  fullName: string;
  email: string;
  phone: string;
  institution: string;
  eventType: string;
  delegateType: string;
}

/**
 * Public action — lets a delegate join the waitlist when an event is at capacity.
 * Rate-limited: 3 attempts per IP per hour.
 */
export async function joinWaitlist(params: WaitlistParams): Promise<{
  success: boolean;
  position?: number;
  error?: string;
}> {
  // Rate limiting
  const reqHeaders = await headers();
  const ip = getClientIp(reqHeaders);
  const { allowed } = await checkRateLimit(ip, 'waitlist', 3, 60 * 60 * 1000);
  if (!allowed) {
    return { success: false, error: 'Too many requests. Please wait and try again.' };
  }

  // Basic validation
  if (!params.fullName || !params.email || !params.phone || !params.institution || !params.eventType) {
    return { success: false, error: 'All fields are required.' };
  }

  // Check for duplicate email on same event
  const { data: existing } = await supabaseAdmin
    .from('waitlist_registrations')
    .select('id')
    .eq('email', params.email)
    .eq('event_type', params.eventType)
    .single();

  if (existing) {
    return { success: false, error: 'You are already on the waitlist for this event.' };
  }

  // Insert — position is auto-assigned by the DB trigger
  const { data, error } = await supabaseAdmin
    .from('waitlist_registrations')
    .insert({
      full_name:    params.fullName,
      email:        params.email,
      phone:        params.phone,
      institution:  params.institution,
      event_type:   params.eventType,
      delegate_type: params.delegateType,
    })
    .select()
    .single();

  if (error) {
    console.error('[Waitlist] Insert failed:', error);
    return { success: false, error: 'Failed to join waitlist. Please try again.' };
  }

  // Send confirmation email
  try {
    await sendWaitlistEmail({
      to: params.email,
      fullName: params.fullName,
      eventType: params.eventType,
      position: data.position,
    });
  } catch (emailErr) {
    console.error('[Waitlist] Email failed (non-fatal):', emailErr);
  }

  return { success: true, position: data.position };
}

/**
 * Checks if a specific event is at or over capacity.
 * Called client-side during registration to decide whether to show the waitlist CTA.
 */
export async function checkEventCapacity(eventType: string): Promise<{
  isFull: boolean;
  available: number;
  total: number;
}> {
  const [capResult, countResult] = await Promise.all([
    supabaseAdmin
      .from('event_capacities')
      .select('total_capacity')
      .eq('event_type', eventType)
      .single(),
    supabaseAdmin
      .from('registrations')
      .select('id', { count: 'exact', head: true })
      .eq('event_type', eventType)
      .eq('payment_status', 'verified'),
  ]);

  const totalCapacity = capResult.data?.total_capacity ?? 9999;
  const verifiedCount = countResult.count ?? 0;
  const available = Math.max(0, totalCapacity - verifiedCount);

  return {
    isFull: verifiedCount >= totalCapacity,
    available,
    total: totalCapacity,
  };
}

async function sendWaitlistEmail(data: {
  to: string;
  fullName: string;
  eventType: string;
  position: number;
}) {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background-color:#f4f0fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f0fa;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(90,50,150,0.08);">
        
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0A0415 0%,#1a0e2e 100%);padding:40px 32px;text-align:center;">
            <div style="font-size:24px;letter-spacing:0.35em;text-transform:uppercase;color:#ffffff;font-weight:800;">SOPHEP</div>
            <div style="margin-top:16px;">
              <span style="display:inline-block;background:rgba(245,158,11,0.2);border:1px solid rgba(245,158,11,0.4);color:#fbbf24;padding:5px 16px;border-radius:20px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;">
                &#9203; Waitlist Confirmed
              </span>
            </div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 32px 24px;">
            <h1 style="font-size:26px;font-weight:300;color:#1a1a2e;margin:0 0 8px;">
              You're on the list, <strong style="font-weight:700;color:#0A0415;">${data.fullName}</strong>!
            </h1>
            <p style="font-size:15px;line-height:1.7;color:#555;margin:16px 0 0;">
              We have added you to the waitlist for <strong style="color:#7c3aed;">${data.eventType}</strong>. 
              If a spot becomes available, you will be the first to know.
            </p>
          </td>
        </tr>

        <!-- Position Card -->
        <tr>
          <td style="padding:0 32px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;">
              <tr>
                <td style="padding:20px 24px;text-align:center;">
                  <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#92400e;margin:0 0 8px;">Your Waitlist Position</p>
                  <p style="font-size:48px;font-weight:800;color:#d97706;margin:0;line-height:1;">#${data.position}</p>
                  <p style="font-size:13px;color:#b45309;margin:8px 0 0;">For ${data.eventType}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 32px;border-top:1px solid #ede6f7;text-align:center;">
            <p style="font-size:12px;color:#aaa;margin:0 0 4px;">SOPHEP &mdash; GIK Institute of Engineering Sciences &amp; Technology</p>
            <p style="font-size:11px;color:#ccc;margin:0;">This is an automated message. Please do not reply to this email.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
  `;

  await resend.emails.send({
    from: 'SOPHEP Registration <onboarding@resend.dev>',
    to: [data.to],
    subject: `SOPHEP Waitlist Confirmed — Position #${data.position} for ${data.eventType}`,
    html,
  });
}
