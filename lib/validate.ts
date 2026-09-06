import { nightsBetween } from "./ist";

export interface EnquiryErrors {
  name?: string;
  mobile?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: string;
}

/** Strips +91 / 0 prefixes and separators so a pasted number doesn't fail on formatting. */
export function normaliseMobile(raw: string): string {
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}

export const INDIAN_MOBILE = /^[6-9]\d{9}$/;

export function validateEnquiry(
  values: {
    name: string;
    mobile: string;
    checkIn: string;
    checkOut: string;
    guests: string;
  },
  today: string,
): EnquiryErrors {
  const errors: EnquiryErrors = {};

  if (values.name.trim().length < 2) {
    errors.name = "Please tell us your name.";
  }

  const mobile = normaliseMobile(values.mobile);
  if (!mobile) {
    errors.mobile = "We need a mobile number to reply on.";
  } else if (!INDIAN_MOBILE.test(mobile)) {
    errors.mobile = "That doesn't look like a 10-digit Indian mobile number.";
  }

  if (!values.checkIn) {
    errors.checkIn = "Pick a check-in date.";
  } else if (values.checkIn < today) {
    errors.checkIn = "Check-in can't be in the past.";
  }

  if (!values.checkOut) {
    errors.checkOut = "Pick a check-out date.";
  } else if (values.checkIn && nightsBetween(values.checkIn, values.checkOut) < 1) {
    errors.checkOut = "Check-out has to be after check-in.";
  }

  const guests = Number(values.guests);
  if (!values.guests || !Number.isInteger(guests) || guests < 1) {
    errors.guests = "How many of you are coming?";
  }

  return errors;
}
