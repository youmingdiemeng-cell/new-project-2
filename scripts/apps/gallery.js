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
