
import type { Request, Response } from "express";
import {
  searchAirports,
  searchFlights,
  confirmPrice,
  bookFlight,
  getBookingDetails,
  cancelBooking,
  issueTicket,
  searchMultiCityFlights,
  getAirlines,
} from "./flights.service.js";

const getSingleParam = (param: string | string[] | undefined): string | undefined => {
  if (Array.isArray(param)) return param[0];
  return param;
};

export const getAirports = async (req: Request, res: Response) => {
  try {
    const keyword = String(req.query.keyword || "");

    const data = await searchAirports(keyword);

    res.json(data);
  } catch (error: any) {
    console.error("Airport fetch error:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getFlights = async (req: Request, res: Response) => {
  try {
    const origin = String(req.query.origin);
	const destination = String(req.query.destination);
	const adults = Number(req.query.adults);
	const cabin = String(req.query.cabin);
	const departure_date = String(req.query.departure_date);

    // Quick validation for required fields
    if (!adults || !cabin || !departure_date || !destination || !origin) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required search parameters: adults, cabin, departure_date, destination, and origin are required." 
      });
    }

    const data = await searchFlights(req.query); 
    res.json(data);
  } catch (error: any) {
    console.error("Flight search error:", error.message);
    res.status(500).json({ success: false, message: error?.message || 'Internal Server Error', error: process.env.NODE_env === 'development' ? error : undefined, });
  }
};

// backend/src/modules/flights/flights.controller.ts
export const confirmFlightPrice = async (req: Request, res: Response) => {
  try {
    // Destructure the string out of req.params
    const flightId = Array.isArray(req.params.flightId)
      ? req.params.flightId[0]
      : req.params.flightId; 

    if (!flightId) {
      return res.status(400).json({ message: "Flight ID is required" });
    }

    // Pass the STRING 'flightId' to the service
    const data = await confirmPrice(flightId);

    res.json(data);
  } catch (error: any) {
    console.error("Controller Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const bookFlightController = async (req: Request, res: Response) => {
  try {
    const flightId = getSingleParam(req.params.flightId);
    if (!flightId) {
      return res.status(400).json({ success: false, message: "Flight ID is required" });
    }

    const data = await bookFlight(flightId, req.body);

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBooking = async (req: Request, res: Response) => {
  try {
    const reference = getSingleParam(req.params.reference);
    if (!reference) {
      return res.status(400).json({ success: false, message: "Reference is required" });
    }

    const data = await getBookingDetails(reference);

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelFlight = async (req: Request, res: Response) => {
  try {
    const reference = getSingleParam(req.params.reference);
    if (!reference) {
      return res.status(400).json({ success: false, message: "Reference is required" });
    }

    const data = await cancelBooking(reference);

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const payForFlight = async (req: Request, res: Response) => {
  try {
    const reference = getSingleParam(req.params.reference);
    if (!reference) {
      return res.status(400).json({ success: false, message: "Reference is required" });
    }

    const data = await issueTicket(reference);

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const multiCitySearch = async (req: Request, res: Response) => {
  try {
    const data = await searchMultiCityFlights(req.body);

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAirlinesController = async (req: Request, res: Response) => {
  try {
    const data = await getAirlines();

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

