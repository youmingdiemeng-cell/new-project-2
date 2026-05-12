// js/apps.js — all app renderers

function isMessageVisible(msg) {
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

/* ===== Messages App ===== */
function renderMessagesApp() {
  const contacts = MESSAGE_DATA.contacts.filter(c =>
    c.messages.some(m => isMessageVisible(m))
  );
  let html = `
    <div class="app-view">
      <div class="app-header">
        <button class="back-btn" onclick="goHome()">←</button>
        <span class="app-title">信息</span>
      </div>
      <div class="chat-list">
  `;
  contacts.forEach(c => {
    const visibleMsgs = c.messages.filter(m => isMessageVisible(m));
    const lastMsg = visibleMsgs[visibleMsgs.length - 1];
    const unread = visibleMsgs.filter(m => m.from !== 'me').length;
    html += `
      <div class="chat-item" onclick="openChat('${c.id}')">
        <div class="chat-avatar" style="background: rgba(255,255,255,0.06)">${getAvatar(c.id)}</div>
        <div class="chat-info">
          <div class="chat-name">${c.name}</div>
          <div class="chat-preview">${lastMsg ? lastMsg.text : ''}</div>
        </div>
        ${unread > 0 ? `<span class="unread-badge">${unread}</span>` : ''}
      </div>
    `;
  });
  html += `</div></div>`;
  document.getElementById('screenContent').innerHTML = html;
}

function openChat(contactId) {
  const contact = MESSAGE_DATA.contacts.find(c => c.id === contactId);
  if (!contact) return;
  const visibleMsgs = contact.messages.filter(m => isMessageVisible(m));

  let bubblesHtml = '';
  visibleMsgs.forEach(m => {
    const isSent = m.from === 'me';
    const timeStr = '';
    bubblesHtml += `
      <div class="message-bubble ${isSent ? 'sent' : 'received'}">
        ${m.text}
      </div>
    `;
  });

  const showReplies = contactId === 'mystery' && GameState.foundClues.includes('radio_87.9_heard');
  const showInput = contactId === 'unknown' && GameState.foundClues.includes('radio_87.9_heard');
  let replyHtml = '';
  if (showReplies) {
    replyHtml = `
      <div class="chat-reply-bar">
        <button class="reply-option" onclick="sendReply('${contactId}', '听了')">听了</button>
        <button class="reply-option" onclick="sendReply('${contactId}', '你是谁')">你是谁</button>
        <button class="reply-option" onclick="sendReply('${contactId}', '我不知道你在说什么')">我不知道你在说什么</button>
      </div>
    `;
  } else if (showInput) {
    replyHtml = `
      <div class="chat-reply-bar" style="flex-wrap:nowrap;gap:6px;">
        <input type="text" id="chatInput" placeholder="对方在等你说出那句话…" style="flex:1;padding:10px 12px;border-radius:18px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.06);color:#fff;font-size:13px;outline:none;" onkeydown="if(event.key==='Enter')sendChatMessage()">
        <button onclick="sendChatMessage()" style="padding:10px 16px;border-radius:18px;border:none;background:#007aff;color:#fff;font-size:12px;cursor:pointer;">发送</button>
      </div>
    `;
  }

  document.getElementById('screenContent').innerHTML = `
    <div class="app-view">
      <div class="app-header">
        <button class="back-btn" onclick="renderMessagesApp()">←</button>
        <span class="app-title">${contact.name}</span>
      </div>
      <div class="chat-view">
        <div class="chat-messages">
          ${bubblesHtml}
        </div>
        ${replyHtml}
      </div>
    </div>
  `;

  const msgsDiv = document.querySelector('.chat-messages');
  if (msgsDiv) msgsDiv.scrollTop = msgsDiv.scrollHeight;
}

function sendReply(contactId, text) {
  const msgsDiv = document.querySelector('.chat-messages');
  msgsDiv.innerHTML += `
    <div class="message-bubble sent">
      ${text}
    </div>
  `;
  msgsDiv.scrollTop = msgsDiv.scrollHeight;
  GameState.foundClues.push('replied_to_' + contactId);
  GameState.save();
}

function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;

  const msgsDiv = document.querySelector('.chat-messages');
  msgsDiv.innerHTML += `
    <div class="message-bubble sent">
      ${text}
    </div>
  `;
  msgsDiv.scrollTop = msgsDiv.scrollHeight;
  input.value = '';

  // Auto-reply logic
  setTimeout(() => {
    let reply = '……？';
    if (text === '成为听众') {
      reply = '欢迎你。你存在我这的密码是：NIGHT';
      if (!GameState.foundClues.includes('code_night')) {
        GameState.foundClues.push('code_night');
        GameState.save();
      }
    }
    msgsDiv.innerHTML += `
      <div class="message-bubble received">
        ${reply}
      </div>
    `;
    msgsDiv.scrollTop = msgsDiv.scrollHeight;
  }, 1200);
}

/* ===== Radio App ===== */
function renderRadioApp() {
  const freq = RADIO_DATA.currentFrequency || 87.0;
  const isSpecial = Math.abs(freq - 87.9) < 0.06;
  const isNear = !isSpecial && Math.abs(freq - 87.9) < 0.6;
  const isNear93 = !isSpecial && !isNear && Math.abs(freq - 93.5) < 0.06;
  const showFineTune = GameState.fineTuneUnlocked;
  const fineMode = showFineTune && (RADIO_DATA._fineMode || false);

  let contentHtml = '';
  if (isSpecial) {
    const isExact = Math.abs(freq - 87.9) < 0.01;
    const texts = RADIO_DATA.content
      .filter(t => t.phase <= GameState.gamePhase)
      .filter(t => isExact || t.id !== 'r4') // coordinates only at exact 87.90
      .map(t => t.text);
    if (texts.length > 0) {
      contentHtml = `<div class="radio-text">${texts.join('\n\n')}</div>`;
    } else {
      contentHtml = `<div class="radio-static">--- 静电噪音 ---</div>`;
    }
  } else if (isNear && !fineMode) {
    contentHtml = `<div class="radio-static">--- 兹……${freq.toFixed(1)}……兹……有东西在附近……---</div>`;
  } else if (isNear93 && !showFineTune) {
    contentHtml = `<div class="radio-static">--- 静电噪音 ---</div>`;
  } else {
    contentHtml = `<div class="radio-static">--- 静电噪音 ---</div>`;
  }

  // Track first time reaching 87.9
  if (isSpecial && !GameState.foundClues.includes('radio_87.9_heard')) {
    GameState.foundClues.push('radio_87.9_heard');
    GameState.save();
  }

  let historyHtml = '';
  RADIO_DATA.listeningHistory.forEach(h => {
    historyHtml += `<div class="history-item">${h.date} ${h.time} — ${h.freq} MHz</div>`;
  });

  document.getElementById('screenContent').innerHTML = `
    <div class="app-view">
      <div class="app-header">
        <button class="back-btn" onclick="goHome()">←</button>
        <span class="app-title">电台</span>
      </div>
      <div class="radio-view">
        <div class="radio-display">
          <div class="radio-frequency${fineMode ? ' fine-mode' : ''}"${showFineTune ? ' ondblclick="toggleFineMode()"' : ''}>${fineMode ? freq.toFixed(2) : freq.toFixed(1)}</div>
          <div class="radio-band">MHz${fineMode ? ' <span style="color:#ffcc00;font-size:10px;">微调</span>' : ''}</div>
        </div>
        <div class="radio-controls">
          <button class="radio-btn" onclick="tuneRadio(${fineMode ? -0.05 : -0.5})">−</button>
          ${showFineTune ? `<button class="radio-btn fine-toggle${fineMode ? ' active' : ''}" onclick="toggleFineMode()" style="font-size:10px;width:auto;padding:0 10px;">微调</button>` : ''}
          <button class="radio-btn" onclick="tuneRadio(${fineMode ? 0.05 : 0.5})">+</button>
        </div>
        <div class="now-playing">📻 正在播放...</div>
        <div class="radio-content">
          ${contentHtml}
        </div>
        <div class="radio-history">
          <div class="radio-history-title">最近收听</div>
          ${historyHtml}
        </div>
      </div>
    </div>
  `;

  // Attach dblclick listener for fine-tune unlock at 93.5
  if (isNear93 && !GameState.fineTuneUnlocked) {
    const freqEl = document.querySelector('.radio-frequency');
    if (freqEl) {
      freqEl.style.cursor = 'pointer';
      freqEl.ondblclick = function() {
        if (!GameState.fineTuneUnlocked) unlockFineTune();
      };
    }
  }
}

