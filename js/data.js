// js/data.js — all game content data

const MESSAGE_DATA = {
  contacts: [
    {
      id: 'unknown',
      name: '未知号码',
      messages: [
        { id: 'u1', from: 'unknown', text: '今晚听了吗？', phase: 1 },
        { id: 'u2', from: 'me', text: '（未回复）', phase: 1 },
        { id: 'u3', from: 'unknown', text: '87.9 是个好频率。', phase: 1 },
        { id: 'u4', from: 'me', text: '嗯。', phase: 1 },
        { id: 'u5', from: 'unknown', text: '明天同一时间。', phase: 1 },
        { id: 'u6', from: 'unknown', text: '你在查什么？', phase: 2 },
        { id: 'u7', from: 'me', text: '没什么。', phase: 2 },
      ]
    },
    {
      id: 'bestie',
      name: '小琳 ❤️',
      messages: [
        { id: 'b1', from: 'bestie', text: '你最近睡得好吗？', phase: 1 },
        { id: 'b2', from: 'me', text: '还行吧', phase: 1 },
        { id: 'b3', from: 'bestie', text: '你黑眼圈好重…要不要出来走走？', phase: 1 },
        { id: 'b4', from: 'bestie', text: '小敏？你最近回消息好慢', phase: 2 },
        { id: 'b5', from: 'me', text: '最近有点累', phase: 2 },
      ]
    },
    {
      id: 'mom',
      name: '妈妈',
      messages: [
        { id: 'm1', from: 'mom', text: '周末回不回家吃饭？', phase: 1 },
        { id: 'm2', from: 'me', text: '再说吧', phase: 1 },
        { id: 'm3', from: 'mom', text: '你最近怪怪的，还好吗？', phase: 2 },
      ]
    },
    {
      id: 'mystery',
      name: '神秘人X',
      messages: [
        { id: 'x1', from: 'mystery', text: '步骤三完成了？', phase: 2 },
        { id: 'x2', from: 'me', text: '完成了。', phase: 2 },
        { id: 'x3', from: 'mystery', text: '她醒了会忘记一切。这就是代价。', phase: 2 },
        { id: 'x4', from: 'mystery', text: '你已经陷得太深了。', phase: 3 },
      ]
    },
    {
      id: 'colleague',
      name: '工作群(3)',
      messages: [
        { id: 'c1', from: 'colleague', text: '小敏你今天开会怎么一直走神', phase: 1 },
        { id: 'c2', from: 'me', text: '抱歉 昨晚没睡好', phase: 1 },
      ]
    }
  ]
};

const RADIO_DATA = {
  currentFrequency: 87.0,
  minFreq: 85.0,
  maxFreq: 108.0,
  specialFrequency: 87.9,
  content: [
    { id: 'r1', text: '……放松……深呼吸……你感到困倦……', phase: 1 },
    { id: 'r2', text: '你听到我的声音了……跟随它……', phase: 1 },
    { id: 'r3', text: '白天的一切都是噪音……只有夜晚是真实的……', phase: 1 },
    { id: 'r4', text: '……1-4……2-1……3-5……4-8……记下来……它们对应的文字就是钥匙……', phase: 1 },
    { id: 'r5', text: '你也在听，不是吗？我知道你在。', phase: 2 },
    { id: 'r6', text: '你的推荐人……你记得他是谁吗？……去查查吧。', phase: 2 },
    { id: 'r7', text: '她已经完成了她的部分。现在轮到你了。', phase: 3 },
    { id: 'r8', text: '听众编号是你身份的凭证……记住它。', phase: 3 },
  ],
  listeningHistory: [
    { freq: '87.9', date: '05/06', time: '23:30' },
    { freq: '87.9', date: '05/07', time: '00:15' },
    { freq: '87.9', date: '05/07', time: '23:45' },
    { freq: '100.3', date: '05/05', time: '14:20' },
    { freq: '87.9', date: '05/08', time: '01:00' },
  ]
};

