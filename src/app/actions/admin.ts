'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { SignJWT, jwtVerify } from 'jose';
import { generateQrCodeBuffer, generateQrCodeDataUri } from '@/lib/generateQrCode';
import { generateConfirmationPdf } from '@/lib/confirmationPdf';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required but not set. Please configure it in your environment.');
}
const JWT_SECRET = process.env.JWT_SECRET;
const secret = new TextEncoder().encode(JWT_SECRET);

const resend = new Resend(process.env.RESEND_API_KEY);

// ─── AUTH ────────────────────────────────────────────────────────────────────

export async function loginAdmin(email: string, password: string) {
  const reqHeaders = await headers();
  const ip = getClientIp(reqHeaders);
  const { allowed } = await checkRateLimit(ip, 'admin_login', 5, 15 * 60 * 1000); // 5 attempts per 15 mins

  if (!allowed) {
    return { success: false, error: 'Too many login attempts. Please try again later.' };
  }

  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  // 1. Sign in with Supabase Auth using the service role client
  //    (we use a fresh client for auth so we get access to auth.signInWithPassword)
  const authClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );

  const { data: authData, error: authError } = await authClient.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.user) {
    console.error('[Admin Auth] Login error:', authError?.message);
    return { success: false, error: 'Invalid credentials. Access denied.' };
  }

  // 2. Fetch the user's role from our user_roles table (via service_role to bypass RLS)
  const { data: roleRow, error: roleError } = await supabaseAdmin
    .from('user_roles')
    .select('role')
    .eq('user_id', authData.user.id)
    .single();

  if (roleError || !roleRow) {
    console.error('[Admin Auth] Role lookup error:', roleError?.message);
    return { success: false, error: 'Account not authorised. Contact your administrator.' };
  }

  // 3. Generate a CSRF nonce and embed it in the JWT
  const csrfNonce = crypto.randomUUID();

  const token = await new SignJWT({
    sub: authData.user.id,
    email: authData.user.email,
    role: roleRow.role,
    csrfNonce,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(secret);

  // 4. Set the hardened session cookie
  const cookieStore = await cookies();
  cookieStore.set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 1, // 1 hour
    path: '/admin',          // scoped to /admin — not the whole site
    sameSite: 'strict',
  });

  // 5. Set the CSRF nonce in a separate readable cookie for the client to include in forms
  cookieStore.set('admin_csrf', csrfNonce, {
    httpOnly: false,         // readable by JS so the client can send it back
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 1,
    path: '/admin',
    sameSite: 'strict',
  });

  return { success: true, role: roleRow.role };
}

/**
 * Validates the CSRF nonce submitted with a form against the one stored in the JWT.
 * Call this at the top of every mutating server action that an admin can trigger.
 */
export async function validateAdminCsrf(submittedNonce: string): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;
    if (!token) return false;

    const { payload } = await jwtVerify(token, secret);
    return (payload as any).csrfNonce === submittedNonce;
  } catch {
    return false;
  }
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  cookieStore.delete('admin_csrf');
  redirect('/admin/login');
}

// ─── DATA FETCHING ────────────────────────────────────────────────────────────

export interface Delegate {
  id: string;
  full_name: string;
  cnic: string;
  phone: string;
  email: string;
  institution: string;
  event_preference: string;
  accommodation_needed: boolean;
  transportation_needed: boolean;
}

export interface Registration {
  id: string;
  created_at: string;
  full_name: string;
  cnic: string;
  phone: string;
  email: string;
  institution: string;
  event_type: string;
  delegate_type: string;
  total_amount: number;
  payment_status: 'pending' | 'verified' | 'rejected';
  payment_receipt_url: string | null;
  accommodation_needed: boolean;
  transportation_needed: boolean;
  delegates: Delegate[];
}