function tuneRadio(delta) {
  let newFreq = parseFloat((RADIO_DATA.currentFrequency + delta).toFixed(2));
  newFreq = Math.max(RADIO_DATA.minFreq, Math.min(RADIO_DATA.maxFreq, newFreq));
  RADIO_DATA.currentFrequency = newFreq;
  renderRadioApp();
}

function toggleFineMode() {
  RADIO_DATA._fineMode = !RADIO_DATA._fineMode;
  renderRadioApp();
}

function unlockFineTune() {
  if (GameState.fineTuneUnlocked) return;
  GameState.fineTuneUnlocked = true;
  GameState.foundClues.push('fine_tune_clue');
  GameState.save();
  renderRadioApp();
}

/* ===== Browser App ===== */
function renderBrowserApp() {
  const urlValue = GameState._lastUrl || '';
  document.getElementById('screenContent').innerHTML = `
    <div class="app-view">
      <div class="app-header">
        <button class="back-btn" onclick="goHome()">←</button>
        <span class="app-title">浏览器</span>
      </div>
      <div class="browser-view">
        <div class="browser-url-bar" style="display:flex;gap:6px;padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.06);flex-shrink:0;">
          <input type="text" id="urlInput" value="${urlValue}" placeholder="输入网址…" style="flex:1;padding:8px 10px;border-radius:8px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.06);color:#fff;font-size:12px;font-family:monospace;outline:none;" onkeydown="if(event.key==='Enter')navigateToUrl()">
          <button onclick="navigateToUrl()" style="padding:8px 14px;border-radius:8px;border:none;background:#007aff;color:#fff;font-size:12px;cursor:pointer;">前往</button>
        </div>
        <div class="browser-tabs">
          <div class="browser-tab active" onclick="showBrowserTab('history')">历史记录</div>
          <div class="browser-tab" onclick="showBrowserTab('bookmarks')">书签</div>
        </div>
        <div id="browserContent" class="browser-list">
          ${renderBrowserHistory()}
        </div>
      </div>
    </div>
  `;
}

function showBrowserTab(tab) {
  const tabs = document.querySelectorAll('.browser-tab');
  tabs.forEach((t, i) => t.classList.toggle('active', (i === 0 && tab === 'history') || (i === 1 && tab === 'bookmarks')));
  document.getElementById('browserContent').innerHTML = tab === 'history' ? renderBrowserHistory() : renderBrowserBookmarks();
}

function renderBrowserHistory() {
  let html = '';
  BROWSER_DATA.searchHistory.forEach(h => {
    html += `
      <div class="browser-item" onclick="searchWeb('${h.query}')">
        <div class="browser-item-query">${h.query}</div>
        <div class="browser-item-meta">${h.date} ${h.time}</div>
      </div>
    `;
  });
  return html || '<p style="color: rgba(255,255,255,0.3); padding: 20px; text-align: center;">无历史记录</p>';
}

function renderBrowserBookmarks() {
  let html = '';

  // Always have forum and hypno
  html += `
    <div class="browser-bookmark" onclick="openBrowserPage('forum')">
      <div class="bookmark-icon">🔖</div>
      <div>
        <div class="bookmark-title">深夜电台论坛 - 讨论区</div>
        <div class="bookmark-url">bbs.radio879.com</div>
      </div>
    </div>
    <div class="browser-bookmark" onclick="openBrowserPage('hypno')">
      <div class="bookmark-icon">🔖</div>
      <div>
        <div class="bookmark-title">催眠引导 · 睡前放松</div>
        <div class="bookmark-url">hypno-guide.net</div>
      </div>
    </div>
  `;

  return html || '<p style="color: rgba(255,255,255,0.3); padding: 20px; text-align: center;">无书签</p>';
}

/* URL Navigation */
function navigateToUrl() {
  const input = document.getElementById('urlInput');
  let url = input.value.trim().toLowerCase();
  if (!url) return;

  GameState._lastUrl = url;
  GameState.save();

  // Normalize URL
  if (url.startsWith('http://')) url = url.slice(7);
  if (url.startsWith('https://')) url = url.slice(8);
  if (url.endsWith('/')) url = url.slice(0, -1);

  // Route URLs
  if (url === 'radio879.com' || url === 'www.radio879.com') {
    openRadioPage('home');
  } else if (url === 'radio879.com/search' || url === 'radio879.com/search/') {
    renderWebsiteSearch();
  } else if (url === 'radio879.com/listeners' || url === 'radio879.com/listeners/') {
    openRadioPage('listeners');
  } else if (url === 'radio879.com/member' || url === 'radio879.com/member/') {
    renderMemberLogin();
  } else if (url === 'radio879.com/admin' || url === 'radio879.com/admin/') {
    renderMemberLogin();
  } else if (url === 'radio879.com/internal/14') {
    if (GameState.memberLoggedIn) {
      openRadioPage('internal14');
    } else {
      renderRadioSite('访问被拒绝', 'radio879.com/internal/14', '⚠️ 需要会员权限。\n\n请先登录会员系统。');
    }
  } else if (url.includes('bbs.radio879.com')) {
    openBrowserPage('forum');
  } else if (url.includes('hypno-guide.net')) {
    openBrowserPage('hypno');
  } else if (url.includes('radio879.com')) {
    showPageNotFound(url);
  } else {
    showPageNotFound(url);
  }
}

function showPageNotFound(url) {
  renderRadioSite('无法访问', url, '⚠️ 无法访问此页面\n\n请检查网址是否正确。\n\n—— Radio 87.9 听众服务中心');
}

