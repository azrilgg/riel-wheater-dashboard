// /api/weather.js

export default async function handler(req, res) {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Latitude dan longitude wajib diisi." });
  }

  try {
    const apiKey = process.env.WEATHER_API_KEY; // 🔑 Ambil dari Environment Variable Vercel
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=no`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Gagal ambil data dari WeatherAPI");

    const data = await response.json();

    // Biar cocok sama struktur lama (Tomorrow.io)
    const formatted = {
      data: {
        values: {
          temperature: data.current.temp_c,
          humidity: data.current.humidity,
          windSpeed: data.current.wind_kph / 3.6, // ubah ke m/s
          temperatureApparent: data.current.feelslike_c,
          weatherCode: data.current.condition.code
        }
      }
    };

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
