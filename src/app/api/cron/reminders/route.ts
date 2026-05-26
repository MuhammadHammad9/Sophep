import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: Request) {
  // Simple auth to ensure only Vercel Cron can hit this
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch all verified registrations
    const { data: verifiedUsers, error } = await supabaseAdmin
      .from("registrations")
      .select("id, email, full_name, event_type")
      .eq("payment_status", "verified");

    if (error) {
      console.error("[Cron Reminders] Failed to fetch users:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!verifiedUsers || verifiedUsers.length === 0) {
      return NextResponse.json({ message: "No verified users to email." });
    }

    // Prepare email promises
    const emailPromises = verifiedUsers.map((user) => {
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background-color:#f4f0fa;padding:40px 0;margin:0;">
  <table width="600" cellpadding="0" cellspacing="0" align="center" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(90,50,150,0.08);">
    <tr>
      <td style="background:linear-gradient(135deg,#0A0415 0%,#1a0e2e 100%);padding:40px 32px;text-align:center;">
        <div style="font-size:24px;letter-spacing:0.35em;text-transform:uppercase;color:#ffffff;font-weight:800;">SOPHEP</div>
      </td>
    </tr>
    <tr>
      <td style="padding:40px 32px;">
        <h1 style="font-size:22px;color:#1a1a2e;margin:0 0 16px;">See you soon, ${user.full_name}!</h1>
        <p style="color:#555;line-height:1.6;font-size:15px;margin:0 0 16px;">
          The SOPHEP conference is just around the corner. We are thrilled to welcome you to the <strong>${user.event_type}</strong> event.
        </p>
        <p style="color:#555;line-height:1.6;font-size:15px;margin:0 0 16px;">
          Don't forget to bring your QR E-Ticket (sent previously in your confirmation email) for a smooth check-in process.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 32px;border-top:1px solid #ede6f7;text-align:center;font-size:12px;color:#aaa;">
        SOPHEP &mdash; GIK Institute of Engineering Sciences & Technology
      </td>
    </tr>
  </table>
</body>
</html>
      `;

      return resend.emails.send({
        from: "SOPHEP Events <events@resend.dev>",
        to: [user.email],
        subject: "SOPHEP is Almost Here! Important Event Details",
        html: htmlContent,
      });
    });

    // Send emails in parallel
    await Promise.allSettled(emailPromises);

    return NextResponse.json({ success: true, count: verifiedUsers.length });
  } catch (err) {
    console.error("[Cron Reminders] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