function openBrowserPage(pageId) {
  const page = BROWSER_DATA.pages[pageId];
  if (!page) return;

  // Forum page reveals fine-tuning method — no auto-unlock, player must discover it at 93.5

  document.getElementById('screenContent').innerHTML = `
    <div class="app-view">
      <div class="app-header">
        <button class="back-btn" onclick="renderBrowserApp()">←</button>
        <span class="app-title">网页</span>
      </div>
      <div class="webpage-view">
        <div class="webpage-bar">
          <span style="color:rgba(255,255,255,0.3);font-size:11px;">🔒</span>
          <div class="webpage-url">${page.url || page.title}</div>
        </div>
        <div class="webpage-title">${page.title}</div>
        <div class="webpage-body">${page.content}</div>
      </div>
    </div>
  `;
}

/* Radio 879 website pages */
function openRadioPage(section) {
  const baseUrl = 'radio879.com';

  if (section === 'home') {
    const page = BROWSER_DATA.pages.radioHome;
    renderRadioSite(page.title, baseUrl, page.content);
  } else if (section === 'listeners') {
    if (GameState.memberLoggedIn) {
      const tableContent = `
        <div style="background:rgba(255,255,255,0.03);border-radius:8px;overflow:hidden;">
          <div style="display:grid;grid-template-columns:90px 1fr 60px;padding:10px 12px;font-size:10px;color:rgba(255,255,255,0.4);border-bottom:1px solid rgba(255,255,255,0.06);text-transform:uppercase;letter-spacing:1px;">
            <span>编号</span><span>姓名</span><span>阶段</span>
          </div>
          ${[
            ['R-879-01 ★','—','管理员'],
            ['R-879-02','李明远','三/服从'],
            ['R-879-03','王建国','三/离线'],
            ['R-879-04','张素芳','三/服从'],
            ['R-879-05','陈志强','三/服从'],
            ['R-879-06','刘美玲','三/服从'],
            ['R-879-07','赵伟','三/服从'],
            ['R-879-08','孙丽华','三/服从'],
            ['R-879-09','周杰','三/服从'],
            ['R-879-10','吴秀英','三/服从'],
            ['R-879-11','郑建国','二/进行'],
            ['R-879-12','黄芳','二/进行'],
            ['R-879-13','林志明','二/进行'],
            ['R-879-14','林小敏','三/94%'],
            ['R-879-15','—','接触中'],
          ].map(row => `
            <div style="display:grid;grid-template-columns:90px 1fr 60px;padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.03);font-size:12px;color:rgba(255,255,255,0.8);${row[0].includes('01') ? 'background:rgba(255,204,0,0.05);' : ''}${row[0].includes('14') ? 'color:#ffcc00;' : ''}">
              <span style="${row[0].includes('01') ? 'color:#ffcc00;' : ''}">${row[0]}</span>
              <span>${row[1]}</span>
              <span style="font-size:10px;color:rgba(255,255,255,0.5);">${row[2]}</span>
            </div>
          `).join('')}
          <div style="padding:10px 12px;font-size:10px;color:rgba(255,255,255,0.3);text-align:center;">总注册：47 人 · 显示前 15 条</div>
        </div>
        <div style="margin-top:12px;">
          <a href="#" onclick="event.preventDefault();navigateToSite('search')">🔍 资料搜索</a>
        </div>`;
      renderRadioSite('Radio 87.9 — 听众墙', baseUrl + '/listeners', tableContent, "navigateToSite('member')");
    } else {
      const page = BROWSER_DATA.pages.radioListeners;
      renderRadioSite(page.title, baseUrl + '/listeners', `${page.content}\n\n<a href="#" onclick="event.preventDefault();navigateToSite('member')">🔐 登录会员查看详细信息</a>`, "navigateToSite('member')");
    }
  } else if (section === 'admin') {
    renderMemberLogin();
  } else if (section === 'internal14') {
    const page = BROWSER_DATA.pages.radioInternal14;
    renderRadioSite(page.title, baseUrl + '/internal/14', page.content, "navigateToSite('member')");
  }
}

function navigateToSite(section) {
  const paths = {
    home: 'radio879.com',
    listeners: 'radio879.com/listeners',
    search: 'radio879.com/search',
    member: 'radio879.com/member',
    admin: 'radio879.com/member',
    internal14: 'radio879.com/internal/14',
  };
  GameState._lastUrl = paths[section] || 'radio879.com';
  GameState.save();
  if (section === 'home') openRadioPage('home');
  else if (section === 'listeners') openRadioPage('listeners');
  else if (section === 'search') renderWebsiteSearch();
  else if (section === 'member') renderMemberLogin();
  else if (section === 'admin') renderMemberLogin();
  else if (section === 'internal14') openRadioPage('internal14');
  else openRadioPage('home');
}

function getRadioAuthAction(section) {
  if (!GameState.memberLoggedIn) return '';

  const targetSection = section || 'home';
  return `<button onclick="logoutMember('${targetSection}')" style="margin-left:auto;padding:4px 8px;border-radius:999px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.72);font-size:10px;cursor:pointer;">退出登录</button>`;
}

function logoutMember(section) {
  GameState.memberLoggedIn = false;
  GameState.memberAccount = null;
  GameState.save();

  if (section === 'member') {
    renderMemberLogin(true);
  } else if (section === 'search') {
    renderWebsiteSearch();
  } else if (section === 'listeners') {
    openRadioPage('listeners');
  } else {
    openRadioPage('home');
  }
}

function renderRadioSite(title, url, content, backFn) {
  const backCall = backFn || 'renderBrowserApp()';
  let authSection = 'home';
  if (url.includes('/listeners')) authSection = 'listeners';
  else if (url.includes('/member')) authSection = 'member';
  else if (url.includes('/search')) authSection = 'search';
  document.getElementById('screenContent').innerHTML = `
    <div class="app-view">
      <div class="app-header">
        <button class="back-btn" onclick="${backCall}">←</button>
        <span class="app-title">Radio 87.9</span>
      </div>
      <div class="webpage-view">
        <div class="webpage-bar">
          <span style="color:rgba(255,255,255,0.3);font-size:11px;">🔒</span>
          <div class="webpage-url">${url}</div>
        </div>
        <div class="webpage-title" style="font-size:14px;">${title}</div>
        <div class="webpage-body">${content}</div>
      </div>
    </div>
  `;
}

function renderAdminLogin() {
  document.getElementById('screenContent').innerHTML = `
    <div class="app-view">
      <div class="app-header">
        <button class="back-btn" onclick="renderBrowserApp()">←</button>
        <span class="app-title">管理后台</span>
      </div>
      <div class="webpage-view">
        <div class="webpage-bar">
          <span style="color:rgba(255,255,255,0.3);font-size:11px;">🔒</span>
          <div class="webpage-url">radio879.com/admin</div>
        </div>
        <div style="padding:24px 16px;">
          <p style="color:rgba(255,255,255,0.6);font-size:13px;margin-bottom:20px;">管理员登录</p>
          <input type="text" id="adminUser" placeholder="用户名" style="display:block;width:100%;padding:10px 14px;margin-bottom:12px;border-radius:10px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);color:#fff;font-size:14px;outline:none;">
          <input type="text" id="adminPass" placeholder="密码" style="display:block;width:100%;padding:10px 14px;margin-bottom:16px;border-radius:10px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);color:#fff;font-size:14px;outline:none;" onkeydown="if(event.key==='Enter')checkAdminLogin()">
          <button onclick="checkAdminLogin()" style="width:100%;padding:10px;border-radius:10px;border:none;background:#007aff;color:#fff;font-size:14px;cursor:pointer;">登录</button>
          <div style="margin-top:14px;padding:10px;background:rgba(255,255,255,0.03);border-radius:8px;font-size:11px;color:rgba(255,255,255,0.35);line-height:1.6;">
            💡 密码提示：带你来到这里的人
          </div>
          <div id="adminError" style="color:#ff3b30;font-size:12px;margin-top:10px;text-align:center;"></div>
        </div>
      </div>
    </div>
  `;
}

