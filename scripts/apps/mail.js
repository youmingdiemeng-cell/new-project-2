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
    <div style="padding:8px 16px;font-size:11px;color:rgba(255,255,255,0.3);">${mail.from}</div>
    <div class="mail-body-view">${mail.body}</div></div>`;
}
