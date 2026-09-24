let currentDuration = 25 * 60;
let timeLeft = currentDuration;
let isRunning = false;
let timerId = null;

const timeDisplay = document.getElementById('pomodoro-time');
const toggleBtn = document.getElementById('pomodoro-toggle');
const resetBtn = document.getElementById('pomodoro-reset');
const setBtns = document.querySelectorAll('.pomodoro-set-btn');

function updateDisplay() {
  const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const s = (timeLeft % 60).toString().padStart(2, '0');
  timeDisplay.textContent = `${m}:${s}`;
}

function toggleTimer() {
  if (isRunning) {
    clearInterval(timerId);
    toggleBtn.textContent = '▶';
    isRunning = false;
  } else {
    timerId = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      } else {
        clearInterval(timerId);
        toggleBtn.textContent = '▶';
        isRunning = false;
        // Animación al terminar
        timeDisplay.classList.add('text-emerald-500', 'animate-pulse');
        setTimeout(() => timeDisplay.classList.remove('text-emerald-500', 'animate-pulse'), 5000);
      }
    }, 1000);
    toggleBtn.textContent = '⏸';
    isRunning = true;
  }
}

function resetTimer() {
  clearInterval(timerId);
  isRunning = false;
  timeLeft = currentDuration;
  toggleBtn.textContent = '▶';
  updateDisplay();
}

function setDuration(mins) {
  currentDuration = mins * 60;
  resetTimer();
}

export function initPomodoro() {
  toggleBtn.addEventListener('click', toggleTimer);
  resetBtn.addEventListener('click', resetTimer);
  
  setBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const mins = parseInt(e.target.dataset.mins);
      setDuration(mins);
    });
  });

  updateDisplay();
}
