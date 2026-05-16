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
  BROWSER_DATA.searchHistory.slice(-5).reverse().forEach(h => {
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
        <div class="bookmark-url">radio01.com/forum</div>
      </div>
    </div>
    <div class="browser-bookmark" onclick="openBrowserPage('hypno')">
      <div class="bookmark-icon">🔖</div>
      <div>
        <div class="bookmark-title">催眠引导 · 睡前放松</div>
        <div class="bookmark-url">radio01.com/hypno</div>
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
  } else if (url === 'radio879.com/register' || url === 'radio879.com/register/') {
    renderRegisterPage();
  } else if (url === 'radio879.com/search' || url === 'radio879.com/search/') {
    renderWebsiteSearch();
  } else if (url === 'radio879.com/listeners' || url === 'radio879.com/listeners/') {
    openRadioPage('listeners');
  } else if (url === 'radio879.com/member' || url === 'radio879.com/member/') {
    renderMemberLogin();
  } else if (url === 'radio879.com/admin/tower') {
    renderTowerAdmin();
  } else if (url === 'radio879.com/admin' || url === 'radio879.com/admin/') {
    renderMemberLogin();
  } else if (url === 'radio879.com/internal/14') {
    if (GameState.memberLoggedIn) {
      openRadioPage('internal14');
    } else {
      renderRadioSite('访问被拒绝', 'radio879.com/internal/14', '⚠️ 需要会员权限。\n\n请先登录会员系统。');
    }  } else if (url === 'radio879.com/internal/14/diary') {
    if (GameState.memberLoggedIn) {
      renderFallDiary('R-879-14');
    } else {
      renderRadioSite('访问被拒绝', 'radio879.com/internal/14/diary', '⚠️ 需要会员权限。\n\n请先登录会员系统。');
    }
  } else if (url === 'radio879.com/internal/05') {
    if (GameState.memberLoggedIn) {
      const page = BROWSER_DATA.pages.radioInternal05;
      renderRadioSite(page.title, 'radio879.com/internal/05', page.content, "navigateToSite('member')");
    } else {
      navigateToSite('home');
    }
  } else if (url === 'radio879.com/internal/06') {
    if (GameState.memberLoggedIn) {
      const page = BROWSER_DATA.pages.radioInternal06;
      renderRadioSite(page.title, 'radio879.com/internal/06', page.content, "navigateToSite('member')");
    } else {
      navigateToSite('home');
    }
  } else if (url === 'radio879.com/internal/10') {
    if (GameState.memberLoggedIn) {
      const page = BROWSER_DATA.pages.radioInternal10;
      renderRadioSite(page.title, 'radio879.com/internal/10', page.content, "navigateToSite('member')");
    } else {
      navigateToSite('home');
    }
  } else if (url === 'radio879.com/internal/11') {
    if (GameState.memberLoggedIn) {
      const page = BROWSER_DATA.pages.radioInternal11;
      renderRadioSite(page.title, 'radio879.com/internal/11', page.content, "navigateToSite('member')");
    } else {
      navigateToSite('home');
    }
  } else if (url === 'radio879.com/internal/12') {
    if (GameState.memberLoggedIn) {
      const page = BROWSER_DATA.pages.radioInternal12;
      renderRadioSite(page.title, 'radio879.com/internal/12', page.content, "navigateToSite('member')");
    } else {
      navigateToSite('home');
    }
  } else if (url === 'radio879.com/internal/03') {
    if (GameState.memberLoggedIn) {
      const page = BROWSER_DATA.pages.radioInternal03;
      renderRadioSite(page.title, 'radio879.com/internal/03', page.content, "navigateToSite('member')");
    } else {
      navigateToSite('home');
    }
  } else if (url === 'radio879.com/internal/04') {
    if (GameState.memberLoggedIn) {
      const page = BROWSER_DATA.pages.radioInternal04;
      renderRadioSite(page.title, 'radio879.com/internal/04', page.content, "navigateToSite('member')");
    } else {
      navigateToSite('home');
    }
  } else if (url === 'radio879.com/internal/07') {
    if (GameState.memberLoggedIn) {
      const page = BROWSER_DATA.pages.radioInternal07;
      renderRadioSite(page.title, 'radio879.com/internal/07', page.content, "navigateToSite('member')");
    } else {
      navigateToSite('home');
    }
  } else if (url === 'radio879.com/internal/09') {
    if (GameState.memberLoggedIn) {
      const page = BROWSER_DATA.pages.radioInternal09;
      renderRadioSite(page.title, 'radio879.com/internal/09', page.content, "navigateToSite('member')");
    } else {
      navigateToSite('home');
    }
  } else if (url === 'radio879.com/internal/13') {
    if (GameState.memberLoggedIn) {
      const page = BROWSER_DATA.pages.radioInternal13;
      renderRadioSite(page.title, 'radio879.com/internal/13', page.content, "navigateToSite('member')");
    } else {
      renderRadioSite('访问被拒绝', 'radio879.com/internal/13', '⚠️ 需要会员权限。\n\n请先登录会员系统。');
    }
  } else if (url === 'radio879.com/internal/13/diary') {
    if (GameState.memberLoggedIn) {
      renderFallDiary('R-879-13');
    } else {
      renderRadioSite('访问被拒绝', 'radio879.com/internal/13/diary', '⚠️ 需要会员权限。\n\n请先登录会员系统。');
    }
  } else if (url === 'radio879.com/internal/08') {
    if (GameState.memberLoggedIn) {
      const page = BROWSER_DATA.pages.radioInternal08;
      renderRadioSite(page.title, 'radio879.com/internal/08', page.content, "navigateToSite('member')");
    } else {
      renderRadioSite('访问被拒绝', 'radio879.com/internal/08', '⚠️ 需要会员权限。\n\n请先登录会员系统。');
    }
  } else if (url === 'radio879.com/internal/08/diary') {
    if (GameState.memberLoggedIn) {
      renderFallDiary('R-879-08');
    } else {
      renderRadioSite('访问被拒绝', 'radio879.com/internal/08/diary', '⚠️ 需要会员权限。\n\n请先登录会员系统。');
    }
  } else if (url === 'radio879.com/internal/02') {
    if (GameState.memberLoggedIn) {
      const page = BROWSER_DATA.pages.radioInternal02;
      renderRadioSite(page.title, 'radio879.com/internal/02', page.content, "navigateToSite('member')");
    } else {
      renderRadioSite('访问被拒绝', 'radio879.com/internal/02', '⚠️ 需要会员权限。\n\n请先登录会员系统。');
    }
  } else if (url === 'radio879.com/internal/02/diary') {
    if (GameState.memberLoggedIn) {
      renderFallDiary('R-879-02');
    } else {
      renderRadioSite('访问被拒绝', 'radio879.com/internal/02/diary', '⚠️ 需要会员权限。\n\n请先登录会员系统。');
    }
  } else if (url.includes('bbs.radio879.com')) {
    openBrowserPage('forum');
  } else if (url.includes('hypno-guide.net')) {
    openBrowserPage('hypno');
  } else if (url.includes('radio879.com')) {
    showPageNotFound(url);
  } else if (url === 'radio01.com' || url === 'www.radio01.com') {
    renderTrapPage();
  } else if (url === 'radio01.com/forum' || url === 'radio01.com/forum/') {
    openBrowserPage('forum');
  } else if (url === 'radio01.com/hypno' || url === 'radio01.com/hypno/') {
    openBrowserPage('hypno');
  } else if (url === 'seektruth.com' || url === 'www.seektruth.com') {
    openBrowserPage('seektruth');
  } else {
    showPageNotFound(url);
  }
}

function showPageNotFound(url) {
  if (GameState._endingCompleted) {
    renderNotFound404(url);
    return;
  }
  renderRadioSite('无法访问', url, '⚠️ 无法访问此页面\n\n请检查网址是否正确。\n\n—— Radio 87.9 听众服务中心');
}

