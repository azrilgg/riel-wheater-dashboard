const API_KEY = "ec057fba69dcc0416f1622967c6239f9";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locBtn = document.getElementById("locBtn");
const weatherCard = document.getElementById("weatherCard");
const errorEl = document.getElementById("error");
const loadingEl = document.getElementById("loading");

// 🔥 Ambil cuaca berdasarkan nama kota
async function getWeather(city) {
  try {
    showLoading(true);
    const res = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=id`);
    if (!res.ok) throw new Error("Kota tidak ditemukan!");
    const data = await res.json();
    renderWeather(data);
  } catch (err) {
    showError(err.message);
  } finally {
    showLoading(false);
  }
}

// 🌍 Ambil cuaca berdasarkan koordinat lokasi
async function getWeatherByLocation(lat, lon) {
  try {
    showLoading(true);
    const res = await fetch(`${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=id`);
    if (!res.ok) throw new Error("Gagal mengambil data lokasi!");
    const data = await res.json();
    renderWeather(data);
  } catch (err) {
    showError(err.message);
  } finally {
    showLoading(false);
  }
}

// 💨 Render data ke tampilan
function renderWeather(data) {
  errorEl.classList.add("hidden");
  weatherCard.classList.remove("hidden");

  document.getElementById("cityName").textContent = `${data.name}, ${data.sys.country}`;
  document.getElementById("weatherDesc").textContent = data.weather[0].description;
  document.getElementById("tempValue").textContent = `${Math.round(data.main.temp)}°C`;
  document.getElementById("humidity").textContent = `Kelembapan ${data.main.humidity}%`;
  document.getElementById("wind").textContent = `Angin ${data.wind.speed} m/s`;
  document.getElementById("feels").textContent = `Terasa ${Math.round(data.main.feels_like)}°C`;
  document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  localStorage.setItem("lastCity", data.name);
}

function showError(msg) {
  errorEl.textContent = msg;
  errorEl.classList.remove("hidden");
  weatherCard.classList.add("hidden");
}

function showLoading(state) {
  loadingEl.classList.toggle("hidden", !state);
}

// 🔍 Tombol cari
searchBtn.onclick = () => {
  const city = cityInput.value.trim();
  city ? getWeather(city) : showError("Masukkan nama kota terlebih dahulu!");
};

cityInput.addEventListener("keydown", e => {
  if (e.key === "Enter") searchBtn.click();
});

// 📍 Tombol "Lokasi Saya"
locBtn.onclick = () => {
  ambilLokasi();
};

// 🚀 Fungsi ambil lokasi pengguna
function ambilLokasi() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        getWeatherByLocation(latitude, longitude);
      },
      () => showError("Akses lokasi ditolak! Gunakan tombol cari.")
    );
  } else {
    showError("Browser tidak mendukung geolokasi!");
  }
}

// 🧠 Saat halaman pertama kali dibuka
window.addEventListener("load", () => {
  showLoading(true);
  // 🔥 Coba ambil lokasi otomatis
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        getWeatherByLocation(latitude, longitude);
      },
      () => {
        // ❗ Kalau user tolak izin lokasi → pakai kota terakhir atau default Jakarta
        const last = localStorage.getItem("lastCity");
        if (last) getWeather(last);
        else getWeather("Jakarta");
      }
    );
  } else {
    // Kalau browser gak dukung GPS
    const last = localStorage.getItem("lastCity");
    if (last) getWeather(last);
    else getWeather("Jakarta");
  }
});
