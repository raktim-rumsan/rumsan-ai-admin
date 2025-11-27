import { SECTORS } from "@/constants/sector";

export const LANDING_PAGE = process.env.NEXT_PUBLIC_INDUSTRY_VALUES || "";
export const validLandingPages = SECTORS.map((sector) => sector.value);
export type LandingPageType = (typeof validLandingPages)[number];
export function getLandingPage(): LandingPageType {
  if (validLandingPages.includes(LANDING_PAGE as LandingPageType))
    return LANDING_PAGE as LandingPageType;
  return "" as LandingPageType;
}
