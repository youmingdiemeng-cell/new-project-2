// scripts/core/main.js
// Game bootstrap and opening flow.

function showIntro() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div id="introOverlay" style="position:fixed;top:0;left:0;width:100%;height:100%;padding:20px 16px;background:#0a0a0a;z-index:1000;display:flex;align-items:center;justify-content:center;flex-direction:column;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;overflow-y:auto;">
      <div style="width:min(100%,360px);max-width:360px;padding:clamp(18px,4vw,32px);text-align:center;animation:fadeIn 2s ease;max-height:100%;margin:auto 0;">
        <p style="color:rgba(255,255,255,0.4);font-size:11px;letter-spacing:2px;margin-bottom:24px;">87.9 MHz</p>
        <p style="color:rgba(255,255,255,0.7);font-size:14px;line-height:2;margin-bottom:16px;">
          姐姐最近不太对劲。
        </p>
        <p style="color:rgba(255,255,255,0.5);font-size:13px;line-height:1.9;margin-bottom:10px;">
          她总是凌晨醒来，却不记得自己做了什么。<br>
          她的黑眼圈越来越重。<br>
          她开始说一些奇怪的话。
        </p>
        <p style="color:rgba(255,255,255,0.45);font-size:13px;line-height:1.9;margin-bottom:10px;">
          前天，她不见了。<br>
          只留下了这部手机。
        </p>
        <p style="color:rgba(255,255,255,0.4);font-size:13px;line-height:1.9;margin-bottom:32px;">
          手机里有她留下的线索。<br>
          她说，如果有一天她不在了。<br>
          打开手机，按她说的做。
        </p>
        <p style="color:rgba(255,255,255,0.25);font-size:12px;margin-bottom:20px;">
          现在是深夜 23:47。<br>
          你打开了姐姐的手机。
        </p>
        <p style="color:rgba(255,255,255,0.2);font-size:9px;margin-bottom:28px;line-height:1.8;">
          注意调节音量。<br>
          右上角按钮可控制背景音乐。
        </p>
        <button id="startGameBtn" onclick="startGame()"
          style="padding:12px 36px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.2);color:rgba(255,255,255,0.7);border-radius:24px;font-size:14px;cursor:pointer;transition:all 0.3s;letter-spacing:1px;"
          onmouseover="this.style.background='rgba(255,255,255,0.12)';this.style.color='#fff';"
          onmouseout="this.style.background='rgba(255,255,255,0.08)';this.style.color='rgba(255,255,255,0.7)';">
          开始游戏
        </button>
      </div>
    </div>
  `;
}

function startGame() {
  const overlay = document.getElementById('introOverlay');
  if (overlay) {
    overlay.style.transition = 'opacity 0.8s ease';
    overlay.style.opacity = '0';
    setTimeout(() => overlay.remove(), 800);
  }
  renderPhoneShell();

  if (typeof startGameTimer === 'function') {
    startGameTimer();
  }

  if (!_bgMusicAudio) {
    _bgMusicAudio = new Audio('assets/audio/bg-theme.mp3');
    _bgMusicAudio.loop = true;
    _bgMusicAudio.volume = 0.12;
    _bgMusicAudio.play().catch(() => {});
  }

  if (GameState.currentApp) {
    openApp(GameState.currentApp);
  }
  if (GameState.endingTriggered) {
    triggerEnding();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  GameState.load();
  showIntro();
  checkAutoPuzzles();
});
