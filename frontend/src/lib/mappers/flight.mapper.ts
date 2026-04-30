import { Flight } from '@/lib/hooks/tiqwa/flight-search.hook';
import { FlightDetailsProps } from '@/lib/types/flight-search/response-flight-search.type';

export const mapFlightToDetails = (
  flight: Flight
): FlightDetailsProps => {
  const amount = Number(flight.amount ?? 0);

  return {
    id: flight.id ?? crypto.randomUUID(),

    amount,
    currency: flight.currency ?? 'NGN',

    fare_basis: '',
    office_id: '',

    outbound: [],
    inbound: [],

    outbound_stops: 0,
    inbound_stops: 0,

    total_duration: 0,
    total_outbound_duration: 0,
    total_inbound_duration: 0,

    pricing: {
      base_fare: amount,
      markup: null,
      payable: amount,
      tax: 0,
    },

    travelers_price: (flight.travelers_price ?? []).map((p) => ({
      adult: Number(p.adult ?? 0),
    })),

    price_summary: [
      {
        passenger_type: 'adult',
        quantity: 1,
        total_price: amount,
      },
    ],
  };
};
