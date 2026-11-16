import { nightsBetween } from "./ist";
import { OCCUPANCY } from "./constants";

export interface EnquiryValues {
  name: string;
  mobile: string;
  checkIn: string;
  checkOut: string;
  guests: string;
}

export type EnquiryErrors = Partial<Record<keyof EnquiryValues, string>>;

/**
 * Field order as it appears on the form. The form focuses the first field in
 * this order that has an error, so keep it matching the rendered layout.
 */
export const ENQUIRY_FIELDS = [
  "name",
  "mobile",
  "checkIn",
  "checkOut",
  "guests",
] as const satisfies readonly (keyof EnquiryValues)[];

/**
 * Name of the enquiry form's honeypot field. It is hidden from people and
 * from assistive tech, so only a bot filling in every field it finds will
 * send it non-empty. The form renders it and /api/enquiry checks it.
 */
export const HONEYPOT_FIELD = "website";

/**
 * Longest name accepted. Generous for a real name, and it also caps what a
 * direct POST can push into the owner's inbox: every other field is held to a
 * fixed format below, so this is the only free text that gets through.
 */
export const NAME_MAX = 80;

/** Strips +91 / 0 prefixes and separators so a pasted number doesn't fail on formatting. */
export function normaliseMobile(raw: string): string {
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}

/**
 * Collapses runs of whitespace, including newlines, to single spaces. The
 * name goes into a line of the WhatsApp message and into the email subject,
 * so a pasted newline must not be able to start a fake "Guests:" line.
 */
export function normaliseName(raw: string): string {
  return raw.replace(/\s+/g, " ").trim();
}

export const INDIAN_MOBILE = /^[6-9]\d{9}$/;

/**
 * A real calendar date in YYYY-MM-DD form. `Date.parse` alone isn't enough:
 * it rolls "2027-02-30" over into March instead of rejecting it.
 */
export function isIsoDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return (
    date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d
  );
}

/** One to three digits, so "1e1" or a thousand-digit string never reach the message. */
const GUESTS = /^\d{1,3}$/;

export function validateEnquiry(values: EnquiryValues, today: string): EnquiryErrors {
  const errors: EnquiryErrors = {};

  const name = normaliseName(values.name);
  if (name.length < 2) {
    errors.name = "Please tell us your name.";
  } else if (name.length > NAME_MAX) {
    errors.name = `Please keep it to ${NAME_MAX} characters.`;
  }

  const mobile = normaliseMobile(values.mobile);
  if (!mobile) {
    errors.mobile = "We need a mobile number to reply on.";
  } else if (!INDIAN_MOBILE.test(mobile)) {
    errors.mobile = "That doesn't look like a 10-digit Indian mobile number.";
  }

  const checkInOk = isIsoDate(values.checkIn);
  if (!checkInOk) {
    errors.checkIn = "Pick a check-in date.";
  } else if (values.checkIn < today) {
    errors.checkIn = "Check-in can't be in the past.";
  }

  if (!isIsoDate(values.checkOut)) {
    errors.checkOut = "Pick a check-out date.";
  } else if (checkInOk && nightsBetween(values.checkIn, values.checkOut) < 1) {
    errors.checkOut = "Check-out has to be after check-in.";
  }

  const guests = values.guests.trim();
  if (!GUESTS.test(guests) || Number(guests) < 1) {
    errors.guests = "How many of you are coming?";
  } else if (Number(guests) > OCCUPANCY.maxGroup) {
    errors.guests = `We take groups of up to ${OCCUPANCY.maxGroup}.`;
  }

  return errors;
}

/**
 * The cleaned values that get sent on, from input that has already passed
 * `validateEnquiry`. The client and the server both build the message from
 * this, so what reaches WhatsApp and what reaches the backup email match.
 */
export function cleanEnquiry(values: EnquiryValues): EnquiryValues {
  return {
    name: normaliseName(values.name),
    mobile: normaliseMobile(values.mobile),
    checkIn: values.checkIn,
    checkOut: values.checkOut,
    guests: String(Number(values.guests.trim())),
  };
}