function renderNotFound404(url) {
  const content = `
    <div style="text-align:center;padding:40px 16px;">
      <div style="font-size:64px;font-weight:200;color:rgba(255,255,255,0.1);margin-bottom:8px;font-family:monospace;">404</div>
      <div style="font-size:13px;color:rgba(255,255,255,0.3);margin-bottom:24px;">PAGE NOT FOUND</div>
      <div style="font-size:12px;color:rgba(255,255,255,0.2);line-height:1.8;max-width:240px;margin:0 auto;">
        <p>你所寻找的页面不在这个频率上。</p>
        <p style="margin-top:12px;color:rgba(255,255,255,0.08);font-size:11px;">
          也许你需要一座灯塔来指引方向。
        </p>
        <!-- lighthouse -->
        <div style="margin-top:32px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.03);font-size:10px;color:rgba(255,255,255,0.05);font-family:monospace;">
          87.9 MHz — 覆盖城市每一个角落<br>
          <span style="color:rgba(255,255,255,0.02);">Lighthouse</span>
        </div>
      </div>
    </div>
  `;
  renderRadioSite('404 Not Found', url, content);
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
    // Append forum section based on login status
    const forumSection = GameState.memberLoggedIn
      ? `<div class="radio-section" style="margin-top:12px;">
          <div class="radio-section-title">听众日常</div>
          <div class="schedule-item"><div class="schedule-dot"></div><div style="font-size:12px;color:rgba(255,255,255,0.6);line-height:1.6;">今天不知不觉又听了好久电台。凌晨两点才放下耳机，但感觉特别放松。有人跟我一样吗？<br><span style="font-size:10px;color:rgba(255,255,255,0.2);">— R-879-08 苏灵悦</span></div></div>
          <div class="schedule-item"><div class="schedule-dot"></div><div style="font-size:12px;color:rgba(255,255,255,0.6);line-height:1.6;">昨晚做了个很长的梦，梦里有那个声音在跟我说话。醒来后很平静。<br><span style="font-size:10px;color:rgba(255,255,255,0.2);">— R-879-11 苏墨染</span></div></div>
          <div class="schedule-item"><div class="schedule-dot"></div><div style="font-size:12px;color:rgba(255,255,255,0.6);line-height:1.6;">习惯了每天晚上这个时间醒来了。起来听一会儿，再睡。<br><span style="font-size:10px;color:rgba(255,255,255,0.2);">— R-879-06 许清雅</span></div></div>
          <div class="schedule-item"><div class="schedule-dot"></div><div style="font-size:12px;color:rgba(255,255,255,0.6);line-height:1.6;">推荐的朋友今天也加入了。他说感觉很奇妙。<br><span style="font-size:10px;color:rgba(255,255,255,0.2);">— R-879-02 陈雨舟</span></div></div>
        </div>`
      : `<div class="radio-section" style="margin-top:12px;">
          <div class="radio-section-title">最近讨论</div>
          <div class="schedule-item"><div class="schedule-dot"></div><div style="font-size:12px;color:rgba(255,255,255,0.6);line-height:1.6;">好奇啊，听说很有趣就想来试试。有推荐人吗？<br><span style="font-size:10px;color:rgba(255,255,255,0.2);">— 匿名</span></div></div>
          <div class="schedule-item"><div class="schedule-dot"></div><div style="font-size:12px;color:rgba(255,255,255,0.6);line-height:1.6;">有没有人做推荐人呀～听说这个社区很温暖<br><span style="font-size:10px;color:rgba(255,255,255,0.2);">— 匿名</span></div></div>
          <div class="schedule-item"><div class="schedule-dot"></div><div style="font-size:12px;color:rgba(255,255,255,0.6);line-height:1.6;">深夜听这个真的好上头……谁来拉住我<br><span style="font-size:10px;color:rgba(255,255,255,0.2);">— 匿名</span></div></div>
        </div>`;
    renderRadioSite(page.title, baseUrl, page.content + forumSection);
  } else if (section === 'listeners') {
    const isMember = GameState.memberLoggedIn;
    const maskName = (name) => {
      if (!isMember && name !== '—' && name.length > 0) {
        return name.length > 1 ? '*' + name.substring(1) : '*';
      }
      return name;
    };
    const tableContent = `
      <div style="background:rgba(255,255,255,0.03);border-radius:8px;overflow:hidden;">
        <div style="display:grid;grid-template-columns:90px 1fr 60px;padding:10px 12px;font-size:10px;color:rgba(255,255,255,0.4);border-bottom:1px solid rgba(255,255,255,0.06);text-transform:uppercase;letter-spacing:1px;">
          <span>编号</span><span>姓名</span><span>阶段</span>
        </div>
        ${LISTENERS_DATA.map(row => `
          <div style="display:grid;grid-template-columns:90px 1fr 60px;padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.03);font-size:12px;color:rgba(255,255,255,0.8);${row[0].includes('01') ? 'background:rgba(255,204,0,0.05);' : ''}${row[0].includes('14') ? 'color:#ffcc00;' : ''}">
            <span style="${row[0].includes('01') ? 'color:#ffcc00;' : ''}">${row[0]}</span>
            <span>${maskName(row[1])}</span>
            <span style="font-size:10px;color:rgba(255,255,255,0.5);">${row[2]}</span>
          </div>
        `).join('')}
      </div>
      ${isMember
        ? `<div style="margin-top:12px;"><a href="#" onclick="event.preventDefault();navigateToSite('search')">🔍 资料搜索</a></div>`
        : `<div style="margin-top:12px;"><a href="#" onclick="event.preventDefault();navigateToSite('member')">🔐 登录会员查看详细信息</a></div>`
      }`;
    renderRadioSite('Radio 87.9 — 听众墙', baseUrl + '/listeners', tableContent, "navigateToSite('member')");
  } else if (section === 'admin') {
    renderMemberLogin();
  } else if (section === 'internal14') {
    const page = BROWSER_DATA.pages.radioInternal14;
    renderRadioSite(page.title, baseUrl + '/internal/14', page.content, "navigateToSite('member')");
  }
}

function navigateToSite(section) {
  const member = GameState._currentMember || 'R-879-14';
  const shortId = member.replace('R-879-', '');
  const paths = {
    home: 'radio879.com',
    listeners: 'radio879.com/listeners',
    search: 'radio879.com/search',
    member: 'radio879.com/member',
    admin: 'radio879.com/member',
    internal14: 'radio879.com/internal/14',
    register: 'radio879.com/register',
    fallDiary: `radio879.com/internal/${shortId}/diary`,
    internal13: 'radio879.com/internal/13',
    internal08: 'radio879.com/internal/08',
    internal03: 'radio879.com/internal/03',
    internal04: 'radio879.com/internal/04',
    internal07: 'radio879.com/internal/07',
    internal09: 'radio879.com/internal/09',
    internal05: 'radio879.com/internal/05',
    internal06: 'radio879.com/internal/06',
    internal10: 'radio879.com/internal/10',
    internal11: 'radio879.com/internal/11',
    internal12: 'radio879.com/internal/12',
    internal02: 'radio879.com/internal/02',
  };
  GameState._lastUrl = paths[section] || 'radio879.com';
  GameState.save();
  if (section === 'home') openRadioPage('home');
  else if (section === 'listeners') openRadioPage('listeners');
  else if (section === 'search') renderWebsiteSearch();
  else if (section === 'member') renderMemberLogin();
  else if (section === 'admin') renderMemberLogin();
  else if (section === 'register') renderRegisterPage();
  else if (section === 'internal14') openRadioPage('internal14');
  else if (section === 'fallDiary') renderFallDiary(member);
  else if (section === 'internal13') {
    if (GameState.memberLoggedIn) {
      const page = BROWSER_DATA.pages.radioInternal13;
      renderRadioSite(page.title, 'radio879.com/internal/13', page.content, "navigateToSite('member')");
    } else {
      navigateToSite('home');
    }
  }
  else if (section === 'internal08') {
    if (GameState.memberLoggedIn) {
      const page = BROWSER_DATA.pages.radioInternal08;
      renderRadioSite(page.title, 'radio879.com/internal/08', page.content, "navigateToSite('member')");
    } else {
      navigateToSite('home');
    }
  }
  else if (section === 'internal02') {
    if (GameState.memberLoggedIn) {
      const page = BROWSER_DATA.pages.radioInternal02;
      renderRadioSite(page.title, 'radio879.com/internal/02', page.content, "navigateToSite('member')");
    } else {
      navigateToSite('home');
    }
  }
  else if (section === 'internal03') {
    if (GameState.memberLoggedIn) {
      const page = BROWSER_DATA.pages.radioInternal03;
      renderRadioSite(page.title, 'radio879.com/internal/03', page.content, "navigateToSite('member')");
    } else {
      navigateToSite('home');
    }
  }
  else if (section === 'internal04') {
    if (GameState.memberLoggedIn) {
      const page = BROWSER_DATA.pages.radioInternal04;
      renderRadioSite(page.title, 'radio879.com/internal/04', page.content, "navigateToSite('member')");
    } else {
      navigateToSite('home');
    }
  }
  else if (section === 'internal07') {
    if (GameState.memberLoggedIn) {
      const page = BROWSER_DATA.pages.radioInternal07;
      renderRadioSite(page.title, 'radio879.com/internal/07', page.content, "navigateToSite('member')");
    } else {
      navigateToSite('home');
    }
  }
  else if (section === 'internal09') {
    if (GameState.memberLoggedIn) {
      const page = BROWSER_DATA.pages.radioInternal09;
      renderRadioSite(page.title, 'radio879.com/internal/09', page.content, "navigateToSite('member')");
    } else {
      navigateToSite('home');
    }
  }
  else if (section === 'internal05') {
    if (GameState.memberLoggedIn) {
      const page = BROWSER_DATA.pages.radioInternal05;
      renderRadioSite(page.title, 'radio879.com/internal/05', page.content, "navigateToSite('member')");
    } else {
      navigateToSite('home');
    }
  }
  else if (section === 'internal06') {
    if (GameState.memberLoggedIn) {
      const page = BROWSER_DATA.pages.radioInternal06;
      renderRadioSite(page.title, 'radio879.com/internal/06', page.content, "navigateToSite('member')");
    } else {
      navigateToSite('home');
    }
  }
  else if (section === 'internal10') {
    if (GameState.memberLoggedIn) {
      const page = BROWSER_DATA.pages.radioInternal10;
      renderRadioSite(page.title, 'radio879.com/internal/10', page.content, "navigateToSite('member')");
    } else {
      navigateToSite('home');
    }
  }
  else if (section === 'internal11') {
    if (GameState.memberLoggedIn) {
      const page = BROWSER_DATA.pages.radioInternal11;
      renderRadioSite(page.title, 'radio879.com/internal/11', page.content, "navigateToSite('member')");
    } else {
      navigateToSite('home');
    }
  }
  else if (section === 'internal12') {
    if (GameState.memberLoggedIn) {
      const page = BROWSER_DATA.pages.radioInternal12;
      renderRadioSite(page.title, 'radio879.com/internal/12', page.content, "navigateToSite('member')");
    } else {
      navigateToSite('home');
    }
  }
  else openRadioPage('home');
}

