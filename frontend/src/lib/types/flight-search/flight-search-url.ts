// src/lib/types/flight-search/flight-search-url.ts

import { FlightTypeEnum } from '@/lib/schemas/enums/flight-types.enum';
import { TFlightFormSchema } from '@/lib/hooks/website/landing-page.hook';

export type FlightSearchQuery = {
  from: string;
  origin_country: string;
  to: string;
  destination_country: string;
  departure: string;
  return?: string;
  cabin: string;
  adult: string;
  child: string;
  infant: string;
  from_code: string;
  to_code: string;
};

export function buildFlightSearchUrl(flightType: FlightTypeEnum, data: TFlightFormSchema) {
  const query: FlightSearchQuery = {
    from: data.leavingFrom.city,
    to: data.goingTo.city,
    departure: data.departureDate.toISOString().split('T')[0],
    cabin: data.guestNumber.type,
    adult: String(data.guestNumber.adult),
    child: String(data.guestNumber.child),
    infant: data.guestNumber.isInfant ? '1' : '0',
    from_code: data.leavingFrom.city_code ?? '',
    to_code: data.goingTo.city_code ?? '',
    origin_country: data.leavingFrom.country,
    destination_country: data.goingTo.country,
  };

  if (data.flightType === 'round_trip' && data.returnDate) {
    query.return = data.returnDate.toISOString().split('T')[0];
  }

  const search = new URLSearchParams(query).toString();

  return `/flight/search/${flightType}?${search}`;
}
