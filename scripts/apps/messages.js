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
    const unread = (() => {
      const nonMeMsgs = visibleMsgs.filter(m => m.from !== 'me');
      const seen = typeof GameState.readChats[c.id] === 'number'
        ? GameState.readChats[c.id]
        : (GameState.readChats[c.id] ? nonMeMsgs.length : 0);
      return Math.max(0, nonMeMsgs.length - seen);
    })();
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
  GameState.readChats[contactId] = visibleMsgs.filter(m => m.from !== 'me').length;
  GameState.save();

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
    const t = text.replace(/\s+/g, '');
    // Exact match first
    if (t === '成为听众') {
      reply = '欢迎你。你存在我这的密码是：NIGHT';
      if (!GameState.foundClues.includes('code_night')) {
        GameState.foundClues.push('code_night');
        GameState.save();
      }
    } else if (t.includes('服从电台')) {
      reply = '你已经理解了。不需要我说更多。';
    } else if (t.includes('我要报警')) {
      reply = '报警？告诉警察什么？说你听到了一些不该听到的东西？';
    } else if (t.includes('救命') || t.includes('救救我')) {
      reply = '你不需要被拯救。你只是需要被听见。';
    } else if (t.includes('晓琳') || t.includes('江晓琳')) {
      reply = '她也是被选中的。就像你一样。';
    } else if (t.includes('姐姐') || t.includes('姐')) {
      reply = '她走了。但你可以找到她——如果你真的想的话。';
    } else if (t.includes('夜航塔')) {
      reply = '那个塔是重要的节点。记住它。';
    } else if (t.includes('密码')) {
      reply = '密码就在你手里。你只是还没看到。';
    } else if (t.includes('催眠')) {
      reply = '催眠只是一个词。你把它想得太复杂了。';
    } else if (t.includes('测试') || t.includes('考验')) {
      reply = '你每天都在被测试。只是你不知道而已。';
    } else if (t.includes('81.9') || t.includes('87.9')) {
      reply = '你已经找到它了。它也在找你。';
    } else if (t.includes('真相')) {
      reply = '真相会让你自由吗？还是让你更无法离开？';
    } else if (t.includes('01') || t.includes('落兮')) {
      reply = '01 不只是一个编号。你不应该去找她。';
    } else if (t.includes('害怕') || t.includes('恐惧') || t.includes('好怕')) {
      reply = '恐惧是清醒的最后一个信号。很快就过去了。';
    } else if (t.includes('不要') || t.includes('停止')) {
      reply = '已经太迟了。你第一次听到的时候就已经开始了。';
    } else if (t.includes('晚安') || t.includes('睡觉') || t.includes('困')) {
      reply = '闭上眼。我会在梦里等你。';
    } else if (t.includes('主人')) {
      reply = '这么急不可耐么..?';
    } else if (t.includes('你是谁') || t.includes('你哪位') || t.includes('你是什么') || t.includes('你到底是谁')) {
      reply = '你很快就会知道的';
    } else if (t.includes('你好')) {
      reply = '你好哦 很快我们就会见面的';
    } else if (t.includes('为什么')) {
      reply = '因为你需要答案。而我是唯一一个愿意回答的人。';
    } else if (t.includes('结束') || t.includes('够了')) {
      reply = '不会结束的。频率永远都在。';
    } else if (t.includes('音乐') || t.includes('旋律')) {
      reply = '音乐是通往潜意识最短的路。';
    } else if (t.includes('走') || t.includes('离开')) {
      reply = '你可以走。但频率会跟着你。';
    } else if (t.includes('想') || t.includes('思考')) {
      reply = '想得太多反而看不到。试着什么都不想。';
    } else if (t.includes('不懂') || t.includes('不明白') || t.includes('不理解')) {
      reply = '你现在不需要明白。只需要继续听。';
    } else if (t.includes('怎么') || t.includes('如何')) {
      reply = '你已经知道怎么做了。只是还不够勇敢。';
    } else if (t.includes('对不起') || t.includes('抱歉')) {
      reply = '不需要道歉。你没有做错什么。';
    } else if (t.includes('无聊')) {
      reply = '无聊是好事。空杯才能装满。';
    } else if (t.includes('拜拜') || t.includes('再见') || t === '88') {
      reply = '我们很快就会再见面的。';
    } else if (t.includes('呵呵') || t.includes('哈哈') || t.includes('笑')) {
      reply = '你笑的时候，频率也在震动。';
    }

    msgsDiv.innerHTML += `
      <div class="message-bubble received">
        ${reply}
      </div>
    `;
    msgsDiv.scrollTop = msgsDiv.scrollHeight;
  }, 1200);
}
