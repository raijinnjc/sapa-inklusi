/**
 * SAPA INKLUSI - Master SPA Application Controller with Auth Gateway
 * High-performance, Living UI, Zero-dependency Charting & Web Speech API
 */

// Global App State
let activeView = 'dashboard';
let outcomeChartInstance = null;
let donutChartInstance = null;
let radarChartInstance = null;
let speechRec = null;
let isRec = false;
let audioCtx = null;

// Sound Effects via Web Audio API
function playSound(type = 'click') {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        if (type === 'click') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.05);
            gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.05);
        } else if (type === 'success') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(440, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.12);
            gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.12);
        }
    } catch(e) {
        // Audio policy ignore
    }
}

// Toast Notification Manager
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const iconMap = {
        'success': 'verified',
        'info': 'info',
        'warning': 'warning',
        'error': 'error'
    };
    const colorMap = {
        'success': 'bg-[#2E6F40] text-white',
        'info': 'bg-[#C85A32] text-white',
        'warning': 'bg-[#E29547] text-white',
        'error': 'bg-[#BA1A1A] text-white'
    };

    const toast = document.createElement('div');
    toast.className = `toast-msg flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-xs font-semibold ${colorMap[type] || colorMap.info}`;
    toast.innerHTML = `
        <span class="material-symbols-outlined text-base">${iconMap[type] || 'info'}</span>
        <span>${message}</span>
    `;

    container.appendChild(toast);
    playSound(type === 'success' ? 'success' : 'click');

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

// ==========================================
// AUTHENTICATION CONTROLLER
// ==========================================
function checkAuthState() {
    const isLogged = window.store ? window.store.state.isLoggedIn : false;
    const loginGate = document.getElementById('loginGate');
    const mainApp = document.getElementById('mainAppWrapper');

    if (isLogged) {
        if (loginGate) loginGate.classList.add('hidden');
        if (mainApp) mainApp.classList.remove('hidden');
        updateUserProfileUI();
        navigateTo(activeView || 'dashboard');
    } else {
        if (loginGate) loginGate.classList.remove('hidden');
        if (mainApp) mainApp.classList.add('hidden');
    }
}

function autoFillDemo(email) {
    playSound('click');
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    if (emailInput) emailInput.value = email;
    if (passwordInput) passwordInput.value = 'password123';

    // Highlight selected demo card
    document.querySelectorAll('.demo-role-card').forEach(c => {
        if (c.getAttribute('data-email') === email) {
            c.classList.add('border-[#C85A32]', 'bg-[#FDF3EE]');
            c.classList.remove('border-[#EAE4D9]', 'bg-white');
        } else {
            c.classList.remove('border-[#C85A32]', 'bg-[#FDF3EE]');
            c.classList.add('border-[#EAE4D9]', 'bg-white');
        }
    });
}

function handleLoginSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim() || 'gpk@sapa.id';
    
    // Simulate auth loading
    const btn = document.getElementById('loginSubmitBtn');
    if (btn) {
        btn.innerHTML = `<span class="material-symbols-outlined text-sm animate-spin">progress_activity</span> Memverifikasi Kredensial...`;
        btn.disabled = true;
    }

    setTimeout(() => {
        const user = window.store.login(email);
        if (btn) {
            btn.innerHTML = `<span>Masuk ke Platform</span> <span class="material-symbols-outlined text-sm">arrow_forward</span>`;
            btn.disabled = false;
        }

        checkAuthState();
        showToast(`Selamat datang, ${user.name}! (${user.roleLabel})`, "success");
    }, 600);
}

function handleLogout() {
    playSound('click');
    if (confirm("Apakah Anda yakin ingin keluar dari SAPA Inklusi?")) {
        window.store.logout();
        checkAuthState();
        showToast("Anda telah berhasil keluar.", "info");
    }
}

function updateUserProfileUI() {
    const user = window.store.state.currentUser || {
        name: window.store.state.userName,
        roleLabel: window.store.state.userRoleLabel,
        avatarInitials: 'SW',
        avatarColor: '#C85A32'
    };

    const sideName = document.getElementById('sidebarUserName');
    if (sideName) sideName.innerText = user.name;
    const sideRole = document.getElementById('sidebarUserRole');
    if (sideRole) sideRole.innerText = user.roleLabel;
    const sideAvatar = document.getElementById('sidebarUserAvatar');
    if (sideAvatar) {
        sideAvatar.innerText = user.avatarInitials || 'SW';
        sideAvatar.style.backgroundColor = user.avatarColor || '#C85A32';
    }

    const roleSelector = document.getElementById('topRoleSelector');
    if (roleSelector) {
        roleSelector.value = window.store.state.userRole;
    }
}