export async function getRegistrations(): Promise<Registration[]> {
  const { data, error } = await supabaseAdmin
    .from('registrations')
    .select('id, created_at, full_name, cnic, phone, email, institution, event_type, delegate_type, total_amount, payment_status, receipt_url, needs_accommodation, needs_transportation, delegates(*)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[Admin] Failed to fetch registrations:', error.message, error.details, error.hint, error.code, JSON.stringify(error));
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mappedData = await Promise.all((data as any[]).map(async (r) => {
    let finalUrl = r.receipt_url ?? null;
    
    if (finalUrl && finalUrl.includes('/storage/v1/object/public/receipts/')) {
      const path = finalUrl.split('/storage/v1/object/public/receipts/')[1];
      if (path) {
        const { data: signedData, error: signError } = await supabaseAdmin.storage
          .from('receipts')
          .createSignedUrl(path, 60 * 60);
          
        if (signedData?.signedUrl) {
          finalUrl = signedData.signedUrl;
        } else if (signError) {
          console.error('[Admin] Failed to sign URL for path:', path, signError);
        }
      }
    }

    return {
      ...r,
      payment_receipt_url: finalUrl,
      accommodation_needed: r.needs_accommodation ?? false,
      transportation_needed: r.needs_transportation ?? false,
    };
  }));

  return mappedData as Registration[];
}

// ─── STATUS UPDATES ───────────────────────────────────────────────────────────

export async function updatePaymentStatus(
  id: string,
  status: 'verified' | 'rejected'
) {
  // ── Guard: only allow changing PENDING registrations ──────────────────────
  const { data: current, error: fetchErr } = await supabaseAdmin
    .from('registrations')
    .select('id, payment_status')
    .eq('id', id)
    .single();

  if (fetchErr || !current) {
    return { success: false, error: 'Registration not found.' };
  }

  if (current.payment_status !== 'pending') {
    return {
      success: false,
      error: `Already ${current.payment_status}. Only pending applications can be updated.`,
    };
  }
  // ─────────────────────────────────────────────────────────────────────────

  const { data, error } = await supabaseAdmin
    .from('registrations')
    .update({ payment_status: status })
    .eq('id', id)
    .eq('payment_status', 'pending')
    .select()
    .single();

  if (error) {
    console.error('[Admin] Failed to update status:', error);
    return { success: false, error: error.message };
  }

  if (!data) {
    return { success: false, error: 'Status was already changed. Please refresh.' };
  }

  if (status === 'verified' && data) {
    await sendVerificationEmail(data);
  } else if (status === 'rejected' && data) {
    await sendRejectionEmail(data);
  }

  return { success: true, data };
}


