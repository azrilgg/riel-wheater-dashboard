// /api/weather.js

export default async function handler(req, res) {
  const { lat, lon } = req.query;
  const apiKey = process.env.TOMORROW_API_KEY;

  try {
    const response = await fetch(
      `https://api.tomorrow.io/v4/weather/realtime?location=${lat},${lon}&apikey=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("Gagal mengambil data dari Tomorrow.io");
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ error: "Terjadi kesalahan pada server cuaca" });
  }
}
