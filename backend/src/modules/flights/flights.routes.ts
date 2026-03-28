// src/modules/flights/flights.routes.ts
import { Router } from "express";
import * as flightsController from "./flights.controller.js";

const router = Router();

router.get("/airports", flightsController.getAirports);

router.get("/", flightsController.getAllFlights);
router.get("/:id", flightsController.getFlightById);
router.post("/", flightsController.createFlight);
router.patch("/:id", flightsController.updateFlight);
router.delete("/:id", flightsController.deleteFlight);


export default router;