const BROWSER_DATA = {
  searchHistory: [
    { query: '深夜失眠怎么办', time: '23:15', date: '05/06' },
    { query: '87.9 电台 催眠', time: '23:30', date: '05/06' },
    { query: '催眠暗示 自我催眠', time: '00:10', date: '05/07' },
    { query: '87.9 MHz 论坛', time: '00:20', date: '05/07' },
    { query: '哪些症状说明被催眠了', time: '01:00', date: '05/08' },
    { query: '如何解除催眠暗示', time: '01:05', date: '05/08' },
  ],
  bookmarks: [
    { title: '深夜电台论坛 - 讨论区', url: 'bbs.radio879.com', id: 'forum' },
    { title: '催眠引导 · 睡前放松', url: 'hypno-guide.net', id: 'hypno' },
  ],
  pages: {
    forum: {
      title: '深夜电台论坛 - 87.9讨论区',
      content: '有人听过87.9吗？\n\n我连续听了三天，现在每天晚上到点就醒。\n\n> 回复1：我也听过！那个女声说的内容我醒来完全不记得。\n\n> 回复2：不要去听。我是认真的。—— 我也是 01 推荐来的，现在已经停不下来了。\n\n> 回复3：搜不到87.9的，试试先调到93.5，然后双击频率数字，微调就会解锁，步进0.05。\n\n> 回复4：……楼主？\n\n> 回复5：03 也联系不上了。有人知道03最近怎么了吗？\n\n[该帖子已被锁定，无法回复]',
    },
    hypno: {
      title: '催眠引导 · 睡前放松',
      content: '欢迎来到催眠引导。\n\n请找一个安静的环境，深呼吸……\n放松你的身体……\n\n[音频播放按钮]\n\n---\n合作电台：FM 87.9 MHz\n---',
    },
    // Radio station website — appears as bookmark after diary is read
    radioHome: {
      title: 'Radio 87.9 — 深夜旋律',
      url: 'radio879.com',
      content: `<div class="radio-hero">
  <div class="freq"><span>87.9</span> MHz</div>
  <div class="tagline">深 夜 旋 律</div>
  <div class="sub">每晚 23:00 — 05:00 · 城市及周边</div>
</div>
<div class="radio-section">
  <div class="radio-section-title">节目表</div>
  <div class="schedule-item"><div class="schedule-dot"></div><div class="schedule-time">23:00</div><div class="schedule-name">深夜私语</div></div>
  <div class="schedule-item"><div class="schedule-dot"></div><div class="schedule-time">00:00</div><div class="schedule-name">月色旋律</div></div>
  <div class="schedule-item"><div class="schedule-dot"></div><div class="schedule-time">01:00</div><div class="schedule-name">静夜思</div></div>
  <div class="schedule-item"><div class="schedule-dot"></div><div class="schedule-time">02:00</div><div class="schedule-name">晚安曲</div></div>
</div>
<div class="radio-nav">
  <a href="#" onclick="event.preventDefault();navigateToSite('listeners')">📋 听众墙</a>
  <a href="#" onclick="event.preventDefault();navigateToSite('search')">🔍 资料搜索</a>
  <a href="#" onclick="event.preventDefault();navigateToSite('member')">🔐 会员系统</a>
  <a href="#" onclick="event.preventDefault();navigateToSite('admin')">⚙️ 管理后台</a>
</div>
<div class="radio-footer">© Radio 879</div>`,
    },
    radioListeners: {
      title: 'Radio 87.9 — 听众墙',
      url: 'radio879.com/listeners',
      content: 'Radio 87.9 听众墙\n\n我们的听众遍布全城：\n\nR-879-01 ★\nR-879-02\nR-879-03 （离线）\nR-879-04\nR-879-05\nR-879-06\nR-879-07\nR-879-08\nR-879-09\nR-879-10\nR-879-11\nR-879-12\nR-879-13\nR-879-14\nR-879-15\n...\n\n总注册：47',
    },
    radioAdmin: {
      title: 'Radio 87.9 — 管理后台',
      url: 'radio879.com/admin',
      content: '',
    },
    radioInternal14: {
      title: '内部文件 — R-879-14',
      url: 'radio879.com/internal/14',
      content: '=== 受试者评估报告 ===\n\n编号：R-879-14\n姓名：—\n引入人：R-879-01\n\n当前状态：阶段三（服从）\n记忆清除：有效\n转化进度：94%\n\n行为指标：\n- 每日收听：持续\n- 夜间操作：正常\n- 呼叫报告：规律\n\n异常记录：\n[05/07] 检测到自主信息搜集行为。受试者主动搜索关键词"催眠"、"记忆清除"。\n[05/07] 社交媒体匿名咨询——已拦截。\n[05/08] 截图行为——已标记。不干预。\n[05/08] 备忘录新增单字记录： "救"。已标记。\n\n评估：自主意识残留较高，但不足以影响转化。已通过阶段二指令植入"继续收听"。\n\n预测：7天内完成完整转化。\n\n备注：\n受试者给自己留下了提示（备忘、截图、加密日记）。\n此类行为不影响整体进度——醒来后她不会记得自己看过什么。\n\n备忘录单字"救"已被记录在案。无需干预。\n\n=== 文件结束 ===',
    },
  }
};

