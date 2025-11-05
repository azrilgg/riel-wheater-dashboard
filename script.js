const API_KEY = "ec057fba69dcc0416f1622967c6239f9";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locBtn = document.getElementById("locBtn");
const weatherCard = document.getElementById("weatherCard");
const errorEl = document.getElementById("error");
const loadingEl = document.getElementById("loading");

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

searchBtn.onclick = () => {
  const city = cityInput.value.trim();
  city ? getWeather(city) : showError("Masukkan nama kota terlebih dahulu!");
};

cityInput.addEventListener("keydown", e => {
  if (e.key === "Enter") searchBtn.click();
});

locBtn.onclick = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        getWeatherByLocation(latitude, longitude);
      },
      () => showError("Akses lokasi ditolak!")
    );
  } else showError("Browser tidak mendukung geolokasi!");
};

async function getWeatherByLocation(lat, lon) {
  try {
    showLoading(true);
    const res = await fetch(`${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=id`);
    const data = await res.json();
    renderWeather(data);
  } catch {
    showError("Gagal mengambil data lokasi!");
  } finally {
    showLoading(false);
  }
}

window.addEventListener("load", () => {
  const last = localStorage.getItem("lastCity");
  if (last) getWeather(last);
  else getWeather("Jakarta");
});
