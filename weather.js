// Coordenadas para Ramos Mejía, Buenos Aires
const LAT = -34.6406;
const LON = -58.5636;

const weatherCodeMap = {
  0: { desc: 'Despejado', icon: '☀️' },
  1: { desc: 'Mayormente despejado', icon: '🌤️' },
  2: { desc: 'Parcialmente nublado', icon: '⛅️' },
  3: { desc: 'Nublado', icon: '☁️' },
  45: { desc: 'Niebla', icon: '🌫️' },
  48: { desc: 'Niebla escarcha', icon: '🌫️' },
  51: { desc: 'Llovizna ligera', icon: '🌦️' },
  53: { desc: 'Llovizna moderada', icon: '🌧️' },
  55: { desc: 'Llovizna densa', icon: '🌧️' },
  61: { desc: 'Lluvia ligera', icon: '🌧️' },
  63: { desc: 'Lluvia moderada', icon: '🌧️' },
  65: { desc: 'Lluvia fuerte', icon: '⛈️' },
  80: { desc: 'Chubascos', icon: '🌦️' },
  81: { desc: 'Chubascos fuertes', icon: '⛈️' },
  82: { desc: 'Chubascos violentos', icon: '⛈️' },
  95: { desc: 'Tormenta', icon: '🌩️' },
  96: { desc: 'Tormenta con granizo', icon: '⛈️' },
  99: { desc: 'Tormenta severa', icon: '⛈️' },
};

export async function fetchWeather() {
  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,apparent_temperature,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=America%2FSao_Paulo`);
    
    if (!response.ok) throw new Error("Error fetching weather");
    const data = await response.json();

    const current = data.current;
    const daily = data.daily;
    
    const weatherInfo = weatherCodeMap[current.weather_code] || { desc: 'Desconocido', icon: '🌡️' };

    document.getElementById('weather-temp').textContent = `${Math.round(current.temperature_2m)}°`;
    document.getElementById('weather-feels').textContent = Math.round(current.apparent_temperature);
    document.getElementById('weather-icon').textContent = weatherInfo.icon;
    document.getElementById('weather-desc').textContent = weatherInfo.desc;
    document.getElementById('weather-max').textContent = Math.round(daily.temperature_2m_max[0]);
    document.getElementById('weather-min').textContent = Math.round(daily.temperature_2m_min[0]);
    
  } catch (error) {
    console.error("No se pudo cargar el clima", error);
    document.getElementById('weather-desc').textContent = "Error al cargar";
  }
}

export function initWeather() {
  fetchWeather();
  // Actualizar cada 15 minutos (900000 ms)
  setInterval(fetchWeather, 900000);
}