function checkAdminLogin() {
  const user = document.getElementById('adminUser').value.trim();
  const pass = document.getElementById('adminPass').value.trim();

  // Username: R-879-14 (from mail), Password: R-879-01 (hint: "带你来到这里的人")
  if (user === 'R-879-14' && pass === 'R-879-01') {
    GameState.adminLoggedIn = true;
    GameState.save();
    checkAutoPuzzles();

    // Show admin dashboard
    document.getElementById('screenContent').innerHTML = `
      <div class="app-view">
        <div class="app-header">
          <button class="back-btn" onclick="renderBrowserApp()">←</button>
          <span class="app-title">管理后台</span>
        </div>
        <div class="webpage-view">
          <div class="webpage-bar">
            <span style="color:rgba(0,255,0,0.5);font-size:11px;">🟢</span>
            <div class="webpage-url">radio879.com/admin — 已登录</div>
          </div>
          <div class="webpage-body">
            <p style="color:#34c759;font-size:13px;margin-bottom:16px;">登录成功。</p>
            <div style="background:rgba(255,255,255,0.03);padding:14px;border-radius:8px;margin-bottom:12px;">
              <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:4px;">受试者管理</div>
              <div style="font-size:13px;color:#fff;margin-bottom:6px;">R-879-14 — 阶段三（完成）</div>
              <div style="font-size:11px;color:rgba(255,255,255,0.6);">转化进度：94% · 记忆清除：有效</div>
            </div>
            <div style="background:rgba(255,255,255,0.03);padding:14px;border-radius:8px;margin-bottom:12px;">
              <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:4px;">操作日志</div>
              <div style="font-size:11px;color:rgba(255,255,255,0.6);font-family:monospace;line-height:1.8;">
                05/07 23:45 — 收听确认 ✓<br>
                05/08 00:10 — 指令发送 ✓<br>
                05/08 01:20 — 呼叫报告 ✓<br>
                05/08 01:23 — ⚠️ 自主意识检测：备忘录操作<br>
                05/08 01:32 — 内部文件已移至 /internal/14<br>
                05/08 01:33 — ⚠️ 截图检测：不干预<br>
                05/08 02:00 — ✅ 阶段三确认完成
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  } else {
    document.getElementById('adminError').textContent = '用户名或密码错误';
  }
}

/* ===== Website Search Page (radio879.com/search) ===== */
function renderWebsiteSearch() {
  const historyHtml = GameState.searchQueries.map(q =>
    `<div class="snoop-history-item">› ${q}</div>`
  ).join('');

  document.getElementById('screenContent').innerHTML = `
    <div class="app-view">
      <div class="app-header">
        <button class="back-btn" onclick="navigateToSite('home')">←</button>
        <span class="app-title">资料搜索</span>
      </div>
      <div class="webpage-view">
        <div class="webpage-bar">
          <span style="color:rgba(255,255,255,0.3);font-size:11px;">🔍</span>
          <div class="webpage-url">radio879.com/search${GameState.memberLoggedIn ? ' — 🟢 会员已登录' : ''}</div>
        </div>
        <div class="snoop-view">
          <div class="snoop-search-bar">
            <input type="text" class="snoop-input" id="siteSearchInput" placeholder="搜索电台资料库…"
              onkeydown="if(event.key==='Enter')websiteSearch()">
            <button class="snoop-btn" onclick="websiteSearch()">搜索</button>
          </div>
          <div style="font-size:10px;color:rgba(255,255,255,0.2);margin-bottom:8px;padding:0 4px;">
            搜索提示：试试搜索 R-879、87.9、会员
          </div>
          <div class="snoop-results" id="siteSearchResults">
            <div class="snoop-empty">输入关键词搜索电台资料库</div>
          </div>
          ${GameState.searchQueries.length > 0 ? `<div class="snoop-history"><div class="snoop-history-title">搜索记录</div>${historyHtml}</div>` : ''}
        </div>
      </div>
    </div>
  `;
  setTimeout(() => {
    const input = document.getElementById('siteSearchInput');
    if (input) input.focus();
  }, 100);
}

function websiteSearch() {
  const input = document.getElementById('siteSearchInput');
  const query = input.value.trim();
  if (!query) return;

  GameState.searchQueries.push(query);
  GameState.save();

  const resultsDiv = document.getElementById('siteSearchResults');

  // Check public search
  let match = SEARCH_DATA.find(k => k.word.toLowerCase() === query.toLowerCase());

  // When logged in, also check admin search — overrides public if both match
  if (GameState.memberLoggedIn) {
    const adminMatch = SEARCH_ADMIN_DATA.find(k => k.word.toLowerCase() === query.toLowerCase());
    if (adminMatch) match = adminMatch;
  }

  if (!match) {
    resultsDiv.innerHTML = `<div class="snoop-result-item"><div class="snoop-result-content" style="color:rgba(255,255,255,0.3);">未找到匹配结果</div></div>`;
    input.value = '';
    return;
  }

  let html = '';
  match.results.forEach(r => {
    const isFinal = r.final;
    const extraClass = isFinal ? 'final' : '';
    html += `<div class="snoop-result-item ${extraClass}">
      <div class="snoop-result-type">${r.type}</div>
      <div class="snoop-result-content">${r.content}</div>
    </div>`;
  });
  resultsDiv.innerHTML = html;

  // Track search for member unlock
  if (GameState.memberLoggedIn && !GameState.foundClues.includes('searched_' + query)) {
    GameState.foundClues.push('searched_' + query);
    GameState.save();

    // Check ending conditions
    checkSearchEnding();
  }

  // Auto-trigger ending for final results
  if (match.results.some(r => r.final)) {
    GameState.foundClues.push('search_final_trigger');
    GameState.save();
    setTimeout(() => {
      if (typeof triggerEnding === 'function') {
        triggerEnding();
      }
    }, 12000);
  }

  input.value = '';
}

function checkSearchEnding() {
  if (GameState.endingTriggered) return;
  if (!GameState.memberLoggedIn) return;

  // Conditions: searched R-879-14 (or 14), 推荐人, R-879-15 (or 15)
  const has14 = GameState.foundClues.includes('searched_R-879-14') || GameState.foundClues.includes('searched_14');
  const hasRef = GameState.foundClues.includes('searched_推荐人');
  const has15 = GameState.foundClues.includes('searched_R-879-15') || GameState.foundClues.includes('searched_15');

  if (has14 && hasRef && has15) {
    // All conditions met — ending is already triggered by the final result
  }
}

/* ===== Member Login (radio879.com/member) ===== */
function renderMemberLogin(forcePrompt) {
  // Already logged in — show dashboard
  if (GameState.memberLoggedIn) {
    renderMemberDashboard();
    return;
  }
  const hint = GameState.foundClues.includes('member_hint_shown') ? '' : '💡 在官网搜索中了解会员登录规则';
  document.getElementById('screenContent').innerHTML = `
    <div class="app-view">
      <div class="app-header">
        <button class="back-btn" onclick="navigateToSite('home')">←</button>
        <span class="app-title">会员系统</span>
      </div>
      <div class="webpage-view">
        <div class="webpage-bar">
          <span style="color:rgba(255,255,255,0.3);font-size:11px;">🔒</span>
          <div class="webpage-url">radio879.com/member</div>
        </div>
        <div style="padding:24px 16px;">
          <p style="color:rgba(255,255,255,0.6);font-size:13px;margin-bottom:20px;">会员登录</p>
          <p style="color:rgba(255,255,255,0.25);font-size:11px;margin-bottom:16px;line-height:1.6;">
            欢迎使用 87.9 会员系统。请使用您的听众编号登录以查看详细信息。
          </p>
          <input type="text" id="memberUser" placeholder="用户名（听众编号）" style="display:block;width:100%;padding:10px 14px;margin-bottom:12px;border-radius:10px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);color:#fff;font-size:14px;outline:none;">
          <input type="password" id="memberPass" placeholder="密码" style="display:block;width:100%;padding:10px 14px;margin-bottom:16px;border-radius:10px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);color:#fff;font-size:14px;outline:none;" onkeydown="if(event.key==='Enter')checkMemberLogin()">
          <button onclick="checkMemberLogin()" style="width:100%;padding:10px;border-radius:10px;border:none;background:#007aff;color:#fff;font-size:14px;cursor:pointer;">登录</button>
          <div id="memberError" style="color:#ff3b30;font-size:12px;margin-top:10px;text-align:center;"></div>
          <div style="margin-top:14px;padding:10px;background:rgba(255,255,255,0.03);border-radius:8px;font-size:11px;color:rgba(255,255,255,0.25);line-height:1.6;">
            ${hint}
          </div>
        </div>
      </div>
    </div>
  `;
  if (!GameState.foundClues.includes('member_hint_shown')) {
    GameState.foundClues.push('member_hint_shown');
    GameState.save();
  }
}

function renderMemberDashboard() {
  document.getElementById('screenContent').innerHTML = `
    <div class="app-view">
      <div class="app-header">
        <button class="back-btn" onclick="navigateToSite('home')">←</button>
        <span class="app-title">会员系统</span>
      </div>
      <div class="webpage-view">
        <div class="webpage-bar">
          <span style="color:rgba(0,255,0,0.5);font-size:11px;">🟢</span>
          <div class="webpage-url">radio879.com/member — 已登录</div>
        </div>
        <div class="webpage-body">
          <p style="color:#34c759;font-size:13px;margin-bottom:16px;">欢迎，R-879-14。</p>
          <div style="background:rgba(255,255,255,0.03);padding:14px;border-radius:8px;margin-bottom:12px;">
            <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:4px;">你的档案</div>
            <div style="font-size:13px;color:#fff;margin-bottom:2px;">R-879-14 — 林小敏</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.5);">推荐人：R-879-01 ｜ 阶段三（服从）</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.5);">转化进度：94% ｜ 记忆清除：有效</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.5);">当前任务：推荐新人（R-879-15）</div>
          </div>
          <div style="background:rgba(255,255,255,0.03);padding:14px;border-radius:8px;margin-bottom:12px;">
            <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:4px;">推荐链</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.6);font-family:monospace;line-height:1.8;">
              R-879-01（创始）<br>
              &nbsp;&nbsp;├→ R-879-02 ～ R-879-07<br>
              &nbsp;&nbsp;├→ <strong>R-879-14（你）</strong><br>
              &nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;└→ <strong style="color:#ffcc00;">R-879-15（预注册）</strong><br>
              &nbsp;&nbsp;└→ 共 47 人
            </div>
          </div>
          <div style="background:rgba(255,255,255,0.03);padding:14px;border-radius:8px;margin-bottom:12px;">
            <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:8px;">关联页面</div>
            <a href="#" onclick="event.preventDefault();navigateToSite('search')">🔍 资料搜索</a>
            <a href="#" onclick="event.preventDefault();navigateToSite('internal14')">📋 内部报告</a>
            <a href="#" onclick="event.preventDefault();navigateToSite('listeners')">👥 听众墙</a>
          </div>
        </div>
      </div>
    </div>
  `;
  if (!GameState.foundClues.includes('member_logged_in')) {
    GameState.foundClues.push('member_logged_in');
    GameState.save();
  }
}

function checkMemberLogin() {
  const user = document.getElementById('memberUser').value.trim();
  const pass = document.getElementById('memberPass').value.trim();

  if (user === 'R-879-14' && pass === 'R-879-01') {
    GameState.memberLoggedIn = true;
    GameState.save();
    renderMemberDashboard();
    document.getElementById('memberError').textContent = '用户名或密码错误';
  }
}

function renderMemberLogin(forcePrompt) {
  if (GameState.memberLoggedIn && !forcePrompt) {
    renderMemberDashboard();
    return;
  }

  const hint = GameState.foundClues.includes('member_hint_shown') ? '' : '📌 在官网搜索中了解会员登录规则';
  document.getElementById('screenContent').innerHTML = `
    <div class="app-view">
      <div class="app-header">
        <button class="back-btn" onclick="navigateToSite('home')">←</button>
        <span class="app-title">会员系统</span>
      </div>
      <div class="webpage-view">
        <div class="webpage-bar" style="display:flex;align-items:center;gap:8px;">
          <span style="color:rgba(255,255,255,0.3);font-size:11px;">🔀</span>
          <div class="webpage-url">radio879.com/member</div>
        </div>
        <div style="padding:24px 16px;">
          <p style="color:rgba(255,255,255,0.6);font-size:13px;margin-bottom:20px;">会员登录</p>
          <p style="color:rgba(255,255,255,0.25);font-size:11px;margin-bottom:16px;line-height:1.6;">
            欢迎使用 87.9 会员系统。请输入您的听众编号与推荐人编号，以查看详细资料。
          </p>
          <input type="text" id="memberUser" placeholder="账号（听众编号）" style="display:block;width:100%;padding:10px 14px;margin-bottom:12px;border-radius:10px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);color:#fff;font-size:14px;outline:none;">
          <input type="password" id="memberPass" placeholder="密码" style="display:block;width:100%;padding:10px 14px;margin-bottom:16px;border-radius:10px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);color:#fff;font-size:14px;outline:none;" onkeydown="if(event.key==='Enter')checkMemberLogin()">
          <button id="memberLoginButton" onclick="checkMemberLogin()" style="width:100%;padding:10px;border-radius:10px;border:none;background:#007aff;color:#fff;font-size:14px;cursor:pointer;">登录</button>
          <div id="memberError" style="color:#ff3b30;font-size:12px;margin-top:10px;text-align:center;"></div>
          <div style="margin-top:14px;padding:10px;background:rgba(255,255,255,0.03);border-radius:8px;font-size:11px;color:rgba(255,255,255,0.25);line-height:1.6;">
            ${hint}
          </div>
        </div>
      </div>
    </div>
  `;

  if (!GameState.foundClues.includes('member_hint_shown')) {
    GameState.foundClues.push('member_hint_shown');
    GameState.save();
  }
}

function renderMemberDashboard(memberAccount) {
  const currentMember = memberAccount || GameState.memberAccount || 'R-879-14';
  const isPreRegistered = currentMember === 'R-879-15';

  if (GameState.memberAccount !== currentMember) {
    GameState.memberAccount = currentMember;
    GameState.save();
  }

  const welcomeText = isPreRegistered ? '欢迎，R-879-15。' : '欢迎，R-879-14。';
  const profileName = isPreRegistered ? 'R-879-15 — 预注册' : 'R-879-14 — 林小敏';
  const profileMeta = isPreRegistered
    ? '推荐人：R-879-14 ｜ 阶段一（接触）'
    : '推荐人：R-879-01 ｜ 阶段三（服从）';
  const progressText = isPreRegistered
    ? '当前状态：自主调查中 ｜ 首次收听：未发生'
    : '转化进度：94% ｜ 记忆清除：有效';
  const taskText = isPreRegistered
    ? '当前任务：通过遗留设备完成接触'
    : '当前任务：推荐新人（R-879-15）';
  const chainMarkup = isPreRegistered
    ? `
              R-879-01（创始）<br>
              &nbsp;&nbsp;├→ R-879-02 至 R-879-07<br>
              &nbsp;&nbsp;├→ <strong>R-879-14</strong><br>
              &nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;└→ <strong style="color:#ffcc00;">R-879-15（你）</strong><br>
              &nbsp;&nbsp;└→ 共 47 人
            `
    : `
              R-879-01（创始）<br>
              &nbsp;&nbsp;├→ R-879-02 至 R-879-07<br>
              &nbsp;&nbsp;├→ <strong>R-879-14（你）</strong><br>
              &nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;└→ <strong style="color:#ffcc00;">R-879-15（预注册）</strong><br>
              &nbsp;&nbsp;└→ 共 47 人
            `;
  const relatedLinks = isPreRegistered
    ? `
            <a href="#" onclick="event.preventDefault();navigateToSite('search')">📳 资料搜索</a>
            <a href="#" onclick="event.preventDefault();navigateToSite('listeners')">👥 听众墙</a>
          `
    : `
            <a href="#" onclick="event.preventDefault();navigateToSite('search')">📳 资料搜索</a>
            <a href="#" onclick="event.preventDefault();navigateToSite('internal14')">📋 内部报告</a>
            <a href="#" onclick="event.preventDefault();navigateToSite('listeners')">👥 听众墙</a>
          `;

  document.getElementById('screenContent').innerHTML = `
    <div class="app-view">
      <div class="app-header">
        <button class="back-btn" onclick="navigateToSite('home')">←</button>
        <span class="app-title">会员系统</span>
      </div>
      <div class="webpage-view">
        <div class="webpage-bar" style="display:flex;align-items:center;gap:8px;">
          <span style="color:rgba(0,255,0,0.5);font-size:11px;">🟢</span>
          <div class="webpage-url">radio879.com/member — 已登录</div>
        </div>
        <div class="webpage-body">
          <p style="color:#34c759;font-size:13px;margin-bottom:16px;">${welcomeText}</p>
          <div style="background:rgba(255,255,255,0.03);padding:14px;border-radius:8px;margin-bottom:12px;">
            <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:4px;">你的档案</div>
            <div style="font-size:13px;color:#fff;margin-bottom:2px;">${profileName}</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.5);">${profileMeta}</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.5);">${progressText}</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.5);">${taskText}</div>
          </div>
          <div style="background:rgba(255,255,255,0.03);padding:14px;border-radius:8px;margin-bottom:12px;">
            <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:4px;">推荐链</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.6);font-family:monospace;line-height:1.8;">
              ${chainMarkup}
            </div>
          </div>
          <div style="background:rgba(255,255,255,0.03);padding:14px;border-radius:8px;margin-bottom:12px;">
            <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:8px;">关联页面</div>
            ${relatedLinks}
          </div>
        </div>
      </div>
    </div>
  `;

  if (!GameState.foundClues.includes('member_logged_in')) {
    GameState.foundClues.push('member_logged_in');
    GameState.save();
  }
}

function checkMemberLogin() {
  const user = document.getElementById('memberUser').value.trim();
  const pass = document.getElementById('memberPass').value.trim();
  const validCredentials = {
    'R-879-14': 'R-879-01',
    'R-879-15': 'R-879-14',
  };

  if (validCredentials[user] === pass) {
    GameState.memberLoggedIn = true;
    GameState.memberAccount = user;
    GameState.save();
    renderMemberDashboard(user);
    return;
  }

  document.getElementById('memberError').textContent = '用户名或密码错误';
}

function getRadioAuthAction(section) {
  if (!GameState.memberLoggedIn) return '';

  const targetSection = section || 'home';
  return `<button onclick="logoutMember('${targetSection}')" style="margin-left:auto;padding:4px 8px;border-radius:999px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.72);font-size:10px;cursor:pointer;">退出登录</button>`;
}

function logoutMember(section) {
  GameState.memberLoggedIn = false;
  GameState.memberAccount = null;
  GameState.save();

  if (section === 'member') {
    renderMemberLogin(true);
  } else if (section === 'search') {
    renderWebsiteSearch();
  } else if (section === 'listeners') {
    openRadioPage('listeners');
  } else {
    openRadioPage('home');
  }
}

function renderRadioSite(title, url, content, backFn) {
  const backCall = backFn || 'renderBrowserApp()';
  let authSection = 'home';
  if (url.includes('/listeners')) authSection = 'listeners';
  else if (url.includes('/member')) authSection = 'member';
  else if (url.includes('/search')) authSection = 'search';

  document.getElementById('screenContent').innerHTML = `
    <div class="app-view">
      <div class="app-header">
        <button class="back-btn" onclick="${backCall}">←</button>
        <span class="app-title">Radio 87.9</span>
      </div>
      <div class="webpage-view">
        <div class="webpage-bar" style="display:flex;align-items:center;gap:8px;">
          <span style="color:rgba(255,255,255,0.3);font-size:11px;">🔀</span>
          <div class="webpage-url">${url}</div>
          ${getRadioAuthAction(authSection)}
        </div>
        <div class="webpage-title" style="font-size:14px;">${title}</div>
        <div class="webpage-body">${content}</div>
      </div>
    </div>
  `;
}

function renderWebsiteSearch() {
  const historyHtml = GameState.searchQueries.map(q =>
    `<div class="snoop-history-item">- ${q}</div>`
  ).join('');

  document.getElementById('screenContent').innerHTML = `
    <div class="app-view">
      <div class="app-header">
        <button class="back-btn" onclick="navigateToSite('home')">←</button>
        <span class="app-title">资料搜索</span>
      </div>
      <div class="webpage-view">
        <div class="webpage-bar" style="display:flex;align-items:center;gap:8px;">
          <span style="color:rgba(255,255,255,0.3);font-size:11px;">📳</span>
          <div class="webpage-url">radio879.com/search${GameState.memberLoggedIn ? ' — 会员已登录' : ''}</div>
          ${getRadioAuthAction('search')}
        </div>
        <div class="snoop-view">
          <div class="snoop-search-bar">
            <input type="text" class="snoop-input" id="siteSearchInput" placeholder="搜索电台资料库..."
              onkeydown="if(event.key==='Enter')websiteSearch()">
            <button class="snoop-btn" onclick="websiteSearch()">搜索</button>
          </div>
          <div style="font-size:10px;color:rgba(255,255,255,0.2);margin-bottom:8px;padding:0 4px;">
            搜索提示：试试搜索 R-879、87.9、会员
          </div>
          <div class="snoop-results" id="siteSearchResults">
            <div class="snoop-empty">输入关键词搜索电台资料库</div>
          </div>
          ${GameState.searchQueries.length > 0 ? `<div class="snoop-history"><div class="snoop-history-title">搜索记录</div>${historyHtml}</div>` : ''}
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    const input = document.getElementById('siteSearchInput');
    if (input) input.focus();
  }, 100);
}

