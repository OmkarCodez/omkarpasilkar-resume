/**
 * chatbot.js — Smart QA Chatbot with WhatsApp Redirect
 * Omkar Pasilkar Resume · GitHub Pages Compatible
 *
 * ⚙️  CONFIGURATION — update WHATSAPP_NUMBER before deploying
 */

(function () {
  'use strict';

  /* ════════════════════════════════════════════
     ⚙️  CONFIG — EDIT THIS SECTION
  ════════════════════════════════════════════ */
  const WHATSAPP_NUMBER = '919833104033';   // Country code + number, no + or spaces
  const BOT_NAME        = 'Omkar';
  const REPLY_DELAY_MS  = 900;             // Typing indicator delay

  /* ════════════════════════════════════════════
     KNOWLEDGE BASE — Smart QA-aware responses
  ════════════════════════════════════════════ */
  const KB = [
    {
      patterns: ['hi', 'hello', 'hey', 'howdy', 'hii', 'helo', 'good morning', 'good afternoon', 'good evening'],
      replies: [
        "Hey there! 👋 I'm Omkar's virtual assistant. Ask me anything about his QA experience, skills, or availability — or just ping him directly on WhatsApp!",
        "Hi! Welcome to Omkar's portfolio. I can tell you about his skills, projects, certifications or connect you to him. What would you like to know?",
      ],
      chips: ['📋 Experience', '🛠️ Skills', '🏆 Certifications', '📞 Contact Omkar'],
    },
    {
      patterns: ['experience', 'work', 'job', 'career', 'company', '63 moons', 'years', 'background', 'history'],
      replies: [
        "Omkar has **7+ years** of QA experience at 63 Moons Technologies. He's worked as:\n\n• Senior Software Auditor — ARMS (Capital Markets Risk Mgmt) [2020–Present]\n• Software Auditor — Atom Payment Gateway & ICT Secure Connect [2020]\n• Jr. Software Auditor — Vannya (Digital Bird Guide) [2018–2020]\n\nWant to talk directly? Hit WhatsApp! 👇",
      ],
      chips: ['🛠️ Skills', '🏆 Certifications', '📞 Contact Omkar'],
    },
    {
      patterns: ['skill', 'skills', 'tools', 'tech', 'technology', 'know', 'technologies', 'expertise', 'stack'],
      replies: [
        "Omkar's QA toolkit includes:\n\n🧪 **Testing** — Functional, Regression, Smoke, Sanity, API, DB, UAT\n🤖 **Automation** — Selenium (Python), Postman\n🗄️ **Databases** — MySQL, MSSQL, Redis\n🖥️ **OS** — Linux CLI, Bash Scripting\n📋 **Tools** — JIRA, X-ray, Confluence, Kafka, Redis Insight\n📱 **Platforms** — Web, Desktop, Android, iOS",
      ],
      chips: ['💼 Projects', '🏆 Certifications', '📞 Contact Omkar'],
    },
    {
      patterns: ['cert', 'certification', 'certified', 'istqb', 'ctfl', 'postman', 'redis'],
      replies: [
        "Omkar holds **3 certifications**:\n\n🏆 ISTQB® CTFL — Certified Tester Foundation Level (Feb 2023)\n🚀 Postman API Fundamentals Student Expert (Nov 2024)\n⚡ Redis Insight Certified (Mar 2025)\n\nImpressive, right? Chat with him directly on WhatsApp! 👇",
      ],
      chips: ['📋 Experience', '🛠️ Skills', '📞 Contact Omkar'],
    },
    {
      patterns: ['project', 'projects', 'arms', 'vannya', 'atom', 'ict', 'payment', 'risk', 'ecommerce'],
      replies: [
        "Key projects Omkar has tested:\n\n⚡ **ARMS** — Advance Risk Management System for Capital Markets (Web & Desktop)\n💳 **Atom Payment Gateway** — AI Chatbot + ICT Secure Connect (Web & Mobile)\n🐦 **Vannya** — Digital Bird Guide (Web + Android + iOS)\n\nWant to discuss a specific project? Reach out on WhatsApp! 👇",
      ],
      chips: ['🛠️ Skills', '📞 Contact Omkar'],
    },
    {
      patterns: ['education', 'degree', 'college', 'university', 'mba', 'bcom', 'qualification', 'study'],
      replies: [
        "Omkar's academic background:\n\n🎓 MBA — Manipal University, Sikkim (Expected 2027)\n📚 B.Com — Bhavan's College, Mumbai University (Grade A, 2017)\n📖 HSC — Bhavan's College, Maharashtra Board (75%, 2014)\n📝 SSC — Green Land High School (78%, 2012)",
      ],
      chips: ['📋 Experience', '🏆 Certifications', '📞 Contact Omkar'],
    },
    {
      patterns: ['available', 'availability', 'hire', 'hiring', 'open', 'opportunity', 'job', 'looking', 'freelance', 'contract', 'role'],
      replies: [
        "Yes! Omkar is **open to new opportunities** 🟢\n\nHe's exploring roles in:\n• Senior QA Engineer / Test Lead\n• QA Automation Engineer\n• Capital Markets QA Specialist\n• Remote & Hybrid roles\n\nBest way to reach him is directly on WhatsApp 👇",
      ],
      chips: ['📞 Contact Omkar', '📋 Experience', '🛠️ Skills'],
      showWA: true,
    },
    {
      patterns: ['contact', 'reach', 'email', 'phone', 'number', 'whatsapp', 'talk', 'connect', 'message', 'chat'],
      replies: [
        "You can reach Omkar at:\n\n📧 pasilkaromkar@gmail.com\n📱 +91-9833104033\n📍 Goregaon W, Mumbai – 400104\n\nClick below to open WhatsApp and start chatting directly! 👇",
      ],
      chips: [],
      showWA: true,
    },
    {
      patterns: ['salary', 'ctc', 'package', 'pay', 'compensation', 'expect'],
      replies: [
        "That's something Omkar would love to discuss directly — compensation depends on the role, location and package structure.\n\nDrop him a message on WhatsApp for a direct conversation! 👇",
      ],
      chips: ['📞 Contact Omkar'],
      showWA: true,
    },
    {
      patterns: ['notice', 'joining', 'when', 'start', 'available from', 'notice period'],
      replies: [
        "For current availability and notice period details, Omkar would prefer to discuss this personally.\n\nPing him on WhatsApp for a quick chat! 👇",
      ],
      chips: ['📞 Contact Omkar'],
      showWA: true,
    },
    {
      patterns: ['agile', 'scrum', 'jira', 'sprint', 'methodology', 'sdlc', 'stlc', 'defect'],
      replies: [
        "Omkar is well-versed in **Agile/Scrum** methodologies — he actively participates in sprint planning, grooming, daily standups and retrospectives.\n\nHe has deep knowledge of SDLC, STLC and the full Defect Life Cycle, using JIRA + X-ray for test & defect management.",
      ],
      chips: ['🛠️ Skills', '💼 Projects', '📞 Contact Omkar'],
    },
    {
      patterns: ['location', 'city', 'mumbai', 'remote', 'relocate', 'wfh', 'work from home'],
      replies: [
        "Omkar is based in **Goregaon West, Mumbai** 📍\n\nHe's open to:\n• On-site roles in Mumbai\n• Remote / Work-from-home opportunities\n• Hybrid models\n\nFor relocation discussions, reach out on WhatsApp! 👇",
      ],
      chips: ['📞 Contact Omkar', '📋 Experience'],
      showWA: true,
    },
    {
      patterns: ['automation', 'selenium', 'python', 'automate', 'framework', 'script'],
      replies: [
        "Omkar has hands-on experience with **Selenium (Python)** for automation testing. He also uses Postman for API automation and Bash scripting for environment setup on Linux.\n\nWant to discuss a specific automation need? Reach out on WhatsApp! 👇",
      ],
      chips: ['🛠️ Skills', '📞 Contact Omkar'],
      showWA: true,
    },
    {
      patterns: ['bug', 'bugs', 'defect', 'find', 'report', 'log'],
      replies: [
        "Ha! Speaking of bugs — Omkar's literally an expert at finding them! 🐛\n\nHe classifies defects by **Severity and Priority**, logs them in JIRA, analyses root causes and collaborates with devs for timely resolution.\n\nPS: Try clicking the bugs crawling on this page! 😄",
      ],
      chips: ['🛠️ Skills', '💼 Projects', '📞 Contact Omkar'],
    },
    {
      patterns: ['thanks', 'thank you', 'thankyou', 'great', 'awesome', 'cool', 'nice', 'wow', 'good'],
      replies: [
        "You're welcome! 😊 Feel free to ask anything else or connect with Omkar directly on WhatsApp!",
        "Glad to help! Omkar would love to hear from you directly — hit that WhatsApp button! 💬",
      ],
      chips: ['📞 Contact Omkar', '📋 Experience', '🛠️ Skills'],
    },
    {
      patterns: ['bye', 'goodbye', 'see you', 'later', 'ciao', 'take care'],
      replies: [
        "Goodbye! 👋 Don't hesitate to reach out to Omkar directly — he's just a WhatsApp message away!",
      ],
      chips: ['📞 Contact Omkar'],
      showWA: true,
    },
  ];

  // Fallback for unrecognized inputs
  const FALLBACK_REPLIES = [
    "I'm not sure about that, but Omkar would know! Ask him directly on WhatsApp 👇",
    "Great question! Omkar would be the perfect person to answer this. Reach out via WhatsApp! 👇",
    "I don't have that info handy, but you can ask Omkar directly — he's very responsive on WhatsApp! 👇",
  ];

  /* ════════════════════════════════════════════
     DOM REFERENCES
  ════════════════════════════════════════════ */
  const fab        = document.getElementById('chatFab');
  const win        = document.getElementById('chatWindow');
  const messagesEl = document.getElementById('chatMessages');
  const chipsEl    = document.getElementById('chatChips');
  const inputEl    = document.getElementById('chatInput');
  const sendBtn    = document.getElementById('chatSend');
  const closeBtn   = document.getElementById('chatClose');
  const badgeEl    = document.getElementById('chatBadge');
  const waBar      = document.getElementById('chatWaBar');
  const waBtn      = document.getElementById('chatWaBtn');

  if (!fab || !win) return;

  /* ════════════════════════════════════════════
     STATE
  ════════════════════════════════════════════ */
  let isOpen          = false;
  let lastUserMessage = '';
  let messageCount    = 0;

  /* ════════════════════════════════════════════
     HELPERS
  ════════════════════════════════════════════ */
  function getTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function formatText(raw) {
    // Convert **bold**, \n to HTML
    return raw
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  /* ════════════════════════════════════════════
     RENDER MESSAGES
  ════════════════════════════════════════════ */
  function addMessage(text, sender = 'bot', skipScroll = false) {
    const msg = document.createElement('div');
    msg.className = `chat-msg ${sender}`;

    if (sender === 'bot') {
      msg.innerHTML = `
        <div class="chat-msg-avatar">OP</div>
        <div>
          <div class="chat-bubble">${formatText(text)}</div>
          <div class="chat-bubble-time">${getTime()}</div>
        </div>`;
    } else {
      msg.innerHTML = `
        <div>
          <div class="chat-bubble">${formatText(text)}</div>
          <div class="chat-bubble-time">${getTime()}</div>
        </div>`;
    }

    messagesEl.appendChild(msg);
    if (!skipScroll) scrollBottom();
    messageCount++;
  }

  function showTyping() {
    const el = document.createElement('div');
    el.className = 'chat-msg bot';
    el.id = 'typingIndicator';
    el.innerHTML = `
      <div class="chat-msg-avatar">OP</div>
      <div class="chat-typing">
        <span></span><span></span><span></span>
      </div>`;
    messagesEl.appendChild(el);
    scrollBottom();
    return el;
  }

  function removeTyping() {
    const el = document.getElementById('typingIndicator');
    if (el) el.remove();
  }

  function scrollBottom() {
    setTimeout(() => {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }, 50);
  }

  /* ════════════════════════════════════════════
     RENDER CHIPS
  ════════════════════════════════════════════ */
  function setChips(chips) {
    chipsEl.innerHTML = '';
    chips.forEach(label => {
      const btn = document.createElement('button');
      btn.className = 'chat-chip';
      btn.textContent = label;
      btn.addEventListener('click', () => handleChip(label));
      chipsEl.appendChild(btn);
    });
  }

  function handleChip(label) {
    const clean = label.replace(/^[^\w]+/, '').trim(); // strip emoji prefix
    if (clean.toLowerCase().includes('contact omkar')) {
      openWhatsApp(lastUserMessage || 'Hi Omkar! I visited your resume website and would like to connect.');
      return;
    }
    addMessage(label, 'user');
    processInput(clean);
  }

  /* ════════════════════════════════════════════
     NLP MATCH
  ════════════════════════════════════════════ */
  function findResponse(input) {
    const lower = input.toLowerCase();
    for (const entry of KB) {
      for (const pattern of entry.patterns) {
        if (lower.includes(pattern)) return entry;
      }
    }
    return null;
  }

  /* ════════════════════════════════════════════
     PROCESS INPUT
  ════════════════════════════════════════════ */
  function processInput(text) {
    if (!text.trim()) return;
    lastUserMessage = text;

    // Hide WA bar while processing
    waBar.style.display = 'none';

    const typing = showTyping();

    setTimeout(() => {
      removeTyping();

      const match = findResponse(text);

      if (match) {
        const reply = randomFrom(match.replies);
        addMessage(reply, 'bot');
        setChips(match.chips || []);

        if (match.showWA) {
          waBar.style.display = 'block';
          scrollBottom();
        }
      } else {
        const fallback = randomFrom(FALLBACK_REPLIES);
        addMessage(fallback, 'bot');
        setChips(['📋 Experience', '🛠️ Skills', '📞 Contact Omkar']);
        waBar.style.display = 'block';
        scrollBottom();
      }

    }, REPLY_DELAY_MS + Math.random() * 400);
  }

  /* ════════════════════════════════════════════
     WHATSAPP REDIRECT
  ════════════════════════════════════════════ */
  function buildWAMessage(userMsg) {
    if (!userMsg || userMsg.length < 3) {
      return `Hi Omkar! I visited your resume website and would like to connect with you.`;
    }
    return `Hi Omkar! I visited your resume website.\n\nI had a question: "${userMsg}"\n\nLooking forward to hearing from you!`;
  }

  function openWhatsApp(msg) {
    const encoded = encodeURIComponent(buildWAMessage(msg));
    const url     = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  waBtn.addEventListener('click', () => {
    openWhatsApp(lastUserMessage);
  });

  /* ════════════════════════════════════════════
     SEND MESSAGE
  ════════════════════════════════════════════ */
  function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = '';
    addMessage(text, 'user');
    processInput(text);
  }

  sendBtn.addEventListener('click', sendMessage);

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  /* ════════════════════════════════════════════
     OPEN / CLOSE WINDOW
  ════════════════════════════════════════════ */
  function openChat() {
    isOpen = true;
    win.classList.add('open');
    win.setAttribute('aria-hidden', 'false');
    fab.querySelector('.open-icon').style.display  = 'none';
    fab.querySelector('.close-icon').style.display = 'flex';
    badgeEl.style.opacity   = '0';
    badgeEl.style.transform = 'scale(0)';

    // Greet on first open
    if (messageCount === 0) {
      setTimeout(() => {
        const typing = showTyping();
        setTimeout(() => {
          removeTyping();
          addMessage(`Hey there! 👋 I'm Omkar's virtual assistant.\n\nAsk me about his **QA experience**, **skills**, **certifications**, or **availability** — or connect with him directly on WhatsApp!`, 'bot');
          setChips(['📋 Experience', '🛠️ Skills', '🏆 Certifications', '📞 Contact Omkar']);
        }, 700);
      }, 200);
    }

    setTimeout(() => inputEl.focus(), 400);
  }

  function closeChat() {
    isOpen = false;
    win.classList.remove('open');
    win.setAttribute('aria-hidden', 'true');
    fab.querySelector('.open-icon').style.display  = 'flex';
    fab.querySelector('.close-icon').style.display = 'none';
  }

  fab.addEventListener('click', () => isOpen ? closeChat() : openChat());
  closeBtn.addEventListener('click', closeChat);

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (isOpen && !win.contains(e.target) && !fab.contains(e.target)) {
      closeChat();
    }
  });

  // Esc key close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeChat();
  });

  /* ════════════════════════════════════════════
     AUTO-OPEN after 6 seconds (first visit)
  ════════════════════════════════════════════ */
  if (!sessionStorage.getItem('chatAutoOpened')) {
    setTimeout(() => {
      if (!isOpen) {
        sessionStorage.setItem('chatAutoOpened', '1');
        openChat();
      }
    }, 6000);
  }

})();
