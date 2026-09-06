import { NextResponse } from "next/server";
import { validateEnquiry } from "@/lib/validate";
import { istToday } from "@/lib/ist";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Backup record of an enquiry. The guest's real path is WhatsApp; this
 * exists so an enquiry is never lost if they abandon the handoff.
 *
 * WEB3FORMS_ACCESS_KEY is read here, server-side, and never sent to the
 * browser.
 */
export async function POST(request: Request) {
  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const values = {
    name: String(body.name ?? ""),
    mobile: String(body.mobile ?? ""),
    checkIn: String(body.checkIn ?? ""),
    checkOut: String(body.checkOut ?? ""),
    guests: String(body.guests ?? ""),
  };

  // Re-validate server-side: never trust the client's word for it.
  const errors = validateEnquiry(values, istToday());
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 422 });
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    // Not configured yet. Don't fail the guest's submission over it.
    console.warn("[enquiry] WEB3FORMS_ACCESS_KEY not set — record not stored");
    return NextResponse.json({ ok: true, stored: false });
  }

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `Stay enquiry — ${values.name} (${values.guests} guests)`,
        from_name: "Sweet Orchard Farm website",
        name: values.name,
        mobile: `+91 ${values.mobile}`,
        check_in: values.checkIn,
        check_out: values.checkOut,
        nights: String(body.nights ?? ""),
        guests: values.guests,
        message: String(body.message ?? ""),
      }),
    });

    if (!res.ok) {
      console.error("[enquiry] web3forms responded", res.status);
      return NextResponse.json({ ok: true, stored: false });
    }
    return NextResponse.json({ ok: true, stored: true });
  } catch (err) {
    console.error("[enquiry] web3forms failed", err);
    return NextResponse.json({ ok: true, stored: false });
  }
}