function renderMemberDashboard(memberAccount) {
  const currentMember = memberAccount || GameState.memberAccount || 'R-879-14';
  const isPreRegistered = currentMember === 'R-879-15';

  if (GameState.memberAccount !== currentMember) {
    GameState.memberAccount = currentMember;
    GameState.save();
  }

  const welcomeText = isPreRegistered ? '欢迎，R-879-15。' : '欢迎，R-879-14。';
  const profileName = isPreRegistered ? 'R-879-15 — 预注册' : 'R-879-14 — 林小敏';
  const profileMeta = isPreRegistered
    ? '推荐人：R-879-14 ｜ 阶段一（接触）'
    : '推荐人：R-879-01 ｜ 阶段三（服从）';
  const progressText = isPreRegistered
    ? '当前状态：自主调查中 ｜ 首次收听：未发生'
    : '转化进度：94% ｜ 记忆清除：有效';
  const taskText = isPreRegistered
    ? '当前任务：通过遗留设备完成接触'
    : '当前任务：推荐新人（R-879-15）';
  const chainMarkup = isPreRegistered
    ? `
              R-879-01（创始）<br>
              &nbsp;&nbsp;├→ R-879-02 至 R-879-07<br>
              &nbsp;&nbsp;├→ <strong>R-879-14</strong><br>
              &nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;└→ <strong style="color:#ffcc00;">R-879-15（你）</strong><br>
              &nbsp;&nbsp;└→ 共 47 人
            `
    : `
              R-879-01（创始）<br>
              &nbsp;&nbsp;├→ R-879-02 至 R-879-07<br>
              &nbsp;&nbsp;├→ <strong>R-879-14（你）</strong><br>
              &nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;└→ <strong style="color:#ffcc00;">R-879-15（预注册）</strong><br>
              &nbsp;&nbsp;└→ 共 47 人
            `;
  const relatedLinks = isPreRegistered
    ? `
            <a href="#" onclick="event.preventDefault();navigateToSite('search')">📳 资料搜索</a>
            <a href="#" onclick="event.preventDefault();navigateToSite('listeners')">👥 听众墙</a>
          `
    : `
            <a href="#" onclick="event.preventDefault();navigateToSite('search')">📳 资料搜索</a>
            <a href="#" onclick="event.preventDefault();navigateToSite('internal14')">📋 内部报告</a>
            <a href="#" onclick="event.preventDefault();navigateToSite('listeners')">👥 听众墙</a>
          `;

  document.getElementById('screenContent').innerHTML = `
    <div class="app-view">
      <div class="app-header">
        <button class="back-btn" onclick="navigateToSite('home')">←</button>
        <span class="app-title">会员系统</span>
      </div>
      <div class="webpage-view">
        <div class="webpage-bar" style="display:flex;align-items:center;gap:8px;">
          <span style="color:rgba(0,255,0,0.5);font-size:11px;">🟢</span>
          <div class="webpage-url">radio879.com/member — 已登录</div>
          ${getRadioAuthAction('member')}
        </div>
        <div class="webpage-body">
          <p style="color:#34c759;font-size:13px;margin-bottom:16px;">${welcomeText}</p>
          <div style="background:rgba(255,255,255,0.03);padding:14px;border-radius:8px;margin-bottom:12px;">
            <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:4px;">你的档案</div>
            <div style="font-size:13px;color:#fff;margin-bottom:2px;">${profileName}</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.5);">${profileMeta}</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.5);">${progressText}</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.5);">${taskText}</div>
          </div>
          <div style="background:rgba(255,255,255,0.03);padding:14px;border-radius:8px;margin-bottom:12px;">
            <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:4px;">推荐链</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.6);font-family:monospace;line-height:1.8;">
              ${chainMarkup}
            </div>
          </div>
          <div style="background:rgba(255,255,255,0.03);padding:14px;border-radius:8px;margin-bottom:12px;">
            <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:8px;">关联页面</div>
            ${relatedLinks}
          </div>
        </div>
      </div>
    </div>
  `;

  if (!GameState.foundClues.includes('member_logged_in')) {
    GameState.foundClues.push('member_logged_in');
    GameState.save();
  }
}

