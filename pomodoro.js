let currentDuration = 25 * 60;
let timeLeft = currentDuration;
let isRunning = false;
let timerId = null;
let audioCtx = null;

const timeDisplay = document.getElementById('pomodoro-time');
const toggleBtn = document.getElementById('pomodoro-toggle');
const resetBtn = document.getElementById('pomodoro-reset');
const setBtns = document.querySelectorAll('.pomodoro-set-btn');

function updateDisplay() {
  const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const s = (timeLeft % 60).toString().padStart(2, '0');
  timeDisplay.textContent = `${m}:${s}`;
}

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playAlarm() {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;

  function playNote(freq, startTime, duration) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.value = freq;
    
    // Envolvente suave
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.5, startTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  // Tono zen ascendente (A5 -> C#6 -> E6)
  playNote(880.00, now, 1.5);
  playNote(1108.73, now + 0.4, 2.0);
  playNote(1318.51, now + 0.8, 2.5);
}

function setPlayIcon() {
  toggleBtn.innerHTML = '<svg class="ml-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
}

function setPauseIcon() {
  toggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>';
}

function toggleTimer() {
  initAudio();
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
        
        playAlarm();
        
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
  initAudio();
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
      initAudio();
      const mins = parseInt(e.target.dataset.mins);
      setDuration(mins);
    });
  });

  updateDisplay();
}
