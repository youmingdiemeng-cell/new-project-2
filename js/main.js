// js/main.js — app initialization

function showIntro() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div id="introOverlay" style="position:fixed;inset:0;background:#0a0a0a;z-index:1000;display:flex;align-items:center;justify-content:center;flex-direction:column;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;padding:16px;overflow-y:auto;">
      <div style="width:min(100%,360px);max-height:100%;padding:clamp(18px,5vw,32px) clamp(16px,5vw,32px);text-align:center;animation:fadeIn 2s ease;margin:auto;">
        <p style="color:rgba(255,255,255,0.4);font-size:clamp(10px,2.8vw,13px);letter-spacing:2px;margin-bottom:clamp(14px,4vw,24px);">87.9 MHz</p>
        <p style="color:rgba(255,255,255,0.7);font-size:clamp(12px,3.6vw,15px);line-height:1.85;margin-bottom:clamp(10px,3.5vw,16px);">
          姐姐最近不太对劲。
        </p>
        <p style="color:rgba(255,255,255,0.5);font-size:clamp(11px,3.3vw,14px);line-height:1.8;margin-bottom:10px;">
          她总是凌晨醒来，却不记得自己做了什么。<br>
          她的黑眼圈越来越重。<br>
          她开始说一些奇怪的话。
        </p>
        <p style="color:rgba(255,255,255,0.45);font-size:clamp(11px,3.3vw,14px);line-height:1.8;margin-bottom:10px;">
          前天，她不见了。<br>
          只留下了这部手机。
        </p>
        <p style="color:rgba(255,255,255,0.4);font-size:clamp(11px,3.3vw,14px);line-height:1.8;margin-bottom:clamp(20px,6vw,32px);">
          手机里有她留下的线索。<br>
          她说，如果有一天她不在了——<br>
          打开手机，按她说的做。
        </p>
        <p style="color:rgba(255,255,255,0.25);font-size:clamp(10px,3vw,13px);line-height:1.7;margin-bottom:clamp(20px,6vw,32px);">
          现在是深夜 23:47。<br>
          你打开了姐姐的手机。
        </p>
        <button id="startGameBtn" onclick="startGame()"
          style="padding:clamp(10px,3vw,12px) clamp(24px,8vw,36px);background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.2);color:rgba(255,255,255,0.7);border-radius:24px;font-size:clamp(12px,3.5vw,15px);cursor:pointer;transition:all 0.3s;letter-spacing:1px;"
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