function checkMemberLogin() {
  const userField = document.getElementById('memberUser');
  const passField = document.getElementById('memberPass');
  const errorField = document.getElementById('memberError');
  const user = userField.value.trim();
  const pass = passField.value.trim();
  const validCredentials = {
    'R-879-14': 'R-879-01',
    'R-879-15': 'R-879-14',
  };

  if (user === 'R-879-15' && !GameState.finalMemberUnlock) {
    errorField.textContent = '该编号暂未开放登录';
    return;
  }

  if (validCredentials[user] === pass) {
    GameState.memberLoggedIn = true;
    GameState.memberAccount = user;
    GameState.save();
    renderMemberDashboard(user);
    return;
  }

  errorField.textContent = '用户名或密码错误';
}

/* ===== Gallery App ===== */
function renderGalleryApp() {
  let gridHtml = '';
  GALLERY_DATA.forEach(p => {
    const isLocked = p.locked && !GameState.unlockedContent['photo:' + p.id];
    gridHtml += `
      <div class="gallery-item ${isLocked ? 'locked' : ''}" onclick="${isLocked ? `showPasswordModal('${p.puzzleId}', '${p.id}')` : `openLightbox('${p.id}')`}">
        ${isLocked ? '' : (p.src ? `<img src="${p.src}" style="width:100%;height:100%;object-fit:cover">` : '🖼️')}
      </div>
    `;
  });

  document.getElementById('screenContent').innerHTML = `
    <div class="app-view">
      <div class="app-header">
        <button class="back-btn" onclick="goHome()">←</button>
        <span class="app-title">相册</span>
      </div>
      <div class="gallery-grid">
        ${gridHtml}
      </div>
      <div class="gallery-caption">共 ${GALLERY_DATA.length} 张照片</div>
    </div>
  `;
}

