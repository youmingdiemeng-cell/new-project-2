// scripts/core/runtime.js

// Shared runtime helpers used by multiple in-phone apps.

let _whiteNoiseAudio = null;
let _bgMusicAudio = null;
let _bgMusicMuted = false;

function toggleBgMusic() {
  _bgMusicMuted = !_bgMusicMuted;
  if (_bgMusicAudio) {
    _bgMusicAudio.volume = _bgMusicMuted ? 0 : 0.12;
  }
  return _bgMusicMuted;
}

function toggleBgMusicIcon() {
  const muted = toggleBgMusic();
  const el = document.getElementById('bgMusicToggle');
  if (el) el.textContent = muted ? '🔇' : '🎵';
}

/* ===== Game Timer ===== */
let _gameTimer = null;

function startGameTimer() {
  if (_gameTimer) return;
  updateStatusBarTime();
  let _acc = 0;
  _gameTimer = setInterval(() => {
    _acc += 1 / 60;
    if (_acc >= 1) {
      _acc -= 1;
      GameState.gameTimeElapsed = (GameState.gameTimeElapsed || 0) + 1;
      updateStatusBarTime();
      if (GameState.gameTimeElapsed % 15 === 0) GameState.save();
    }
  }, 1000);
}

function getGameTimeString() {
  const totalMinutes = 23 * 60 + 47 + (GameState.gameTimeElapsed || 0);
  const hours = Math.floor(totalMinutes / 60) % 24;
  const mins = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

function updateStatusBarTime() {
  const timeStr = getGameTimeString();
  const statusEl = document.querySelector('.status-time');
  if (statusEl) statusEl.textContent = timeStr;
  const homeEl = document.getElementById('homeTimeDisplay');
  if (homeEl) homeEl.textContent = '深夜 ' + timeStr;
}

function isMessageVisible(msg) {
  if (msg.endingRequired && !GameState._endingCompleted) return false;
  return msg.phase <= GameState.gamePhase;
}

function getAvatar(contactId) {
  const avatars = {
    unknown: '📡',
    bestie: '👩',
    mom: '👩‍🦱',
    mystery: '❌',
    colleague: '💼',
  };
  return avatars[contactId] || '📱';
}
