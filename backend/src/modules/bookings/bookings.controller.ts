import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import { createBookingService } from "./bookings.service.js";

/**
 * GET /bookings
 * Fetch all bookings
 */
export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

/**
 * POST /bookings
 * Create a new booking
 */
export const createBooking = async (req: Request, res: Response) => {
  try {
    const booking = await createBookingService(req.body);

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create booking",
    });
  }
};
