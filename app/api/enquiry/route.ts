import { NextResponse } from "next/server";
import {
  cleanEnquiry,
  validateEnquiry,
  ENQUIRY_FIELDS,
  HONEYPOT_FIELD,
  type EnquiryValues,
} from "@/lib/validate";
import { istToday, nightsBetween } from "@/lib/ist";
import { composeEnquiryMessage } from "@/lib/whatsapp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Longest request body accepted, in characters. A real enquiry is well under
 * 1,000; anything near this is not coming from the form.
 */
const MAX_BODY_CHARS = 4096;

/** Only strings (and, for leniency, finite numbers) count as a field value. */
function field(body: Record<string, unknown>, key: string): string {
  const v = body[key];
  if (typeof v === "string") return v;
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  return "";
}

/**
 * Backup record of an enquiry. The guest's real path is WhatsApp; this
 * exists so an enquiry is never lost if they abandon the handoff.
 *
 * Nothing from the client is forwarded as-is. The five fields are
 * re-validated and cleaned, and the message and night count are rebuilt
 * here from those fields, so a direct POST can't put arbitrary text into
 * the email the owner receives.
 *
 * Not covered: rate limiting. It needs shared state across serverless
 * instances, such as a KV store, which this project doesn't have.
 *
 * WEB3FORMS_ACCESS_KEY is read here, server-side, and never sent to the
 * browser.
 */
export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > MAX_BODY_CHARS) {
    return NextResponse.json({ ok: false, error: "too_large" }, { status: 413 });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }
  // `null`, arrays and bare primitives are all valid JSON, but not an enquiry.
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }
  const body = parsed as Record<string, unknown>;

  // Answer a filled honeypot exactly like a successful submission without a
  // backup key, so a bot gets no signal that it was caught.
  if (field(body, HONEYPOT_FIELD).trim()) {
    return NextResponse.json({ ok: true, stored: false });
  }

  const input = Object.fromEntries(
    ENQUIRY_FIELDS.map((k) => [k, field(body, k)]),
  ) as unknown as EnquiryValues;

  // Re-validate server-side: never trust the client's word for it.
  const errors = validateEnquiry(input, istToday());
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 422 });
  }

  const values = cleanEnquiry(input);

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
        nights: String(nightsBetween(values.checkIn, values.checkOut)),
        guests: values.guests,
        message: composeEnquiryMessage(values),
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
