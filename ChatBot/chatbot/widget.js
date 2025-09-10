(function () {
  const style = document.createElement('style');
  style.innerHTML = `
    #chatbot-window,
    #chatbot-window * {
      box-sizing: border-box;
    }

    #chatbot-icon {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #007bff;
      color: white;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      z-index: 9999;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      transition: background 0.3s;
      user-select: none;
    }
    #chatbot-icon:hover {
      background: #0056b3;
    }

    #chatbot-window {
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 360px;
      height: 650px;
      background: linear-gradient(145deg, #222831, #393e46);
      border-radius: 16px;
      display: none;
      flex-direction: column;
      overflow: hidden;
      z-index: 9998;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.8);
      color: #e0e0e0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      user-select: text;
    }

    #chatbot-header {
      flex-shrink: 0;
      height: 56px;
      padding: 12px 20px;
      background: linear-gradient(90deg, #00c6ff, #0072ff);
      border-bottom: 2px solid #005bb5;
      box-shadow: 0 3px 6px rgba(0, 114, 255, 0.5);
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      user-select: none;
    }

    #chatbot-logo {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    #chatbot-logo img {
      width: 32px;
      height: 32px;
      object-fit: contain;
    }

    #chatbot-title {
      font-weight: bold;
      font-size: 18px;
      color: #fff;
      user-select: none;
    }

    #chatbot-close {
      cursor: pointer;
      font-size: 24px;
      color: #ddd;
      transition: color 0.2s;
      user-select: none;
    }
    #chatbot-close:hover {
      color: #fff;
    }

    #chatbot-messages {
      flex-grow: 1;
      overflow-y: auto;
      padding: 18px 20px;
      background: #2c313a;
      font-size: 16px;
      line-height: 1.5;
      scrollbar-width: thin;
      scrollbar-color: #00b4db #1c1f26;
      display: flex;
      flex-direction: column;
      gap: 10px;
      user-select: text;
    }

    #chatbot-messages::-webkit-scrollbar {
      width: 8px;
    }
    #chatbot-messages::-webkit-scrollbar-track {
      background: #1c1f26;
      border-radius: 10px;
    }
    #chatbot-messages::-webkit-scrollbar-thumb {
      background-color: #00b4db;
      border-radius: 10px;
      border: 2px solid #1c1f26;
    }

    .message {
      max-width: 80%;
      padding: 14px 18px;
      border-radius: 24px;
      word-wrap: break-word;
      white-space: pre-wrap;
      font-size: 16px;
      line-height: 1.5;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(8px);
      border: 1px solid transparent;
      user-select: text;
    }

    .message.user {
      background: linear-gradient(135deg, #007bff, #0056b3);
      color: white;
      margin-left: auto;
      border-bottom-right-radius: 6px;
      border: 1px solid #004a99;
      box-shadow: 0 4px 14px rgba(0, 123, 255, 0.6);
    }

    .message.bot {
      background: linear-gradient(135deg, #434a54, #2c313a);
      color: #ddd;
      margin-right: auto;
      border-bottom-left-radius: 6px;
      border: 1px solid #1a1f26;
      box-shadow: 0 4px 14px rgba(30, 30, 30, 0.6);
    }

    #chatbot-input {
      flex-shrink: 0;
      height: 64px;
      padding: 14px 16px;
      background: linear-gradient(90deg, #1f2739, #131a27);
      border-top: 2px solid #005bb5;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom-left-radius: 16px;
      border-bottom-right-radius: 16px;
      box-shadow: inset 0 0 10px #0072ff55;
    }

    #chatbot-input input {
      flex-grow: 1;
      height: 36px;
      padding: 0 16px;
      font-size: 16px;
      border-radius: 30px;
      background: #323a4a;
      color: #e0e0e0;
      border: none;
      outline: none;
      box-shadow: inset 0 0 8px #0072ff88;
      transition: background-color 0.3s;
      user-select: text;
    }

    #chatbot-input input::placeholder {
      color: #999;
    }

    #chatbot-send-btn {
      background: #00aaff;
      color: white;
      border: none;
      padding: 10px 16px;
      font-size: 16px;
      border-radius: 24px;
      cursor: pointer;
      user-select: none;
      transition: background 0.3s;
    }

    #chatbot-send-btn:hover {
      background: #008fcc;
    }

    #chatbot-mic-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      user-select: none;
      font-size: 24px;
      color: #00aaff;
      transition: color 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      width: 36px;
      height: 36px;
    }

    #chatbot-mic-btn.listening svg {
      fill: #ff4b4b;
      animation: pulse 1.2s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(1);}
      50% { transform: scale(1.2);}
      100% { transform: scale(1);}
    }

    /* Loading "..." typing effect */
    .loading-dots {
      display: inline-block;
      position: relative;
      width: 40px;
      height: 16px;
    }
    .loading-dots span {
      position: absolute;
      top: 0;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #00aaff;
      animation-timing-function: cubic-bezier(0, 1, 1, 0);
    }
    .loading-dots span:nth-child(1) {
      left: 0;
      animation: loading-dot1 0.6s infinite;
    }
    .loading-dots span:nth-child(2) {
      left: 12px;
      animation: loading-dot2 0.6s infinite;
    }
    .loading-dots span:nth-child(3) {
      left: 24px;
      animation: loading-dot3 0.6s infinite;
    }
    @keyframes loading-dot1 {
      0% { transform: scale(0);}
      100% { transform: scale(1);}
    }
    @keyframes loading-dot2 {
      0% { transform: translateX(0);}
      100% { transform: translateX(12px);}
    }
    @keyframes loading-dot3 {
      0% { transform: scale(1);}
      100% { transform: scale(0);}
    }
  `;
  document.head.appendChild(style);

  // Create chatbot icon
  const icon = document.createElement('div');
icon.id = 'chatbot-icon';
icon.title = "Open Chatbot";
icon.style.width = '60px';
icon.style.height = '60px';
icon.style.borderRadius = '50%';
icon.style.cursor = 'pointer';
icon.style.position = 'fixed';
icon.style.bottom = '20px';
icon.style.right = '20px';
icon.style.zIndex = '9999';
icon.style.display = 'flex';
icon.style.justifyContent = 'center';
icon.style.alignItems = 'center';
icon.style.boxShadow = '0 0 12px 3px rgba(0, 123, 255, 0.6)'; // bluish shadow
icon.style.background = 'transparent'; // no background color

icon.innerHTML = `
  <img src="https://raw.githubusercontent.com/HorizonHoppers/SIH2025/main/107b782e-c2d8-45f9-94cb-c131f4d00f03.jpg" 
       alt="Logo" 
       style="width: 52px; height: 52px; border-radius: 50%; object-fit: cover;" />
`;


  // Create chatbot window
  const windowEl = document.createElement('div');
  windowEl.id = 'chatbot-window';

  windowEl.innerHTML = `
    <div id="chatbot-header">
    <div id="chatbot-logo">
    <img src="https://raw.githubusercontent.com/HorizonHoppers/SIH2025/main/107b782e-c2d8-45f9-94cb-c131f4d00f03.jpg" alt="Logo" />
    <div id="chatbot-title">Nova Chatbot</div>
  </div>
  
      <div id="chatbot-close" title="Close">✖</div>
    </div>
    <div id="chatbot-messages"></div>
    <div id="chatbot-input">
      <button id="chatbot-mic-btn" title="Speak">
        <svg xmlns="http://www.w3.org/2000/svg" fill="#00aaff" height="24" viewBox="0 0 24 24" width="24"><path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0h-2zM11 19.93v2.07h2v-2.07a7.001 7.001 0 0 0 5.64-6.78h-2a5.002 5.002 0 0 1-9.28 0H5.36a7.001 7.001 0 0 0 5.64 6.78z"/></svg>
      </button>
      <input type="text" id="chatbot-user-input" placeholder="Type a message..." autocomplete="off" />
      <button id="chatbot-send-btn">Send</button>
    </div>
  `;

  document.body.appendChild(icon);
  document.body.appendChild(windowEl);

  const closeBtn = windowEl.querySelector('#chatbot-close');
  const micBtn = windowEl.querySelector('#chatbot-mic-btn');
  const input = windowEl.querySelector('#chatbot-user-input');
  const sendBtn = windowEl.querySelector('#chatbot-send-btn');
  const messages = windowEl.querySelector('#chatbot-messages');

  function showWelcome() {
    addMessage("Hi! I'm Nova, your SikshaSetu assistant. How can I help you today?", false);
  }

  icon.addEventListener('click', () => {
    if (windowEl.style.display === 'flex') {
      windowEl.style.display = 'none';
    } else {
      windowEl.style.display = 'flex';
      if (messages.children.length === 0) showWelcome();
      input.focus();
    }
  });

  closeBtn.addEventListener('click', () => {
    windowEl.style.display = 'none';
  });

  function addMessage(text, isUser) {
    const msg = document.createElement('div');
    msg.className = 'message ' + (isUser ? 'user' : 'bot');
    msg.textContent = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  let typingMsg = null;
  function showTyping() {
    if (!typingMsg) {
      typingMsg = document.createElement('div');
      typingMsg.className = 'message bot';
      typingMsg.innerHTML = `<div class="loading-dots"><span></span><span></span><span></span></div>`;
      messages.appendChild(typingMsg);
      messages.scrollTop = messages.scrollHeight;
    }
  }

  function hideTyping() {
    if (typingMsg) {
      messages.removeChild(typingMsg);
      typingMsg = null;
    }
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, true);
    input.value = '';
    showTyping();

    try {
      const res = await fetch('https://translator-qm58.onrender.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text })
      });

      const data = await res.json();
      hideTyping();
      addMessage(data.response || 'No response from server.', false);
    } catch (err) {
      hideTyping();
      console.error('Chat error:', err);
      addMessage('Error connecting to server.', false);
    }
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keypress', e => {
    if (e.key === 'Enter') sendMessage();
  });

  // === MIC & VOICE HANDLING ===
  let recognition;
  let interimMessage = null;
  let silenceTimeout;

  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;

    function resetSilenceTimeout() {
      if (silenceTimeout) clearTimeout(silenceTimeout);
      silenceTimeout = setTimeout(() => {
        recognition.stop();
      }, 2500);
    }

    recognition.onstart = () => {
      micBtn.classList.add('listening');
      micBtn.disabled = false;
      if (interimMessage) {
        messages.removeChild(interimMessage);
        interimMessage = null;
      }
      resetSilenceTimeout();
    };

    recognition.onresult = (event) => {
      resetSilenceTimeout();
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');

      if (event.results[0].isFinal) {
        if (interimMessage) {
          messages.removeChild(interimMessage);
          interimMessage = null;
        }
        input.value = transcript;
        sendMessage();
      } else {
        if (!interimMessage) {
          interimMessage = document.createElement('div');
          interimMessage.className = 'message bot';
          interimMessage.style.fontStyle = 'italic';
          messages.appendChild(interimMessage);
        }
        interimMessage.textContent = transcript + ' ...';
        messages.scrollTop = messages.scrollHeight;
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      micBtn.classList.remove('listening');
      micBtn.disabled = false;
      if (interimMessage) {
        messages.removeChild(interimMessage);
        interimMessage = null;
      }
      addMessage('Voice error: ' + event.error, false);
    };

    recognition.onend = () => {
      micBtn.classList.remove('listening');
      micBtn.disabled = false;
      if (interimMessage) {
        messages.removeChild(interimMessage);
        interimMessage = null;
      }
      if (silenceTimeout) clearTimeout(silenceTimeout);
    };

    micBtn.addEventListener('click', () => {
      if (micBtn.classList.contains('listening')) {
        recognition.stop();
        micBtn.disabled = true;
      } else {
        micBtn.disabled = true;
        recognition.start();
      }
    });
  } else {
    micBtn.style.display = 'none'; // Not supported
  }
})();

