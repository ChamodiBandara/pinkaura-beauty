import axios from "axios";

const BASE_URL = "http://localhost:8000/api";

export const getShades = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/shades`);
    return res.data.shades;
  } catch (err) {
    console.error("Failed to fetch shades:", err);
    return [];
  }
};
