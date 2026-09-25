import 'whatwg-fetch'
import './style.css'
import { initWeather } from './weather.js'
import { initPomodoro } from './pomodoro.js'
import { initTasks } from './sheets.js'
import { initSpotify } from './spotify.js'

function updateClock() {
  const now = new Date();
  
  // Reloj
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('clock').textContent = `${hours}:${minutes}`;

  // Fecha
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  let dateString = now.toLocaleDateString('es-AR', options);
  // Capitalize first letter
  dateString = dateString.charAt(0).toUpperCase() + dateString.slice(1);
  document.getElementById('date').textContent = dateString;
}

// Iniciar módulos
updateClock();
setInterval(updateClock, 1000);
initWeather();
initPomodoro();

// --- Configuración (Settings Modal) ---
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const settingsForm = document.getElementById('settingsForm');

const sheetIdInput = document.getElementById('sheetIdInput');
const spotifyIdInput = document.getElementById('spotifyIdInput');

// Cargar configuración guardada al inicio
function loadSettings() {
  const config = JSON.parse(localStorage.getItem('ipdaViewerConfig') || '{}');
  sheetIdInput.value = config.sheetId || '';
  spotifyIdInput.value = config.spotifyId || '';
  document.getElementById('spotifyRefreshInput').value = localStorage.getItem('spotify_refresh_token') || '';
  return config;
}

// Inicializamos la app leyendo la config
let currentConfig = loadSettings();
initTasks(currentConfig);
initSpotify(currentConfig);

// Eventos del Modal
settingsBtn.addEventListener('click', () => {
  loadSettings(); // Recargar valores visualmente
  settingsModal.classList.remove('hidden');
  settingsModal.classList.add('flex');
});

closeSettingsBtn.addEventListener('click', () => {
  settingsModal.classList.add('hidden');
  settingsModal.classList.remove('flex');
});

settingsForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const newConfig = {
    sheetId: sheetIdInput.value.trim(),
    spotifyId: spotifyIdInput.value.trim()
  };
  
  const manualRefreshToken = document.getElementById('spotifyRefreshInput').value.trim();
  if (manualRefreshToken) {
    localStorage.setItem('spotify_refresh_token', manualRefreshToken);
  }
  
  localStorage.setItem('ipdaViewerConfig', JSON.stringify(newConfig));
  currentConfig = newConfig;
  
  settingsModal.classList.add('hidden');
  settingsModal.classList.remove('flex');
  
  // Recargar los módulos que dependen de la config
  initTasks(currentConfig);
  initSpotify(currentConfig);
});

// --- Screensaver ---
const screensaver = document.getElementById('screensaver');
let inactivityTimer;
const SCREENSAVER_DELAY = 60000; // 1 minuto en milisegundos

function resetInactivity() {
  if (!screensaver.classList.contains('opacity-0')) {
    // Si estaba negro, lo ocultamos y evitamos que este tap registre clicks en la UI debajo
    screensaver.classList.add('opacity-0');
    screensaver.classList.add('pointer-events-none');
  }
  
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    screensaver.classList.remove('opacity-0');
    screensaver.classList.remove('pointer-events-none');
  }, SCREENSAVER_DELAY);
}

// Escuchar interacciones en todo el documento para resetear el reloj de inactividad
['touchstart', 'mousemove', 'click', 'keydown'].forEach(evt => {
  document.addEventListener(evt, resetInactivity, { passive: true });
});

resetInactivity();
