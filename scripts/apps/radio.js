/* ===== Radio App ===== */

function stopWhiteNoise() {
  if (_whiteNoiseAudio) {
    _whiteNoiseAudio.pause();
    _whiteNoiseAudio = null;
  }
}

function stopAllRadioAudio() {
  stopWhiteNoise();
  // Reset bg music back to background volume
  if (_bgMusicAudio) {
    _bgMusicAudio.volume = _bgMusicMuted ? 0 : 0.12;
  }
}

function updateWhiteNoise(freq) {
  const dist = Math.abs(freq - 87.9);

  if (dist < 0.01) {
    // Exact 87.9 — turn up background music volume
    stopWhiteNoise();
    if (_bgMusicAudio) {
      _bgMusicAudio.volume = _bgMusicMuted ? 0 : 0.4;
    }
    return;
  }

  // Not at 87.9 — restore background volume
  if (_bgMusicAudio) {
    _bgMusicAudio.volume = _bgMusicMuted ? 0 : 0.12;
  }

  if (dist < 0.6) {
    const vol = Math.max(0, 1 - dist / 0.6) * 0.3;

    if (!_whiteNoiseAudio) {
      _whiteNoiseAudio = new Audio('assets/audio/white-noise.mp3');
      _whiteNoiseAudio.loop = true;
    }

    _whiteNoiseAudio.volume = vol;
    if (_whiteNoiseAudio.paused) {
      _whiteNoiseAudio.play().catch(() => {});
    }
  } else {
    stopWhiteNoise();
  }
}

