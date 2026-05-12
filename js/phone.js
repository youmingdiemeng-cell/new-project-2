// js/phone.js — phone shell renderer, app navigation

const APPS = [
  { id: 'messages', label: '信息', icon: '💬', gradient: 'linear-gradient(135deg, #34c759, #28a745)' },
  { id: 'browser', label: '浏览器', icon: '🌐', gradient: 'linear-gradient(135deg, #007aff, #0056d6)' },
  { id: 'radio', label: '电台', icon: '📻', gradient: 'linear-gradient(135deg, #ff3b30, #c62828)' },
  { id: 'phone', label: '电话', icon: '📞', gradient: 'linear-gradient(135deg, #34c759, #1b8e3a)' },
  { id: 'gallery', label: '相册', icon: '🖼️', gradient: 'linear-gradient(135deg, #ff9500, #e65100)' },
  { id: 'notes', label: '备忘录', icon: '📝', gradient: 'linear-gradient(135deg, #ffcc00, #f9a825)' },
  { id: 'mail', label: '邮件', icon: '✉️', gradient: 'linear-gradient(135deg, #007aff, #0044aa)' },
];

const DOCK_APPS = ['messages', 'radio', 'browser', 'phone'];
const PHONE_BASE_WIDTH = 320;
const PHONE_BASE_HEIGHT = 680;

function applyPhoneViewportLayout() {
  const container = document.getElementById('phoneContainer');
  const frame = document.getElementById('phoneFrame');
  if (!container || !frame) return;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const safeGap = (vw <= 360 || vh <= 620) ? 8 : (vw <= 480 ? 12 : 24);
  const scale = Math.max(0.1, Math.min(
    (vw - safeGap) / PHONE_BASE_WIDTH,
    (vh - safeGap) / PHONE_BASE_HEIGHT
  ));

  container.style.position = 'fixed';
  container.style.left = '50%';
  container.style.top = '50%';
  container.style.width = `${PHONE_BASE_WIDTH}px`;
  container.style.height = `${PHONE_BASE_HEIGHT}px`;
  container.style.margin = '0';
  container.style.display = 'flex';
  container.style.justifyContent = 'center';
  container.style.alignItems = 'center';
  container.style.transform = `translate(-50%, -50%) scale(${scale})`;
  container.style.transformOrigin = 'center center';
  container.style.zIndex = '1';

  frame.style.position = 'relative';
  frame.style.top = '0';
  frame.style.left = '0';
  frame.style.width = `${PHONE_BASE_WIDTH}px`;
  frame.style.height = `${PHONE_BASE_HEIGHT}px`;
  frame.style.transform = 'none';
  frame.style.transformOrigin = 'center center';
}

function renderPhoneShell() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="phone-container" id="phoneContainer">
      <div class="phone-frame" id="phoneFrame">
        <div class="phone-notch"></div>
        <div class="phone-screen">
          <div class="status-bar">
            <div class="status-left">
              <span class="status-time">23:47</span>
            </div>
            <div class="status-right">
              <span>🌙</span>
            </div>
          </div>
          <div id="screenContent"></div>
        </div>
      </div>
    </div>
  `;
  applyPhoneViewportLayout();
  renderHomeScreen();
}

function renderHomeScreen() {
  GameState.currentApp = null;
  const screen = document.getElementById('screenContent');

  let appIconsHtml = '';
  APPS.forEach(a => {
    if (DOCK_APPS.includes(a.id)) return;
    appIconsHtml += `
      <div class="app-icon" onclick="openApp('${a.id}')">
        <div class="app-icon-inner" style="background: ${a.gradient}">${a.icon}</div>
        <span class="app-label">${a.label}</span>
      </div>
    `;
  });

  let dockHtml = '';
  DOCK_APPS.forEach(id => {
    const a = APPS.find(x => x.id === id);
    dockHtml += `
      <div class="app-icon" onclick="openApp('${a.id}')">
        <div class="app-icon-inner" style="background: ${a.gradient}">
          ${a.icon}
        </div>
        <span class="app-label">${a.label}</span>
      </div>
    `;
  });

  screen.innerHTML = `
    <div class="home-screen">
      <div class="home-header">
        <span class="home-header-text">姐姐的手机</span>
        <span style="color:rgba(255,255,255,0.3);font-size:11px;">深夜 23:47</span>
      </div>
      <div class="app-grid">
        ${appIconsHtml}
      </div>
      <div class="dock">
        ${dockHtml}
      </div>
      <div class="home-indicator"></div>
    </div>
  `;
}

function renderAppView(appId) {
  const renderers = {
    messages: typeof renderMessagesApp === 'function' ? renderMessagesApp : () => genericAppView('信息'),
    browser: typeof renderBrowserApp === 'function' ? renderBrowserApp : () => genericAppView('浏览器'),
    radio: typeof renderRadioApp === 'function' ? renderRadioApp : () => genericAppView('电台'),
    phone: typeof renderPhoneApp === 'function' ? renderPhoneApp : () => genericAppView('电话'),
    gallery: typeof renderGalleryApp === 'function' ? renderGalleryApp : () => genericAppView('相册'),
    notes: typeof renderNotesApp === 'function' ? renderNotesApp : () => genericAppView('备忘录'),
    mail: typeof renderMailApp === 'function' ? renderMailApp : () => genericAppView('邮件'),
  };
  const render = renderers[appId] || renderHomeScreen;
  render();
}

function genericAppView(title) {
  const screen = document.getElementById('screenContent');
  screen.innerHTML = `
    <div class="app-view">
      <div class="app-header">
        <button class="back-btn" onclick="goHome()">←</button>
        <span class="app-title">${title}</span>
      </div>
      <div class="app-content">
        <p style="color: rgba(255,255,255,0.4); text-align: center; margin-top: 40px;">
          即将到来...
        </p>
      </div>
    </div>
  `;
}

function openApp(appId) {
  GameState.currentApp = appId;
  GameState.save();
  renderAppView(appId);
}

function goHome() {
  renderHomeScreen();
  GameState.save();
}

window.addEventListener('resize', applyPhoneViewportLayout);