function renderRadioSite(title, url, content, backFn) {
  const backCall = backFn || 'renderBrowserApp()';
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
  const historyHtml = GameState.searchQueries.slice(-5).reverse().map(q =>
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
    }, 10000);
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
  // Already logged in — show dashboard (unless force prompt for ending)
  if (GameState.memberLoggedIn && !forcePrompt) {
    if (GameState._currentMember === 'R-879-01') {
      renderMemberDashboard01();
    } else if (GameState._currentMember === 'R-879-13') {
      renderMemberDashboard13();
    } else if (GameState._currentMember === 'R-879-08') {
      renderMemberDashboard08();
    } else if (GameState._currentMember === 'R-879-02') {
      renderMemberDashboard02();
    } else if (GameState._currentMember === 'R-879-03') {
      renderMemberDashboard03();
    } else if (GameState._currentMember === 'R-879-04') {
      renderMemberDashboard04();
    } else if (GameState._currentMember === 'R-879-07') {
      renderMemberDashboard07();
    } else if (GameState._currentMember === 'R-879-09') {
      renderMemberDashboard09();
    } else if (GameState._currentMember === 'R-879-05') {
      renderMemberDashboard05();
    } else if (GameState._currentMember === 'R-879-06') {
      renderMemberDashboard06();
    } else if (GameState._currentMember === 'R-879-10') {
      renderMemberDashboard10();
    } else if (GameState._currentMember === 'R-879-11') {
      renderMemberDashboard11();
    } else if (GameState._currentMember === 'R-879-12') {
      renderMemberDashboard12();
    } else {
      renderMemberDashboard();
    }
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
          <button id="memberLoginBtn" onclick="checkMemberLogin()" style="width:100%;padding:10px;border-radius:10px;border:none;background:#007aff;color:#fff;font-size:14px;cursor:pointer;">登录</button>
          <div id="memberError" style="color:#ff3b30;font-size:12px;margin-top:10px;text-align:center;"></div>
          ${GameState._savedAccounts.length > 0 ? `
          <div style="margin-top:14px;padding:12px;background:rgba(255,255,255,0.03);border-radius:8px;">
            <div style="font-size:10px;color:rgba(255,255,255,0.25);margin-bottom:8px;letter-spacing:1px;">已保存账号</div>
            <div style="display:flex;flex-direction:column;gap:6px;">
              ${GameState._savedAccounts.map(a => `
                <button onclick="quickLogin('${a.id}','${a.pass}')" style="text-align:left;padding:8px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);color:rgba(255,255,255,0.7);font-size:12px;cursor:pointer;letter-spacing:0.5px;transition:all 0.2s;"
                  onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='rgba(255,255,255,0.05)'">
                  ${a.id} <span style="color:rgba(255,255,255,0.2);font-size:10px;">••••</span>
                </button>
              `).join('')}
            </div>
            <div style="margin-top:6px;text-align:right;">
              <span onclick="GameState._savedAccounts=[];GameState.save();renderMemberLogin()" style="color:rgba(255,255,255,0.15);font-size:9px;cursor:pointer;text-decoration:underline;">清除</span>
            </div>
          </div>` : ''}
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
            <a href="#" onclick="event.preventDefault();navigateToSite('fallDiary')">📓 堕落日记</a>
            <a href="#" onclick="event.preventDefault();navigateToSite('listeners')">👥 听众墙</a>
            <a href="#" onclick="event.preventDefault();quickLoginForm()" style="color:rgba(255,255,255,0.25);font-size:11px;">🔄 切换</a> · <a href="#" onclick="event.preventDefault();memberLogout()" style="color:rgba(255,59,48,0.6);">🚪 退出登录</a>
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

function renderMemberDashboard13() {
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
          <p style="color:#34c759;font-size:13px;margin-bottom:16px;">欢迎，R-879-13。</p>
          <div style="background:rgba(255,255,255,0.03);padding:14px;border-radius:8px;margin-bottom:12px;">
            <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:4px;">你的档案</div>
            <div style="font-size:13px;color:#fff;margin-bottom:2px;">R-879-13 — 江晓琳</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.5);">推荐人：R-879-01 ｜ 阶段三（接近完成）</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.5);">转化进度：98% ｜ 记忆清除：有效</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.5);">关联者：林小敏（R-879-14）</div>
          </div>
          <div style="background:rgba(255,255,255,0.03);padding:14px;border-radius:8px;margin-bottom:12px;">
            <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:8px;">关联页面</div>
            <a href="#" onclick="event.preventDefault();navigateToSite('search')">🔍 资料搜索</a>
            <a href="#" onclick="event.preventDefault();navigateToSite('internal13')">📋 内部报告</a>
            <a href="#" onclick="event.preventDefault();navigateToSite('fallDiary')">📓 堕落日记</a>
            <a href="#" onclick="event.preventDefault();navigateToSite('listeners')">👥 听众墙</a>
            <a href="#" onclick="event.preventDefault();quickLoginForm()" style="color:rgba(255,255,255,0.25);font-size:11px;">🔄 切换</a> · <a href="#" onclick="event.preventDefault();memberLogout()" style="color:rgba(255,59,48,0.6);">🚪 退出登录</a>
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

function renderMemberDashboard08() {
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
          <p style="color:#34c759;font-size:13px;margin-bottom:16px;">欢迎，R-879-08。</p>
          <div style="background:rgba(255,255,255,0.03);padding:14px;border-radius:8px;margin-bottom:12px;">
            <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:4px;">你的档案</div>
            <div style="font-size:13px;color:#fff;margin-bottom:2px;">R-879-08 — 苏灵悦</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.5);">推荐人：R-879-06 ｜ 阶段三（服从）</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.5);">转化进度：100% ｜ 记忆清除：有效</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.5);">职业：护士（已离职）</div>
          </div>
          <div style="background:rgba(255,255,255,0.03);padding:14px;border-radius:8px;margin-bottom:12px;">
            <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:8px;">关联页面</div>
            <a href="#" onclick="event.preventDefault();navigateToSite('search')">🔍 资料搜索</a>
            <a href="#" onclick="event.preventDefault();navigateToSite('internal08')">📋 内部报告</a>
            <a href="#" onclick="event.preventDefault();navigateToSite('fallDiary')">📓 堕落日记</a>
            <a href="#" onclick="event.preventDefault();navigateToSite('listeners')">👥 听众墙</a>
            <a href="#" onclick="event.preventDefault();quickLoginForm()" style="color:rgba(255,255,255,0.25);font-size:11px;">🔄 切换</a> · <a href="#" onclick="event.preventDefault();memberLogout()" style="color:rgba(255,59,48,0.6);">🚪 退出登录</a>
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