async function sendVerificationEmail(registration: Registration) {
  const refId = `REF-${registration.id.slice(0, 8).toUpperCase()}`;

  // ── Step 1: Generate QR buffer + data URI (for PDF embedding) ────────────
  const [qrBuffer, qrDataUri] = await Promise.all([
    generateQrCodeBuffer(registration.id),
    generateQrCodeDataUri(registration.id),
  ]);

  // ── Step 2: Upload QR PNG to Supabase Storage ────────────────────────────
  // Email clients (Gmail, Outlook) block data: URI image sources.
  // We upload to storage and use the signed HTTPS URL instead.
  let qrHttpUrl = '';
  try {
    const qrStoragePath = `qr-codes/${registration.id}.png`;
    await supabaseAdmin.storage
      .from('receipts')
      .upload(qrStoragePath, qrBuffer, {
        contentType: 'image/png',
        upsert: true,
      });
    const { data: qrSigned } = await supabaseAdmin.storage
      .from('receipts')
      .createSignedUrl(qrStoragePath, 60 * 60 * 24 * 365); // 1-year URL
    qrHttpUrl = qrSigned?.signedUrl ?? '';
  } catch (qrUploadErr) {
    console.error('[Admin] QR upload failed (non-fatal):', qrUploadErr);
  }

  // ── Step 3: Generate PDF (uses data URI for internal embedding) ──────────
  let confirmationPdf: Buffer | null = null;
  try {
    confirmationPdf = await generateConfirmationPdf(registration, qrDataUri);
  } catch (pdfErr) {
    console.error('[Admin] PDF generation failed (non-fatal):', pdfErr);
  }

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background-color:#f4f0fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f0fa;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(90,50,150,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0A0415 0%,#1a0e2e 100%);padding:40px 32px;text-align:center;">
              <div style="font-size:24px;letter-spacing:0.35em;text-transform:uppercase;color:#ffffff;font-weight:800;">SOPHEP</div>
              <div style="margin-top:16px;">
                <span style="display:inline-block;background:rgba(34,197,94,0.2);border:1px solid rgba(34,197,94,0.4);color:#4ade80;padding:5px 16px;border-radius:20px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;">&#10003; Payment Verified</span>
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 32px 24px;">
              <h1 style="font-size:26px;font-weight:300;color:#1a1a2e;margin:0 0 8px;">Congratulations, <strong style="font-weight:700;color:#0A0415;">${registration.full_name}</strong>!</h1>
              <p style="font-size:15px;line-height:1.7;color:#555;margin:16px 0 0;">Your payment for <strong style="color:#7c3aed;">${registration.event_type}</strong> has been successfully verified. Your registration is now officially confirmed.</p>
              <p style="font-size:14px;line-height:1.7;color:#777;margin:12px 0 0;">Your <strong>QR E-Ticket</strong> and full confirmation letter PDF are attached to this email. Present them at the event check-in desk.</p>
            </td>
          </tr>

          <!-- QR Code Section -->
          <tr>
            <td style="padding:0 32px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f6ff;border:1px solid #e5d8ff;border-radius:16px;">
                <tr>
                  <td style="padding:24px;text-align:center;">
                    <p style="font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#9f6fe0;font-weight:600;margin:0 0 16px;">Your Check-In QR Ticket</p>
                    ${qrHttpUrl
                      ? `<img src="${qrHttpUrl}" alt="QR Check-In Code" width="160" height="160" style="border-radius:8px;border:2px solid #e5d8ff;display:block;margin:0 auto;" />`
                      : `<div style="width:160px;height:160px;background:#ede6ff;border-radius:8px;border:2px dashed #c4b5fd;display:inline-block;margin:0 auto;padding:20px;box-sizing:border-box;"><p style="font-size:11px;color:#7c3aed;text-align:center;margin:0;">QR code attached as PNG file</p></div>`
                    }
                    <p style="font-size:13px;font-weight:700;color:#7c3aed;margin:14px 0 2px;letter-spacing:0.1em;">${refId}</p>
                    <p style="font-size:11px;color:#aaa;margin:0;">Present at the registration desk on arrival</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Info Box -->
          <tr>
            <td style="padding:0 32px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;">
                <tr>
                  <td style="padding:20px 24px 12px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #dcfce7;"><span style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;">Reference ID</span></td>
                        <td style="padding:8px 0;border-bottom:1px solid #dcfce7;text-align:right;"><span style="color:#7c3aed;font-size:14px;font-weight:600;">${refId}</span></td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #dcfce7;"><span style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;">Event</span></td>
                        <td style="padding:8px 0;border-bottom:1px solid #dcfce7;text-align:right;"><span style="color:#1a1a2e;font-size:14px;font-weight:500;">${registration.event_type}</span></td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;"><span style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;">Status</span></td>
                        <td style="padding:8px 0;text-align:right;"><span style="display:inline-block;background:#dcfce7;color:#166534;font-size:12px;font-weight:600;padding:3px 10px;border-radius:12px;">&#10003; Confirmed</span></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Attachments Note -->
          <tr>
            <td style="padding:0 32px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="font-size:13px;color:#92400e;margin:0;line-height:1.6;">
                      <strong>&#128206; Attachments:</strong> This email includes your QR ticket PNG and a PDF confirmation letter. 
                      If you cannot see the QR image above, please check your email attachments.
                    </p>
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
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    const attachments: { filename: string; content: Buffer; contentType: string }[] = [
      {
        filename: `SOPHEP-QR-${refId}.png`,
        content: qrBuffer,
        contentType: 'image/png',
      },
    ];

    if (confirmationPdf) {
      attachments.push({
        filename: `SOPHEP-Confirmation-${refId}.pdf`,
        content: confirmationPdf,
        contentType: 'application/pdf',
      });
    }

    await resend.emails.send({
      from: 'SOPHEP Registration <onboarding@resend.dev>',
      to: [registration.email],
      subject: `SOPHEP Registration Confirmed — ${refId}`,
      html: htmlContent,
      attachments,
    });
  } catch (err) {
    console.error('[Admin] Failed to send verification email:', err);
  }
}