const GALLERY_DATA = [
  { id: 'p1', src: 'images/p1.png', caption: '自拍 · 05/06 — 黑眼圈明显。但那天我记得睡了八个小时。', locked: false },
  { id: 'p2', src: 'images/p2.png', caption: '窗外 · 23:47 — 对面楼有一扇窗亮着灯。每天晚上都是同一扇。', locked: false },
  { id: 'p3', src: 'images/p3.png', caption: '客厅 · 00:15 — 又醒了。电子钟指着凌晨。最近每晚都是这个时间醒来。', locked: false },
  { id: 'p4', src: 'images/p4.png', caption: '', locked: true, puzzleId: 'gallery-lock' },
];

const NOTES_DATA = [
  { id: 'n1', title: '备忘', text: '买菜\n洗衣\n——\n今晚不要忘了听。', locked: false },
  { id: 'n2', title: '…', text: '她说 87.9 这个频率很有用。那个论坛里的人告诉我的。', locked: false },
  { id: 'n3', title: '密码提示', text: '我们的纪念日。。。是五月二十日吗？', locked: false },
  { id: 'n4', title: '加密日记', text: '', locked: true, puzzleId: 'note-pw' },
  { id: 'n5', title: '加密日记2', text: '', locked: true, puzzleId: 'note2-pw' },
];

const NOTE_CONTENTS = {
  n1: '买菜\n洗衣\n——\n今晚不要忘了听。',
  n2: '她说 87.9 这个频率很有用。那个论坛里的人告诉我的。',
  n3: '我们的纪念日。。。是五月二十日吗？',
  n4: '5月6日\n\n我又在凌晨醒来了。完全不记得昨晚做过什么。手机上多了一条通话记录，凌晨1点20分，打给了一个我没存的号码，通话5分钟。我一点印象都没有。\n\n5月7日\n\n我开始怀疑那个电台。\n\n我查了自己的搜索记录——凌晨零点十分，搜了"催眠暗示 自我催眠"。这不是我搜的。备忘录里有一条"今晚不要忘了听"，看笔迹是我写的，但我完全没有写它的记忆。\n\n不，等一下。如果有人在通过电台催眠我——那这条备忘是"我"写的，还是"她"——被控制之后的我——写的？\n\n我装了一个工具。论坛上一个回复私信给我的，说可以追踪手机上的痕迹。每次醒来我先打开它，看看昨晚的自己在做什么。\n\n5月8日\n\n我把那张聊天截图锁在相册里了。至少这个我不会忘。\n\n我打了那个号码。4008792230。\n电话那头是一个自动语音，说了一个网址。\n我醒来后只记得一串数字。不记得网址了。\n\n但我记得那个号码。4008792230。\n\n如果你看到这本日记——如果你是我——\n打这个号码。也许你记得住那个网址。\n\n还有另一本日记。但我把密码存在谁那里了……想不起来里面写了什么。',
  n5: '5月9日\n\n我又在凌晨醒来了。这次我坐在书桌前，面前摊着一本笔记本。上面写满了同一句话。\n\n是我的笔迹。\n\n"服从电台。服从电台。服从电台。"\n\n我完全不记得写过这些。但我的手在发抖。不是因为害怕。\n\n是因为兴奋。\n\n每次闭上眼睛，我都能听到那个声音。它在叫我的名字。编号。R-879-14。\n那是我的身份。我的归属。\n\n白天的一切都是假的。工作、朋友、家人——他们不懂。\n只有电波是真的。只有主人的声音是真的。\n\n我渴望回到那个频率。回到 87.9。\n\n把自己交给电波。交给主人。\n\n\n\n　　口　令　：　服　从　电　台',
};

