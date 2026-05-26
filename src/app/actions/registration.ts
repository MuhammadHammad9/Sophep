'use server';

import { supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';
import { headers } from 'next/headers';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

import { personalInfoSchema, step2Schema, logisticsSchema, paymentSchema } from '@/lib/validations/registration';

const resend = new Resend(process.env.RESEND_API_KEY);

interface RegisterParams {
  personalInfo: any;
  step2Details: any;
  logistics: any;
  payment: any;
  receiptUrl: string | null;
  totalAmount: number;
}

const BASE_FEE = 3500;
const ACCO_FEE = 2000;
const TRANSPORT_FEE = 1500;

export async function submitRegistration(params: RegisterParams) {
  // ── Rate Limiting ────────────────────────────────────────────
  const reqHeaders = await headers();
  const ip = getClientIp(reqHeaders);
  const { allowed } = await checkRateLimit(ip, 'register', 5, 60 * 60 * 1000);

  if (!allowed) {
    return {
      success: false,
      error: 'Too many registration attempts. Please wait an hour and try again.',
    };
  }

  try {
    // 1. Server-side Payload Validation
    const personalInfo = personalInfoSchema.parse(params.personalInfo);
    
    // Only validate step2 if it's a delegation
    let step2Details = null;
    if (personalInfo.delegateType === 'Delegation') {
      step2Details = step2Schema.parse(params.step2Details);
    }
    
    const logistics = logisticsSchema.parse(params.logistics);
    const payment = paymentSchema.parse(params.payment);

    // 2. Server-side Price Calculation (Ignore client totalAmount)
    const size = personalInfo.delegateType === "Delegation" ? (personalInfo.delegationSize || 1) : 1;
    const totalBase = size * BASE_FEE;
    const totalAcco = logistics.needsAccommodation ? (size * ACCO_FEE) : 0;
    const totalTransport = logistics.needsTransportation ? (size * TRANSPORT_FEE) : 0;
    const computedTotalAmount = totalBase + totalAcco + totalTransport;

    // 3. Insert the main registration record
    const { data: registration, error: regError } = await supabaseAdmin
      .from('registrations')
      .insert({
        full_name: personalInfo.fullName,
        email: personalInfo.email,
        phone: personalInfo.phone,
        cnic: personalInfo.cnicOrPassport,
        institution: personalInfo.institution,
        event_type: personalInfo.event,
        delegate_type: personalInfo.delegateType,
        delegation_size: personalInfo.delegationSize ?? null,
        needs_accommodation: logistics.needsAccommodation,
        needs_transportation: logistics.needsTransportation,
        transport_city: logistics.transportationCity ?? null,
        payment_method: payment.paymentMethod,
        receipt_url: params.receiptUrl ?? null,
        payment_status: 'pending',
        total_amount: computedTotalAmount,
        problem_area: params.step2Details?.problemArea ?? null,
      })
      .select()
      .single();

    if (regError) {
      console.error('[Registration Action] Insert error:', regError);
      return { success: false, error: regError.message };
    }

    // 4. Insert individual delegates if it's a delegation (with rollback)
    if (personalInfo.delegateType === 'Delegation' && step2Details && step2Details.members.length > 0) {
      const delegateRows = step2Details.members.map((member: any) => ({
        registration_id: registration.id,
        full_name: member.fullName,
        preference_1: member.preference1 ?? null,
        preference_2: member.preference2 ?? null,
        preference_3: member.preference3 ?? null,
      }));

      const { error: delegateError } = await supabaseAdmin
        .from('delegates')
        .insert(delegateRows);

      if (delegateError) {
        console.error('[Registration Action] Delegates insert error:', delegateError);
        // Rollback parent record
        await supabaseAdmin.from('registrations').delete().eq('id', registration.id);
        return { success: false, error: 'Failed to save delegates. Please try again.' };
      }
    }

    // 5. Send confirmation email (Application Received)
    try {
      await sendApplicationReceivedEmail({
        to: personalInfo.email,
        fullName: personalInfo.fullName,
        eventType: personalInfo.event,
        delegateType: personalInfo.delegateType,
        totalAmount: computedTotalAmount,
        registrationId: registration.id,
      });
    } catch (emailErr) {
      console.error('[Registration Action] Email error:', emailErr);
      // We don't fail the registration if only the email fails
    }

    return { success: true, registrationId: registration.id };

  } catch (error: any) {
    console.error('[Registration Action] Unexpected error:', error);
    if (error.issues && error.issues.length > 0) {
      return { success: false, error: 'Validation failed: ' + error.issues[0].message };
    }
    return { success: false, error: 'An unexpected error occurred during registration.' };
  }
}

async function sendApplicationReceivedEmail(data: any) {
  const { to, fullName, eventType, delegateType, totalAmount, registrationId } = data;

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
          <tr style="background:linear-gradient(135deg,#0A0415 0%,#1a0e2e 100%);padding:40px 32px;text-align:center;">
            <td style="padding:40px 32px;">
              <div style="font-size:24px;letter-spacing:0.35em;text-transform:uppercase;color:#ffffff;font-weight:800;">SOPHEP</div>
              <div style="margin-top:16px;">
                <span style="display:inline-block;background:rgba(159,111,224,0.25);border:1px solid rgba(159,111,224,0.4);color:#c4a5f0;padding:5px 16px;border-radius:20px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;">&#10003; Application Received</span>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 32px 24px;">
              <h1 style="font-size:26px;font-weight:300;color:#1a1a2e;margin:0 0 8px;">Welcome, <strong style="font-weight:700;color:#0A0415;">${fullName}</strong></h1>
              <p style="font-size:15px;line-height:1.7;color:#555;margin:16px 0 0;">Your registration for <strong style="color:#7c3aed;">${eventType}</strong> has been successfully submitted. Our administration team is reviewing your application and verifying your payment receipt.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f5ff;border:1px solid #e8dff5;border-radius:12px;padding:20px;">
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #ede6f7;">Reference ID</td>
                  <td style="padding:8px 0;border-bottom:1px solid #ede6f7;text-align:right;color:#7c3aed;font-weight:600;">${registrationId.slice(0, 8).toUpperCase()}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #ede6f7;">Event</td>
                  <td style="padding:8px 0;border-bottom:1px solid #ede6f7;text-align:right;">${eventType}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #ede6f7;">Amount</td>
                  <td style="padding:8px 0;border-bottom:1px solid #ede6f7;text-align:right;">PKR ${totalAmount.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;">Status</td>
                  <td style="padding:8px 0;text-align:right;"><span style="background:#FEF3C7;color:#92400E;padding:3px 10px;border-radius:12px;font-size:12px;">Under Review</span></td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px;border-top:1px solid #ede6f7;text-align:center;color:#aaa;font-size:12px;">
              SOPHEP — GIK Institute of Engineering Sciences & Technology
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const { data: resendData, error: resendError } = await resend.emails.send({
    from: 'SOPHEP Registration <onboarding@resend.dev>',
    to: [to],
    subject: `SOPHEP Application Received — Ref #${registrationId.slice(0, 8).toUpperCase()}`,
    html: htmlContent,
  });

  if (resendError) {
    throw new Error(resendError.message);
  }
}
