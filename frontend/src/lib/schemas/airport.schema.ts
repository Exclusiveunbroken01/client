// src/lib/schemas/airport.schema.ts

import { z } from 'zod';

export const AirportLocationValueSchema = z.object({
  city: z.string(),
  city_code: z.string(),
  country: z.string(),
});

export type TAirportLocationValue = z.infer<typeof AirportLocationValueSchema>;