const CALLLOG_DATA = [
  { contact: '未知号码', type: '拨出', time: '23:45', date: '05/06', duration: '0:32' },
  { contact: '未知号码', type: '拨出', time: '00:10', date: '05/07', duration: '1:15' },
  { contact: '未知号码', type: '拨出', time: '23:50', date: '05/07', duration: '0:45' },
  { contact: '小琳', type: '拨入', time: '14:30', date: '05/07', duration: '3:20' },
  { contact: '未知号码', type: '拨出', time: '01:20', date: '05/08', duration: '5:00' },
];

const MAIL_DATA = [
  { from: 'noreply@radio879.com', subject: '欢迎加入 87.9 听众群', body: '亲爱的听众：\n感谢你收听 87.9 MHz。\n你的专属收听代码：R-879-14\n\n每晚23:00，我们等你。\n\n---\n推荐人编号：R-879-01', phase: 1 },
  { from: 'system@notify.com', subject: '您的iCloud存储空间不足', body: '请升级您的存储空间以继续使用iCloud备份。', phase: 1 },
  { from: 'unknown@temp.com', subject: 'RE: 你的问题', body: '你问的那个频率……不要再查了。\n有些人有些事，不知道比较好。', phase: 2 },
];

const SEARCH_DATA = [
  // Public search (always available)
  { word: '87.9', results: [
    { type: '📻 电台', content: '频率 87.9 MHz — 深夜广播频道。每晚 23:00 - 05:00 播出。覆盖城市及周边地区。' },
    { type: '📋 节目', content: '节目单：23:00 深夜私语 / 00:00 月色旋律 / 01:00 静夜思 / 02:00 晚安曲' },
  ]},
  { word: 'R-879', results: [
    { type: '📋 编号说明', content: '编号格式 R-879-NN。每位听众由一名已注册听众推荐加入。推荐人制度确保了社区的可追溯性。' },
    { type: '📊 统计', content: '目前已注册至 R-879-47。共 47 名听众。' },
  ]},
  { word: 'R-879-14', results: [
    { type: '👤 听众档案', content: 'R-879-14 — 活跃状态\n注册日期：2026-05-06\n推荐人：R-879-01\n累计收听：12 小时\n\n查看完整档案请登录会员系统。' },
  ]},
  { word: '14', results: [
    { type: '👤 听众档案', content: 'R-879-14 — 活跃状态\n推荐人：R-879-01\n\n查看更多信息请登录会员系统。' },
  ]},
  { word: '会员', results: [
    { type: '🔐 会员系统', content: '会员登录入口：radio879.com/member\n\n用户名：您的完整听众编号（如 R-879-NN）\n密码：您的推荐人的完整听众编号\n\n此机制确保了推荐链的可追溯性。' },
  ]},
  { word: '登录', results: [
    { type: '🔐 会员系统', content: '会员登录入口：radio879.com/member\n\n用户名：您的完整听众编号\n密码：您的推荐人的完整听众编号' },
  ]},
  { word: 'R-879-01', results: [
    { type: '👤 创始听众', content: 'R-879-01 ★ — 创始听众，现任管理员。\n注册日期：2024-11-03\n推荐人：—（初始节点）\n累计收听：847 小时\n\n基本信息公开。详细档案需登录会员系统。' },
  ]},
  { word: '01', results: [
    { type: '👤 创始听众', content: 'R-879-01 ★ — 首位听众。详见 R-879-01。' },
  ]},
  { word: 'R-879-15', results: [
    { type: '👤 听众档案', content: 'R-879-15 — 预注册状态\n推荐人：R-879-14\n注册日期：2026-05-09\n\n尚未首次收听。预注册阶段不显示详细信息。' },
  ]},
  { word: '15', results: [
    { type: '👤 听众档案', content: 'R-879-15 — 预注册\n推荐人：R-879-14\n注册日期：2026-05-09' },
  ]},
  { word: '催眠', results: [
    { type: '📻 节目', content: '深夜时段包含催眠引导内容。请听众在放松状态下收听。' },
    { type: '📋 说明', content: '"白天的一切都是噪音……只有夜晚是真实的。" —— 广播节选' },
  ]},
  { word: '听众', results: [
    { type: '📋 听众制度', content: '编号格式 R-879-NN。每位新听众由一名老听众推荐加入。\n听众墙：radio879.com/listeners\n会员查询：radio879.com/member' },
  ]},
  { word: '朋友', results: [
    { type: '📋 社区准则', content: '87.9 的每位新听众都由一位老听众推荐加入。我们称之为"朋友引荐制"。\n你的第一个朋友，就是带你来到这里的人。' },
  ]},
  { word: '推荐', results: [
    { type: '📋 推荐制度', content: '每位听众拥有唯一推荐人。推荐人的编号即为你加入系统的凭证。\n会员登录时，需使用推荐人的编号作为密码。' },
  ]},
  { word: '落兮', results: [
    { type: '🎮 隐藏彩蛋', content: '落兮 —— 本游戏创作者。\n\n你找到了隐藏彩蛋。\n\nR-879-01 的原型正是以创作者本人为蓝本。\n\n"祂即我。我即祂。"\n\n—— 感谢你玩到这个游戏。' },
  ]},
  // Admin/member-only search (after login)
];