async function sendRejectionEmail(registration: Registration) {
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background-color:#f4f0fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f0fa;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(90,50,150,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0A0415 0%,#1a0e2e 100%);padding:40px 32px;text-align:center;">
              <div style="font-size:24px;letter-spacing:0.35em;text-transform:uppercase;color:#ffffff;font-weight:800;">SOPHEP</div>
              <div style="margin-top:16px;">
                <span style="display:inline-block;background:rgba(239,68,68,0.2);border:1px solid rgba(239,68,68,0.4);color:#fca5a5;padding:5px 16px;border-radius:20px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;">&#10005; Application Update</span>
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 32px 24px;">
              <h1 style="font-size:26px;font-weight:300;color:#1a1a2e;margin:0 0 8px;">Dear <strong style="font-weight:700;color:#0A0415;">${registration.full_name}</strong>,</h1>
              <p style="font-size:15px;line-height:1.7;color:#555;margin:16px 0 0;">We regret to inform you that we are unable to verify the payment receipt provided for your <strong>${registration.event_type}</strong> registration. As a result, your application has not been processed at this time.</p>
              <p style="font-size:15px;line-height:1.7;color:#555;margin:16px 0 0;">If you believe this is an error, or if you would like to submit a new payment receipt, please contact our support team or reply to this email.</p>
            </td>
          </tr>

          <!-- Info Box -->
          <tr>
            <td style="padding:0 32px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;">
                <tr>
                  <td style="padding:20px 24px 12px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #fee2e2;"><span style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;">Reference ID</span></td>
                        <td style="padding:8px 0;border-bottom:1px solid #fee2e2;text-align:right;"><span style="color:#7c3aed;font-size:14px;font-weight:600;">${registration.id.slice(0, 8).toUpperCase()}</span></td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #fee2e2;"><span style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;">Event</span></td>
                        <td style="padding:8px 0;border-bottom:1px solid #fee2e2;text-align:right;"><span style="color:#1a1a2e;font-size:14px;font-weight:500;">${registration.event_type}</span></td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;"><span style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;">Status</span></td>
                        <td style="padding:8px 0;text-align:right;"><span style="display:inline-block;background:#fee2e2;color:#991b1b;font-size:12px;font-weight:600;padding:3px 10px;border-radius:12px;">&#10005; Rejected</span></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px;border-top:1px solid #ede6f7;text-align:center;">
              <p style="font-size:12px;color:#aaa;margin:0 0 4px;">SOPHEP — GIK Institute of Engineering Sciences &amp; Technology</p>
              <p style="font-size:11px;color:#ccc;margin:0;">This is an automated message. Please do not reply to this email.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    await resend.emails.send({
      from: 'SOPHEP Registration <onboarding@resend.dev>',
      to: [registration.email],
      subject: `SOPHEP Application Update — Ref #${registration.id.slice(0, 8).toUpperCase()}`,
      html: htmlContent,
    });
  } catch (err) {
    console.error('[Admin] Failed to send rejection email:', err);
  }
}

// ─── WAITLIST PROMOTION ───────────────────────────────────────────────────────

