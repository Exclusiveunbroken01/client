import { z } from 'zod';
import { CabinClassSchema, FlightTypeSchema } from '../enums/flight-types.enum';
import { AirportLocationValueSchema } from '../airport.schema';

export const flightGuestSchema = z.object({
  adult: z.number().min(1),
  child: z.number().min(0),
  isInfant: z.boolean(),
  type: CabinClassSchema,
  totalGuest: z.number().min(1),
});

export const flightFormSchema = z
  .object({
    flightType: FlightTypeSchema,

    leavingFrom: AirportLocationValueSchema,
    goingTo: AirportLocationValueSchema,

    departureDate: z.date(),
    returnDate: z.date().optional(),

    guestNumber: flightGuestSchema,
  })
  .superRefine((data, ctx) => {
    if (data.leavingFrom.city_code === data.goingTo.city_code) {
      ctx.addIssue({
        path: ['goingTo'],
        message: 'Destination must be different',
        code: z.ZodIssueCode.custom,
      });
    }

    if (data.flightType === 'round_trip' && !data.returnDate) {
      ctx.addIssue({
        path: ['returnDate'],
        message: 'Return date is required for round trip flights',
        code: z.ZodIssueCode.custom,
      });
    }

    const calculatedTotal = data.guestNumber.adult + data.guestNumber.child;

    if (data.guestNumber.totalGuest !== calculatedTotal) {
      ctx.addIssue({
        path: ['guestNumber', 'totalGuest'],
        message: 'Total guest count does not match',
        code: z.ZodIssueCode.custom,
      });
    }
  });

export const carTabSchema = z
  .object({
    location: z.object({
      pickupL: z.string(),
      dropOffL: z.string(),
    }),
    rentalDate: z.array(z.date()).min(2, 'Please pick at least two dates'),
    rentalTime: z.object({
      pickupT: z.string(),
      dropoffT: z.string(),
    }),
  })
  .refine(
    (data) => {
      if (data.rentalDate.length < 2) return true; // handled by .min
      return data.rentalDate[0] <= data.rentalDate[1];
    },
    {
      message: 'The first date cannot be after the second date',
      path: ['eventDates'], // points error to the array
    },
  )
  .refine((range) => range.rentalTime.pickupT < range.rentalTime.dropoffT, {
    message: 'Rental Time Pickup Time must be before Dropoff Time',
    path: ['range.rentalTime.dropoffT'], // attach error to the "to" field
  });

export const airportTabSchema = z.object({
  locations: z.object({
    airport: z.string().nonempty('Input field required'),
    hotel: z.string().nonempty('Input field required'),
  }),
  travellers: z.object({
    adult: z.number(),
    children: z.number(),
    infant: z.number(),
    totalTravelers: z.number(),
  }),
  flightDepartureDate: z.array(z.date()).length(2, 'Please pick only two dates'),
  flightDepartureTime: z.string(),
});

export const roundTripTabSchema = z.object({
  locations: z.object({
    airport: z.string(),
    hotel: z.string(),
  }),
  travellers: z.object({
    adult: z.number(),
    children: z.number(),
    infant: z.number(),
    totalTravelers: z.number(),
  }),
  flightDepartureDate: z.array(z.date()).length(2, 'Please pick only two dates'),
  flightDepartureTime: z.string(),
  flightArrivalTime: z.string(),
});

export const attractionTabSchema = z.object({
  destination: z.string(),
  travelDate: z.array(z.date()).length(2, 'Please pick only two dates'),
});

export type TCarTabSchema = z.infer<typeof carTabSchema>;
export type TAirportTabSchema = z.infer<typeof airportTabSchema>;
export type TRoundTripTabSchema = z.infer<typeof roundTripTabSchema>;
export type TAttractionTabSchema = z.infer<typeof attractionTabSchema>;
