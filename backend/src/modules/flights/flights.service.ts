// backend/src/modules/flights/flights.service.ts

const BASE_URL = process.env.TIQWA_BASE_URL;
const API_KEY = process.env.TIQWA_API_KEY;

/**
 * 🔧 Helper: Standardized request handler
 */
const tiqwaFetch = async (endpoint: string, options: RequestInit = {}) => {
  // Ensure we don't have double slashes or missing slashes
  const baseUrl = BASE_URL?.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  if (!baseUrl) throw new Error("TIQWA_BASE_URL is not defined in .env");
  if (!API_KEY) throw new Error("TIQWA_API_KEY is not defined in .env");

  const url = `${baseUrl}${cleanEndpoint}`;
  console.log("Tiqwa base URL:", BASE_URL);
  console.log(`📡 Sending Request to Tiqwa: [${options.method || 'GET'}] ${url}`);
    
  const response = await fetch(url, {
    ...options,
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ Tiqwa API Error (${response.status}):`, errorText);
    throw new Error(`Tiqwa API Error: ${errorText}`);
  }

  return response.json();
};

/**
 * ✈️ Flight Offer Search
 */
export const searchFlights = async (params: any) => {
  const query = new URLSearchParams();
  
  // Dynamically add all incoming params (origin, destination, adults, etc.)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, String(value));
    }
  });

  return tiqwaFetch(`/flight/search?${query.toString()}`, {
    method: "GET",
  });
};


/**
 * 💰 Confirm Price
 */
// backend/src/modules/flights/flights.service.ts

export const confirmPrice = async (flightId: any) => {
    console.log("flightId:", flightId);
  try {
    // If flightId accidentally comes in as an object { flightId: '...' }
    // we extract the string. This is a safety check.
    const idString = typeof flightId === 'object' ? flightId.flightId : flightId;

    if (!idString || typeof idString !== 'string') {
      throw new Error("Invalid Flight ID provided to service");
    }

    const cleanId = idString.trim();
    
    // Use the trailing slash as discussed earlier to avoid 301 redirects
    return await tiqwaFetch(`/flight/confirm_price/${cleanId}`, {
      method: "GET",
    });
  } catch (error: any) {
    // This will now log the actual string ID instead of [object Object]
    console.error(`🚨 Service Failure:`, error.message);
    throw error;
  }
};

/**
 * 🧾 Book Flight
 */
export const bookFlight = async (flight_id: string, payload: any) => {
  return tiqwaFetch(`/flight/book/${flight_id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};



/**
 * 📄 Booking Details
 */
export const getBookingDetails = async (reference: string) => {
  return tiqwaFetch(`/flight/${reference}`, {
    method: "GET",
  });
};



/**
 * ❌ Cancel Booking
 */
export const cancelBooking = async (reference: string) => {
  return tiqwaFetch(`/flight/${reference}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
};



/**
 * 🎟️ Issue Ticket (Payment)
 */
export const issueTicket = async (reference: string) => {
  return tiqwaFetch(`/flight/pay/${reference}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

/**
 * 🌍 Multi-city Flight Search
 */
export const searchMultiCityFlights = async (payload: {
  destinations: {
    origin: string;
    destination: string;
    departure_date: string;
  }[];
  cabin: string;
  adults: number;
  children?: number;
  infants?: number;
}) => {
  return tiqwaFetch(`/flight/multi_city/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};

/**
 * 🛫 Airports Search
 */
export const searchAirports = async (keyword: string) => {
  const query = new URLSearchParams({
    keyword,
  });

  return tiqwaFetch(`/airports?${query.toString()}`, {
    method: "GET",
  });
};

/**
 * 🛩️ Airlines
 */
export const getAirlines = async () => {
  return tiqwaFetch(`/airlines`, {
    method: "GET",
  });
};
