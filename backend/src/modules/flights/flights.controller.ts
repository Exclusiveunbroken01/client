// src/modules/flights/flights.controller.ts
import type { Request, Response } from "express";

/**
 * GET /flights
 */
export const getAllFlights = async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "All flights fetched",
  });
};

/**
 * GET /flights/:id
 */
export const getFlightById = async (req: Request, res: Response) => {
  const { id } = req.params;

  res.json({
    success: true,
    message: `Flight ${id} fetched`,
  });
};

/**
 * POST /flights
 */
export const createFlight = async (req: Request, res: Response) => {
  res.status(201).json({
    success: true,
    message: "Flight created",
  });
};

/**
 * PATCH /flights/:id
 */
export const updateFlight = async (req: Request, res: Response) => {
  const { id } = req.params;

  res.json({
    success: true,
    message: `Flight ${id} updated`,
  });
};

/**
 * DELETE /flights/:id
 */
export const deleteFlight = async (req: Request, res: Response) => {
  const { id } = req.params;

  res.json({
    success: true,
    message: `Flight ${id} deleted`,
  });
};

/**
 * ✅ NEW: GET /flights/airports
 */
export const getAirports = async (req: Request, res: Response) => {
  try {
    const keyword = String(req.query.keyword || "");

    const response = await fetch(
      `${process.env.TIQWA_BASE_URL}/airports?keyword=${encodeURIComponent(keyword)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TIQWA_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Tiqwa API request failed");
    }

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error("Airport fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching airports",
    });
  }
};