function openLightbox(photoId) {
  const photo = GALLERY_DATA.find(p => p.id === photoId);
  if (!photo) return;

  if (photoId === 'p4' && !GameState.foundClues.includes('photo_p4_seen')) {
    GameState.foundClues.push('photo_p4_seen');
    GameState.save();
    checkAutoPuzzles();
  }

  document.getElementById('screenContent').innerHTML += `
    <div class="lightbox-overlay" onclick="renderGalleryApp()">
      <button class="lightbox-close" onclick="event.stopPropagation();renderGalleryApp()">✕</button>
      <div class="lightbox-image">${photo.src ? `<img src="${photo.src}">` : '🖼️'}</div>
      <div class="lightbox-caption">${photo.caption || ''}</div>
    </div>
  `;
}

function showPasswordModal(puzzleId, photoId) {
  const puzzle = PUZZLES.find(p => p.id === puzzleId);
  const hint = puzzle?.prompt || '';
  document.getElementById('screenContent').innerHTML += `
    <div class="password-modal">
      <p style="color:rgba(255,255,255,0.6);font-size:13px;">相册已加密</p>
      ${hint ? `<p style="color:rgba(255,255,255,0.35);font-size:11px;margin-top:-8px;margin-bottom:4px;">💡 ${hint}</p>` : ''}
      <p style="color:rgba(255,255,255,0.2);font-size:10px;margin:-4px 0 6px;">（4位密码）</p>
      <input type="password" id="pwInput" placeholder="请输入密码" maxlength="10"
        onkeydown="if(event.key==='Enter')checkPassword('${puzzleId}', '${photoId}')">
      <button onclick="checkPassword('${puzzleId}', '${photoId}')">确定</button>
      <div id="pwError" class="pw-error"></div>
      <button style="background:none;color:rgba(255,255,255,0.4);font-size:12px;border:none;cursor:pointer;" onclick="renderGalleryApp()">取消</button>
    </div>
  `;
  setTimeout(() => document.getElementById('pwInput').focus(), 100);
}

