/* ===== Phone App ===== */
function renderPhoneApp() {
  document.getElementById('screenContent').innerHTML = `
    <div class="app-view">
      <div class="app-header">
        <button class="back-btn" onclick="goHome()">←</button>
        <span class="app-title">电话</span>
      </div>
      <div style="flex:1;display:flex;flex-direction:column;overflow:hidden;">
        <div class="phone-tabs" style="display:flex;border-bottom:1px solid rgba(255,255,255,0.06);flex-shrink:0;">
          <div class="phone-tab active" id="tabRecents" onclick="showPhoneTab('recents')" style="flex:1;padding:10px;text-align:center;font-size:12px;color:#007aff;border-bottom:2px solid #007aff;">最近通话</div>
          <div class="phone-tab" id="tabDialer" onclick="showPhoneTab('dialer')" style="flex:1;padding:10px;text-align:center;font-size:12px;color:rgba(255,255,255,0.4);border-bottom:2px solid transparent;">拨号</div>
        </div>
        <div id="phoneRecents" style="flex:1;overflow-y:auto;">
          ${renderCallLog()}
        </div>
        <div id="phoneDialer" style="display:none;flex:1;overflow-y:auto;">
          ${renderDialPad()}
        </div>
      </div>
    </div>
  `;
}

function showPhoneTab(tab) {
  const recents = document.getElementById('phoneRecents');
  const dialer = document.getElementById('phoneDialer');
  const tabRecents = document.getElementById('tabRecents');
  const tabDialer = document.getElementById('tabDialer');
  if (tab === 'recents') {
    recents.style.display = 'block';
    dialer.style.display = 'none';
    tabRecents.style.cssText = 'flex:1;padding:10px;text-align:center;font-size:12px;color:#007aff;border-bottom:2px solid #007aff;';
    tabDialer.style.cssText = 'flex:1;padding:10px;text-align:center;font-size:12px;color:rgba(255,255,255,0.4);border-bottom:2px solid transparent;';
  } else {
    recents.style.display = 'none';
    dialer.style.display = 'block';
    tabDialer.style.cssText = 'flex:1;padding:10px;text-align:center;font-size:12px;color:#007aff;border-bottom:2px solid #007aff;';
    tabRecents.style.cssText = 'flex:1;padding:10px;text-align:center;font-size:12px;color:rgba(255,255,255,0.4);border-bottom:2px solid transparent;';
  }
}

function renderCallLog() {
  let html = '';
  CALLLOG_DATA.forEach(c => {
    const isOut = c.type === '拨出';
    html += `<div class="call-item">
      <div class="call-icon" style="color:${isOut ? '#ff9500' : '#34c759'}">${isOut ? '📤' : '📥'}</div>
      <div class="call-info">
        <div class="call-contact">${c.contact}</div>
        <div class="call-meta">${c.date} ${c.time} · ${c.type} · ${c.duration}</div>
      </div>
    </div>`;
  });
  return html;
}

function renderDialPad() {
  return `
    <div style="padding:16px 16px 8px;">
      <div id="dialDisplay" style="background:rgba(255,255,255,0.05);border-radius:10px;padding:14px 16px;text-align:center;font-size:22px;font-family:monospace;color:#fff;letter-spacing:2px;min-height:28px;margin-bottom:16px;">&nbsp;</div>
      <div class="dialpad-grid">
        ${['1','2','3','4','5','6','7','8','9','*','0','#'].map(n => `
          <button class="dialpad-btn" onclick="dialPress('${n}')">${n}</button>
        `).join('')}
      </div>
      <div style="display:flex;gap:12px;margin-top:12px;">
        <button onclick="dialBackspace()" style="flex:1;padding:12px;border-radius:10px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);color:#fff;font-size:13px;cursor:pointer;">⌫</button>
        <button onclick="makeCall()" style="flex:2;padding:12px;border-radius:10px;border:none;background:#34c759;color:#fff;font-size:14px;font-weight:600;cursor:pointer;">📞 拨打</button>
      </div>
      <div id="dialError" style="color:#ff3b30;font-size:11px;text-align:center;margin-top:8px;min-height:16px;"></div>
    </div>
  `;
}

let _dialNumber = '';

function dialPress(digit) {
  _dialNumber += digit;
  document.getElementById('dialDisplay').textContent = _dialNumber;
  document.getElementById('dialError').textContent = '';
}

function dialBackspace() {
  _dialNumber = _dialNumber.slice(0, -1);
  document.getElementById('dialDisplay').textContent = _dialNumber || ' ';
}

function makeCall() {
  const num = _dialNumber.trim();
  if (!num) {
    document.getElementById('dialError').textContent = '请输入号码';
    return;
  }

  // Debug: dial to hard reset everything (including gamePhase)
  if (num === '20031123') {
    localStorage.removeItem('gameSave');
    location.reload();
    return;
  }

  // Hotline: ask for password before giving URL
  if (num === '4008792230') {
    showPasswordCallScreen(num);
  } else if (num === '110' || num === '119' || num === '120') {
    showCallScreen(num, '呼叫中……', ['您拨打的号码暂时无法接通。', '请稍后再试。']);
  } else {
    showCallScreen(num, '呼叫中……', ['（无人接听）']);
  }
  _dialNumber = '';
}

