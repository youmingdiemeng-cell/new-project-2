/* ===== Notes App ===== */
function truncate(text, maxLen) {
  if (text.length <= maxLen) return text;
  return text.substring(0, maxLen) + '…';
}

function renderNotesApp() {
  const visibleNotes = NOTES_DATA.filter(n => {
    if (n.phase && n.phase > GameState.gamePhase) return false;
    // n5 (加密日记2) is always visible
    return true;
  });
  let html = `<div class="app-view"><div class="app-header"><button class="back-btn" onclick="goHome()">←</button><span class="app-title">备忘录</span></div><div class="notes-list">`;
  visibleNotes.forEach(n => {
    const isLocked = n.locked && !GameState.unlockedContent['note:' + n.id];
    const displayText = isLocked ? '🔒 已锁定' :
      (n.id === 'n4' && GameState.unlockedContent['note:n4'] ? '[日记已解锁]' : truncate(NOTE_CONTENTS[n.id] || n.text, 22));
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
