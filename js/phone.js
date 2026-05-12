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
const DEVICE_MOBILE_CLASS = 'device-mobile';
const DEVICE_DESKTOP_CLASS = 'device-desktop';
const FLOATING_KEYBOARD_MARGIN = 12;

let activeMobileInput = null;
let activeMobileInputStyle = '';
let keyboardHandlingBound = false;
let baseMobileViewportHeight = 0;

function isMobileGameDevice() {
  const ua = navigator.userAgent || '';
  const platform = navigator.platform || '';
  const uaDataMobile = !!(navigator.userAgentData && navigator.userAgentData.mobile);
  const mobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet|Silk|Kindle|PlayBook/i.test(ua);
  const iPadDesktopUA = platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  const coarseTouchOnly = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches && !window.matchMedia('(hover: hover)').matches);
  return uaDataMobile || mobileUA || iPadDesktopUA || coarseTouchOnly;
}

function syncDeviceShellMode() {
  const isMobile = isMobileGameDevice();
  document.body.classList.toggle(DEVICE_MOBILE_CLASS, isMobile);
  document.body.classList.toggle(DEVICE_DESKTOP_CLASS, !isMobile);
  return isMobile;
}

function getVirtualKeyboardHeight() {
  if (!window.visualViewport) return 0;
  return Math.max(0, window.innerHeight - window.visualViewport.height - window.visualViewport.offsetTop);
}

function applyPhoneViewportLayout() {
  const container = document.getElementById('phoneContainer');
  const frame = document.getElementById('phoneFrame');
  if (!container || !frame) return;

  const isMobile = syncDeviceShellMode();
  const viewportHeight = window.innerHeight;
  const keyboardHeight = getVirtualKeyboardHeight();

  container.style.zIndex = '1';
  container.style.margin = '0';
  container.style.display = 'block';

  if (isMobile) {
    if (!baseMobileViewportHeight || keyboardHeight <= 120) {
      baseMobileViewportHeight = viewportHeight;
    }

    container.style.position = 'fixed';
    container.style.left = '0';
    container.style.top = '0';
    container.style.width = '100vw';
    container.style.height = `${baseMobileViewportHeight}px`;
    container.style.transform = 'none';
    container.style.transformOrigin = 'top left';

    frame.style.position = 'relative';
    frame.style.top = '0';
    frame.style.left = '0';
    frame.style.width = '100%';
    frame.style.height = '100%';
    frame.style.transform = 'none';
    frame.style.transformOrigin = 'top left';
  } else {
    const shellWidth = Math.round((viewportHeight * PHONE_BASE_WIDTH) / PHONE_BASE_HEIGHT);

    container.style.position = 'fixed';
    container.style.left = '50%';
    container.style.top = '0';
    container.style.width = `${shellWidth}px`;
    container.style.height = `${viewportHeight}px`;
    container.style.transform = 'translateX(-50%)';
    container.style.transformOrigin = 'top center';

    frame.style.position = 'relative';
    frame.style.top = '0';
    frame.style.left = '0';
    frame.style.width = '100%';
    frame.style.height = '100%';
    frame.style.transform = 'none';
    frame.style.transformOrigin = 'top center';
  }

  updateMobileKeyboardAnchor();
}

function isKeyboardEligibleField(element) {
  if (!element || !(element instanceof HTMLElement)) return false;
  return element.matches('input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]):not([type="range"]):not([type="color"]):not([type="file"]), textarea, select');
}

function clearMobileInputAnchor(preserveActiveField) {
  if (!activeMobileInput) return;

  activeMobileInput.style.cssText = activeMobileInputStyle;
  activeMobileInput.classList.remove('keyboard-floating-field');
  if (!preserveActiveField) {
    activeMobileInput = null;
    activeMobileInputStyle = '';
  }
}

function updateMobileKeyboardAnchor() {
  if (!isMobileGameDevice() || !activeMobileInput || !window.visualViewport) return;

  const viewport = window.visualViewport;
  const keyboardHeight = getVirtualKeyboardHeight();
  const keyboardVisible = keyboardHeight > 120;
  if (!keyboardVisible) {
    clearMobileInputAnchor(true);
    return;
  }

  const rect = activeMobileInput.getBoundingClientRect();
  const width = Math.min(Math.max(rect.width, 220), window.innerWidth - (FLOATING_KEYBOARD_MARGIN * 2));
  const left = Math.min(
    Math.max(FLOATING_KEYBOARD_MARGIN, rect.left),
    window.innerWidth - width - FLOATING_KEYBOARD_MARGIN
  );

  activeMobileInput.classList.add('keyboard-floating-field');
  activeMobileInput.style.position = 'fixed';
  activeMobileInput.style.left = `${left}px`;
  activeMobileInput.style.right = 'auto';
  activeMobileInput.style.bottom = `${keyboardHeight + FLOATING_KEYBOARD_MARGIN}px`;
  activeMobileInput.style.top = 'auto';
  activeMobileInput.style.width = `${width}px`;
  activeMobileInput.style.maxWidth = `calc(100vw - ${FLOATING_KEYBOARD_MARGIN * 2}px)`;
  activeMobileInput.style.margin = '0';
  activeMobileInput.style.zIndex = '3000';
  activeMobileInput.style.transform = 'none';
}

function bindMobileKeyboardHandling() {
  if (keyboardHandlingBound) return;
  keyboardHandlingBound = true;

  document.addEventListener('focusin', (event) => {
    if (!isMobileGameDevice() || !isKeyboardEligibleField(event.target)) return;

    clearMobileInputAnchor(false);
    activeMobileInput = event.target;
    activeMobileInputStyle = activeMobileInput.style.cssText;

    window.setTimeout(() => {
      updateMobileKeyboardAnchor();
    }, 80);
  }, true);

  document.addEventListener('focusout', (event) => {
    if (!activeMobileInput || event.target !== activeMobileInput) return;
    window.setTimeout(() => {
      clearMobileInputAnchor(false);
    }, 120);
  }, true);

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', updateMobileKeyboardAnchor);
    window.visualViewport.addEventListener('scroll', updateMobileKeyboardAnchor);
  }

  window.addEventListener('orientationchange', () => {
    window.setTimeout(() => {
      baseMobileViewportHeight = 0;
      applyPhoneViewportLayout();
    }, 120);
  });
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
  bindMobileKeyboardHandling();
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