// ==========================================
// SPA NAVIGATION ROUTER
// ==========================================
function navigateTo(viewId) {
    playSound('click');
    activeView = viewId;

    // Update nav links
    document.querySelectorAll('.nav-item').forEach(el => {
        const target = el.getAttribute('data-view');
        if (target === viewId) {
            el.className = "nav-item flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold bg-[#C85A32]/10 text-[#C85A32] transition-all";
            const icon = el.querySelector('.material-symbols-outlined');
            if (icon) icon.classList.add('fill');
        } else {
            el.className = "nav-item flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-[#656A73] hover:text-[#C85A32] hover:bg-[#F6F3ED] transition-all";
            const icon = el.querySelector('.material-symbols-outlined');
            if (icon) icon.classList.remove('fill');
        }
    });

    // Toggle view panes
    document.querySelectorAll('.view-pane').forEach(el => {
        el.classList.remove('active');
    });

    const activePane = document.getElementById(`view-${viewId}`);
    if (activePane) {
        activePane.classList.add('active');
    }

    // Trigger sub-renderers
    if (viewId === 'dashboard') renderDashboardCharts();
    if (viewId === 'microcredential') renderModulesList();
    if (viewId === 'pib') renderPIBDirectory();
    if (viewId === 'sekolah') renderSchoolDirectory();
    if (viewId === 'pendampingan') renderSessionsList();
    if (viewId === 'laporan') renderOutcomeCharts();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// 1. DASHBOARD VIEW
// ==========================================
function renderDashboardCharts() {
    if (typeof Chart === 'undefined') return;

    // Longitudinal Monthly Bar Chart
    const ctxBar = document.getElementById('chartGrowth');
    if (ctxBar) {
        if (outcomeChartInstance) outcomeChartInstance.destroy();
        outcomeChartInstance = new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu'],
                datasets: [{
                    label: 'PIB Aktif',
                    data: [42, 58, 69, 84, 98, 112, 120, 128],
                    backgroundColor: function(context) {
                        return context.dataIndex === 7 ? '#C85A32' : 'rgba(200, 90, 50, 0.35)';
                    },
                    borderRadius: 6,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1C2024',
                        padding: 10,
                        titleFont: { family: 'Plus Jakarta Sans', size: 12 },
                        bodyFont: { family: 'Plus Jakarta Sans', size: 12 }
                    }
                },
                scales: {
                    y: { grid: { color: '#F0ECE4' }, ticks: { color: '#8F95A0', font: { size: 10 } } },
                    x: { grid: { display: false }, ticks: { color: '#656A73', font: { size: 11, weight: '600' } } }
                }
            }
        });
    }

    // Donut Needs Chart
    const ctxDonut = document.getElementById('chartNeeds');
    if (ctxDonut) {
        if (donutChartInstance) donutChartInstance.destroy();
        donutChartInstance = new Chart(ctxDonut, {
            type: 'doughnut',
            data: {
                labels: ['Terpenuhi (74%)', 'Butuh PIB (26%)'],
                datasets: [{
                    data: [34, 12],
                    backgroundColor: ['#5B6E43', '#C85A32'],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '72%',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1C2024',
                        padding: 10
                    }
                }
            }
        });
    }
}