export async function promoteFromWaitlist(waitlistId: string) {
  // Fetch waitlist record
  const { data: waitlistRecord, error: fetchErr } = await supabaseAdmin
    .from('waitlist_registrations')
    .select('*')
    .eq('id', waitlistId)
    .single();

  if (fetchErr || !waitlistRecord) {
    return { success: false, error: 'Waitlist record not found.' };
  }

  // Generate a special link or just send them the registration link
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background-color:#f4f0fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f0fa;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(90,50,150,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#0A0415 0%,#1a0e2e 100%);padding:40px 32px;text-align:center;">
              <div style="font-size:24px;letter-spacing:0.35em;text-transform:uppercase;color:#ffffff;font-weight:800;">SOPHEP</div>
              <div style="margin-top:16px;">
                <span style="display:inline-block;background:rgba(34,197,94,0.2);border:1px solid rgba(34,197,94,0.4);color:#4ade80;padding:5px 16px;border-radius:20px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;">&#10024; Waitlist Promoted</span>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 32px 24px;">
              <h1 style="font-size:26px;font-weight:300;color:#1a1a2e;margin:0 0 8px;">Great News, <strong style="font-weight:700;color:#0A0415;">${waitlistRecord.full_name}</strong>!</h1>
              <p style="font-size:15px;line-height:1.7;color:#555;margin:16px 0 0;">A spot has opened up for <strong>${waitlistRecord.event_type}</strong> and you've been promoted from the waitlist!</p>
              <p style="font-size:15px;line-height:1.7;color:#555;margin:16px 0 0;">Please visit our registration portal within the next 48 hours to complete your payment and secure your spot.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px;border-top:1px solid #ede6f7;text-align:center;">
              <p style="font-size:12px;color:#aaa;margin:0 0 4px;">SOPHEP — GIK Institute of Engineering Sciences &amp; Technology</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    await resend.emails.send({
      from: 'SOPHEP Registration <onboarding@resend.dev>',
      to: [waitlistRecord.email],
      subject: `SOPHEP: You're off the waitlist for ${waitlistRecord.event_type}!`,
      html: htmlContent,
    });
  } catch (err) {
    console.error('[Admin] Failed to send waitlist promotion email:', err);
    return { success: false, error: 'Failed to send email' };
  }

  // Remove from waitlist or mark as promoted (assuming delete for now)
  await supabaseAdmin.from('waitlist_registrations').delete().eq('id', waitlistId);

  return { success: true };
}

// ─── EXCEL EXPORT ─────────────────────────────────────────────────────────────

/**
 * Exports all registrations + delegates as an Excel workbook.
 * Returns the file as a base64 string so the client can trigger a download.
 */
