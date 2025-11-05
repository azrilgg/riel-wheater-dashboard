// 🌤️ Riel Weather Dashboard - Versi Tomorrow.io API

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locBtn = document.getElementById("locBtn");
const weatherCard = document.getElementById("weatherCard");
const errorEl = document.getElementById("error");
const loadingEl = document.getElementById("loading");

// Fungsi utama ambil data cuaca berdasarkan koordinat 
async function getWeather(lat, lon) {
  try {
    showLoading(true);
    const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`); 
    if (!res.ok) throw new Error("Gagal mengambil data cuaca!");
    const data = await res.json();
    renderWeather(data);
  } catch (err) {
    showError(err.message);
  } finally {
    showLoading(false);
  }
}

// Fungsi ambil koordinat dari nama kota (pakai API geocoding OpenStreetMap)
async function getCityCoords(city) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${city}&format=json&limit=1`);
    const data = await res.json();
    if (data.length === 0) throw new Error("Kota tidak ditemukan!");
    const { lat, lon, display_name } = data[0];
    getWeather(lat, lon);
    localStorage.setItem("lastCity", display_name);
  } catch (err) {
    showError(err.message);
  }
}

// Render hasil ke tampilan
function renderWeather(data) {
  const w = data.data.values;

  // ✅ Ambil nilai weatherCode dengan aman
  const code =
    w.weatherCode?.value ||
    w.weatherCodeFullDay?.value ||
    w.weatherCodeDay?.value ||
    w.weatherCode ||
    w.weatherCodeFullDay ||
    w.weatherCodeDay ||
    null;

  errorEl.classList.add("hidden");
  weatherCard.classList.remove("hidden");

  document.getElementById("cityName").textContent =
    localStorage.getItem("lastCity") || "Lokasi Anda";

  const conditionText = code ? translateCondition(code) : "Tidak diketahui";
  document.getElementById("weatherDesc").textContent = `Kondisi: ${conditionText}`;

  document.getElementById("tempValue").textContent = `${Math.round(w.temperature)}°C`;
  document.getElementById("humidity").textContent = `Kelembapan ${w.humidity}%`;
  document.getElementById("wind").textContent = `Angin ${w.windSpeed} m/s`;
  document.getElementById("feels").textContent = `Terasa ${Math.round(w.temperatureApparent)}°C`;

  document.getElementById("weatherIcon").src = getWeatherIcon(code);
}

function showError(msg) {
  errorEl.textContent = msg;
  errorEl.classList.remove("hidden");
  weatherCard.classList.add("hidden");
}

function showLoading(state) {
  loadingEl.classList.toggle("hidden", !state);
}

// Tombol cari kota
searchBtn.onclick = () => {
  const city = cityInput.value.trim();
  city ? getCityCoords(city) : showError("Masukkan nama kota terlebih dahulu!");
};

cityInput.addEventListener("keydown", e => {
  if (e.key === "Enter") searchBtn.click();
});

// Tombol lokasi sekarang
locBtn.onclick = () => {
  ambilLokasi();
};

function ambilLokasi() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        getWeather(latitude, longitude);
      },
      () => showError("Akses lokasi ditolak!")
    );
  } else {
    showError("Browser tidak mendukung geolokasi!");
  }
}

// Ganti kode cuaca ke teks
function translateCondition(code) {
  const map = {
    1000: "Cerah",
    1100: "Cerah sebagian",
    1101: "Berawan sebagian",
    1102: "Berawan",
    2000: "Kabut",
    2100: "Kabut ringan",
    4000: "Gerimis",
    4200: "Hujan ringan",
    4201: "Hujan deras",
    5000: "Salju",
    5100: "Salju ringan",
    6000: "Hujan es ringan",
    6200: "Campuran salju ringan",
    6201: "Campuran salju deras"
  };
  return map[code] || "Tidak diketahui";
}

// Ganti kode cuaca ke ikon
function getWeatherIcon(code) {
  const base = "/assets/icons/";
  const icons = {
    1000: "clear_day.jpg",      // Cerah
    1001: "cloudy.jpg",         // Berawan
    1100: "mostly_clear.jpg",   // Cerah sebagian
    1101: "partly_cloudy.jpg",  // Berawan sebagian
    1102: "mostly_cloudy.jpg",  // Lebih banyak awan
    2000: "fog.jpg",            // Kabut
    4000: "drizzle.jpg",        // Gerimis
    4001: "rain.jpg",           // Hujan
    4200: "rain.jpg",           // Hujan ringan
    4201: "rain.jpg"            // Hujan lebat
  };

  return base + (icons[code] || "cloudy.jpg"); // default kalau kode gak dikenal
}

// Saat pertama kali dibuka
window.addEventListener("load", () => {
  showLoading(true);
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        getWeather(latitude, longitude);
      },
      () => {
        const last = localStorage.getItem("lastCity");
        if (last) getCityCoords(last);
        else getCityCoords("Jakarta");
      }
    );
  }
});