// ==========================================
// 2. MICROCREDENTIAL VIEW
// ==========================================
function renderModulesList() {
    const list = window.store ? window.store.state.modules : [];
    const container = document.getElementById('modulesGrid');
    if (!container) return;
    container.innerHTML = '';

    list.forEach(m => {
        const card = document.createElement('div');
        card.className = "bg-white p-5 rounded-2xl border border-[#EAE4D9] shadow-sm hover-elevate flex flex-col justify-between";
        card.innerHTML = `
            <div>
                <div class="flex justify-between items-start mb-3">
                    <span class="w-7 h-7 rounded-lg bg-[#C85A32]/10 text-[#C85A32] font-bold text-xs flex items-center justify-center">${m.number}</span>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#5B6E43]/15 text-[#5B6E43]">${m.category}</span>
                </div>
                <h3 class="font-bold text-sm text-[#1C2024] mb-1.5 leading-snug">${m.title}</h3>
                <p class="text-xs text-[#656A73] line-clamp-2 leading-relaxed mb-4">${m.description}</p>
            </div>
            <div class="pt-3 border-t border-[#F0ECE4] flex items-center justify-between">
                <span class="text-[11px] text-[#8F95A0] font-medium flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm">schedule</span> ${m.durationHours} Jam
                </span>
                <button onclick="takeQuizModal('${m.id}')" class="px-3 py-1.5 rounded-lg bg-[#F6F3ED] hover:bg-[#C85A32] hover:text-white text-[#1C2024] text-xs font-bold transition-colors">
                    Ikuti Asesmen
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

function takeQuizModal(modId) {
    const m = window.store.state.modules.find(item => item.id === modId);
    if (!m) return;

    const modal = document.getElementById('quizModal');
    const content = document.getElementById('quizModalContent');
    if (!modal || !content) return;

    const q = m.quizQuestions ? m.quizQuestions[0] : { q: "Konsep dasar pembelajaran adaptif?", a: ["Diferensiasi instruksi", "Standarisasi nilai"], correct: 0 };
    
    content.innerHTML = `
        <div class="flex justify-between items-center mb-3">
            <span class="text-xs font-bold text-[#C85A32]">Modul ${m.number} • Asesmen Kompetensi</span>
            <button onclick="closeModal('quizModal')" class="text-[#8F95A0] hover:text-[#1C2024]"><span class="material-symbols-outlined">close</span></button>
        </div>
        <h3 class="font-bold text-base text-[#1C2024] mb-4">${m.title}</h3>
        <div class="p-4 rounded-xl bg-[#F6F3ED] border border-[#EAE4D9] mb-4 text-xs font-medium text-[#1C2024]">
            <p class="font-bold mb-3">${q.q}</p>
            <div class="space-y-2">
                ${q.a.map((opt, idx) => `
                    <label class="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#EAE4D9] cursor-pointer hover:border-[#C85A32]">
                        <input type="radio" name="quizAns" value="${idx}" class="text-[#C85A32] focus:ring-[#C85A32]">
                        <span>${opt}</span>
                    </label>
                `).join('')}
            </div>
        </div>
        <div class="flex justify-end gap-2">
            <button onclick="closeModal('quizModal')" class="px-4 py-2 rounded-xl border border-[#EAE4D9] text-xs font-bold">Batal</button>
            <button onclick="submitQuiz('${m.id}', ${q.correct})" class="px-5 py-2 rounded-xl bg-[#C85A32] hover:bg-[#B04A25] text-white text-xs font-bold">Kirim Jawaban</button>
        </div>
    `;

    modal.classList.remove('hidden');
}

function submitQuiz(modId, correctIdx) {
    const selected = document.querySelector('input[name="quizAns"]:checked');
    if (!selected) {
        showToast("Pilih salah satu jawaban terlebih dahulu.", "warning");
        return;
    }

    if (parseInt(selected.value) === correctIdx) {
        closeModal('quizModal');
        showToast("Selamat! Anda lulus asesmen dengan nilai 100.", "success");
        openCertModal(window.store.state.userName || "Rina Maharani, S.Pd");
    } else {
        showToast("Jawaban kurang tepat. Pelajari materi kembali dan coba lagi.", "error");
    }
}

function openCertModal(userName = "Rina Maharani, S.Pd") {
    const modal = document.getElementById('certModal');
    const nameEl = document.getElementById('certRecipientName');
    if (nameEl) nameEl.innerText = userName;
    if (modal) modal.classList.remove('hidden');
    playSound('success');
}

// ==========================================
// 3. ASISTEN AI KELAS VIEW
// ==========================================
function initVoiceAI() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        speechRec = new SR();
        speechRec.lang = 'id-ID';
        speechRec.continuous = false;
        speechRec.interimResults = false;

        speechRec.onresult = function(event) {
            const text = event.results[0][0].transcript;
            const input = document.getElementById('aiInput');
            if (input) input.value = text;
            stopVoice();
            sendAiMessage(text);
        };

        speechRec.onerror = function() {
            stopVoice();
        };

        speechRec.onend = function() {
            stopVoice();
        };
    }
}

function toggleVoice() {
    playSound('click');
    if (!speechRec) {
        const text = prompt("Simulasi Suara (Browser belum aktif STT):", "Sederhanakan instruksi tugas matematika hari ini.");
        if (text) sendAiMessage(text);
        return;
    }

    if (!isRec) {
        try {
            speechRec.start();
            isRec = true;
            document.getElementById('micButton').classList.add('mic-pulsing', 'bg-[#C85A32]', 'text-white');
            document.getElementById('waveVisualizer').classList.remove('hidden');
        } catch(e) {}
    } else {
        speechRec.stop();
        stopVoice();
    }
}

function stopVoice() {
    isRec = false;
    const btn = document.getElementById('micButton');
    if (btn) btn.classList.remove('mic-pulsing', 'bg-[#C85A32]', 'text-white');
    const wave = document.getElementById('waveVisualizer');
    if (wave) wave.classList.add('hidden');
}

function handleAiSubmit(e) {
    e.preventDefault();
    const input = document.getElementById('aiInput');
    if (!input) return;
    const msg = input.value.trim();
    if (!msg) return;
    input.value = '';
    sendAiMessage(msg);
}

function sendAiMessage(promptText) {
    const feed = document.getElementById('aiChatFeed');
    if (!feed) return;

    // User message
    const userDiv = document.createElement('div');
    userDiv.className = "flex items-start gap-3 max-w-[85%] ml-auto justify-end";
    userDiv.innerHTML = `
        <div class="bg-[#C85A32] text-white p-4 rounded-2xl rounded-tr-sm text-xs leading-relaxed shadow-sm">
            <p>${escapeHtml(promptText)}</p>
        </div>
        <div class="w-7 h-7 rounded-full bg-[#EAE4D9] text-[#1C2024] font-bold text-[10px] flex items-center justify-center shrink-0">PIB</div>
    `;
    feed.appendChild(userDiv);
    feed.scrollTop = feed.scrollHeight;

    // AI Response
    setTimeout(() => {
        const resp = window.store.generateAI(promptText);
        const aiDiv = document.createElement('div');
        aiDiv.className = "flex items-start gap-3 max-w-[85%]";
        aiDiv.innerHTML = `
            <div class="w-7 h-7 rounded-full bg-[#C85A32] text-white font-bold text-[10px] flex items-center justify-center shrink-0">AI</div>
            <div class="bg-white p-4 rounded-2xl rounded-tl-sm border border-[#EAE4D9] text-xs text-[#1C2024] leading-relaxed shadow-sm space-y-2">
                <div class="whitespace-pre-line">${markedText(resp)}</div>
                <div class="pt-2 border-t border-[#F0ECE4] flex gap-3">
                    <button onclick="speakSpeech(\`${escapeJs(resp)}\`)" class="text-[#C85A32] hover:text-[#B04A25] font-bold flex items-center gap-1 text-[11px]">
                        <span class="material-symbols-outlined text-sm">volume_up</span> Putar Suara (TTS)
                    </button>
                    <button onclick="copyText(\`${escapeJs(resp)}\`)" class="text-[#656A73] hover:text-[#1C2024] flex items-center gap-1 text-[11px]">
                        <span class="material-symbols-outlined text-sm">content_copy</span> Salin
                    </button>
                </div>
            </div>
        `;
        feed.appendChild(aiDiv);
        feed.scrollTop = feed.scrollHeight;
        playSound('click');
    }, 400);
}

function speakSpeech(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        // Clean markdown symbols for cleaner voice
        const clean = text.replace(/[*#_]/g, '');
        const utt = new SpeechSynthesisUtterance(clean);
        utt.lang = 'id-ID';
        utt.rate = 0.95;
        window.speechSynthesis.speak(utt);
    } else {
        showToast("Browser tidak mendukung Text-to-Speech.", "warning");
    }
}

// ==========================================
// 4. PIB DIRECTORY VIEW
// ==========================================
function renderPIBDirectory() {
    const list = window.store ? window.store.state.pibs : [];
    const tbody = document.getElementById('pibTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    list.forEach((p, idx) => {
        const isCert = p.status === 'BERSERTIFIKAT';
        const tr = document.createElement('tr');
        tr.className = `hover:bg-[#FBF9F5] transition-colors cursor-pointer border-b border-[#F0ECE4] ${idx === 0 ? 'bg-[#FDF3EE]/50' : ''}`;
        tr.onclick = () => selectPibDrawer(p.id);
        tr.innerHTML = `
            <td class="py-3.5 px-4">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style="background-color: ${p.bgColor}">${p.initials}</div>
                    <div>
                        <div class="font-bold text-xs text-[#1C2024]">${p.name}</div>
                        <div class="text-[10px] text-[#8F95A0]">${p.email}</div>
                    </div>
                </div>
            </td>
            <td class="py-3.5 px-4 text-xs text-[#656A73]">${p.region}</td>
            <td class="py-3.5 px-4">
                <span class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${isCert ? 'bg-[#5B6E43]/15 text-[#5B6E43]' : 'bg-[#C85A32]/10 text-[#C85A32]'}">
                    <span class="material-symbols-outlined text-xs">${isCert ? 'verified' : 'hourglass_top'}</span>
                    ${isCert ? 'Bersertifikat' : 'Dalam Progres'}
                </span>
            </td>
            <td class="py-3.5 px-4">
                <span class="text-[11px] px-2 py-0.5 rounded bg-[#F6F3ED] text-[#1C2024] font-medium">${p.competencies[0]}</span>
            </td>
            <td class="py-3.5 px-4 text-xs font-semibold text-[#1C2024]">${p.assignedSchool}</td>
            <td class="py-3.5 px-4">
                <span class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${p.availability === 'TERSEDIA' ? 'bg-[#5B6E43]/15 text-[#5B6E43]' : 'bg-[#8F95A0]/20 text-[#656A73]'}">
                    <span class="w-1.5 h-1.5 rounded-full ${p.availability === 'TERSEDIA' ? 'bg-[#5B6E43]' : 'bg-[#656A73]'}"></span>
                    ${p.availability === 'TERSEDIA' ? 'Tersedia' : 'Sedang Bertugas'}
                </span>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function selectPibDrawer(id) {
    const p = window.store.state.pibs.find(item => item.id === id);
    if (!p) return;

    document.getElementById('drawerAvatar').innerText = p.initials;
    document.getElementById('drawerAvatar').style.backgroundColor = p.bgColor;
    document.getElementById('drawerName').innerText = p.name;
    document.getElementById('drawerIdRegion').innerText = `${p.region} • ${p.id}`;
    document.getElementById('drawerSchool').innerText = p.assignedSchool;
    document.getElementById('drawerStudents').innerText = `${p.studentsCount} Siswa didampingi`;
    document.getElementById('drawerRating').innerText = `⭐ ${p.rating} (${p.sessionsCompleted} sesi)`;

    const comps = document.getElementById('drawerComps');
    comps.innerHTML = p.competencies.map(c => `<span class="px-2 py-0.5 rounded bg-[#F6F3ED] text-xs font-medium">${c}</span>`).join('');
}

function filterPib() {
    const q = document.getElementById('searchPib').value.toLowerCase();
    const region = document.getElementById('filterPibRegion').value;
    const cert = document.getElementById('filterPibCert').value;

    const rows = document.querySelectorAll('#pibTableBody tr');
    rows.forEach(r => {
        const text = r.innerText.toLowerCase();
        const mQ = !q || text.includes(q);
        const mR = region === 'ALL' || text.includes(region.toLowerCase());
        const mC = cert === 'ALL' || (cert === 'BERSERTIFIKAT' ? text.includes('bersertifikat') : text.includes('dalam progres'));
        r.style.display = (mQ && mR && mC) ? '' : 'none';
    });
}

// ==========================================
// 5. SEKOLAH MITRA VIEW
// ==========================================
function renderSchoolDirectory() {
    const list = window.store ? window.store.state.schools : [];
    const container = document.getElementById('schoolListContainer');
    if (!container) return;
    container.innerHTML = '';

    list.forEach(s => {
        const isNeed = s.status === 'BUTUH_PENDAMPING';
        const row = document.createElement('div');
        row.className = "p-4 rounded-xl border border-[#EAE4D9] bg-white hover-elevate cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-3";
        row.onclick = () => selectSchoolDetail(s.id);
        row.innerHTML = `
            <div>
                <div class="flex items-center gap-2 mb-1">
                    <span class="font-bold text-sm text-[#1C2024]">${s.name}</span>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded ${s.level === 'SD' ? 'bg-[#C85A32]/10 text-[#C85A32]' : 'bg-[#5B6E43]/10 text-[#5B6E43]'}">${s.level}</span>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${isNeed ? 'bg-[#BA1A1A]/10 text-[#BA1A1A]' : 'bg-[#5B6E43]/15 text-[#5B6E43]'}">${isNeed ? 'Butuh PIB' : 'Terpenuhi'}</span>
                </div>
                <p class="text-xs text-[#656A73] flex items-center gap-2">
                    <span>${s.region} • ${s.distanceKm} km</span>
                    <span>• Siswa: ${s.studentsCount} anak</span>
                </p>
            </div>
            <div class="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                <div class="text-right">
                    <span class="text-xs font-bold text-[#C85A32] block">${s.matchingScore}% Match</span>
                    <span class="text-[10px] text-[#8F95A0]">Tugas: ${s.assignedPIB}/${s.requiredPIB} PIB</span>
                </div>
                <button onclick="event.stopPropagation(); openAssignModal('${s.id}')" class="px-3.5 py-1.5 rounded-lg bg-[#C85A32] hover:bg-[#B04A25] text-white text-xs font-bold transition-colors">
                    Tugaskan
                </button>
            </div>
        `;
        container.appendChild(row);
    });
}

function selectSchoolDetail(schoolId) {
    const s = window.store.state.schools.find(item => item.id === schoolId);
    if (!s) return;

    document.getElementById('prevSchoolName').innerText = s.name;
    document.getElementById('prevSchoolLoc').innerText = `${s.region} (${s.distanceKm} km) • ${s.address}`;
    document.getElementById('prevSchoolMatch').innerText = `${s.matchingScore}% Match Score`;
    document.getElementById('prevSchoolNeed').innerText = `Butuh ${s.requiredPIB} PIB (Ditugaskan: ${s.assignedPIB})`;
    document.getElementById('prevSchoolComps').innerText = s.requiredCompetencies.join(', ');
    document.getElementById('prevSchoolCoord').innerText = s.coordinatorName;
}

function openAssignModal(schoolId) {
    const school = window.store.state.schools.find(item => item.id === schoolId);
    const pibs = window.store.state.pibs.filter(p => p.availability === 'TERSEDIA');

    const select = document.getElementById('assignPibSelect');
    if (select) {
        select.innerHTML = pibs.map(p => `<option value="${p.id}">${p.name} - ${p.region} (${p.competencies.join(', ')})</option>`).join('');
    }

    const modal = document.getElementById('assignModal');
    if (modal) {
        modal.setAttribute('data-school-id', schoolId);
        document.getElementById('assignTargetSchoolName').innerText = school ? school.name : '';
        modal.classList.remove('hidden');
    }
}

function handleAssignConfirm() {
    const modal = document.getElementById('assignModal');
    const schoolId = modal.getAttribute('data-school-id');
    const pibId = document.getElementById('assignPibSelect').value;

    if (window.store.assignPIB(pibId, schoolId)) {
        closeModal('assignModal');
        showToast("PIB berhasil ditugaskan ke sekolah mitra!", "success");
        renderSchoolDirectory();
    }
}

// ==========================================
// 6. MONITORING PENDAMPINGAN VIEW
// ==========================================
function renderSessionsList() {
    const list = window.store ? window.store.state.sessions : [];
    const tbody = document.getElementById('sessionsTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    list.forEach(s => {
        const isDone = s.status === 'SELESAI';
        const isVerif = s.verificationStatus === 'TERVERIFIKASI';
        const tr = document.createElement('tr');
        tr.className = "hover:bg-[#FBF9F5] transition-colors border-b border-[#F0ECE4]";
        tr.innerHTML = `
            <td class="py-3 px-4 text-xs font-semibold text-[#1C2024]">${s.date}<br><span class="text-[10px] text-[#8F95A0]">${s.time}</span></td>
            <td class="py-3 px-4 text-xs font-bold text-[#1C2024]">${s.pibName}</td>
            <td class="py-3 px-4 text-xs text-[#656A73]">${s.schoolName}<br><span class="text-[10px] font-medium text-[#1C2024]">${s.className} (${s.studentName})</span></td>
            <td class="py-3 px-4 text-xs text-[#1C2024] max-w-[220px] truncate" title="${s.notes}">${s.activity}</td>
            <td class="py-3 px-4">
                <span class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${isDone ? 'bg-[#5B6E43]/15 text-[#5B6E43]' : 'bg-[#C85A32]/10 text-[#C85A32]'}">
                    ${s.status}
                </span>
            </td>
            <td class="py-3 px-4 text-center">
                ${isVerif ? `
                    <span class="inline-flex items-center gap-1 text-[10px] font-bold text-[#5B6E43] bg-[#5B6E43]/15 px-2.5 py-1 rounded-full">
                        <span class="material-symbols-outlined text-xs">verified</span> Terverifikasi
                    </span>
                ` : `
                    <button onclick="verifySessionAction('${s.id}')" class="px-3 py-1 rounded-lg bg-[#C85A32] hover:bg-[#B04A25] text-white text-xs font-bold transition-colors">
                        Setujui
                    </button>
                `}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function verifySessionAction(sessionId) {
    if (window.store.verifySession(sessionId, true)) {
        showToast("Sesi pendampingan berhasil diverifikasi!", "success");
        renderSessionsList();
    }
}

function verifyAllAction() {
    const count = window.store.verifyAllPending();
    if (count > 0) {
        showToast(`${count} sesi tertunda berhasil diverifikasi secara serentak!`, "success");
        renderSessionsList();
    } else {
        showToast("Semua sesi sudah terverifikasi.", "info");
    }
}

// ==========================================
// 7. LAPORAN & OUTCOME VIEW
// ==========================================
function renderOutcomeCharts() {
    if (typeof Chart === 'undefined') return;

    // Outcome Radar Chart (4 core indicators)
    const ctxRadar = document.getElementById('chartOutcomeRadar');
    if (ctxRadar) {
        if (radarChartInstance) radarChartInstance.destroy();
        radarChartInstance = new Chart(ctxRadar, {
            type: 'radar',
            data: {
                labels: ['Komunikasi (78%)', 'Partisipasi Kelas (82%)', 'Kemandirian (75%)', 'Interaksi Sosial (80%)'],
                datasets: [
                    {
                        label: 'Baseline (Awal)',
                        data: [62, 63, 61, 62],
                        borderColor: '#8F95A0',
                        backgroundColor: 'rgba(143, 149, 160, 0.2)',
                        borderWidth: 1.5
                    },
                    {
                        label: 'Capaian Saat Ini',
                        data: [78, 82, 75, 80],
                        borderColor: '#C85A32',
                        backgroundColor: 'rgba(200, 90, 50, 0.25)',
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { font: { family: 'Plus Jakarta Sans', size: 11 } } }
                },
                scales: {
                    r: {
                        angleLines: { color: '#EAE4D9' },
                        grid: { color: '#F0ECE4' },
                        pointLabels: { font: { size: 11, weight: 'bold' }, color: '#1C2024' },
                        suggestedMin: 40,
                        suggestedMax: 100
                    }
                }
            }
        });
    }
}

// ==========================================
// 8. MOBILE SIMULATOR CONTROLLER
// ==========================================
function switchMobileTab(tabName) {
    playSound('click');
    document.querySelectorAll('.mobile-tab-pane').forEach(el => el.classList.add('hidden'));
    const target = document.getElementById(`mTab-${tabName}`);
    if (target) target.classList.remove('hidden');

    document.querySelectorAll('.mob-nav-btn').forEach(btn => {
        if (btn.getAttribute('data-tab') === tabName) {
            btn.className = "mob-nav-btn flex flex-col items-center text-[#C85A32] font-bold";
        } else {
            btn.className = "mob-nav-btn flex flex-col items-center text-[#8F95A0] hover:text-[#1C2024]";
        }
    });
}

// ==========================================
// UTILITIES
// ==========================================
function closeModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.add('hidden');
}

function escapeHtml(text) {
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
}

function escapeJs(text) {
    return text.replace(/`/g, '\\`').replace(/\\/g, '\\\\').replace(/\$/g, '\\$');
}

function markedText(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
}

function copyText(txt) {
    navigator.clipboard.writeText(txt);
    showToast("Teks disalin ke clipboard!", "success");
}

// Global Initialization
window.addEventListener('DOMContentLoaded', () => {
    initVoiceAI();
    checkAuthState();
});