function showPasswordCallScreen(number) {
  document.getElementById('screenContent').innerHTML = `
    <div class="app-view">
      <div class="app-header">
        <button class="back-btn" onclick="renderPhoneApp()">←</button>
        <span class="app-title">通话中</span>
      </div>
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;padding:24px;text-align:center;">
        <div style="font-size:28px;font-weight:300;color:#fff;margin-bottom:8px;">${number}</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:16px;" id="callStatus">呼叫中...</div>
        <div id="callMessages" style="width:100%;flex:1;overflow-y:auto;display:flex;flex-direction:column;align-items:center;"></div>
        <div id="passwordArea" style="display:none;width:100%;max-width:240px;margin-bottom:8px;">
          <div style="display:flex;gap:8px;">
            <input type="text" id="passwordInput" placeholder="输入口令" style="flex:1;padding:10px 14px;border-radius:10px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);color:#fff;font-size:14px;outline:none;text-align:center;" onkeydown="if(event.key==='Enter')checkCallPassword()">
            <button onclick="checkCallPassword()" style="padding:10px 18px;border-radius:10px;border:none;background:#007aff;color:#fff;font-size:13px;cursor:pointer;">确认</button>
          </div>
          <div id="passwordError" style="color:#ff3b30;font-size:12px;margin-top:8px;min-height:18px;text-align:center;"></div>
        </div>
        <button onclick="renderPhoneApp()" style="padding:14px 40px;border-radius:28px;border:none;background:#ff3b30;color:#fff;font-size:14px;cursor:pointer;margin-top:16px;">结束通话</button>
      </div>
    </div>
  `;

  const lines = [
    '您好，这里是 87.9 听众服务中心。',
    '您的身份已验证。欢迎回来，R-879-14。',
    '请输入您的口令以继续。',
  ];

  let lineIndex = 0;
  const msgContainer = document.getElementById('callMessages');
  const statusEl = document.getElementById('callStatus');

  const interval = setInterval(() => {
    if (lineIndex < lines.length) {
      const p = document.createElement('p');
      p.style.cssText = 'color:rgba(255,255,255,0.8);font-size:13px;line-height:1.6;margin-bottom:8px;animation:fadeIn 0.5s ease;';
      p.textContent = lines[lineIndex];
      msgContainer.appendChild(p);
      msgContainer.scrollTop = msgContainer.scrollHeight;
      if (lineIndex === 1) {
        statusEl.textContent = '已接通';
      }
      lineIndex++;
    } else {
      clearInterval(interval);
      document.getElementById('passwordArea').style.display = 'block';
      const el = document.getElementById('passwordInput');
      if (el) el.focus();
    }
  }, 1500);
  window._callInterval = interval;
}

function checkCallPassword() {
  const input = document.getElementById('passwordInput');
  const err = document.getElementById('passwordError');
  const msg = document.getElementById('callMessages');
  const pwArea = document.getElementById('passwordArea');
  const pwd = input.value.trim();

  if (pwd === '服从电台') {
    err.textContent = '';
    if (!GameState.foundClues.includes('phone_call_made')) {
      GameState.foundClues.push('phone_call_made');
      GameState.save();
    }
    if (GameState.gamePhase < 2) {
      GameState.gamePhase = 2;
      GameState.save();
    }
    pwArea.style.display = 'none';

    const lines = [
      '✓ 口令正确。',
      '您的专属访问地址：',
      'radio879.com',
      '在网站上可查询听众信息、搜索相关资料。',
      '愿频率与你同在。再会。',
    ];

    let lineIndex = 0;
    const interval = setInterval(() => {
      if (lineIndex < lines.length) {
        const p = document.createElement('p');
        let style = 'color:rgba(255,255,255,0.8);font-size:13px;line-height:1.6;margin-bottom:8px;animation:fadeIn 0.5s ease;';
        if (lineIndex === 0) {
          style = 'color:#34c759;font-size:13px;line-height:1.6;margin-bottom:8px;animation:fadeIn 0.5s ease;';
        } else if (lineIndex === 2) {
          style = 'color:#ffcc00;font-size:16px;font-family:monospace;letter-spacing:2px;margin-bottom:8px;animation:fadeIn 0.5s ease;';
        }
        p.style.cssText = style;
        p.textContent = lines[lineIndex];
        msg.appendChild(p);
        msg.scrollTop = msg.scrollHeight;
        lineIndex++;
      } else {
        clearInterval(interval);
      }
    }, 1200);
  } else {
    err.textContent = '口令错误。请重试。';
    input.value = '';
    input.focus();
  }
}

function showCallScreen(number, status, lines) {
  let lineIndex = 0;
  document.getElementById('screenContent').innerHTML = `
    <div class="app-view">
      <div class="app-header">
        <button class="back-btn" onclick="renderPhoneApp()">←</button>
        <span class="app-title">通话中</span>
      </div>
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;padding:32px 24px;text-align:center;">
        <div style="font-size:28px;font-weight:300;color:#fff;margin-bottom:8px;">${number}</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:24px;" id="callStatus">${status}</div>
        <div style="flex:1;width:100%;overflow-y:auto;" id="callMessages"></div>
        <button onclick="renderPhoneApp()" style="padding:14px 40px;border-radius:28px;border:none;background:#ff3b30;color:#fff;font-size:14px;cursor:pointer;margin-top:16px;">结束通话</button>
      </div>
    </div>
  `;

  if (lines.length > 0) {
    const msgContainer = document.getElementById('callMessages');
    const statusEl = document.getElementById('callStatus');

    const interval = setInterval(() => {
      if (lineIndex < lines.length) {
        const p = document.createElement('p');
        p.style.cssText = 'color:rgba(255,255,255,0.8);font-size:13px;line-height:1.6;margin-bottom:8px;animation:fadeIn 0.5s ease;';
        p.textContent = lines[lineIndex];
        msgContainer.appendChild(p);
        msgContainer.scrollTop = msgContainer.scrollHeight;
        if (lineIndex === 0) {
          statusEl.textContent = '已接通';
        }
        lineIndex++;
      } else {
        clearInterval(interval);
        statusEl.textContent = '通话结束';
      }
    }, 1500);

    // Store interval for cleanup
    window._callInterval = interval;
  }
}