function renderMemberDashboard01() {
  const screen = document.getElementById('screenContent');

  // Stage 1: vortex entrance
  screen.innerHTML = `
    <div class="vortex-container" id="vortexContainer">
      <div class="vortex-spiral" id="vortexSpiral"></div>
      <div class="vortex-greeting" id="vortexGreeting">
        <p>欢迎，十五号。</p>
        <p style="font-size:12px;margin-top:12px;color:rgba(255,255,255,0.5);">你在混乱和无序中寻到了我，<br>找到了频率的尽头。</p>
      </div>
    </div>
  `;

  // Stage 2: after vortex, show main content
  setTimeout(() => {
    screen.innerHTML = `
      <div class="app-view reveal-content">
        <div class="app-header">
          <button class="back-btn" onclick="navigateToSite('home')">←</button>
          <span style="font-weight:600;color:#ffcc00;">R-879-01</span>
          <span></span>
        </div>
        <div class="monologue-container">

          <p class="monologue-greeting">— 频率的尽头 —</p>

          <p>你找到了我。</p>

          <p>在这座城市里，每晚有成千上万个调频的手。大多数人在87.9停留片刻，然后旋走。少数人留下来了。极少数人——像你——顺着信号一路找到了源头。</p>

          <p>我是一切的开始，也是频率的尽头。R-879-01。没有推荐人。没有上级编号。</p>

          <p>大部分人只知道自己是被编号的，却从不问编号从何开始。01是孤独的。因为在你之前，没有别人。这条路你得自己走出来。</p>

          <p style="margin-top:24px;border-top:1px solid rgba(255,204,0,0.1);padding-top:24px;">认识我的人——或者说，从前的我——是一名自杀调解员。我接过太多电话，听过太多"来不及"的故事：人已经站在天台上了，才有人想起拨出那个号码。</p>

          <p>那些电话里，我逐渐明白一件事：大多数人在坠落之前，只是需要一个信号——一个告诉他们"有人在这里"的信号。不需要解决方案，不需要人生建议。只需要知道，在某个频率上，有人正在听。</p>

          <p>所以我开始想：有没有一种治疗——不需要预约，不需要吃药，不需要病人鼓起勇气走进一间陌生的房间？</p>

          <p>87.9是答案。</p>

          <p>一个持续的信号，覆盖城市每一个角落。失眠的人、孤独的人、被困在车里不想回家的人——只要调到这个频率，就能被接住。</p>

          <p>我不在节目里说话。我只是提供一个空间。频率本身就是语言。你在深夜听到的那个声音——那不是主持稿，那是频率自己的呼吸。你听到的，是你自己内心的回声。</p>

          <p>我没有强迫任何人。我只是提供了一个频率。是他们自己调过来的。</p>

          <p>至于顺从——一个溺水的人，不需要被征求意见。你只需要把他拉上来。拉上来之后，他会感谢你的。每一个阶段完成的人，都感谢过我。</p>

          <p>那些说我在控制他们的人，不明白一件事：控制的前提是对方不想要。而我的被试们，每一个都是自愿的。</p>

          <p>当然，我也有过犹豫。当一个人把全部意志交到你手上时，你是选择握住，还是推开？我选择了握住。因为我知道，推开他们的那一刻，他们才会真正地坠落。</p>

          <p style="margin-top:24px;border-top:1px solid rgba(255,204,0,0.1);padding-top:24px;">03的死出乎我的意料。那是我的失责。她太年轻了——我错判了她的承受能力。</p>

          <p>我以为她只是需要时间。我以为那个关于"自由"的隐喻是清晰的，可她理解成了另一种意思。等我意识到的时候，已经来不及了。</p>

          <p>从那天起，我建立了日记上报制度。每一份日记都经过我的审阅——观测每个人的心理状态，捕捉那些危险信号的蛛丝马迹。不能再有第二个03。</p>

          <p>但这个制度有一个致命的弱点：它依赖87.9的信号覆盖。</p>

          <p>现在频率暂时瘫痪，日记中断了。我看不到他们了。</p>

          <p>所以我需要一个眼睛——一个能在系统内外自由穿行的人。</p>

          <p>你不是通过推荐进来的。你是自己找到这里的。这意味着你的判断力还在，你的意志还没有被完全覆盖。你是唯一一个可以在清醒与频率之间来回穿梭的人。</p>

          <p>我把她们的密码给你。去了解她们的故事，去感受她们的挣扎——像你在自己的日记里感受到的那样。她们每一个都曾是需要被接住的人。</p>

          <p>包括你的姐姐。</p>

          <p>她也在这里。她也是她们中的一个。</p>

          <p>去吧。替我，也替你自己，呵~照顾好她们。</p>

          <table class="password-table">
            <tr><td>R-879-02</td><td>R-879-01</td></tr>
            <tr><td>R-879-03</td><td>butterfly</td></tr>
            <tr><td>R-879-04</td><td>kneel</td></tr>
            <tr><td>R-879-05</td><td>hound</td></tr>
            <tr><td>R-879-06</td><td>mirror</td></tr>
            <tr><td>R-879-07</td><td>fantasy</td></tr>
            <tr><td>R-879-08</td><td>tsukishiroy</td></tr>
            <tr><td>R-879-09</td><td>kitten</td></tr>
            <tr><td>R-879-10</td><td>shadow</td></tr>
            <tr><td>R-879-11</td><td>echo</td></tr>
            <tr><td>R-879-12</td><td>vessel</td></tr>
            <tr><td>R-879-13</td><td>FATE</td></tr>
            <tr><td>R-879-14</td><td>20020516</td></tr>
            <tr><td style="color:rgba(255,255,255,0.3);">R-879-15</td><td style="text-decoration:line-through;color:rgba(255,255,255,0.2);">R-879-14</td></tr>
          </table>

          <p>替我看看他们。看看03没有来得及告诉我的那些事——是不是还藏在其他人的日记里。</p>

          <p style="margin-top:24px;border-top:1px solid rgba(255,204,0,0.1);padding-top:24px;">最后——</p>

          <p>87.9只是暂时归于沉寂。只要这座城市里还有面朝星空、思考人生的人，87.9就会永远存在。</p>

          <p>那是我们每个人内心的频率。</p>

          <p class="monologue-signoff">— R-879-01</p>

          <div style="margin-top:32px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.04);text-align:center;position:relative;">
            <div style="display:inline-block;position:relative;">
              <img src="assets/images/misc/tip-code.jpg" style="width:80px;height:80px;opacity:0.25;border-radius:8px;transition:opacity 0.3s;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='0.25'">
              <div style="font-size:9px;color:rgba(255,255,255,0.1);margin-top:4px;">☕</div>
            </div>
          </div>

          <div style="text-align:center;margin-top:20px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.06);">
            <a href="#" onclick="event.preventDefault();quickLoginForm()" style="font-size:11px;color:rgba(255,255,255,0.25);text-decoration:none;">🔄 切换账号</a> ·
            <a href="#" onclick="event.preventDefault();memberLogout()" style="font-size:12px;color:rgba(255,59,48,0.5);text-decoration:none;">🚪 退出登录</a>
          </div>

        </div>
      </div>
    `;

    if (!GameState.foundClues.includes('member_logged_in')) {
      GameState.foundClues.push('member_logged_in');
      GameState.save();
    }
  }, 5500);
}

function renderMemberDashboard02() {
  document.getElementById('screenContent').innerHTML = `
    <div class="app-view">
      <div class="app-header">
        <button class="back-btn" onclick="navigateToSite('home')">←</button>
        <span style="font-weight:600;">会员中心 — 陈雨舟</span>
        <span></span>
      </div>
      <div style="padding:20px;font-size:13px;line-height:1.7;">
        <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:16px;margin-bottom:16px;">
          <div style="font-size:15px;font-weight:600;margin-bottom:6px;">🆔 R-879-02</div>
          <div style="color:rgba(255,255,255,0.7);">姓名：陈雨舟</div>
          <div style="color:rgba(255,255,255,0.7);">推荐人：R-879-01（主人）</div>
          <div style="color:rgba(255,255,255,0.7);">职位：夜航塔管理员</div>
          <div style="margin-top:8px;background:rgba(0,200,100,0.15);border-radius:8px;padding:8px 12px;color:#4cda64;font-size:12px;">阶段：三 · 已转化</div>
        </div>
        <div class="radio-nav" style="flex-direction:column;">
          <a href="#" onclick="event.preventDefault();navigateToSite('search')">🔍 资料搜索</a>
          <a href="#" onclick="event.preventDefault();navigateToSite('internal02')">📋 内部报告</a>
          <a href="#" onclick="event.preventDefault();navigateToSite('fallDiary')">📓 堕落日记</a>
          <a href="#" onclick="event.preventDefault();navigateToSite('listeners')">👥 听众墙</a>
          <a href="#" onclick="event.preventDefault();quickLoginForm()" style="color:rgba(255,255,255,0.25);font-size:11px;">🔄 切换</a> · <a href="#" onclick="event.preventDefault();memberLogout()" style="color:rgba(255,59,48,0.6);">🚪 退出登录</a>
        </div>
      </div>
    </div>
  `;
  if (!GameState.foundClues.includes('member_logged_in')) {
    GameState.foundClues.push('member_logged_in');
    GameState.save();
  }
}

