// api/weather.js

export default async function handler(req, res) {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Latitude dan longitude diperlukan!" });
  }

  try {
    const apiKey = process.env.TOMORROW_API_KEY;
    const url = `https://api.tomorrow.io/v4/weather/realtime?location=${lat},${lon}&apikey=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil data cuaca", details: err.message });
  }
}