export async function exportRegistrationsToExcel(csrfToken: string): Promise<{
  success: boolean;
  base64?: string;
  filename?: string;
  error?: string;
}> {
  // Validate CSRF token
  const isValidCsrf = await validateAdminCsrf(csrfToken);
  if (!isValidCsrf) {
    return { success: false, error: 'Invalid CSRF token. Please refresh and try again.' };
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('registrations')
      .select('id, created_at, full_name, cnic, phone, email, institution, event_type, delegate_type, total_amount, payment_status, needs_accommodation, needs_transportation, delegates(*)')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    // Dynamic import to avoid bundling exceljs on the client side
    const ExcelJS = (await import('exceljs')).default;
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'SOPHEP Admin';
    workbook.created = new Date();

    // ── Sheet 1: Registrations ─────────────────────────────────────────────
    const regSheet = workbook.addWorksheet('Registrations');
    regSheet.columns = [
      { header: 'Ref ID',         key: 'ref_id',           width: 14 },
      { header: 'Full Name',      key: 'full_name',        width: 24 },
      { header: 'Email',          key: 'email',            width: 30 },
      { header: 'Phone',          key: 'phone',            width: 16 },
      { header: 'CNIC',           key: 'cnic',             width: 18 },
      { header: 'Institution',    key: 'institution',      width: 28 },
      { header: 'Event Type',     key: 'event_type',       width: 18 },
      { header: 'Delegate Type',  key: 'delegate_type',    width: 18 },
      { header: 'Amount (PKR)',   key: 'total_amount',     width: 14 },
      { header: 'Status',         key: 'payment_status',   width: 12 },
      { header: 'Accommodation',  key: 'accommodation',    width: 14 },
      { header: 'Transportation', key: 'transportation',   width: 14 },
      { header: 'Delegate Count', key: 'delegate_count',   width: 14 },
      { header: 'Registered At',  key: 'created_at',       width: 22 },
    ];

    // Style the header row
    regSheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF7C3AED' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data as any[]).forEach((r) => {
      const delegates = Array.isArray(r.delegates) ? r.delegates : [];
      regSheet.addRow({
        ref_id:          r.id.slice(0, 8).toUpperCase(),
        full_name:       r.full_name,
        email:           r.email,
        phone:           r.phone,
        cnic:            r.cnic,
        institution:     r.institution,
        event_type:      r.event_type,
        delegate_type:   r.delegate_type,
        total_amount:    r.total_amount,
        payment_status:  r.payment_status,
        accommodation:   r.needs_accommodation ? 'Yes' : 'No',
        transportation:  r.needs_transportation ? 'Yes' : 'No',
        delegate_count:  delegates.length,
        created_at:      new Date(r.created_at).toLocaleString('en-PK'),
      });
    });

    // Alternate row shading
    regSheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: rowNumber % 2 === 0 ? 'FFF5F0FF' : 'FFFFFFFF' },
          };
        });
      }
    });

    // ── Sheet 2: Delegates ────────────────────────────────────────────────
    const delSheet = workbook.addWorksheet('Delegates');
    delSheet.columns = [
      { header: 'Registration Ref', key: 'reg_ref',         width: 16 },
      { header: 'Registration Name',key: 'reg_name',        width: 24 },
      { header: 'Delegate Name',    key: 'full_name',       width: 24 },
      { header: 'Email',            key: 'email',           width: 30 },
      { header: 'Phone',            key: 'phone',           width: 16 },
      { header: 'CNIC',             key: 'cnic',            width: 18 },
      { header: 'Institution',      key: 'institution',     width: 28 },
      { header: 'Event Preference', key: 'event_pref',      width: 18 },
      { header: 'Accommodation',    key: 'accommodation',   width: 14 },
      { header: 'Transportation',   key: 'transportation',  width: 14 },
    ];

    delSheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F46E5' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data as any[]).forEach((r) => {
      const delegates = Array.isArray(r.delegates) ? r.delegates : [];
      delegates.forEach((d: any) => {
        delSheet.addRow({
          reg_ref:       r.id.slice(0, 8).toUpperCase(),
          reg_name:      r.full_name,
          full_name:     d.full_name,
          email:         d.email,
          phone:         d.phone,
          cnic:          d.cnic,
          institution:   d.institution,
          event_pref:    d.event_preference,
          accommodation: d.accommodation_needed ? 'Yes' : 'No',
          transportation:d.transportation_needed ? 'Yes' : 'No',
        });
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const filename = `SOPHEP-Registrations-${new Date().toISOString().slice(0, 10)}.xlsx`;

    return { success: true, base64, filename };
  } catch (err: any) {
    console.error('[Admin] Excel export failed:', err);
    return { success: false, error: err.message };
  }
}

// ─── AUDIT LOG ────────────────────────────────────────────────────────────────

export type AuditEntry = {
  id: string;
  admin_email: string;
  action: string;
  target_id: string | null;
  details: Record<string, any> | null;
  created_at: string;
};

/**
 * Records an admin action to the audit log.
 * Non-fatal — if it fails we log but don't surface the error.
 */
async function insertAuditLog(
  adminEmail: string,
  action: string,
  targetId?: string,
  details?: Record<string, any>
) {
  try {
    await supabaseAdmin.from('admin_audit_log').insert({
      admin_email: adminEmail,
      action,
      target_id: targetId ?? null,
      details: details ?? null,
    });
  } catch (err) {
    console.error('[Audit] Failed to insert audit log:', err);
  }
}

/**
 * Returns the last 100 audit log entries (newest first).
 * Called server-side from the dashboard page.
 */
export async function getAuditLog(): Promise<AuditEntry[]> {
  const { data, error } = await supabaseAdmin
    .from('admin_audit_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    // 42P01 = table does not exist — migrations not yet run, return silently
    if ((error as any).code === '42P01') {
      console.warn('[Admin] admin_audit_log table not found. Run migration 04_audit_log.sql in Supabase.');
    } else {
      console.error('[Admin] Failed to fetch audit log:', error);
    }
    return [];
  }
  return (data ?? []) as AuditEntry[];
}