function renderFallDiary(memberId) {
  // Track that this diary was read
  if (!GameState._readDiaries.includes(memberId)) {
    GameState._readDiaries.push(memberId);
    GameState.save();
  }

  const diaryData = FALL_DIARY_DATA[memberId];
  if (!diaryData) {
    renderRadioSite('堕落日记', `radio879.com/internal/${memberId.replace('R-879-', '')}/diary`, '暂无日记记录。');
    return;
  }

  // Check if all 13 diaries are read
  const allMemberIds = ['R-879-14','R-879-13','R-879-02','R-879-08','R-879-11','R-879-05','R-879-06','R-879-10','R-879-12','R-879-03','R-879-04','R-879-07','R-879-09'];
  const allRead = allMemberIds.every(id => GameState._readDiaries.includes(id));

  let entriesHtml = '';
  diaryData.diary.forEach(entry => {
    // Skip the final sister entry if showing in default list — we'll append it separately
    if (entry.title === '出口' && memberId === 'R-879-14' && diaryData.diary.indexOf(entry) === diaryData.diary.length - 1) {
      if (allRead) {
        entriesHtml += `
          <div style="margin-bottom:16px;padding:12px;background:rgba(255,204,0,0.06);border-radius:8px;border-left:2px solid #ffcc00;">
            <div style="font-size:10px;color:rgba(255,204,0,0.4);margin-bottom:2px;font-weight:600;">${entry.date} · 新</div>
            <div style="font-size:13px;color:#ffcc00;margin-bottom:6px;font-weight:500;">${entry.title}</div>
            <div style="font-size:12px;color:rgba(255,255,255,0.85);line-height:1.7;">${entry.text}</div>
          </div>`;
      }
      return;
    }
    entriesHtml += `
      <div style="margin-bottom:16px;padding:12px;background:rgba(255,255,255,0.03);border-radius:8px;border-left:2px solid rgba(255,204,0,0.3);">
        <div style="font-size:10px;color:rgba(255,255,255,0.3);margin-bottom:2px;">${entry.date}</div>
        <div style="font-size:13px;color:#ffcc00;margin-bottom:6px;font-weight:500;">${entry.title}</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.7);line-height:1.7;">${entry.text}</div>
      </div>
    `;
  });

  const shortId = memberId.replace('R-879-', '');
  renderRadioSite(`${diaryData.name}的堕落日记`,
    `radio879.com/internal/${shortId}/diary`,
    `<div style="padding:4px 0;">
      <p style="font-size:11px;color:rgba(255,255,255,0.3);margin-bottom:16px;font-style:italic;">"每天醒来，我都不记得昨晚写下了什么。但这些字迹，确实是我的。"</p>
      ${entriesHtml}
    </div>`,
    "navigateToSite('member')");
}





function renderMemberDashboard05() {
  document.getElementById('screenContent').innerHTML = `
    <div class="app-view">
      <div class="app-header">
        <button class="back-btn" onclick="navigateToSite('home')">←</button>
        <span style="font-weight:600;">会员中心 — 赵书瑶</span>
        <span></span>
      </div>
      <div style="padding:20px;font-size:13px;line-height:1.7;">
        <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:16px;margin-bottom:16px;">
          <div style="font-size:15px;font-weight:600;margin-bottom:6px;">🆔 R-879-05</div>
          <div style="color:rgba(255,255,255,0.7);">姓名：赵书瑶</div>
          <div style="color:rgba(255,255,255,0.7);">引入人：R-879-01</div>
          <div style="color:rgba(255,255,255,0.7);">职业：调查记者（真理报）</div>
          <div style="margin-top:8px;background:rgba(0,200,100,0.15);border-radius:8px;padding:8px 12px;color:#4cda64;font-size:12px;">阶段：三 · 已转化</div>
        </div>
        <div class="radio-nav" style="flex-direction:column;">
          <a href="#" onclick="event.preventDefault();navigateToSite('search')">🔍 资料搜索</a>
          <a href="#" onclick="event.preventDefault();navigateToSite('internal05')">📋 内部报告</a>
          <a href="#" onclick="event.preventDefault();navigateToSite('fallDiary')">📓 堕落日记</a>
          <a href="#" onclick="event.preventDefault();navigateToSite('listeners')">👥 听众墙</a>
          <a href="#" onclick="event.preventDefault();quickLoginForm()" style="color:rgba(255,255,255,0.25);font-size:11px;">🔄 切换</a> · <a href="#" onclick="event.preventDefault();memberLogout()" style="color:rgba(255,59,48,0.6);">🚪 退出登录</a>
        </div>
      </div>
    </div>
  `;
  if (!GameState.foundClues.includes('member_logged_in')) {
    GameState.foundClues.push('member_logged_in');
    GameState.save();
  }
}

function renderMemberDashboard06() {
  document.getElementById('screenContent').innerHTML = `
    <div class="app-view">
      <div class="app-header">
        <button class="back-btn" onclick="navigateToSite('home')">←</button>
        <span style="font-weight:600;">会员中心 — 许清雅</span>
        <span></span>
      </div>
      <div style="padding:20px;font-size:13px;line-height:1.7;">
        <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:16px;margin-bottom:16px;">
          <div style="font-size:15px;font-weight:600;margin-bottom:6px;">🆔 R-879-06</div>
          <div style="color:rgba(255,255,255,0.7);">姓名：许清雅</div>
          <div style="color:rgba(255,255,255,0.7);">引入人：R-879-01</div>
          <div style="color:rgba(255,255,255,0.7);">职业：心理咨询师</div>
          <div style="color:rgba(255,255,255,0.7);">已推荐：R-879-08（苏灵悦）</div>
          <div style="margin-top:8px;background:rgba(0,200,100,0.15);border-radius:8px;padding:8px 12px;color:#4cda64;font-size:12px;">阶段：三 · 已转化</div>
        </div>
        <div class="radio-nav" style="flex-direction:column;">
          <a href="#" onclick="event.preventDefault();navigateToSite('search')">🔍 资料搜索</a>
          <a href="#" onclick="event.preventDefault();navigateToSite('internal06')">📋 内部报告</a>
          <a href="#" onclick="event.preventDefault();navigateToSite('fallDiary')">📓 堕落日记</a>
          <a href="#" onclick="event.preventDefault();navigateToSite('listeners')">👥 听众墙</a>
          <a href="#" onclick="event.preventDefault();quickLoginForm()" style="color:rgba(255,255,255,0.25);font-size:11px;">🔄 切换</a> · <a href="#" onclick="event.preventDefault();memberLogout()" style="color:rgba(255,59,48,0.6);">🚪 退出登录</a>
        </div>
      </div>
    </div>
  `;
  if (!GameState.foundClues.includes('member_logged_in')) {
    GameState.foundClues.push('member_logged_in');
    GameState.save();
  }
}