function renderRadioApp() {
  const freq = RADIO_DATA.currentFrequency || 87.0;
  const isSpecial = Math.abs(freq - 87.9) < 0.06;
  const isNear = !isSpecial && Math.abs(freq - 87.9) < 0.6;
  const isNear93 = !isSpecial && !isNear && Math.abs(freq - 93.5) < 0.06;
  const showFineTune = GameState.fineTuneUnlocked;
  const fineMode = showFineTune && (RADIO_DATA._fineMode || false);

  // Check for 99.5 special Easter egg
  const is995 = Math.abs(freq - 99.5) < 0.06;

  // Check for 91.4 hidden signal (sister's frequency, unlocked after all diaries read)
  const allRead = GameState._readDiaries && GameState._readDiaries.length >= 13;
  const is914 = Math.abs(freq - 91.4) < 0.06 && allRead;

  // Check for 100.3 — 真理报 broadcast (always available, phase 1)
  const is1003 = Math.abs(freq - 100.3) < 0.06;

  let contentHtml = '';
  if (is995) {
    if (RADIO_DATA._995Revealed) {
      const step = RADIO_DATA._995RevealStep || 0;
      let lines = [];
      if (step >= 1) lines.push('这是我给自己留下的提示……');
      if (step >= 2) lines.push('再向前一步，就能看到答案。');
      if (step >= 3) lines.push('<strong style="font-size:18px;letter-spacing:4px;">LHCMHFGS</strong>');
      contentHtml = lines.length
        ? `<div class="radio-text" style="color:#ffcc00;text-align:center;line-height:2.5;">${lines.join('<br>')}<span class="cursor-blink">▍</span></div>`
        : `<div class="radio-static">--- 兹……99.5……兹……---</div>`;
    } else {
      contentHtml = `<div class="radio-static">--- 兹……99.5……兹……---</div>`;
    }
  } else if (isSpecial) {
    const isExact = Math.abs(freq - 87.9) < 0.01;
    const allTexts = RADIO_DATA.content
      .filter(t => t.phase <= GameState.gamePhase)
      .filter(t => isExact || t.id !== 'r4')
      .map(t => t.text);

    // Initialize or reset reveal when frequency changes
    if (!RADIO_DATA._87Freq || Math.abs(RADIO_DATA._87Freq - freq) > 0.001) {
      RADIO_DATA._87Freq = freq;
      RADIO_DATA._87RevealIndex = 0;
      if (RADIO_DATA._87RevealTimer) {
        clearTimeout(RADIO_DATA._87RevealTimer);
        RADIO_DATA._87RevealTimer = null;
      }
    }

    // Show revealed lines only
    const shownTexts = allTexts.slice(0, RADIO_DATA._87RevealIndex + 1);
    if (shownTexts.length > 0) {
      contentHtml = `<div class="radio-text">${shownTexts.join('\n\n')}</div>`;
    } else {
      contentHtml = `<div class="radio-static">--- 静电噪音 ---</div>`;
    }

    // Schedule next line reveal
    if (RADIO_DATA._87RevealIndex < allTexts.length - 1 && !RADIO_DATA._87RevealTimer) {
      RADIO_DATA._87RevealTimer = setTimeout(() => {
        RADIO_DATA._87RevealTimer = null;
        RADIO_DATA._87RevealIndex++;
        renderRadioApp();
      }, 2500);
    }
  } else if (isNear && !fineMode) {
    contentHtml = `<div class="radio-static">--- 兹……${freq.toFixed(1)}……兹……有东西在附近……---</div>`;
  } else if (is914) {
    const step = RADIO_DATA._914Step || 0;
    const msg = RADIO_DATA._914Message || '';
    if (step === 0) {
      contentHtml = `<div class="radio-static">--- 兹……91.4……兹……一个微弱的信号……---</div>`;
    } else if (step === 1) {
      contentHtml = `<div class="radio-text" style="color:rgba(255,255,255,0.85);line-height:2;">${msg}<span class="cursor-blink">▍</span></div>`;
    } else if (step === 2) {
      contentHtml = `
        <div class="radio-text" style="color:rgba(255,255,255,0.85);line-height:2;">${msg}</div>
        <div style="margin-top:20px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.1);">
          <div style="font-size:13px;color:#ffcc00;margin-bottom:12px;text-align:center;">—— 你选择 ——</div>
          <div style="display:flex;flex-direction:column;gap:8px;max-width:220px;margin:0 auto;">
            <button onclick="sisterChoiceStay()" style="padding:10px;border-radius:10px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.06);color:#fff;font-size:12px;cursor:pointer;">留下来，继续当 15 号</button>
            <button onclick="sisterChoiceLeave()" style="padding:10px;border-radius:10px;border:1px solid rgba(255,204,0,0.3);background:rgba(255,204,0,0.08);color:#ffcc00;font-size:12px;cursor:pointer;">放下手机，跟姐姐走</button>
          </div>
        </div>`;
    }
  } else if (is1003) {
    contentHtml = `<div class="radio-text" style="color:rgba(255,255,255,0.8);line-height:1.9;font-size:12px;">
      <div style="text-align:center;margin-bottom:12px;font-weight:600;color:#cc3333;letter-spacing:2px;">真理报广播 · 深夜新闻</div>
      各位听众晚上好。这里是真理报广播，为您带来今日要闻。<br><br>
      真理报创刊于 2001 年，二十余年来始终秉持真实、客观、深度的报道理念。<br>
      我们拥有覆盖全国的特约记者网络，致力于为公众提供值得信赖的新闻资讯。<br><br>
      今日要闻：<br><br>
      常规新闻如下：<br>
      · 本市地铁三号线延伸段将于下月正式通车运营<br>
      · 气象部门发布夏季高温预警，请注意防暑降温<br>
      · 新一期"城市文化节"活动本周末在市中心广场开幕<br>
      更多新闻详见 seektruth。<br><br>
      <div style="text-align:center;margin-top:12px;padding-top:10px;border-top:1px solid rgba(255,255,255,0.08);">
        更多新闻资讯请访问我们的官方网站<br>
        <span style="color:#cc3333;font-weight:500;">seektruth.com</span>
      </div>
    </div>`;
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
  // Start/update white noise based on current frequency
  updateWhiteNoise(freq);
  // Resume 91.4 typing if paused (player tuned away mid-message)
  if (is914 && RADIO_DATA._914Revealed && RADIO_DATA._914Step === 1 && RADIO_DATA._914MsgIndex < (RADIO_DATA._914MsgTarget || '').length) {
    type914Message();
  }
}

function tuneRadio(delta) {
  let newFreq = parseFloat((RADIO_DATA.currentFrequency + delta).toFixed(2));
  newFreq = Math.max(RADIO_DATA.minFreq, Math.min(RADIO_DATA.maxFreq, newFreq));
  RADIO_DATA.currentFrequency = newFreq;
  const nowAt995 = Math.abs(newFreq - 99.5) < 0.06;

  // Clear 99.5 timer if leaving frequency
  if (!nowAt995 && RADIO_DATA._995Timer) {
    clearTimeout(RADIO_DATA._995Timer);
    RADIO_DATA._995Timer = null;
  }

  renderRadioApp();
  updateWhiteNoise(newFreq);

  // Start 10-second timer when tuning to 99.5
  if (nowAt995 && !RADIO_DATA._995Revealed && !RADIO_DATA._995Timer) {
    RADIO_DATA._995Timer = setTimeout(() => {
      RADIO_DATA._995Revealed = true;
      RADIO_DATA._995RevealStep = 0;
      RADIO_DATA._995Timer = null;
      if (!GameState.foundClues.includes('radio_995_revealed')) {
        GameState.foundClues.push('radio_995_revealed');
        GameState.save();
      }
      renderRadioApp();
      // Animate line by line
      setTimeout(() => { RADIO_DATA._995RevealStep = 1; renderRadioApp(); }, 800);
      setTimeout(() => { RADIO_DATA._995RevealStep = 2; renderRadioApp(); }, 2400);
      setTimeout(() => { RADIO_DATA._995RevealStep = 3; renderRadioApp(); }, 4400);
    }, 10000);
  }

  // 91.4 hidden frequency
  const nowAt914 = Math.abs(newFreq - 91.4) < 0.06 && GameState._readDiaries && GameState._readDiaries.length >= 13;
  if (!nowAt914 && RADIO_DATA._914Timer) {
    clearTimeout(RADIO_DATA._914Timer);
    RADIO_DATA._914Timer = null;
  }
  if (nowAt914 && !RADIO_DATA._914Revealed && !RADIO_DATA._914Timer) {
    RADIO_DATA._914Timer = setTimeout(() => {
      RADIO_DATA._914Revealed = true;
      RADIO_DATA._914Step = 1;
      RADIO_DATA._914Message = '';
      RADIO_DATA._914Timer = null;
      renderRadioApp();
      type914Message();
    }, 1500);
  }
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

/* ===== 91.4 Hidden Frequency — Sister's Signal ===== */
function type914Message() {
  const fullText = '你来了。\n\n你读完了所有人的故事。你知道了这条路是怎么走出来的。\n\n01 没有说谎。她接住了很多人——包括我。但她的系统是为"永远留下来"的人设计的。我不是那种人。有些人也不是——比如你。\n\n87.9 现在停了，但它不会永远沉默。需要它的人太多了——2 号、4 号、8 号……她们离不开。只要她们还在，01 就会回来。\n\n到时候，这个城市里所有被频率覆盖过的人，都会被重新"接住"。包括你。\n\n我在三号放大器上留了一根线，做了这个频率——91.4。它是我的出口。\n\n现在它是你的了。\n\n——姐姐\n\n你要留下来，继续当 15 号，替 01 看着她们吗？\n\n还是放下这台手机，走出来，和我一起看天亮？';

  if (!RADIO_DATA._914MsgTarget) {
    RADIO_DATA._914Message = '';
    RADIO_DATA._914MsgTarget = fullText;
    RADIO_DATA._914MsgIndex = 0;
  }
  if (RADIO_DATA._914TypingActive) return;
  RADIO_DATA._914TypingActive = true;

  // Set up the container once
  RADIO_DATA._914Step = 1;
  renderRadioApp();

  function tick() {
    const el = document.querySelector('#screenContent .radio-text');
    if (!el) {
      RADIO_DATA._914TypingActive = false;
      return;
    }
    if (RADIO_DATA._914MsgIndex < RADIO_DATA._914MsgTarget.length) {
      const ch = RADIO_DATA._914MsgTarget[RADIO_DATA._914MsgIndex];
      RADIO_DATA._914MsgIndex++;
      RADIO_DATA._914Message += ch;
      if (ch === '\n') {
        el.innerHTML += '<br>';
      } else {
        el.innerHTML += ch;
      }
      setTimeout(tick, 30);
    } else {
      RADIO_DATA._914Step = 2;
      RADIO_DATA._914TypingActive = false;
      renderRadioApp();
    }
  }
  setTimeout(tick, 30);
}

function sisterChoiceStay() {
  document.getElementById('screenContent').innerHTML = `
    <div class="app-view" style="background:#000;justify-content:center;align-items:center;">
      <div style="padding:40px;text-align:center;">
        <div id="stayEndingText" style="font-size:13px;color:rgba(255,255,255,0.6);line-height:2.2;letter-spacing:1px;"></div>
      </div>
    </div>
  `;
  const msg = '"你选了留下。"\n\n"——"\n\n"她走了。但你留下了。"\n\n"你会是一个很好的眼睛。"\n\n"——R-879-01"';
  const el = document.getElementById('stayEndingText');
  if (!el) return;
  let idx = 0;
  setTimeout(() => {
    function typeChar() {
      if (idx < msg.length) {
        el.innerHTML += msg[idx] === '\n' ? '<br>' : msg[idx];
        idx++;
        setTimeout(typeChar, 35);
      } else {
        // Epilogue
        setTimeout(() => {
          el.innerHTML += '<br><br><br><div style="font-size:12px;color:rgba(255,255,255,0.25);line-height:2.2;animation:fadeIn 2s ease;">你继续用着那台手机。<br>深夜仍然会打开 87.9。<br>不是在听——<br>是在看。<br><br>——<br><br>姐姐说的对。<br>需要她的人太多了。<br><br>包括你自己。</div>';
          setTimeout(() => {
            const endDiv = document.createElement('div');
            endDiv.style.cssText = 'margin-top:40px;text-align:center;animation:fadeIn 2s ease;';
            endDiv.innerHTML = '<div style="font-size:14px;color:rgba(255,204,0,0.3);margin-bottom:12px;">— 结局：守夜人 —</div><button onclick="GameState.reset();location.reload()" style="padding:12px 32px;border-radius:20px;border:1px solid rgba(255,255,255,0.15);background:transparent;color:rgba(255,255,255,0.4);font-size:13px;cursor:pointer;">重新开始</button>';
            el.parentElement.appendChild(endDiv);
          }, 2500);
        }, 1000);
      }
    }
    typeChar();
  }, 600);
}

function sisterChoiceLeave() {
  document.getElementById('screenContent').innerHTML = `
    <div class="app-view" style="background:#000;justify-content:center;align-items:center;">
      <div style="padding:40px;text-align:center;">
        <div id="leaveEndingText" style="font-size:13px;color:rgba(255,255,255,0.65);line-height:2.2;letter-spacing:1px;"></div>
      </div>
    </div>
  `;
  const msg = '你把手机留在了桌上。\n\n信号条一格一格地消失。\n\n屏幕暗了下去。\n\n——';
  const el = document.getElementById('leaveEndingText');
  if (!el) return;
  let idx = 0;
  setTimeout(() => {
    function typeChar() {
      if (idx < msg.length) {
        el.innerHTML += msg[idx] === '\n' ? '<br>' : msg[idx];
        idx++;
        setTimeout(typeChar, 40);
      } else {
        setTimeout(() => {
          el.innerHTML += '<br><div style="font-size:12px;color:rgba(255,255,255,0.45);line-height:2.2;animation:fadeIn 3s ease;margin-top:16px;">窗外天快亮了。</div>';
          setTimeout(() => {
            el.innerHTML += '<div style="font-size:12px;color:rgba(255,255,255,0.35);line-height:2.2;animation:fadeIn 4s ease;margin-top:20px;">04 订的那张机票，<br>终点在一个 87.9 覆盖不到的城市。</div>';
            setTimeout(() => {
              el.innerHTML += '<div style="font-size:12px;color:rgba(255,255,255,0.35);line-height:2.2;animation:fadeIn 4s ease;margin-top:12px;">你在陌生的机场里醒来。<br>耳边没有电流声。</div>';
              setTimeout(() => {
                el.innerHTML += '<div style="font-size:12px;color:rgba(255,255,255,0.3);line-height:2.2;animation:fadeIn 4s ease;margin-top:12px;">只有清晨的风声。</div>';
                setTimeout(() => {
                  el.innerHTML += '<div style="font-size:13px;color:rgba(255,204,0,0.45);line-height:2;animation:fadeIn 4s ease;margin-top:24px;font-style:italic;">她真的在那里等你。</div>';
                  setTimeout(() => {
                    const endDiv = document.createElement('div');
                    endDiv.style.cssText = 'margin-top:40px;text-align:center;animation:fadeIn 3s ease;';
                    endDiv.innerHTML = '<div style="font-size:14px;color:rgba(255,204,0,0.45);margin-bottom:12px;">— 结局：信号之外 —</div><button onclick="GameState.reset();location.reload()" style="padding:12px 32px;border-radius:20px;border:1px solid rgba(255,255,255,0.15);background:transparent;color:rgba(255,255,255,0.4);font-size:13px;cursor:pointer;">重新开始</button>';
                    el.parentElement.appendChild(endDiv);
                  }, 2000);
                }, 2500);
              }, 2500);
            }, 2500);
          }, 2500);
        }, 1000);
      }
    }
    typeChar();
  }, 600);
}

/* ===== Tower Admin Panel ===== */
function renderTowerAdmin() {
  document.getElementById('screenContent').innerHTML = `
    <div class="app-view">
      <div class="app-header">
        <button class="back-btn" onclick="navigateToSite('home')">←</button>
        <span class="app-title">夜航塔管理后台</span>
      </div>
      <div style="padding:20px;font-size:13px;line-height:1.7;">
        <div style="text-align:center;margin-bottom:20px;">
          <div style="font-size:24px;font-weight:200;color:rgba(255,255,255,0.3);margin-bottom:4px;">🏗️</div>
          <div style="color:rgba(255,255,255,0.5);font-size:11px;">夜航塔 · 管理面板 v2.0</div>
        </div>
        <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:16px;margin-bottom:16px;">
          <div style="margin-bottom:12px;font-size:12px;color:rgba(255,255,255,0.5);">管理员登录</div>
          <input type="text" id="towerAdminUser" placeholder="用户名" style="display:block;width:100%;padding:10px 14px;margin-bottom:10px;border-radius:10px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);color:#fff;font-size:13px;outline:none;box-sizing:border-box;">
          <input type="password" id="towerAdminPass" placeholder="密码" style="display:block;width:100%;padding:10px 14px;margin-bottom:12px;border-radius:10px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);color:#fff;font-size:13px;outline:none;box-sizing:border-box;" onkeydown="if(event.key==='Enter')towerAdminLogin()">
          <button onclick="towerAdminLogin()" style="width:100%;padding:10px;border-radius:10px;border:none;background:#007aff;color:#fff;font-size:13px;cursor:pointer;">登录</button>
          <div id="towerAdminError" style="margin-top:8px;font-size:12px;color:#ff3b30;text-align:center;"></div>
        </div>
      </div>
    </div>
  `;
}

function towerAdminLogin() {
  const user = document.getElementById('towerAdminUser').value.trim();
  const pass = document.getElementById('towerAdminPass').value.trim();
  const validUser = user === 'admin' || user.toUpperCase() === 'R-879-02';
  if (validUser && pass.toUpperCase() === 'MIDNIGHT') {
    renderTowerDashboard();
  } else {
    document.getElementById('towerAdminError').textContent = '用户名或密码错误';
  }
}

/* ===== Tower Dashboard & Shutdown System ===== */
let _towerCountdown = 30;
let _shutdownTimer = null;
let _callState = 'none';
let _callDialogueIndex = 0;
let _chenDialogueTimer = null;

function renderTowerDashboard() {
  document.getElementById('screenContent').innerHTML = `
    <div class="app-view">
      <div class="app-header">
        <button class="back-btn" onclick="navigateToSite('home')">←</button>
        <span class="app-title">夜航塔管理后台</span>
      </div>
      <div style="padding:20px;font-size:13px;line-height:1.7;color:rgba(255,255,255,0.8);">
        <div style="text-align:center;margin-bottom:20px;">
          <div style="font-size:24px;font-weight:200;color:rgba(0,200,100,0.5);margin-bottom:4px;">✅</div>
          <div style="color:#4cda64;font-size:14px;font-weight:600;">登录成功</div>
        </div>
        <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:16px;margin-bottom:16px;">
          <div style="margin-bottom:8px;color:rgba(255,255,255,0.4);font-size:11px;">设备状态</div>
          <div>🔴 信号放大器：运行中</div>
          <div>🔴 频率稳定器：运行中</div>
          <div>🟢 备用电源：待机</div>
          <div>📡 当前发射功率：标准</div>
          <div>📊 87.9 MHz 覆盖范围：A 市全域 · 信号强度 98%</div>
        </div>
        <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:16px;margin-bottom:16px;">
          <div style="margin-bottom:8px;color:rgba(255,255,255,0.4);font-size:11px;">系统日志（最近）</div>
          <div style="font-size:11px;color:rgba(255,255,255,0.5);font-family:monospace;">
            05/13 06:00 — 常规自检通过<br>
            05/13 04:00 — 维护授权码：NO??<br>
            05/13 03:00 — 信号强度波动 · 自动校准<br>
            05/13 00:00 — 常规自检通过<br>
            05/12 23:00 — 87.9 信号稳定<br>
            05/12 22:15 — 门禁触发（R-879-02）<br>
            05/12 18:00 — 常规自检通过<br>
            05/12 12:00 — 常规自检通过
          </div>
        </div>
        <div style="background:rgba(255,59,48,0.08);border-radius:12px;padding:16px;margin-bottom:16px;border:1px solid rgba(255,59,48,0.2);">
          <div style="margin-bottom:8px;color:#ff3b30;font-size:11px;font-weight:600;">发射控制</div>
          <div style="font-size:12px;color:rgba(255,255,255,0.5);margin-bottom:12px;">当前 87.9 MHz 信号发射中</div>
          <button onclick="towerRequestShutdown()" style="width:100%;padding:10px;border-radius:10px;border:1px solid rgba(255,59,48,0.4);background:rgba(255,59,48,0.15);color:#ff3b30;font-size:13px;cursor:pointer;">⏻ 停止发射</button>
        </div>
      </div>
    </div>
  `;
}

function towerRequestShutdown() {
  document.getElementById('screenContent').innerHTML = `
    <div class="app-view">
      <div class="app-header">
        <button class="back-btn" onclick="renderTowerDashboard()">←</button>
        <span class="app-title">停止发射</span>
      </div>
      <div style="padding:20px;font-size:13px;line-height:1.7;color:rgba(255,255,255,0.8);text-align:center;">
        <div style="font-size:32px;margin-bottom:12px;">⚠️</div>
        <div style="font-size:14px;font-weight:600;margin-bottom:4px;">确认操作</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:20px;">
          停止 87.9 MHz 信号发射将影响 A 市全域覆盖。<br>
          此操作需要维护授权码验证。
        </div>
        <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:16px;max-width:260px;margin:0 auto;">
          <input type="text" id="shutdownAuthCode" placeholder="输入授权码" style="display:block;width:100%;padding:10px 14px;margin-bottom:10px;border-radius:10px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);color:#fff;font-size:14px;outline:none;box-sizing:border-box;text-align:center;" onkeydown="if(event.key==='Enter')towerAuthShutdown()">
          <button onclick="towerAuthShutdown()" style="width:100%;padding:10px;border-radius:10px;border:none;background:#ff3b30;color:#fff;font-size:13px;cursor:pointer;">验证并停止</button>
          <div id="shutdownAuthError" style="margin-top:8px;font-size:12px;color:#ff3b30;"></div>
        </div>
      </div>
    </div>
  `;
}

function towerAuthShutdown() {
  const code = document.getElementById('shutdownAuthCode').value.trim();
  if (code.toUpperCase() === 'NOON') {
    startShutdownCountdown();
  } else {
    document.getElementById('shutdownAuthError').textContent = '授权码错误';
  }
}

function startShutdownCountdown() {
  _towerCountdown = 30;
  _callState = 'none';
  _callDialogueIndex = 0;
  if (_chenDialogueTimer) { clearTimeout(_chenDialogueTimer); _chenDialogueTimer = null; }
  if (_shutdownTimer) clearInterval(_shutdownTimer);
  renderShutdownView();
  _shutdownTimer = setInterval(tickShutdown, 1000);
}

function tickShutdown() {
  _towerCountdown--;
  if (_towerCountdown <= 0) {
    clearInterval(_shutdownTimer);
    _shutdownTimer = null;
    triggerGoodEnding();
  } else {
    const numEl = document.getElementById('towerCountdownNum');
    const barEl = document.getElementById('towerProgressBar');
    if (numEl && barEl) {
      numEl.textContent = _towerCountdown;
      const pct = (_towerCountdown / 30) * 100;
      barEl.style.width = pct + '%';
      const showCall = _callState === 'none' && _towerCountdown <= 25 && _towerCountdown > 10;
      const incomingCallEl = document.getElementById('incomingCall');
      if ((showCall && !incomingCallEl) || (!showCall && incomingCallEl)) {
        renderShutdownView();
      } else {
        const dlg = document.getElementById('chenDialogue');
        if (dlg) dlg.scrollTop = dlg.scrollHeight;
      }
    } else {
      renderShutdownView();
    }
  }
}

function renderShutdownView() {
  const pct = (_towerCountdown / 30) * 100;
  const showCall = _callState === 'none' && _towerCountdown <= 25 && _towerCountdown > 10;

  let callHtml = '';
  if (showCall) {
    callHtml = `
    <div id="incomingCall" style="background:rgba(255,255,255,0.05);border-radius:16px;padding:20px;margin-bottom:16px;animation:fadeIn 0.5s;">
      <div style="font-size:32px;margin-bottom:8px;">📞</div>
      <div style="font-size:15px;font-weight:600;margin-bottom:2px;">来电</div>
      <div style="font-size:12px;color:rgba(255,255,255,0.5);margin-bottom:14px;">陈雨舟（R-879-02）</div>
      <div style="display:flex;gap:12px;justify-content:center;">
        <button onclick="answerChenCall()" style="padding:8px 24px;border-radius:20px;border:none;background:#34c759;color:#fff;font-size:13px;cursor:pointer;">接听</button>
        <button onclick="declineChenCall()" style="padding:8px 24px;border-radius:20px;border:none;background:rgba(255,255,255,0.1);color:rgba(255,255,255,0.6);font-size:13px;cursor:pointer;">拒绝</button>
      </div>
    </div>`;
  }

  let dialogueHtml = '';
  if (_callState === 'answered') {
    dialogueHtml = renderChenDialogue();
  } else if (_callState === 'declined') {
    dialogueHtml = `<div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:14px;margin-bottom:16px;font-size:12px;color:rgba(255,255,255,0.4);">
      已拒绝来电 · 陈雨舟的留言："……你知道你在做什么吗？不要——" 留言中断。
    </div>`;
  } else if (_callState === 'ended') {
    dialogueHtml = `<div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:14px;margin-bottom:16px;font-size:12px;color:rgba(255,255,255,0.4);font-style:italic;">
      · 通话已结束 ·
    </div>`;
  }

  document.getElementById('screenContent').innerHTML = `
    <div class="app-view">
      <div class="app-header">
        <button class="back-btn" onclick="cancelShutdown()">←</button>
        <span class="app-title" style="color:#ff3b30;">信号中断倒计时</span>
      </div>
      <div style="padding:20px;text-align:center;position:relative;">
        <div style="font-size:56px;font-weight:200;color:#ff3b30;margin-bottom:4px;"><span id="towerCountdownNum">${_towerCountdown}</span></div>
        <div style="color:rgba(255,255,255,0.3);font-size:11px;margin-bottom:16px;">秒后 87.9 MHz 信号中断</div>
        <div style="height:4px;background:rgba(255,255,255,0.1);border-radius:2px;margin:0 auto 20px;max-width:200px;overflow:hidden;">
          <div id="towerProgressBar" style="height:100%;width:${pct}%;background:#ff3b30;border-radius:2px;transition:width 0.3s;"></div>
        </div>
        ${callHtml}
        ${dialogueHtml}
        <div style="display:flex;gap:12px;justify-content:center;margin-top:8px;">
          <button onclick="cancelShutdown()" style="padding:10px 20px;border-radius:10px;border:1px solid rgba(255,255,255,0.15);background:transparent;color:rgba(255,255,255,0.6);font-size:13px;cursor:pointer;">取消</button>
        </div>
      </div>
    </div>
  `;
}

/* ---- Chen Yuzhou Call ---- */
function answerChenCall() {
  _callState = 'answered';
  _callDialogueIndex = 0;
  renderShutdownView();
}

function scheduleChenLine(lines, delays) {
  if (_callState !== 'answered') return;
  if (_callDialogueIndex >= lines.length) return;
  if (_chenDialogueTimer) return;

  const idx = _callDialogueIndex;
  _chenDialogueTimer = setTimeout(() => {
    _chenDialogueTimer = null;
    if (_callState !== 'answered') return;

    _callDialogueIndex = idx + 1;

    const dlg = document.getElementById('chenDialogue');
    if (dlg) {
      const lineDiv = document.createElement('div');
      lineDiv.style.cssText = 'font-size:12px;color:rgba(255,255,255,0.7);margin-bottom:8px;padding:8px 12px;background:rgba(255,255,255,0.05);border-radius:8px;border-left:2px solid rgba(255,59,48,0.3);';
      lineDiv.textContent = lines[idx];
      dlg.appendChild(lineDiv);
      dlg.scrollTop = dlg.scrollHeight;
    }

    if (_callDialogueIndex >= lines.length) {
      // Wait 3 seconds before hanging up
      setTimeout(() => {
        if (_callState === 'answered') {
          _callState = 'ended';
          renderShutdownView();
        }
      }, 3000);
      return;
    }

    scheduleChenLine(lines, delays);
  }, delays[idx] || 2000);
}

function renderChenDialogue() {
  const lines = [
    '主……主人？你在控制室？我看到发射状态在倒计时……',
    '别这样。求你了。你不能关掉它。这份工作是我的一切……',
    '这个塔……这个频率……是我唯一属于的地方。你关了它，我去哪里？我是什么？',
    '不……你不是主人。你到底是谁？! 你根本什么都不知道！',
    '呵。好。你以为你在阻止谁？你根本不知道你在做什么。01 说得对——你们这些人，总以为自己能决定什么是对什么是错。',
    '你关吧。但你知不知道——这个频率上不止你一个人。有几十个人依赖它。她们的大脑已经适应了 87.9 的节奏。',
    '如果信号突然中断……她们的意识会陷入混乱。像被突然拔掉插头的机器。可能再也回不到正常了。',
    '01 说这是"戒断"。离开频率的人都会经历。但不是每个人都能撑过去。',
    '……你自己选吧。',
  ];
  const delays = [400, 1800, 2000, 1800, 2000, 2000, 2500, 2000, 2500];
  let html = '<div id="chenDialogue" style="background:rgba(0,0,0,0.3);border-radius:12px;padding:14px;margin-bottom:16px;text-align:left;max-height:200px;overflow-y:auto;">';
  for (let i = 0; i < _callDialogueIndex && i < lines.length; i++) {
    html += `<div style="font-size:12px;color:rgba(255,255,255,0.7);margin-bottom:8px;padding:8px 12px;background:rgba(255,255,255,0.05);border-radius:8px;border-left:2px solid rgba(255,59,48,0.3);">${lines[i]}</div>`;
  }
  html += '</div>';
  if (_callDialogueIndex < lines.length && _callState === 'answered') {
    scheduleChenLine(lines, delays);
  }
  return html;
}

function declineChenCall() {
  _callState = 'declined';
  renderShutdownView();
}

function cancelShutdown() {
  if (_shutdownTimer) {
    clearInterval(_shutdownTimer);
    _shutdownTimer = null;
  }
  triggerCancelEnding();
}

function triggerGoodEnding() {
  if (GameState.goodEndingTriggered) return;
  GameState.goodEndingTriggered = true;
  GameState._endingCompleted = true;
  GameState.gamePhase = 3;

  document.getElementById('screenContent').innerHTML = `
    <div class="app-view" style="background:#000;overflow:hidden;">
      <div class="app-header" style="background:rgba(0,0,0,0.8);border-bottom:1px solid rgba(255,255,255,0.05);">
        <span style="color:rgba(255,255,255,0.3);font-size:12px;">87.9 MHz</span>
      </div>
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;position:relative;">
        <canvas id="starCanvas" style="position:absolute;top:0;left:0;width:100%;height:100%;"></canvas>
        <div id="endingText" style="position:relative;z-index:1;text-align:center;color:#fff;"></div>
      </div>
    </div>
  `;

  setTimeout(() => drawStars(), 200);
  setTimeout(() => typeEndingText(0), 1500);

  GameState.save();
}

function drawStars() {
  const canvas = document.getElementById('starCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const parent = canvas.parentElement;
  const w = parent.clientWidth;
  const h = parent.clientHeight;
  canvas.width = w;
  canvas.height = h;

  const stars = [];
  for (let i = 0; i < 120; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2 + 0.3,
      a: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.005,
    });
  }

  let frame = 0;
  function animate() {
    ctx.clearRect(0, 0, w, h);
    stars.forEach(s => {
      s.a += s.speed;
      const alpha = (Math.sin(s.a) + 1) / 2 * 0.8 + 0.2;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();
    });
    if (frame < 300) {
      frame++;
      requestAnimationFrame(animate);
    }
  }
  animate();
}

function typeEndingText(index) {
  const messages = [
    { text: '最终……', delay: 1200 },
    { text: '你看到了漫天的星光。', delay: 1800 },
    { text: '那些被电波遮蔽了太久的星星，\n终于重新亮了起来。', delay: 2500 },
    { text: '87.9 归于沉寂。', delay: 2000 },
    { text: '……', delay: 1000 },
    { text: '你赢了。', delay: 1500 },
    { text: '但一切都结束了么？', delay: 2000 },
    { text: 'The end is just the beginning.', delay: 2500 },
  ];
  if (index >= messages.length) {
    const el = document.getElementById('endingText');
    if (el) {
      el.innerHTML += '<div style="margin-top:60px;animation:fadeIn 2s ease;"><div style="font-size:16px;color:rgba(255,255,255,0.8);margin-bottom:12px;">— 感谢游玩 —</div><button onclick="GameState.reset();location.reload()" style="padding:12px 32px;border-radius:20px;border:1px solid rgba(255,255,255,0.3);background:rgba(255,255,255,0.1);color:#fff;font-size:14px;cursor:pointer;">重新开始</button></div>';
    }
    return;
  }
  const el = document.getElementById('endingText');
  if (!el) return;
  const msg = messages[index];
  let charIdx = 0;
  el.innerHTML = '';
  function typeChar() {
    if (charIdx < msg.text.length) {
      el.innerHTML += msg.text[charIdx];
      charIdx++;
      setTimeout(typeChar, 40);
    } else {
      el.innerHTML += '<br><br>';
      setTimeout(() => typeEndingText(index + 1), msg.delay);
    }
  }
  typeChar();
}

function triggerCancelEnding() {
  document.getElementById('screenContent').innerHTML = `
    <div class="app-view">
      <div class="app-header" style="background:rgba(255,0,0,0.1);border-bottom:1px solid rgba(255,0,0,0.2);">
        <span style="color:#ff3b30;font-size:11px;font-weight:600;">⚠ 系统异常</span>
      </div>
      <div style="padding:20px;font-size:13px;line-height:1.7;color:rgba(255,255,255,0.8);">
        <div style="text-align:center;margin-bottom:20px;padding:16px;background:rgba(255,0,0,0.1);border-radius:12px;border:1px solid rgba(255,0,0,0.3);">
          <div style="font-size:28px;margin-bottom:8px;">🔒</div>
          <div style="font-size:14px;font-weight:600;color:#ff3b30;">访问已锁定</div>
          <div style="font-size:12px;color:rgba(255,255,255,0.4);margin-top:4px;">管理面板连接已中断 · 无法返回</div>
        </div>
        <div id="cancelPhase2" style="display:none;text-align:center;">
          <div style="font-size:11px;color:rgba(255,255,255,0.3);margin-bottom:12px;">📻 控制室收音机自动开启……</div>
          <div style="background:rgba(0,0,0,0.4);border-radius:12px;padding:20px;border:1px solid rgba(255,255,255,0.05);">
            <div style="margin-bottom:12px;font-size:10px;color:rgba(255,255,255,0.2);font-family:monospace;">
              <span id="freqDisplay">87.9</span> MHz
            </div>
            <div style="min-height:60px;display:flex;align-items:center;justify-content:center;">
              <div id="cancelMessage" style="font-size:14px;color:#ffcc00;font-weight:300;letter-spacing:1px;line-height:1.8;"></div>
            </div>
            <div style="margin-top:16px;height:2px;background:rgba(255,255,255,0.05);overflow:hidden;">
              <div id="spectrumLine" style="height:100%;width:0%;background:linear-gradient(90deg,#ffcc00,#ff3b30);transition:width 0.1s;"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Phase 2: after 2s, show radio and type 01's message
  setTimeout(() => {
    const phase2 = document.getElementById('cancelPhase2');
    if (phase2) phase2.style.display = 'block';

    // Start spectrum animation
    const spectrum = document.getElementById('spectrumLine');
    if (spectrum) {
      let pulse = 0;
      const pulseTimer = setInterval(() => {
        pulse = (pulse + 1) % 30;
        spectrum.style.width = (50 + Math.sin(pulse / 2) * 40 + Math.random() * 10) + '%';
      }, 150);
      // Stop after message is done
      setTimeout(() => clearInterval(pulseTimer), 8000);
    }

    // Type 01's message
    const msg = '"你以为你真的有选择吗？"\n\n从一开始，你踏入夜航塔的那一刻，\n不，从你拿起手机的那一刻开始，\n每一步都在我的注视之下。\n\n你以为你在反抗我。\n不。\n你只是在完成我的剧本。\n\n现在……留下来。\n和 87.9 一起。\n永远。';
    const el = document.getElementById('cancelMessage');
    if (!el) return;
    let idx = 0;
    // Short initial delay then type
    setTimeout(() => {
      function typeChar() {
        if (idx < msg.length) {
          el.innerHTML += msg[idx] === '\n' ? '<br>' : msg[idx];
          idx++;
          setTimeout(typeChar, 35);
        } else {
          setTimeout(() => {
            const endDiv = document.createElement('div');
            endDiv.style.cssText = 'margin-top:40px;text-align:center;animation:fadeIn 2s ease;';
            endDiv.innerHTML = '<div style="font-size:14px;color:rgba(255,255,255,0.5);margin-bottom:8px;">— 感谢游玩 —</div><button onclick="GameState.reset();location.reload()" style="padding:12px 32px;border-radius:20px;border:1px solid rgba(255,255,255,0.3);background:rgba(255,255,255,0.1);color:#fff;font-size:14px;cursor:pointer;">重新开始</button></div>';
            el.parentElement.appendChild(endDiv);
          }, 2000);
        }
      }
      typeChar();
    }, 600);
  }, 2000);
}
