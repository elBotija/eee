// Coordenadas por defecto (Ramos Mejía)
let currentLat = -34.6406;
let currentLon = -58.5636;
let weatherInterval = null;
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
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${currentLat}&longitude=${currentLon}&current=temperature_2m,apparent_temperature,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=America%2FSao_Paulo`);
    
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

export function initWeather(config) {
  if (config) {
    currentLat = config.lat || -34.6406;
    currentLon = config.lon || -58.5636;
  }
  
  fetchWeather();
  
  // Limpiar intervalo anterior si existe
  if (weatherInterval) clearInterval(weatherInterval);
  
  // Actualizar cada 15 minutos (900000 ms)
  weatherInterval = setInterval(fetchWeather, 900000);

  const refreshBtn = document.getElementById('weather-refresh-btn');
  if (refreshBtn) {
    // Remover event listeners anteriores clonando el nodo para evitar múltiples listeners
    const newRefreshBtn = refreshBtn.cloneNode(true);
    refreshBtn.parentNode.replaceChild(newRefreshBtn, refreshBtn);
    
    newRefreshBtn.addEventListener('click', () => {
      const svg = newRefreshBtn.querySelector('svg');
      if (svg) svg.classList.add('animate-spin');
      
      fetchWeather().finally(() => {
        if (svg) setTimeout(() => svg.classList.remove('animate-spin'), 500);
      });
    });
  }
}