// ─── BULK STATUS UPDATE ───────────────────────────────────────────────────────

export async function bulkUpdatePaymentStatus(
  csrfToken: string,
  ids: string[],
  status: 'verified' | 'rejected'
): Promise<{ success: boolean; updated: number; skipped: number; error?: string }> {
  // Validate CSRF token
  const isValidCsrf = await validateAdminCsrf(csrfToken);
  if (!isValidCsrf) {
    return { success: false, updated: 0, skipped: 0, error: 'Invalid CSRF token. Please refresh and try again.' };
  }
  
  if (!ids.length) return { success: false, updated: 0, skipped: 0, error: 'No IDs provided.' };

  // Get admin email from session for audit log
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('admin_session');
  let adminEmail = 'unknown';
  if (sessionCookie) {
    try {
      const { payload } = await jwtVerify(sessionCookie.value, secret);
      adminEmail = (payload.email as string) ?? 'unknown';
    } catch { /* ignore */ }
  }

  // IMPORTANT: only update PENDING registrations — never re-process verified or rejected
  const { data, error } = await supabaseAdmin
    .from('registrations')
    .update({ payment_status: status })
    .in('id', ids)
    .eq('payment_status', 'pending')   // ← guard: pending only
    .select();

  if (error) {
    console.error('[Admin] Bulk update failed:', error);
    return { success: false, updated: 0, skipped: 0, error: error.message };
  }

  const updated = data?.length ?? 0;
  const skipped = ids.length - updated;

  // Send individual emails + audit log each one
  await Promise.all(
    (data ?? []).map(async (reg: any) => {
      if (status === 'verified') {
        await sendVerificationEmail(reg);
      } else {
        await sendRejectionEmail(reg);
      }
      await insertAuditLog(
        adminEmail,
        status === 'verified' ? 'bulk_verify' : 'bulk_reject',
        reg.id.slice(0, 8).toUpperCase(),
        { event_type: reg.event_type }
      );
    })
  );

  return { success: true, updated, skipped };
}

// ─── SEAT CAPACITY MANAGEMENT ─────────────────────────────────────────────────

export type EventCapacity = {
  id: string;
  event_type: string;
  total_capacity: number;
  verified_count: number;
  available: number;
  is_full: boolean;
};

export async function getEventCapacities(): Promise<EventCapacity[]> {
  // Fetch capacities + count verified registrations per event in parallel
  const [capResult, countResult] = await Promise.all([
    supabaseAdmin.from('event_capacities').select('*').order('event_type'),
    supabaseAdmin
      .from('registrations')
      .select('event_type')
      .eq('payment_status', 'verified'),
  ]);

  if (capResult.error) {
    // 42P01 = table not found — migrations not yet applied
    if ((capResult.error as any).code === '42P01') {
      console.warn('[Admin] event_capacities table not found. Run migration 05_seat_capacity_waitlist.sql in Supabase.');
    } else {
      console.error('[Admin] Failed to fetch capacities:', capResult.error);
    }
    return [];
  }

  // Count verified per event
  const verifiedCounts: Record<string, number> = {};
  (countResult.data ?? []).forEach((r: any) => {
    verifiedCounts[r.event_type] = (verifiedCounts[r.event_type] ?? 0) + 1;
  });

  return (capResult.data ?? []).map((cap: any) => {
    const verified = verifiedCounts[cap.event_type] ?? 0;
    return {
      id: cap.id,
      event_type: cap.event_type,
      total_capacity: cap.total_capacity,
      verified_count: verified,
      available: Math.max(0, cap.total_capacity - verified),
      is_full: verified >= cap.total_capacity,
    };
  });
}

