//src/lib/types/flight-search/flight-search-parser.ts
import { CabinClassSchema, FlightTypeEnum } from '@/lib/schemas/enums/flight-types.enum';
import { TFlightFormSchema } from '@/lib/hooks/website/landing-page.hook';
import { FlightSearchQuery } from './flight-search-url';
import { AirportLocationValue } from '@/lib/types/server/airport.types';

// type SearchParams = {
//   from?: string;
//   to?: string;
//   departure?: string;
//   return?: string;
//   cabin?: string;
//   adult?: string;
//   child?: string;
// };

export type TTiqwaFlightSearchParams = {
  origin: string;
  destination: string;
  departure_date: string;
  cabin: string;
  adults: number;
  return_date?: string;
  children?: number;
  infants?: number;
  flexible_date?: boolean;
};

export type flightFilterState = {
  priceRange: number[];
  durationRange: number[];
  selectedStops: number[];
  selectedAirlines: string[];
  refundableOnly: boolean;
};

function createMinimalLocation(city: string, cityCode: string, country: string): AirportLocationValue {
  return {
    city,
    city_code: cityCode,
    country,
  };
}

export function parseFlightSearchParams(
  flightType: FlightTypeEnum,
  params: FlightSearchQuery,
): Partial<TFlightFormSchema> {
  if (!params.from || !params.to || !params.departure) {
    return {};
  }

  const cabin = CabinClassSchema.options.find((c) => c === params.cabin) ?? 'economy';

  return {
    flightType,
    leavingFrom: createMinimalLocation(params.from, params.from_code, params.origin_country),
    goingTo: createMinimalLocation(params.to, params.to_code, params.destination_country),
    departureDate: new Date(params.departure),
    returnDate: params.return ? new Date(params.return) : undefined,
    guestNumber: {
      adult: Number(params.adult ?? 1),
      child: Number(params.child ?? 0),
      type: cabin,
      isInfant: false,
      totalGuest: Number(params.adult ?? 1) + Number(params.child ?? 0),
    },
  };
}
