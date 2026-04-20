import type { Request, Response } from "express";
import { getCountries } from "./countries.service.js";

export const fetchCountries = async (req: Request, res: Response) => {
  const countries = await getCountries();
  res.json(countries);
};