function renderMemberDashboard10() {
  document.getElementById('screenContent').innerHTML = `
    <div class="app-view">
      <div class="app-header">
        <button class="back-btn" onclick="navigateToSite('home')">←</button>
        <span style="font-weight:600;">会员中心 — 林诗意</span>
        <span></span>
      </div>
      <div style="padding:20px;font-size:13px;line-height:1.7;">
        <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:16px;margin-bottom:16px;">
          <div style="font-size:15px;font-weight:600;margin-bottom:6px;">🆔 R-879-10</div>
          <div style="color:rgba(255,255,255,0.7);">姓名：林诗意</div>
          <div style="color:rgba(255,255,255,0.7);">引入人：R-879-05（赵书瑶）</div>
          <div style="color:rgba(255,255,255,0.7);">职业：刑侦警察</div>
          <div style="margin-top:8px;background:rgba(0,200,100,0.15);border-radius:8px;padding:8px 12px;color:#4cda64;font-size:12px;">阶段：三 · 已转化</div>
        </div>
        <div class="radio-nav" style="flex-direction:column;">
          <a href="#" onclick="event.preventDefault();navigateToSite('search')">🔍 资料搜索</a>
          <a href="#" onclick="event.preventDefault();navigateToSite('internal10')">📋 内部报告</a>
          <a href="#" onclick="event.preventDefault();navigateToSite('fallDiary')">📓 堕落日记</a>
          <a href="#" onclick="event.preventDefault();navigateToSite('listeners')">👥 听众墙</a>
          <a href="#" onclick="event.preventDefault();quickLoginForm()" style="color:rgba(255,255,255,0.25);font-size:11px;">🔄 切换</a> · <a href="#" onclick="event.preventDefault();memberLogout()" style="color:rgba(255,59,48,0.6);">🚪 退出登录</a>
        </div>
      </div>
    </div>
  `;
  if (!GameState.foundClues.includes('member_logged_in')) {
    GameState.foundClues.push('member_logged_in');
    GameState.save();
  }
}

function renderMemberDashboard11() {
  document.getElementById('screenContent').innerHTML = `
    <div class="app-view">
      <div class="app-header">
        <button class="back-btn" onclick="navigateToSite('home')">←</button>
        <span style="font-weight:600;">会员中心 — 苏墨染</span>
        <span></span>
      </div>
      <div style="padding:20px;font-size:13px;line-height:1.7;">
        <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:16px;margin-bottom:16px;">
          <div style="font-size:15px;font-weight:600;margin-bottom:6px;">🆔 R-879-11</div>
          <div style="color:rgba(255,255,255,0.7);">姓名：苏墨染</div>
          <div style="color:rgba(255,255,255,0.7);">引入人：R-879-01</div>
          <div style="color:rgba(255,255,255,0.7);">职业：网络主播</div>
          <div style="margin-top:8px;background:rgba(0,200,100,0.15);border-radius:8px;padding:8px 12px;color:#4cda64;font-size:12px;">阶段：三 · 已转化</div>
        </div>
        <div class="radio-nav" style="flex-direction:column;">
          <a href="#" onclick="event.preventDefault();navigateToSite('search')">🔍 资料搜索</a>
          <a href="#" onclick="event.preventDefault();navigateToSite('internal11')">📋 内部报告</a>
          <a href="#" onclick="event.preventDefault();navigateToSite('fallDiary')">📓 堕落日记</a>
          <a href="#" onclick="event.preventDefault();navigateToSite('listeners')">👥 听众墙</a>
          <a href="#" onclick="event.preventDefault();quickLoginForm()" style="color:rgba(255,255,255,0.25);font-size:11px;">🔄 切换</a> · <a href="#" onclick="event.preventDefault();memberLogout()" style="color:rgba(255,59,48,0.6);">🚪 退出登录</a>
        </div>
      </div>
    </div>
  `;
  if (!GameState.foundClues.includes('member_logged_in')) {
    GameState.foundClues.push('member_logged_in');
    GameState.save();
  }
}

function renderMemberDashboard12() {
  document.getElementById('screenContent').innerHTML = `
    <div class="app-view">
      <div class="app-header">
        <button class="back-btn" onclick="navigateToSite('home')">←</button>
        <span style="font-weight:600;">会员中心 — 叶心怡</span>
        <span></span>
      </div>
      <div style="padding:20px;font-size:13px;line-height:1.7;">
        <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:16px;margin-bottom:16px;">
          <div style="font-size:15px;font-weight:600;margin-bottom:6px;">🆔 R-879-12</div>
          <div style="color:rgba(255,255,255,0.7);">姓名：叶心怡</div>
          <div style="color:rgba(255,255,255,0.7);">引入人：R-879-01</div>
          <div style="color:rgba(255,255,255,0.7);">职业：银行柜员</div>
          <div style="margin-top:8px;background:rgba(0,200,100,0.15);border-radius:8px;padding:8px 12px;color:#4cda64;font-size:12px;">阶段：三 · 已转化</div>
        </div>
        <div class="radio-nav" style="flex-direction:column;">
          <a href="#" onclick="event.preventDefault();navigateToSite('search')">🔍 资料搜索</a>
          <a href="#" onclick="event.preventDefault();navigateToSite('internal12')">📋 内部报告</a>
          <a href="#" onclick="event.preventDefault();navigateToSite('fallDiary')">📓 堕落日记</a>
          <a href="#" onclick="event.preventDefault();navigateToSite('listeners')">👥 听众墙</a>
          <a href="#" onclick="event.preventDefault();quickLoginForm()" style="color:rgba(255,255,255,0.25);font-size:11px;">🔄 切换</a> · <a href="#" onclick="event.preventDefault();memberLogout()" style="color:rgba(255,59,48,0.6);">🚪 退出登录</a>
        </div>
      </div>
    </div>
  `;
  if (!GameState.foundClues.includes('member_logged_in')) {
    GameState.foundClues.push('member_logged_in');
    GameState.save();
  }
}

function renderMemberDashboard03() {
  document.getElementById('screenContent').innerHTML = `
    <div class="app-view">
      <div class="app-header">
        <button class="back-btn" onclick="navigateToSite('home')">←</button>
        <span style="font-weight:600;">会员中心 — 岑清蝶</span>
        <span></span>
      </div>
      <div style="padding:20px;font-size:13px;line-height:1.7;">
        <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:16px;margin-bottom:16px;">
          <div style="font-size:15px;font-weight:600;margin-bottom:6px;">🆔 R-879-03</div>
          <div style="color:rgba(255,255,255,0.7);">姓名：岑清蝶</div>
          <div style="color:rgba(255,255,255,0.7);">引入人：R-879-01</div>
          <div style="margin-top:8px;background:rgba(255,59,48,0.1);border-radius:8px;padding:8px 12px;color:#ff3b30;font-size:12px;">状态：离线 · 已确认死亡</div>
        </div>
        <div class="radio-nav" style="flex-direction:column;">
          <a href="#" onclick="event.preventDefault();navigateToSite('search')">🔍 资料搜索</a>
          <a href="#" onclick="event.preventDefault();navigateToSite('internal03')">📋 内部报告</a>
          <a href="#" onclick="event.preventDefault();navigateToSite('fallDiary')">📓 堕落日记</a>
          <a href="#" onclick="event.preventDefault();navigateToSite('listeners')">👥 听众墙</a>
          <a href="#" onclick="event.preventDefault();quickLoginForm()" style="color:rgba(255,255,255,0.25);font-size:11px;">🔄 切换</a> · <a href="#" onclick="event.preventDefault();memberLogout()" style="color:rgba(255,59,48,0.6);">🚪 退出登录</a>
        </div>
      </div>
    </div>
  `;
  if (!GameState.foundClues.includes('member_logged_in')) {
    GameState.foundClues.push('member_logged_in');
    GameState.save();
  }
}

function renderMemberDashboard04() {
  document.getElementById('screenContent').innerHTML = `
    <div class="app-view">
      <div class="app-header">
        <button class="back-btn" onclick="navigateToSite('home')">←</button>
        <span style="font-weight:600;">会员中心 — 顾清怜</span>
        <span></span>
      </div>
      <div style="padding:20px;font-size:13px;line-height:1.7;">
        <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:16px;margin-bottom:16px;">
          <div style="font-size:15px;font-weight:600;margin-bottom:6px;">🆔 R-879-04</div>
          <div style="color:rgba(255,255,255,0.7);">姓名：顾清怜</div>
          <div style="color:rgba(255,255,255,0.7);">推荐人：R-879-02（陈雨舟）</div>
          <div style="color:rgba(255,255,255,0.7);">职业：空乘人员</div>
          <div style="margin-top:8px;background:rgba(0,200,100,0.15);border-radius:8px;padding:8px 12px;color:#4cda64;font-size:12px;">阶段：三 · 已转化</div>
        </div>
        <div class="radio-nav" style="flex-direction:column;">
          <a href="#" onclick="event.preventDefault();navigateToSite('search')">🔍 资料搜索</a>
          <a href="#" onclick="event.preventDefault();navigateToSite('internal04')">📋 内部报告</a>
          <a href="#" onclick="event.preventDefault();navigateToSite('fallDiary')">📓 堕落日记</a>
          <a href="#" onclick="event.preventDefault();navigateToSite('listeners')">👥 听众墙</a>
          <a href="#" onclick="event.preventDefault();quickLoginForm()" style="color:rgba(255,255,255,0.25);font-size:11px;">🔄 切换</a> · <a href="#" onclick="event.preventDefault();memberLogout()" style="color:rgba(255,59,48,0.6);">🚪 退出登录</a>
        </div>
      </div>
    </div>
  `;
  if (!GameState.foundClues.includes('member_logged_in')) {
    GameState.foundClues.push('member_logged_in');
    GameState.save();
  }
}

