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

function setPlayIcon() {
  toggleBtn.innerHTML = '<svg class="ml-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
}

function setPauseIcon() {
  toggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>';
}

function toggleTimer() {
  if (isRunning) {
    clearInterval(timerId);
    setPlayIcon();
    isRunning = false;
  } else {
    timerId = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      } else {
        clearInterval(timerId);
        setPlayIcon();
        isRunning = false;
        // Animación al terminar
        timeDisplay.classList.add('text-emerald-500', 'animate-pulse');
        setTimeout(() => timeDisplay.classList.remove('text-emerald-500', 'animate-pulse'), 5000);
      }
    }, 1000);
    setPauseIcon();
    isRunning = true;
  }
}

function resetTimer() {
  clearInterval(timerId);
  isRunning = false;
  timeLeft = currentDuration;
  setPlayIcon();
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
