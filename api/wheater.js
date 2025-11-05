// api/weather.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  const API_KEY = process.env.TOMORROW_API_KEY; 
  const BASE_URL = "https://api.tomorrow.io/v4/weather/realtime";
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Parameter lat dan lon wajib diisi!" });
  }

  try {
    const response = await fetch(`${BASE_URL}?location=${lat},${lon}&apikey=${API_KEY}`);
    if (!response.ok) throw new Error("Gagal mengambil data dari Tomorrow.io");
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