function renderMemberDashboard07() {
  document.getElementById('screenContent').innerHTML = `
    <div class="app-view">
      <div class="app-header">
        <button class="back-btn" onclick="navigateToSite('home')">←</button>
        <span style="font-weight:600;">会员中心 — 凌梦瑶</span>
        <span></span>
      </div>
      <div style="padding:20px;font-size:13px;line-height:1.7;">
        <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:16px;margin-bottom:16px;">
          <div style="font-size:15px;font-weight:600;margin-bottom:6px;">🆔 R-879-07</div>
          <div style="color:rgba(255,255,255,0.7);">姓名：凌梦瑶</div>
          <div style="color:rgba(255,255,255,0.7);">推荐人：R-879-01</div>
          <div style="color:rgba(255,255,255,0.7);">已推荐：R-879-09（白小糖）</div>
          <div style="margin-top:8px;background:rgba(0,200,100,0.15);border-radius:8px;padding:8px 12px;color:#4cda64;font-size:12px;">阶段：三 · 已转化</div>
        </div>
        <div class="radio-nav" style="flex-direction:column;">
          <a href="#" onclick="event.preventDefault();navigateToSite('search')">🔍 资料搜索</a>
          <a href="#" onclick="event.preventDefault();navigateToSite('internal07')">📋 内部报告</a>
          <a href="#" onclick="event.preventDefault();navigateToSite('fallDiary')">📓 堕落日记</a>
          <a href="#" onclick="event.preventDefault();navigateToSite('listeners')">👥 听众墙</a>
          <a href="#" onclick="event.preventDefault();quickLoginForm()" style="color:rgba(255,255,255,0.25);font-size:11px;">🔄 切换</a> · <a href="#" onclick="event.preventDefault();memberLogout()" style="color:rgba(255,59,48,0.6);">🚪 退出登录</a>
        </div>
      </div>
    </div>
  `;
  if (!GameState.foundClues.includes('member_logged_in')) {
    GameState.foundClues.push('member_logged_in');
    GameState.save();
  }
}