function checkPassword(puzzleId, photoId) {
  const input = document.getElementById('pwInput').value;
  if (checkPuzzleAnswer(puzzleId, input)) {
    renderGalleryApp();
  } else {
    document.getElementById('pwError').textContent = '密码错误';
  }
}

/* ===== Notes App ===== */
function renderNotesApp() {
  const visibleNotes = NOTES_DATA.filter(n => {
    if (n.phase && n.phase > GameState.gamePhase) return false;
    // n5 (加密日记2) is locked, always visible
    return true;
  });
  let html = `<div class="app-view"><div class="app-header"><button class="back-btn" onclick="goHome()">←</button><span class="app-title">备忘录</span></div><div class="notes-list">`;
  visibleNotes.forEach(n => {
    const isLocked = n.locked && !GameState.unlockedContent['note:' + n.id];
    const displayText = isLocked ? '🔒 已锁定' :
      (n.id === 'n4' && GameState.unlockedContent['note:n4'] ? '[日记已解锁]' : (NOTE_CONTENTS[n.id] || n.text).substring(0, 40));
    html += `
      <div class="note-item" onclick="${isLocked ? `showNotePasswordModal('${n.puzzleId}', '${n.id}')` : `openNote('${n.id}')`}">
        <div class="note-title">${n.title || '无标题'}</div>
        <div class="${isLocked ? 'note-locked' : 'note-text'}">${displayText}</div>
      </div>`;
  });
  html += `</div></div>`;
  document.getElementById('screenContent').innerHTML = html;
}

function openNote(noteId) {
  const content = NOTE_CONTENTS[noteId];
  if (!content) return;

  if (noteId === 'n4' && !GameState.foundClues.includes('diary_read')) {
    GameState.foundClues.push('diary_read');
    GameState.save();
    checkAutoPuzzles();
  }

  const title = noteId === 'n5' ? '无标题' : (NOTES_DATA.find(n => n.id === noteId)?.title || '');
  document.getElementById('screenContent').innerHTML = `
    <div class="app-view"><div class="app-header"><button class="back-btn" onclick="renderNotesApp()">←</button><span class="app-title">${title}</span></div>
    <div class="note-detail">${content}</div></div>`;
}

function showNotePasswordModal(puzzleId, noteId) {
  const puzzle = PUZZLES.find(p => p.id === puzzleId);
  const hint = puzzle?.prompt || '';
  document.getElementById('screenContent').innerHTML += `
    <div class="password-modal">
      <p style="color:rgba(255,255,255,0.6);font-size:13px;">此备忘录已加密</p>
      ${hint ? `<p style="color:rgba(255,255,255,0.35);font-size:11px;margin-top:-8px;margin-bottom:4px;">💡 ${hint}</p>` : ''}
      ${puzzleId === 'note-pw' ? '<p style="color:rgba(255,255,255,0.2);font-size:10px;margin:-4px 0 6px;">（6位密码）</p>' : ''}
      <input type="password" id="notePwInput" placeholder="请输入密码" maxlength="10"
        onkeydown="if(event.key==='Enter')checkNotePassword('${puzzleId}', '${noteId}')">
      <button onclick="checkNotePassword('${puzzleId}', '${noteId}')">确定</button>
      <div id="notePwError" class="pw-error"></div>
      <button style="background:none;color:rgba(255,255,255,0.4);font-size:12px;border:none;cursor:pointer;" onclick="renderNotesApp()">取消</button>
    </div>`;
}

function checkNotePassword(puzzleId, noteId) {
  const input = document.getElementById('notePwInput').value;
  if (checkPuzzleAnswer(puzzleId, input)) {
    openNote(noteId);
  } else {
    document.getElementById('notePwError').textContent = '密码错误';
  }
}

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
  document.getElementById('dialDisplay').textContent = _dialNumber || ' ';
}

function makeCall() {
  const num = _dialNumber.trim();
  if (!num) {
    document.getElementById('dialError').textContent = '请输入号码';
    return;
  }

  // Debug: dial birthday to reset
  if (num === '20031123') {
    GameState.reset();
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

/* ===== Mail App ===== */
function renderMailApp() {
  let html = `<div class="app-view"><div class="app-header"><button class="back-btn" onclick="goHome()">←</button><span class="app-title">邮件</span></div><div class="mail-list">`;
  const visibleMails = MAIL_DATA.filter(m => m.phase <= GameState.gamePhase);
  visibleMails.forEach((m, i) => {
    html += `<div class="mail-item" onclick="openMail(${i})">
      <div class="mail-from">${m.from}</div>
      <div class="mail-subject">${m.subject}</div>
    </div>`;
  });
  html += `</div></div>`;
  document.getElementById('screenContent').innerHTML = html;
}

function openMail(index) {
  const mail = MAIL_DATA[index];
  if (!mail) return;
  document.getElementById('screenContent').innerHTML = `
    <div class="app-view"><div class="app-header"><button class="back-btn" onclick="renderMailApp()">←</button><span class="app-title">${mail.subject}</span></div>
    <div style="padding:8px 16px;font-size:16px;color:rgba(255,255,255,0.3);">${mail.from}</div>
    <div class="mail-body-view">${mail.body}</div></div>`;
}

/* ===== Snooping tool removed — functionality moved to website search ===== */
