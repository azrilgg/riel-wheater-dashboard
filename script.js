// --- KONFIGURASI ---
const API_KEY = "ec057fba69dcc0416f1622967c6239f9";// contoh API key publik
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// --- DOM ELEMENT ---
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locBtn = document.getElementById("locBtn");
const weatherCard = document.getElementById("weatherCard");
const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");
const themeToggle = document.getElementById("themeToggle");

// --- MENAMPILKAN CUACA ---
async function getWeather(city) {
  try {
    showLoading(true);
    const response = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=id`);
    if (!response.ok) throw new Error("Kota tidak ditemukan!");
    const data = await response.json();
    renderWeather(data);
  } catch (err) {
    showError(err.message);
  } finally {
    showLoading(false);
  }
}

// --- BERDASARKAN KOORDINAT ---
async function getWeatherByLocation(lat, lon) {
  try {
    showLoading(true);
    const response = await fetch(`${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=id`);
    const data = await response.json();
    renderWeather(data);
  } catch {
    showError("Tidak dapat mengambil lokasi Anda!");
  } finally {
    showLoading(false);
  }
}

// --- RENDER DATA ---
function renderWeather(data) {
  errorEl.classList.add("hidden");
  weatherCard.classList.remove("hidden");

  document.getElementById("cityName").textContent = `${data.name}, ${data.sys.country}`;
  document.getElementById("weatherDesc").textContent = data.weather[0].description;
  document.getElementById("tempValue").textContent = `${Math.round(data.main.temp)}°C`;
  document.getElementById("humidity").textContent = `Kelembapan: ${data.main.humidity}%`;
  document.getElementById("wind").textContent = `Angin: ${data.wind.speed} m/s`;
  document.getElementById("feels").textContent = `Terasa seperti ${Math.round(data.main.feels_like)}°C`;
  document.getElementById("weatherIcon").src =
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  localStorage.setItem("lastCity", data.name);
}

// --- ERROR & LOADING HANDLER ---
function showError(msg) {
  errorEl.textContent = msg;
  errorEl.classList.remove("hidden");
  weatherCard.classList.add("hidden");
}

function showLoading(state) {
  loadingEl.classList.toggle("hidden", !state);
}

// --- TOMBOL SEARCH ---
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) getWeather(city);
  else showError("Masukkan nama kota terlebih dahulu!");
});

// --- ENTER KEY ---
cityInput.addEventListener("keydown", e => {
  if (e.key === "Enter") searchBtn.click();
});

// --- GUNAKAN LOKASI ---
locBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        getWeatherByLocation(latitude, longitude);
      },
      () => showError("Akses lokasi ditolak atau tidak tersedia!")
    );
  } else {
    showError("Browser tidak mendukung geolokasi!");
  }
});

// --- TOGGLE TEMA ---
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const mode = document.body.classList.contains("light") ? "🌞" : "🌙";
  themeToggle.textContent = mode;
  localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
});

// --- SAAT PERTAMA KALI ---
window.addEventListener("load", () => {
  const last = localStorage.getItem("lastCity");
  const theme = localStorage.getItem("theme");
  if (theme === "light") document.body.classList.add("light");
  if (last) getWeather(last);
  else getWeather("Jakarta");
});