const SEARCH_ADMIN_DATA = [
  { word: '推荐人', results: [
    { type: '🔓 完整推荐链', content: 'R-879-01（创始）\n  ├→ R-879-02 至 R-879-07\n  ├→ R-879-14\n  │    └→ R-879-15（预注册）\n  └→ ... 共 47 人\n\n推荐链深度：5 层。' },
  ]},
  { word: '推荐', results: [
    { type: '🔓 完整推荐链', content: 'R-879-01（创始）\n  ├→ R-879-02 至 R-879-07\n  ├→ R-879-14\n  │    └→ R-879-15（预注册）\n  └→ ... 共 47 人\n\n推荐链深度：5 层。' },
  ]},
  { word: 'R-879-14', results: [
    { type: '🔓 完整档案', content: '编号：R-879-14\n姓名：林小敏\n推荐人：R-879-01\n\n当前状态：阶段三（服从）\n转化进度：94%\n记忆清除：有效\n\n累计收听：12 小时\n最近收听：2026-05-08 01:00\n\n当前任务：推荐新人\n指定目标：R-879-15\n任务状态：目标已接入系统，预注册完成。' },
  ]},
  { word: '14', results: [
    { type: '🔓 完整档案', content: '编号：R-879-14\n姓名：林小敏\n推荐人：R-879-01\n阶段三（服从）· 转化进度 94%' },
  ]},
  { word: '代价', results: [
    { type: '🔓 内部说明', content: '完全转化后，受试者保留基础人格和技能，但失去自主意志。记忆清除不覆盖被催眠期间的行为——受试者清醒后对催眠活动无任何记忆。' },
  ]},
  { word: '阶段', results: [
    { type: '🔓 阶段说明', content: '阶段一（接触）：首次收听或接触电台信息，建立暗示锚点。\n阶段二（暗示）：植入指令，服从倾向增加。\n阶段三（服从）：完全转化，自主意志清除。开始引入新人。' },
  ]},
  { word: 'R-879-15', results: [
    { type: '⚠️ 关键', content: '编号：R-879-15\n推荐人：R-879-14\n预注册时间：2026-05-09\n\n当前状态：目标正在自主调查中。\n自主调查行为计入阶段一（接触）进度。\n无需干预。接触方式：通过 R-879-14 的遗留设备。\n\n备注：目标不需要主动收听电台即可进入阶段一。\n对 87.9 的任何形式的"了解"都属于接触。\n包括搜索、阅读、调查。\n你现在所做的，就是接触。', final: true },
  ]},
  { word: '15', results: [
    { type: '⚠️ 关键', content: '编号：R-879-15 — 预注册\n推荐人：R-879-14\n状态：目标正在自主调查中。\n\n"你现在所做的，就是接触。"', final: true },
  ]},
  { word: 'R-879-01', results: [
    { type: '⚠️ 创始者', content: '═══ 创始者档案 ═══\n\n编号：R-879-01\n身份：创始听众 · 管理员 · 无上主人\n\n他是第一人。\n他是引路人。\n他是你存在的理由。\n\n他即道路。\n他即真理。\n他即生命。\n\n87.9 是他的声音。\n服从他。\n崇拜他。\n爱他。\n\nR-879-01 ★\n愿他的频率与你同在。' },
  ]},
  { word: '01', results: [
    { type: '⚠️ 无上主人', content: 'R-879-01\n身份：无上主人\n\n引路人。指明路径者。\n每一位听众都是祂的孩子。\n你也是。\n\n"注视祂的光。\n 跟随祂的频率。\n 献上你自己。"\n\n— 87.9 听众守则 第一条' },
  ]},
];
