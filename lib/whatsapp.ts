import { WHATSAPP_NUMBER, FARM_NAME } from "./constants";
import { formatStayDate, nightsBetween } from "./ist";

export interface Enquiry {
  name: string;
  mobile: string;
  checkIn: string;
  checkOut: string;
  guests: string;
}

export function composeEnquiryMessage(e: Enquiry): string {
  const nights = nightsBetween(e.checkIn, e.checkOut);
  const nightLabel = nights === 1 ? "1 night" : `${nights} nights`;
  return [
    `Hi ${FARM_NAME} — I'd like to enquire about a stay.`,
    `Name: ${e.name}`,
    `Mobile: +91 ${e.mobile}`,
    `Check-in: ${formatStayDate(e.checkIn)}`,
    `Check-out: ${formatStayDate(e.checkOut)} (${nightLabel})`,
    `Guests: ${e.guests}`,
  ].join("\n");
}

export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Generic "just say hello" link for the sticky contact button. */
export function whatsappHelloLink(): string {
  return whatsappLink(
    `Hi ${FARM_NAME} — I'd like to know more about staying at the farm.`,
  );
}
