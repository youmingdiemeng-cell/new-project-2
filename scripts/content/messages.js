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
      name: '晓琳 ❤️',
      messages: [
        { id: 'b1', from: 'bestie', text: '你最近睡得好吗？', phase: 1 },
        { id: 'b2', from: 'me', text: '还行吧', phase: 1 },
        { id: 'b3', from: 'bestie', text: '你黑眼圈好重…要不要出来走走？', phase: 1 },
        { id: 'b5', from: 'me', text: '最近有点累', phase: 2 },
        { id: 'b4a', from: 'bestie', text: '好啦 别垂头丧气了 给你分享我最近特别喜欢的一首英文诗，泰戈尔写的哦。', phase: 2 },
        { id: 'b4b', from: 'bestie', text: 'iF you shed teArs when you miss the sun,you also miss the stars.The sands in your way bEg for your song,dancing water, carry them lightly.', phase: 2 },
        { id: 'b4c', from: 'bestie', text: '不管遇到什么事，放宽心态，你终会遇见属于自己的漫天星光。加油！', phase: 2 },
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
        { id: 'x1', from: 'mystery', text: '你最近有在深夜听到什么奇怪的声音吗？', phase: 1 },
        { id: 'x2', from: 'me', text: '什么意思？', phase: 2 },
        { id: 'x3', from: 'mystery', text: '那个频率不是用来听的。是用来接住你的。等你意识到了，就已经晚了。', phase: 2 },
        { id: 'x5', from: 'mystery', text: '87.9 停了。但她在网络的缝隙里留下了线索。仔细找找。', phase: 3, endingRequired: true },
        { id: 'x6', from: 'mystery', text: '她在混乱与无序的网络中留下了踪迹。散落在每一个被遗忘的角落。', phase: 3, endingRequired: true },
        { id: 'x7', from: 'mystery', text: '去那些没有人在意的地方找找看。你会知道她还在的。', phase: 3, endingRequired: true },
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
