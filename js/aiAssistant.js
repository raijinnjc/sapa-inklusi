/**
 * SAPA INKLUSI - Asisten AI Kelas Engine
 * Speech-to-Text (STT) & Text-to-Speech (TTS) Implementation
 */

let isRecording = false;
let recognition = null;

// Initialize Web Speech Recognition
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        const input = document.getElementById('chatInput');
        if (input) input.value = transcript;
        stopRecordingUI();
        sendChatMessage(transcript);
    };

    recognition.onerror = function(event) {
        console.warn('Speech Recognition Error:', event.error);
        stopRecordingUI();
    };

    recognition.onend = function() {
        stopRecordingUI();
    };
}

function toggleVoiceRecording() {
    if (!recognition) {
        const simText = prompt("Browser Anda belum mengizinkan Web Speech API langsung. Ketik simulasi suara Anda:", "Sederhanakan instruksi tugas menulis hari ini.");
        if (simText) {
            sendChatMessage(simText);
        }
        return;
    }

    if (!isRecording) {
        try {
            recognition.start();
            isRecording = true;
            const btn = document.getElementById('micBtn');
            if (btn) btn.classList.add('bg-primary', 'text-on-primary', 'mic-pulsing');
            const status = document.getElementById('voiceStatus');
            if (status) status.classList.remove('hidden');
        } catch(e) {
            console.error(e);
        }
    } else {
        recognition.stop();
        stopRecordingUI();
    }
}

function stopRecordingUI() {
    isRecording = false;
    const btn = document.getElementById('micBtn');
    if (btn) btn.classList.remove('bg-primary', 'text-on-primary', 'mic-pulsing');
    const status = document.getElementById('voiceStatus');
    if (status) status.classList.add('hidden');
}

function speakText(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID';
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
    } else {
        alert("Text-to-Speech tidak didukung pada browser ini.");
    }
}

function handleChatSubmit(e) {
    e.preventDefault();
    const input = document.getElementById('chatInput');
    if (!input) return;
    const message = input.value.trim();
    if (!message) return;
    input.value = '';
    sendChatMessage(message);
}

function sendQuickPrompt(promptText) {
    sendChatMessage(promptText);
}

function sendChatMessage(text) {
    const feed = document.getElementById('chatFeed');
    if (!feed) return;

    // User Message Bubble
    const userMsgHtml = `
        <div class="flex items-start gap-3 max-w-[85%] ml-auto justify-end">
            <div class="bg-primary text-on-primary p-4 rounded-2xl rounded-tr-sm shadow-sm">
                <p>${escapeHtml(text)}</p>
            </div>
            <div class="w-7 h-7 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">PIB</div>
        </div>
    `;
    feed.insertAdjacentHTML('beforeend', userMsgHtml);
    feed.scrollTop = feed.scrollHeight;

    // Generate AI Response from DataStore
    setTimeout(() => {
        const aiResponse = window.sapaStore ? window.sapaStore.generateAIResponse(text) : "Respon adaptif disiapkan untuk panduan inklusif.";
        const aiMsgHtml = `
            <div class="flex items-start gap-3 max-w-[85%]">
                <div class="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">AI</div>
                <div class="bg-surface-container-low p-4 rounded-2xl rounded-tl-sm border border-outline-variant/20 text-on-surface">
                    <p class="whitespace-pre-line">${escapeHtml(aiResponse)}</p>
                    <div class="mt-3 flex gap-3 pt-2 border-t border-outline-variant/20">
                        <button onclick="speakText(\`${escapeJsString(aiResponse)}\`)" class="text-primary hover:text-primary-container text-xs font-bold flex items-center gap-1">
                            <span class="material-symbols-outlined text-sm">volume_up</span> Putar Suara (TTS)
                        </button>
                        <button onclick="copyToClipboard(\`${escapeJsString(aiResponse)}\`)" class="text-on-surface-variant hover:text-on-surface text-xs flex items-center gap-1">
                            <span class="material-symbols-outlined text-sm">content_copy</span> Salin
                        </button>
                    </div>
                </div>
            </div>
        `;
        feed.insertAdjacentHTML('beforeend', aiMsgHtml);
        feed.scrollTop = feed.scrollHeight;
    }, 500);
}

function clearChat() {
    const feed = document.getElementById('chatFeed');
    if (!feed) return;
    feed.innerHTML = `
        <div class="flex items-start gap-3 max-w-[85%]">
            <div class="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">AI</div>
            <div class="bg-surface-container-low p-4 rounded-2xl rounded-tl-sm border border-outline-variant/20 text-on-surface">
                <p>Obrolan telah dibersihkan. Silakan ajukan instruksi pembelajaran baru.</p>
            </div>
        </div>
    `;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    alert("Teks berhasil disalin!");
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function escapeJsString(str) {
    return str.replace(/`/g, '\\`').replace(/\\/g, '\\\\').replace(/\$/g, '\\$');
}