export async function updateEventCapacity(
  eventType: string,
  newCapacity: number
): Promise<{ success: boolean; error?: string }> {
  if (newCapacity < 1) return { success: false, error: 'Capacity must be at least 1.' };

  const { error } = await supabaseAdmin
    .from('event_capacities')
    .upsert(
      { event_type: eventType, total_capacity: newCapacity, updated_at: new Date().toISOString() },
      { onConflict: 'event_type' }
    );

  if (error) {
    console.error('[Admin] Capacity update failed:', error);
    return { success: false, error: error.message };
  }

  // Audit log
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('admin_session');
  let adminEmail = 'unknown';
  if (sessionCookie) {
    try {
      const { payload } = await jwtVerify(sessionCookie.value, secret);
      adminEmail = (payload.email as string) ?? 'unknown';
    } catch { /* ignore */ }
  }
  await insertAuditLog(adminEmail, 'update_capacity', eventType, { new_capacity: newCapacity });

  return { success: true };
}

// ─── WAITLIST MANAGEMENT ──────────────────────────────────────────────────────

export type WaitlistEntry = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  institution: string;
  event_type: string;
  delegate_type: string;
  position: number;
  notified: boolean;
  created_at: string;
};

export async function getWaitlistEntries(): Promise<WaitlistEntry[]> {
  const { data, error } = await supabaseAdmin
    .from('waitlist_registrations')
    .select('*')
    .order('event_type')
    .order('position');

  if (error) {
    // 42P01 = table not found — migrations not yet applied
    if ((error as any).code === '42P01') {
      console.warn('[Admin] waitlist_registrations table not found. Run migration 05_seat_capacity_waitlist.sql in Supabase.');
    } else {
      console.error('[Admin] Failed to fetch waitlist:', error);
    }
    return [];
  }
  return (data ?? []) as WaitlistEntry[];
}

// ─── EMAIL SEQUENCES ─────────────────────────────────────────────────────────

export async function dispatchSequence(sequenceId: string): Promise<{ success: boolean; count: number; error?: string }> {
  const { data: registrations, error } = await supabaseAdmin
    .from('registrations')
    .select('*')
    .eq('payment_status', 'verified');

  if (error || !registrations) {
    return { success: false, count: 0, error: 'Failed to fetch registrations.' };
  }

  let targets = registrations;
  let subject = '';
  let html = '';

  if (sequenceId === '7_days') {
    subject = 'SOPHEP: 7 Days to Event! Checklist inside';
    html = '<p>The event is only 7 days away. Here is what you need to prepare.</p>';
  } else if (sequenceId === 'schedule') {
    subject = 'SOPHEP: Official Schedule Released';
    html = '<p>The official schedule is now available. Log in to view the timeline.</p>';
  } else if (sequenceId === 'accommodation') {
    targets = registrations.filter(r => r.needs_accommodation);
    subject = 'SOPHEP: Your Accommodation Details';
    html = '<p>Here are the details regarding your assigned accommodation.</p>';
  } else if (sequenceId === '1_day') {
    subject = 'SOPHEP: Tomorrow is the Big Day!';
    html = '<p>We look forward to welcoming you tomorrow. Here is the venue map.</p>';
  } else {
    return { success: false, count: 0, error: 'Invalid sequence ID' };
  }

  if (targets.length === 0) {
    return { success: true, count: 0 };
  }

  try {
    // We send emails in batches or a loop
    for (const r of targets) {
      // Avoid awaiting each resend sequentially if there are hundreds, but for now a loop is fine for simulation/small batches
      await resend.emails.send({
        from: 'SOPHEP <onboarding@resend.dev>', // Free tier requires this domain
        to: r.email,
        subject,
        html: `<h2>Hello ${r.full_name},</h2>${html}`,
      }).catch(err => console.error('Failed to send email to', r.email, err));
    }

    // Log the sequence dispatch
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('admin_session');
    let adminEmail = 'unknown';
    if (sessionCookie) {
      try {
        const { payload } = await jwtVerify(sessionCookie.value, secret);
        adminEmail = (payload.email as string) ?? 'unknown';
      } catch { /* ignore */ }
    }
    await insertAuditLog(adminEmail, 'dispatch_sequence', sequenceId, { count: targets.length });

    return { success: true, count: targets.length };
  } catch (err: any) {
    console.error('[Admin] Dispatch sequence error:', err);
    return { success: false, count: 0, error: err.message };
  }
}
