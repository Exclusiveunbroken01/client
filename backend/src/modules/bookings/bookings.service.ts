// bookings.service.ts
import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { generateReference } from '@/lib/helper/crypto-generator.helper';

interface CreateBookingInput {
  name: string;
  email: string;
  date: string;
  service: string;
}

export const createBookingService = async (input: CreateBookingInput) => {
  const { name, email, date, service } = input;

  return prisma.$transaction(async (tx) => {
    const MAX_RETRIES = 5;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        return await tx.booking.create({
          data: {
            name,
            email,
            date: new Date(date),
            service,
            referenceCode: generateReference(),
          },
        });
      } catch (err) {
        if (
          err instanceof Prisma.PrismaClientKnownRequestError &&
          err.code === 'P2002'
        ) {
          continue; // retry if referenceCode clashes
        }

        throw err;
      }
    }

    throw new Error('Failed to generate unique booking reference');
  });
};
