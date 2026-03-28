const TIQWA_BASE_URL = process.env.TIQWA_BASE_URL;
const TIQWA_API_KEY = process.env.TIQWA_API_KEY;

const response = await fetch(`${TIQWA_BASE_URL}/airports?keyword=${query}`, {
  headers: {
    Authorization: `Bearer ${TIQWA_API_KEY}`,
  },
});