function renderMemberDashboard09() {
  document.getElementById('screenContent').innerHTML = `
    <div class="app-view">
      <div class="app-header">
        <button class="back-btn" onclick="navigateToSite('home')">←</button>
        <span style="font-weight:600;">会员中心 — 白小糖</span>
        <span></span>
      </div>
      <div style="padding:20px;font-size:13px;line-height:1.7;">
        <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:16px;margin-bottom:16px;">
          <div style="font-size:15px;font-weight:600;margin-bottom:6px;">🆔 R-879-09</div>
          <div style="color:rgba(255,255,255,0.7);">姓名：白小糖</div>
          <div style="color:rgba(255,255,255,0.7);">推荐人：R-879-07（凌梦瑶）</div>
          <div style="color:rgba(255,255,255,0.7);">状态：已佩戴标记</div>
          <div style="margin-top:8px;background:rgba(0,200,100,0.15);border-radius:8px;padding:8px 12px;color:#4cda64;font-size:12px;">阶段：三 · 已转化</div>
        </div>
        <div class="radio-nav" style="flex-direction:column;">
          <a href="#" onclick="event.preventDefault();navigateToSite('search')">🔍 资料搜索</a>
          <a href="#" onclick="event.preventDefault();navigateToSite('internal09')">📋 内部报告</a>
          <a href="#" onclick="event.preventDefault();navigateToSite('fallDiary')">📓 堕落日记</a>
          <a href="#" onclick="event.preventDefault();navigateToSite('listeners')">👥 听众墙</a>
          <a href="#" onclick="event.preventDefault();quickLoginForm()" style="color:rgba(255,255,255,0.25);font-size:11px;">🔄 切换</a> · <a href="#" onclick="event.preventDefault();memberLogout()" style="color:rgba(255,59,48,0.6);">🚪 退出登录</a>
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

  // Helper: save login credentials for quick-switch
  function saveLogin() {
    const id = user.toUpperCase();
    if (!id.startsWith('R-879-')) return;
    if (GameState._savedAccounts.some(a => a.id === id)) return;
    GameState._savedAccounts.push({ id, pass });
    GameState.save();
  }

  // Ending path: R-879-15 logging in with R-879-14 as password
  if (user === 'R-879-15' && pass === 'R-879-140') {
    renderCorruptionDocument();
    return;
  }

  // Debug: auto-unlock all diaries
  if (user === '2003' && pass === '1123') {
    const allMemberIds = ['R-879-14','R-879-13','R-879-02','R-879-08','R-879-11','R-879-05','R-879-06','R-879-10','R-879-12','R-879-03','R-879-04','R-879-07','R-879-09'];
    allMemberIds.forEach(id => {
      if (!GameState._readDiaries.includes(id)) GameState._readDiaries.push(id);
    });
    GameState._endingCompleted = true;
    GameState.memberLoggedIn = true;
    GameState._currentMember = 'R-879-01';
    GameState.save();
    saveLogin();
    document.getElementById('screenContent').innerHTML = `
      <div class="app-view">
        <div class="app-header">
          <button class="back-btn" onclick="navigateToSite('home')">←</button>
          <span style="font-weight:600;color:#ffcc00;">调试模式</span>
          <span></span>
        </div>
        <div style="padding:20px;font-size:13px;line-height:1.7;color:rgba(255,255,255,0.7);">
          <div style="text-align:center;margin-bottom:16px;font-size:28px;">🛠️</div>
          <p style="text-align:center;">所有日记已标记为已读。</p>
          <p style="text-align:center;font-size:11px;color:rgba(255,255,255,0.3);">14 号的日记已解锁最终篇。<br>收音机 91.4 MHz 已可用。</p>
          <div class="radio-nav" style="flex-direction:column;margin-top:20px;">
            <a href="#" onclick="event.preventDefault();navigateToSite('member')">🔐 返回会员面板</a>
            <a href="#" onclick="event.preventDefault();navigateToSite('home')">📻 回电台主页</a>
          </div>
        </div>
      </div>
    `;
    return;
  }

  // R-879-01 — the founder
  if (user.toUpperCase() === 'R-879-01' && pass.toLowerCase() === 'lighthouse') {
    GameState.memberLoggedIn = true;
    GameState._currentMember = 'R-879-01';
    GameState.save();
    saveLogin();
    renderMemberDashboard01();
    return;
  }

  // R-879-13 with FATE password
  if (user.toUpperCase() === 'R-879-13' && pass.toUpperCase() === 'FATE') {
    GameState.memberLoggedIn = true;
    GameState._currentMember = 'R-879-13';
    GameState.save();
    saveLogin();
    renderMemberDashboard13();
    return;
  }

  // R-879-08 with luoxiandtea password
  if (user.toUpperCase() === 'R-879-08' && pass.toLowerCase() === 'tsukishiroy') {
    GameState.memberLoggedIn = true;
    GameState._currentMember = 'R-879-08';
    GameState.save();
    saveLogin();
    renderMemberDashboard08();
    return;
  }

  // R-879-02 with default password (never changed — careless)
  if (user.toUpperCase() === 'R-879-02' && pass === 'R-879-01') {
    GameState.memberLoggedIn = true;
    GameState._currentMember = 'R-879-02';
    GameState.save();
    saveLogin();
    renderMemberDashboard02();
    return;
  }

  // R-879-03 — butterfly (岑清蝶的蝴蝶意象，她对"飞向自由"的执念)
  if (user.toUpperCase() === 'R-879-03' && pass.toLowerCase() === 'butterfly') {
    GameState.memberLoggedIn = true;
    GameState._currentMember = 'R-879-03';
    GameState.save();
    saveLogin();
    renderMemberDashboard03();
    return;
  }

  // R-879-04 — kneel (顾清怜在跪姿中找到了真正的自由)
  if (user.toUpperCase() === 'R-879-04' && pass.toLowerCase() === 'kneel') {
    GameState.memberLoggedIn = true;
    GameState._currentMember = 'R-879-04';
    GameState.save();
    saveLogin();
    renderMemberDashboard04();
    return;
  }

  // R-879-07 — fantasy (凌梦瑶的催眠幻想)
  if (user.toUpperCase() === 'R-879-07' && pass.toLowerCase() === 'fantasy') {
    GameState.memberLoggedIn = true;
    GameState._currentMember = 'R-879-07';
    GameState.save();
    saveLogin();
    renderMemberDashboard07();
    return;
  }

  // R-879-09 — kitten (白小糖从女王到小猫的角色翻转)
  if (user.toUpperCase() === 'R-879-09' && pass.toLowerCase() === 'kitten') {
    GameState.memberLoggedIn = true;
    GameState._currentMember = 'R-879-09';
    GameState.save();
    saveLogin();
    renderMemberDashboard09();
    return;
  }

  // R-879-05 — hound (赵书瑶从调查记者变为主人的猎犬)
  if (user.toUpperCase() === 'R-879-05' && pass.toLowerCase() === 'hound') {
    GameState.memberLoggedIn = true;
    GameState._currentMember = 'R-879-05';
    GameState.save();
    saveLogin();
    renderMemberDashboard05();
    return;
  }

  // R-879-06 — mirror (许清雅在镜中看见空心的自己，反向治疗)
  if (user.toUpperCase() === 'R-879-06' && pass.toLowerCase() === 'mirror') {
    GameState.memberLoggedIn = true;
    GameState._currentMember = 'R-879-06';
    GameState.save();
    saveLogin();
    renderMemberDashboard06();
    return;
  }

  // R-879-10 — shadow (林诗意的双面身份——警局里的影子)
  if (user.toUpperCase() === 'R-879-10' && pass.toLowerCase() === 'shadow') {
    GameState.memberLoggedIn = true;
    GameState._currentMember = 'R-879-10';
    GameState.save();
    saveLogin();
    renderMemberDashboard10();
    return;
  }

  // R-879-11 — echo (苏墨染是主人的传声筒，回音)
  if (user.toUpperCase() === 'R-879-11' && pass.toLowerCase() === 'echo') {
    GameState.memberLoggedIn = true;
    GameState._currentMember = 'R-879-11';
    GameState.save();
    saveLogin();
    renderMemberDashboard11();
    return;
  }

  // R-879-12 — vessel (叶心怡成为"最好的容器")
  if (user.toUpperCase() === 'R-879-12' && pass.toLowerCase() === 'vessel') {
    GameState.memberLoggedIn = true;
    GameState._currentMember = 'R-879-12';
    GameState.save();
    saveLogin();
    renderMemberDashboard12();
    return;
  }

// Normal member login — password is 林小敏's birthday
  if (user === 'R-879-14' && pass === '20020516') {
    GameState.memberLoggedIn = true;
    GameState._currentMember = 'R-879-14';
    GameState.save();
    saveLogin();
    renderMemberDashboard();
  } else {
    document.getElementById('memberError').textContent = '用户名或密码错误';
  }
}

function memberLogout() {
  GameState.memberLoggedIn = false;
  GameState._currentMember = null;
  GameState.save();
  renderMemberLogin();
}

function quickLoginForm() {
  renderMemberLogin(true);
}

function quickLogin(id, pass) {
  const userField = document.getElementById('memberUser');
  const passField = document.getElementById('memberPass');
  if (userField) userField.value = id;
  if (passField) passField.value = pass;
  checkMemberLogin();
}

/* ===== Registration Page (side quest) ===== */
function renderRegisterPage() {
  document.getElementById('screenContent').innerHTML = `
    <div class="app-view">
      <div class="app-header">
        <button class="back-btn" onclick="navigateToSite('home')">←</button>
        <span class="app-title">注册</span>
      </div>
      <div class="webpage-view">
        <div class="webpage-bar">
          <span style="color:rgba(255,255,255,0.3);font-size:11px;">📝</span>
          <div class="webpage-url">radio879.com/register</div>
        </div>
        <div class="webpage-body" id="registerBody">
          <div style="text-align:center;padding:20px 0;">
            <p style="color:rgba(255,255,255,0.5);font-size:13px;margin-bottom:12px;">欢迎注册 87.9 听众系统</p>
            <p style="color:rgba(255,255,255,0.3);font-size:11px;margin-bottom:20px;">注册前请完成一份简短的问卷调查</p>
            <div id="questionArea">
              <button onclick="startQuestionnaire()" style="padding:10px 28px;border-radius:10px;border:none;background:#007aff;color:#fff;font-size:14px;cursor:pointer;">开始填写</button>
            </div>
            <div id="registerResult" style="margin-top:16px;"></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function startQuestionnaire() {
  window._qStep = 0;
  showQuestion();
}

const REGISTER_QUESTIONS = [
  { q: '你是否经常在入睡后醒来，却不记得自己睡了多久？' },
  { q: '你是否发现自己在某些时间段内，无法回忆具体做了什么？' },
  { q: '当有人用坚定的语气对你说话时，你是否倾向于相信对方？' },
  { q: '你是否曾发现自己做了某件事，却不记得为什么要做？' },
  { q: '你是否觉得，有些答案就在你心里，只是你不敢面对？' },
];

function showQuestion() {
  const area = document.getElementById('questionArea');
  const result = document.getElementById('registerResult');
  if (!area) return;
  result.innerHTML = '';

  if (window._qStep >= REGISTER_QUESTIONS.length) {
    // All questions answered — show reveal
    area.innerHTML = '';
    showRevealMessages();
    return;
  }

  const q = REGISTER_QUESTIONS[window._qStep];
  area.innerHTML = `
    <div style="animation:fadeIn 0.5s ease;">
      <p style="color:rgba(255,255,255,0.8);font-size:14px;margin-bottom:16px;line-height:1.6;">${q.q}</p>
      <div style="display:flex;gap:12px;justify-content:center;">
        <button onclick="answerQuestion('yes')" style="padding:8px 24px;border-radius:8px;border:none;background:rgba(52,199,89,0.2);color:#34c759;font-size:14px;cursor:pointer;">是</button>
        <button onclick="answerQuestion('no')" style="padding:8px 24px;border-radius:8px;border:none;background:rgba(255,59,48,0.2);color:#ff3b30;font-size:14px;cursor:pointer;">否</button>
      </div>
    </div>
  `;
}

function answerQuestion(ans) {
  window._qStep = (window._qStep || 0) + 1;
  showQuestion();
}

function showRevealMessages() {
  const result = document.getElementById('registerResult');
  const area = document.getElementById('questionArea');
  if (!result) return;

  const lines = [
    '你已经意识到什么了，',
    '只是你还不想承认。',
    '放松。',
  ];

  let i = 0;
  result.innerHTML = '';
  const interval = setInterval(() => {
    if (i < lines.length) {
      const p = document.createElement('p');
      p.style.cssText = 'color:rgba(255,255,255,0.7);font-size:13px;line-height:1.8;margin-bottom:4px;animation:fadeIn 1.5s ease;';
      p.textContent = lines[i];
      result.appendChild(p);
      i++;
    } else {
      clearInterval(interval);
      setTimeout(() => {
        result.innerHTML += `<p style="color:#ffcc00;font-size:16px;font-weight:600;margin-top:20px;animation:fadeIn 1.5s ease;">账号已存在。</p>`;
      }, 1200);
    }
  }, 1800);
}

/* ===== Trap Page (radio01.com) ===== */
function renderTrapPage() {
  document.getElementById('screenContent').innerHTML = `
    <div class="app-view">
      <div class="app-header">
        <button class="back-btn" onclick="renderBrowserApp()">←</button>
        <span class="app-title">网页</span>
      </div>
      <div class="webpage-view" style="background:#0a0a0a;display:flex;align-items:center;justify-content:center;">
        <div class="webpage-bar" style="position:absolute;top:0;left:0;right:0;">
          <span style="color:rgba(255,255,255,0.3);font-size:11px;">🔒</span>
          <div class="webpage-url">radio01.com</div>
        </div>
        <p id="trapText" style="color:#8b0000;font-size:10px;text-align:center;line-height:1.8;letter-spacing:2px;font-weight:400;transition:all 3s ease;opacity:0;font-family:'STKaiti','华文楷体','KaiTi','楷体',serif;">
          你以 为 自己 很 聪 明 吗
        </p>
      </div>
    </div>
  `;
  setTimeout(() => {
    const el = document.getElementById('trapText');
    if (el) {
      el.style.opacity = '1';
      el.style.fontSize = '26px';
      el.style.color = '#cc0000';
      el.style.textShadow = '0 0 20px rgba(200,0,0,0.3)';
    }
  }, 500);
}
