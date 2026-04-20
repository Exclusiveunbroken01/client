import { prisma } from "../../lib/prisma.js";

interface CreateBookingInput {
  name: string;
  email: string;
  date: string;
  service: string;
}

export const createBookingService = async (input: CreateBookingInput) => {
  const { name, email, date, service } = input;

  return prisma.booking.create({
    data: {
      name,
      email,
      date: new Date(date),
      service,
    },
  });
};
