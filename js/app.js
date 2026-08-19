/**
 * =========================================================================
 * SAPA INKLUSI — Master Controller (Ultra-Seamless Apple Experience)
 * =========================================================================
 * - 60fps GPU-Accelerated Micro-Physics & Easing Transitions
 * - Authentic SAPA Inklusi Palette (Terracotta #DF6E3D & Olive #8E9F6A)
 * - Spotlight-Grade Command Palette (⌘K) with Keyboard Navigation
 * - Fluid Token Streaming AI Engine with TTS Audio Synthesis
 * - Tabular Number Interpolation & Resilient Lifecycle Management
 */

// Global State
let activeView = 'dashboard';
let outcomeChartInstance = null;
let donutChartInstance = null;
let radarChartInstance = null;
let speechRec = null;
let isRec = false;
let currentSchoolFilter = 'ALL';
let searchDebounceTimer = null;
let cmdSelectedIndex = 0;
let currentFilteredCommands = [];

// ==========================================
// TOAST NOTIFICATIONS (Apple Capsule)
// ==========================================
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `store-utility-card py-2.5 px-5 flex items-center gap-2.5 shadow-lg typo-caption pointer-events-auto transition-all duration-200`;
    toast.style.borderRadius = '9999px';
    toast.style.borderColor = type === 'error' ? '#FF453A' : (type === 'success' ? '#8E9F6A' : '#DF6E3D');
    
    toast.innerHTML = `
        <span class="material-symbols-outlined text-base ${type === 'error' ? 'text-[#FF453A]' : (type === 'success' ? 'text-[#8E9F6A]' : 'text-[#DF6E3D]')}">
            ${type === 'success' ? 'verified' : (type === 'error' ? 'error' : 'info')}
        </span>
        <span class="text-[#1d1d1f] font-medium text-xs">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translate3d(0, 10px, 0) scale(0.95)';
        setTimeout(() => toast.remove(), 250);
    }, 2800);
}

// ==========================================
// ANIMATED TABULAR COUNTERS
// ==========================================
function animateCounter(id, target, duration = 650, isDecimal = false) {
    const el = document.getElementById(id);
    if (!el) return;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4);
        const current = start + (target - start) * ease;

        if (isDecimal) {
            el.innerText = current.toFixed(1) + '%';
        } else {
            el.innerText = Math.round(current);
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            if (isDecimal) el.innerText = target + '%';
            else el.innerText = target;
        }
    }
    requestAnimationFrame(update);
}

function triggerAllCounters() {
    const s = window.store ? window.store.state.stats : { pibAktif: 128, sekolahMitra: 46, pendampinganAktif: 92, anakDidampingi: 214, northStarMetric: 73.9 };
    animateCounter('kpiPIBVal', s.pibAktif, 550);
    animateCounter('kpiSchoolVal', s.sekolahMitra, 550);
    animateCounter('kpiAssistVal', s.pendampinganAktif, 600);
    animateCounter('kpiStudentVal', s.anakDidampingi, 650);
    animateCounter('kpiNorthStarVal', s.northStarMetric, 700, true);
}

// ==========================================
// SPOTLIGHT COMMAND PALETTE MENU (⌘K)
// ==========================================
const COMMAND_ACTIONS = [
    { title: "Ringkasan Dashboard", category: "Navigasi", icon: "space_dashboard", action: () => navigateTo('dashboard') },
    { title: "Kurikulum Microcredential (8 Modul)", category: "Navigasi", icon: "school", action: () => navigateTo('microcredential') },
    { title: "Asisten AI Kelas", category: "Navigasi", icon: "smart_toy", action: () => navigateTo('asisten-ai') },
    { title: "Direktori Pendamping Inklusi (PIB)", category: "Navigasi", icon: "diversity_3", action: () => navigateTo('pib') },
    { title: "Sekolah Mitra & Matching Engine", category: "Navigasi", icon: "location_city", action: () => navigateTo('sekolah') },
    { title: "Monitoring Pendampingan Harian", category: "Navigasi", icon: "fact_check", action: () => navigateTo('pendampingan') },
    { title: "Laporan & Evaluasi Outcome", category: "Navigasi", icon: "insights", action: () => navigateTo('laporan') },
    { title: "Simulator Mobile Application", category: "Navigasi", icon: "phone_iphone", action: () => navigateTo('simulator') },
    { title: "Catat Sesi Pendampingan Baru", category: "Aksi", icon: "add", action: () => openModal('addSessionModal') },
    { title: "Daftarkan Sekolah Mitra Baru", category: "Aksi", icon: "add_business", action: () => openModal('addSchoolModal') },
    { title: "Ekspor Seluruh Log Sesi ke CSV", category: "Data", icon: "download", action: () => { window.store.exportToCSV('sessions'); showToast("CSV Sesi diunduh", "success"); } },
    { title: "Keluar dari Akun (Logout)", category: "Sesi", icon: "logout", action: () => handleLogout() }
];

function initCommandPalette() {
    window.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            toggleCommandMenu();
        }
        if (e.key === 'Escape') {
            closeCommandMenu();
            closeAllModals();
        }
        
        // Arrow Navigation in Command Palette
        const modal = document.getElementById('commandMenuModal');
        if (modal && !modal.classList.contains('hidden')) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                cmdSelectedIndex = Math.min(cmdSelectedIndex + 1, currentFilteredCommands.length - 1);
                updateCommandSelection();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                cmdSelectedIndex = Math.max(cmdSelectedIndex - 1, 0);
                updateCommandSelection();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (currentFilteredCommands[cmdSelectedIndex]) {
                    closeCommandMenu();
                    currentFilteredCommands[cmdSelectedIndex].action();
                }
            }
        }
    });
}

function closeAllModals() {
    document.querySelectorAll('[id$="Modal"]').forEach(m => m.classList.add('hidden'));
}

function toggleCommandMenu() {
    const modal = document.getElementById('commandMenuModal');
    if (!modal) return;
    if (modal.classList.contains('hidden')) openCommandMenu();
    else closeCommandMenu();
}

function openCommandMenu() {
    const modal = document.getElementById('commandMenuModal');
    if (!modal) return;
    modal.classList.remove('hidden');
    cmdSelectedIndex = 0;
    const input = document.getElementById('cmdInput');
    if (input) {
        input.value = '';
        input.focus();
    }
    renderCommandItems(COMMAND_ACTIONS);
}

function closeCommandMenu() {
    const modal = document.getElementById('commandMenuModal');
    if (modal) modal.classList.add('hidden');
}

function filterCommandItems() {
    const query = document.getElementById('cmdInput').value.toLowerCase().trim();
    cmdSelectedIndex = 0;
    if (!query) {
        renderCommandItems(COMMAND_ACTIONS);
        return;
    }
    const filtered = COMMAND_ACTIONS.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.category.toLowerCase().includes(query)
    );
    renderCommandItems(filtered);
}

function renderCommandItems(items) {
    currentFilteredCommands = items;
    const list = document.getElementById('cmdItemsList');
    if (!list) return;
    list.innerHTML = '';

    if (items.length === 0) {
        list.innerHTML = `<div class="p-6 text-center typo-caption text-[#7a7a7a]">Tidak ada hasil yang cocok.</div>`;
        return;
    }

    items.forEach((item, index) => {
        const div = document.createElement('div');
        div.id = `cmd-item-${index}`;
        div.className = `flex items-center justify-between p-3 rounded-xl cursor-pointer typo-caption text-[#1d1d1f] transition-colors ${index === cmdSelectedIndex ? 'bg-[#f5f5f7] text-[#DF6E3D] font-semibold' : 'hover:bg-[#f5f5f7]'}`;
        div.onclick = () => {
            closeCommandMenu();
            item.action();
        };
        div.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-base ${index === cmdSelectedIndex ? 'text-[#DF6E3D]' : 'text-[#7a7a7a]'}">${item.icon}</span>
                <span>${item.title}</span>
            </div>
            <span class="typo-fine-print text-[#7a7a7a] uppercase font-semibold">${item.category}</span>
        `;
        list.appendChild(div);
    });
}

function updateCommandSelection() {
    const items = document.querySelectorAll('#cmdItemsList > div');
    items.forEach((el, idx) => {
        const isSel = idx === cmdSelectedIndex;
        el.className = `flex items-center justify-between p-3 rounded-xl cursor-pointer typo-caption text-[#1d1d1f] transition-colors ${isSel ? 'bg-[#f5f5f7] text-[#DF6E3D] font-semibold' : 'hover:bg-[#f5f5f7]'}`;
        const icon = el.querySelector('.material-symbols-outlined');
        if (icon) icon.className = `material-symbols-outlined text-base ${isSel ? 'text-[#DF6E3D]' : 'text-[#7a7a7a]'}`;
        if (isSel) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
}

// ==========================================
// AUTHENTICATION & USER PROFILE
// ==========================================
function checkAuthState() {
    const isLogged = window.store ? window.store.state.isLoggedIn : true;
    const loginGate = document.getElementById('loginGate');
    const mainApp = document.getElementById('mainAppWrapper');
    const authBtn = document.getElementById('btnHeaderAuth');

    if (isLogged) {
        if (loginGate) loginGate.classList.add('hidden');
        if (mainApp) mainApp.classList.remove('hidden');
        if (authBtn) {
            authBtn.innerText = 'Keluar';
            authBtn.onclick = handleLogout;
        }
        updateUserProfileUI();
        navigateTo(activeView || 'dashboard');
    } else {
        if (loginGate) loginGate.classList.remove('hidden');
        if (authBtn) {
            authBtn.innerText = 'Masuk';
            authBtn.onclick = handleLoginOpen;
        }
    }
}

function handleLoginOpen() {
    const loginGate = document.getElementById('loginGate');
    if (loginGate) loginGate.classList.toggle('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function autoFillDemo(email) {
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    if (emailInput) emailInput.value = email;
    if (passwordInput) passwordInput.value = 'password123';
}

function handleLoginSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim() || 'gpk@sapa.id';
    
    const btn = document.getElementById('loginSubmitBtn');
    if (btn) {
        btn.innerHTML = `<span class="material-symbols-outlined text-sm animate-spin">progress_activity</span> Menghubungkan...`;
        btn.disabled = true;
    }

    setTimeout(() => {
        const user = window.store.login(email);
        if (btn) {
            btn.innerHTML = `<span>Masuk ke SAPA Inklusi</span> <span class="material-symbols-outlined text-sm">arrow_forward</span>`;
            btn.disabled = false;
        }

        checkAuthState();
        showToast(`Selamat datang, ${user.name}!`, "success");
    }, 280);
}

function handleLogout() {
    if (confirm("Keluar dari akun SAPA Inklusi?")) {
        window.store.logout();
        checkAuthState();
        showToast("Anda telah keluar.", "info");
    }
}

function updateUserProfileUI() {
    const roleSelector = document.getElementById('topRoleSelector');
    if (roleSelector && window.store) {
        roleSelector.value = window.store.state.userRole;
    }
}

// ==========================================
// SPA NAVIGATION ROUTER (FLUID & INSTANT)
// ==========================================
function navigateTo(viewId) {
    activeView = viewId;

    // Top nav highlighting
    document.querySelectorAll('.nav-item').forEach(el => {
        if (el.getAttribute('data-view') === viewId) {
            el.classList.add('text-white', 'font-semibold');
            el.classList.remove('text-[#cccccc]');
        } else {
            el.classList.remove('text-white', 'font-semibold');
            el.classList.add('text-[#cccccc]');
        }
    });

    // Subnav pill highlighting
    document.querySelectorAll('.subnav-pill').forEach(btn => {
        if (btn.getAttribute('data-tab') === viewId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // View panes fluid cross-fade
    document.querySelectorAll('.view-pane').forEach(el => {
        el.classList.remove('active');
    });

    const activePane = document.getElementById(`view-${viewId}`);
    if (activePane) {
        activePane.classList.add('active');
    }

    // Trigger sub-renderers
    if (viewId === 'dashboard') {
        renderDashboardCharts();
        triggerAllCounters();
    }
    if (viewId === 'microcredential') renderModulesList();
    if (viewId === 'pib') renderPIBDirectory();
    if (viewId === 'sekolah') renderSchoolDirectory();
    if (viewId === 'pendampingan') renderSessionsList();
    if (viewId === 'laporan') renderOutcomeCharts();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// 1. DASHBOARD CHARTS & FILTERS
// ==========================================
function applyDashboardFilter() {
    const region = document.getElementById('filterDashRegion').value;
    const level = document.getElementById('filterDashLevel').value;

    let pibCount = 128;
    let schoolCount = 46;
    let assistCount = 92;
    let studentCount = 214;

    if (region !== 'ALL' || level !== 'ALL') {
        pibCount = region === 'Sukamaju' ? 42 : (region === 'Cendekia' ? 36 : 28);
        schoolCount = region === 'Sukamaju' ? 14 : (region === 'Cendekia' ? 12 : 10);
        assistCount = Math.round(pibCount * 0.72);
        studentCount = Math.round(schoolCount * 4.6);
    }

    animateCounter('kpiPIBVal', pibCount, 350);
    animateCounter('kpiSchoolVal', schoolCount, 350);
    animateCounter('kpiAssistVal', assistCount, 350);
    animateCounter('kpiStudentVal', studentCount, 350);

    showToast(`Filter: ${region} • ${level}`, 'info');
    renderDashboardCharts();
}

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
                        return context.dataIndex === 7 ? '#DF6E3D' : 'rgba(223, 110, 61, 0.40)';
                    },
                    borderRadius: 6,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 600,
                    easing: 'easeOutQuart'
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1d1d1f',
                        padding: 10,
                        titleColor: '#ffffff',
                        bodyColor: '#cccccc',
                        cornerRadius: 8
                    }
                },
                scales: {
                    y: { grid: { color: 'rgba(255, 255, 255, 0.08)' }, ticks: { color: '#cccccc', font: { size: 10 } } },
                    x: { grid: { display: false }, ticks: { color: '#cccccc', font: { size: 11, weight: '500' } } }
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
                    backgroundColor: ['#DF6E3D', '#8E9F6A'],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '76%',
                animation: {
                    duration: 600,
                    easing: 'easeOutQuart'
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1d1d1f',
                        padding: 10
                    }
                }
            }
        });
    }
}

// ==========================================
// 2. MICROCREDENTIAL VIEW & LESSON PLAYER
// ==========================================
let currentModuleCategory = 'ALL';

function filterModulesCategory(cat) {
    currentModuleCategory = cat;
    document.querySelectorAll('.mod-filter-chip').forEach(el => el.classList.remove('selected'));
    const btn = Array.from(document.querySelectorAll('.mod-filter-chip')).find(b => b.innerText.includes(cat) || (cat==='ALL' && b.innerText.includes('Semua')));
    if (btn) btn.classList.add('selected');
    renderModulesList();
    showToast(`Filter modul: ${cat}`, 'info');
}

function renderModulesList() {
    let list = window.store ? window.store.state.modules : [];
    if (currentModuleCategory !== 'ALL') {
        list = list.filter(m => m.category.toLowerCase().includes(currentModuleCategory.toLowerCase()));
    }
    const container = document.getElementById('modulesGrid');
    if (!container) return;
    container.innerHTML = '';

    if (list.length === 0) {
        container.innerHTML = `<div class="store-utility-card col-span-full text-center p-8 typo-caption text-[#7a7a7a]">Tidak ada modul dalam kategori ini.</div>`;
        return;
    }

    list.forEach(m => {
        const card = document.createElement('div');
        card.className = "store-utility-card flex flex-col justify-between";
        card.innerHTML = `
            <div>
                <div class="flex justify-between items-start mb-4">
                    <span class="w-8 h-8 rounded-full bg-[#f5f5f7] text-[#1d1d1f] font-bold text-xs flex items-center justify-center">${m.number}</span>
                    <span class="typo-fine-print px-2.5 py-0.5 rounded-full bg-[#f5f5f7] text-[#7a7a7a] font-semibold">${m.category}</span>
                </div>
                <h3 class="typo-body-strong text-[#1d1d1f] mb-2 leading-snug">${m.title}</h3>
                <p class="typo-caption text-[#7a7a7a] line-clamp-3 leading-relaxed mb-4">${m.description}</p>
            </div>
            <div class="pt-4 border-t border-[#e0e0e0] flex items-center justify-between">
                <span class="typo-fine-print text-[#7a7a7a] font-medium flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm">schedule</span> ${m.durationHours} Jam
                </span>
                <div class="flex gap-2">
                    <button onclick="openModuleLessonModal('${m.id}')" class="button-secondary-pill text-xs py-1 px-3">
                        Materi
                    </button>
                    <button onclick="takeQuizModal('${m.id}')" class="button-primary text-xs py-1 px-3">
                        Asesmen
                    </button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function openModuleLessonModal(modId) {
    const m = window.store.state.modules.find(item => item.id === modId);
    if (!m) return;

    const modal = document.getElementById('lessonModal');
    const titleEl = document.getElementById('lessonModalTitle');
    const catEl = document.getElementById('lessonModalCat');
    const contentEl = document.getElementById('lessonModalContent');

    if (titleEl) titleEl.innerText = `Modul ${m.number}: ${m.title}`;
    if (catEl) catEl.innerText = `${m.category} • ${m.durationHours} Jam Pelatihan`;
    if (contentEl) {
        contentEl.innerHTML = `
            <div class="space-y-4 typo-body text-xs leading-relaxed text-[#1d1d1f]">
                <div class="p-4 bg-[#f5f5f7] rounded-2xl border border-[#e0e0e0] text-[#DF6E3D] font-medium">
                    <strong>Tujuan Pembelajaran:</strong> ${m.description}
                </div>
                ${m.lessonContent || '<p>Materi pembelajaran interaktif siap dipelajari.</p>'}
            </div>
        `;
    }

    const quizBtn = document.getElementById('lessonModalQuizBtn');
    if (quizBtn) {
        quizBtn.onclick = () => {
            closeModal('lessonModal');
            takeQuizModal(m.id);
        };
    }

    if (modal) modal.classList.remove('hidden');
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
            <span class="typo-fine-print text-[#DF6E3D] font-semibold uppercase">Modul ${m.number} • Uji Kompetensi</span>
            <button onclick="closeModal('quizModal')" class="text-[#7a7a7a] hover:text-[#1d1d1f]"><span class="material-symbols-outlined">close</span></button>
        </div>
        <h3 class="typo-tagline text-[#1d1d1f] mb-4">${m.title}</h3>
        <div class="p-4 rounded-2xl bg-[#f5f5f7] border border-[#e0e0e0] mb-4 typo-caption space-y-3">
            <p class="font-semibold text-[#1d1d1f]">${q.q}</p>
            <div class="space-y-2">
                ${q.a.map((opt, idx) => `
                    <label class="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-[#e0e0e0] cursor-pointer hover:border-[#DF6E3D]">
                        <input type="radio" name="quizAns" value="${idx}" class="text-[#DF6E3D] focus:ring-0">
                        <span class="text-[#1d1d1f]">${opt}</span>
                    </label>
                `).join('')}
            </div>
        </div>
        <div class="flex justify-end gap-2">
            <button onclick="closeModal('quizModal')" class="button-secondary-pill text-xs py-1.5 px-4">Batal</button>
            <button onclick="submitQuiz('${m.id}', ${q.correct})" class="button-primary text-xs py-1.5 px-4">Kirim Jawaban</button>
        </div>
    `;

    modal.classList.remove('hidden');
}

function submitQuiz(modId, correctIdx) {
    const selected = document.querySelector('input[name="quizAns"]:checked');
    if (!selected) {
        showToast("Pilih salah satu jawaban.", "warning");
        return;
    }

    if (parseInt(selected.value) === correctIdx) {
        closeModal('quizModal');
        showToast("Selamat! Anda lulus asesmen dengan nilai 100.", "success");
        openCertModal(window.store.state.userName || "Rina Maharani, S.Pd");
    } else {
        showToast("Jawaban kurang tepat. Coba lagi.", "error");
    }
}

function openCertModal(userName = "Rina Maharani, S.Pd") {
    const modal = document.getElementById('certModal');
    const nameEl = document.getElementById('certRecipientName');
    if (nameEl) nameEl.innerText = userName;
    if (modal) modal.classList.remove('hidden');
}

// ==========================================
// 3. ASISTEN AI KELAS (FLUID TOKEN STREAMING)
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

        speechRec.onerror = () => stopVoice();
        speechRec.onend = () => stopVoice();
    }
}

function toggleVoice() {
    if (!speechRec) {
        const text = prompt("Simulasi Suara:", "Sederhanakan instruksi tugas matematika hari ini.");
        if (text) sendAiMessage(text);
        return;
    }

    if (!isRec) {
        try {
            speechRec.start();
            isRec = true;
            const btn = document.getElementById('micButton');
            if (btn) btn.classList.add('bg-[#DF6E3D]');
            const wave = document.getElementById('waveVisualizer');
            if (wave) wave.classList.remove('hidden');
        } catch(e) {}
    } else {
        speechRec.stop();
        stopVoice();
    }
}

function stopVoice() {
    isRec = false;
    const btn = document.getElementById('micButton');
    if (btn) btn.classList.remove('bg-[#DF6E3D]');
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
        <div class="bg-[#DF6E3D] text-white p-4 rounded-2xl rounded-tr-sm text-xs leading-relaxed">
            <p>${escapeHtml(promptText)}</p>
        </div>
    `;
    feed.appendChild(userDiv);
    feed.scrollTop = feed.scrollHeight;

    // AI Response Stream
    const fullResponse = window.store.generateAI(promptText);
    const aiDiv = document.createElement('div');
    aiDiv.className = "flex items-start gap-3 max-w-[85%]";
    aiDiv.innerHTML = `
        <div class="w-7 h-7 rounded-full bg-[#DF6E3D] text-white font-bold text-[10px] flex items-center justify-center shrink-0">AI</div>
        <div class="bg-[#272729] p-4 rounded-2xl rounded-tl-sm text-xs text-white leading-relaxed space-y-2">
            <div id="targetStream" class="whitespace-pre-line"></div>
            <div id="targetActions" class="pt-2 border-t border-white/10 flex gap-3 hidden">
                <button onclick="speakSpeech(\`${escapeJs(fullResponse)}\`)" class="text-[#F4A261] typo-fine-print font-semibold flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm">volume_up</span> Putar Audio
                </button>
                <button onclick="copyText(\`${escapeJs(fullResponse)}\`)" class="text-[#cccccc] typo-fine-print hover:text-white flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm">content_copy</span> Salin
                </button>
            </div>
        </div>
    `;
    feed.appendChild(aiDiv);
    feed.scrollTop = feed.scrollHeight;

    const target = aiDiv.querySelector('#targetStream');
    const actions = aiDiv.querySelector('#targetActions');
    const words = fullResponse.split(' ');
    let currentIdx = 0;
    let accumulated = '';

    const streamInterval = setInterval(() => {
        if (currentIdx < words.length) {
            accumulated += (currentIdx === 0 ? '' : ' ') + words[currentIdx];
            target.innerHTML = markedText(accumulated);
            feed.scrollTop = feed.scrollHeight;
            currentIdx++;
        } else {
            clearInterval(streamInterval);
            if (actions) actions.classList.remove('hidden');
        }
    }, 18);
}

function speakSpeech(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const clean = text.replace(/[*#_]/g, '');
        const utt = new SpeechSynthesisUtterance(clean);
        utt.lang = 'id-ID';
        utt.rate = 0.96;
        window.speechSynthesis.speak(utt);
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
        tr.className = `hover:bg-[#f5f5f7] transition-colors cursor-pointer ${idx === 0 ? 'bg-[#f5f5f7]/50' : ''}`;
        tr.onclick = () => selectPibDrawer(p.id);
        tr.innerHTML = `
            <td class="py-3.5 px-4 typo-body-strong text-[#1d1d1f] text-xs">${p.name}</td>
            <td class="py-3.5 px-4 text-[#7a7a7a]">${p.region}</td>
            <td class="py-3.5 px-4">
                <span class="inline-flex items-center gap-1 typo-fine-print font-semibold px-2 py-0.5 rounded-full ${isCert ? 'bg-[#DF6E3D]/10 text-[#DF6E3D]' : 'bg-[#e0e0e0] text-[#7a7a7a]'}">
                    ${isCert ? 'Bersertifikat' : 'Dalam Progres'}
                </span>
            </td>
            <td class="py-3.5 px-4 text-[#1d1d1f]">${p.competencies[0]}</td>
            <td class="py-3.5 px-4 typo-fine-print font-semibold ${p.availability === 'TERSEDIA' ? 'text-[#8E9F6A]' : 'text-[#7a7a7a]'}">
                ${p.availability === 'TERSEDIA' ? '● Tersedia' : '○ Bertugas'}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function selectPibDrawer(id) {
    const p = window.store.state.pibs.find(item => item.id === id);
    if (!p) return;

    document.getElementById('drawerAvatar').innerText = p.initials;
    document.getElementById('drawerName').innerText = p.name;
    document.getElementById('drawerIdRegion').innerText = `${p.region} • ${p.id}`;
    document.getElementById('drawerSchool').innerText = p.assignedSchool;
    document.getElementById('drawerStudents').innerText = `${p.studentsCount} Siswa didampingi`;
    document.getElementById('drawerRating').innerText = `⭐ ${p.rating} (${p.sessionsCompleted} sesi)`;

    const comps = document.getElementById('drawerComps');
    comps.innerHTML = p.competencies.map(c => `<span class="px-2.5 py-0.5 rounded-full bg-[#f5f5f7] text-[#1d1d1f] typo-fine-print font-medium">${c}</span>`).join('');
}

function filterPib() {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
        const q = document.getElementById('searchPib').value.toLowerCase();
        const region = document.getElementById('filterPibRegion').value;

        const rows = document.querySelectorAll('#pibTableBody tr');
        rows.forEach(r => {
            const text = r.innerText.toLowerCase();
            const mQ = !q || text.includes(q);
            const mR = region === 'ALL' || text.includes(region.toLowerCase());
            r.style.display = (mQ && mR) ? '' : 'none';
        });
    }, 120);
}

// ==========================================
// 5. SEKOLAH MITRA & MATCHING VIEW
// ==========================================
function toggleConfigChip(buttonEl, filterValue) {
    document.querySelectorAll('.configurator-option-chip').forEach(el => el.classList.remove('selected'));
    buttonEl.classList.add('selected');
    currentSchoolFilter = filterValue;
    renderSchoolDirectory();
    showToast(`Filter: ${filterValue}`, 'info');
}

function renderSchoolDirectory() {
    let list = window.store ? window.store.state.schools : [];
    const container = document.getElementById('schoolListContainer');
    if (!container) return;
    container.innerHTML = '';

    if (currentSchoolFilter !== 'ALL') {
        list = list.filter(s => {
            if (currentSchoolFilter === 'SD' || currentSchoolFilter === 'SMP' || currentSchoolFilter === 'SMA') {
                return s.level === currentSchoolFilter;
            }
            return s.requiredCompetencies.some(c => c.toLowerCase().includes(currentSchoolFilter.toLowerCase()));
        });
    }

    if (list.length === 0) {
        container.innerHTML = `<div class="store-utility-card text-center p-8 typo-caption text-[#7a7a7a]">Tidak ada sekolah mitra yang cocok dengan filter saat ini.</div>`;
        return;
    }

    list.forEach(s => {
        const isNeed = s.status === 'BUTUH_PENDAMPING';
        const row = document.createElement('div');
        row.className = "store-utility-card p-4 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-3";
        row.onclick = () => selectSchoolDetail(s.id);
        row.innerHTML = `
            <div>
                <div class="flex items-center gap-2 mb-1">
                    <span class="typo-body-strong text-[#1d1d1f] text-sm">${s.name}</span>
                    <span class="typo-fine-print px-2 py-0.5 rounded bg-[#f5f5f7] text-[#7a7a7a] font-semibold">${s.level}</span>
                    <span class="typo-fine-print px-2 py-0.5 rounded-full ${isNeed ? 'bg-[#FF453A]/10 text-[#FF453A]' : 'bg-[#8E9F6A]/10 text-[#8E9F6A]'} font-semibold">${isNeed ? 'Butuh PIB' : 'Terpenuhi'}</span>
                </div>
                <p class="typo-caption text-[#7a7a7a]">${s.region} • ${s.distanceKm} km • Siswa: ${s.studentsCount} anak</p>
            </div>
            <div class="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                <div class="text-right">
                    <span class="typo-caption-strong text-[#DF6E3D] block">${s.matchingScore}% Match</span>
                    <span class="typo-fine-print text-[#7a7a7a]">Tugas: ${s.assignedPIB}/${s.requiredPIB} PIB</span>
                </div>
                <button onclick="event.stopPropagation(); openAssignModal('${s.id}')" class="button-primary text-xs py-1 px-3">
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
    document.getElementById('prevSchoolMatch').innerText = `${s.matchingScore}% Match`;
    document.getElementById('prevSchoolNeed').innerText = `Butuh ${s.requiredPIB} PIB (Ditugaskan: ${s.assignedPIB})`;
    document.getElementById('prevSchoolComps').innerText = s.requiredCompetencies.join(', ');

    const bd = s.matchingBreakdown || { jarak: 90, kompetensi: 90, jadwal: 90 };
    document.getElementById('breakdownJarak').innerText = `${bd.jarak}%`;
    document.getElementById('breakdownKompetensi').innerText = `${bd.kompetensi}%`;
    document.getElementById('breakdownJadwal').innerText = `${bd.jadwal}%`;
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
        showToast("PIB berhasil ditugaskan ke sekolah!", "success");
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
        const isVerif = s.verificationStatus === 'TERVERIFIKASI';
        const tr = document.createElement('tr');
        tr.className = "hover:bg-[#f5f5f7] transition-colors cursor-pointer";
        tr.onclick = () => openSessionDetailModal(s.id);
        tr.innerHTML = `
            <td class="py-3 px-4 typo-body-strong text-[#1d1d1f] text-xs">${s.date}<br><span class="typo-fine-print text-[#7a7a7a]">${s.time}</span></td>
            <td class="py-3 px-4 typo-body-strong text-[#1d1d1f] text-xs">${s.pibName}</td>
            <td class="py-3 px-4 text-[#7a7a7a]">${s.schoolName}<br><span class="typo-fine-print text-[#1d1d1f] font-medium">${s.studentName}</span></td>
            <td class="py-3 px-4 text-[#1d1d1f] truncate max-w-[200px]">${s.activity}</td>
            <td class="py-3 px-4">
                <span class="typo-fine-print font-semibold px-2 py-0.5 rounded-full ${s.status === 'SELESAI' ? 'bg-[#8E9F6A]/10 text-[#8E9F6A]' : 'bg-[#e0e0e0] text-[#7a7a7a]'}">
                    ${s.status}
                </span>
            </td>
            <td class="py-3 px-4 text-center" onclick="event.stopPropagation()">
                ${isVerif ? `
                    <span class="typo-fine-print font-bold text-[#8E9F6A]">✓ Terverifikasi</span>
                ` : `
                    <button onclick="verifySessionAction('${s.id}')" class="button-primary text-xs py-1 px-3">
                        Setujui
                    </button>
                `}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openSessionDetailModal(sessionId) {
    const s = window.store.state.sessions.find(item => item.id === sessionId);
    if (!s) return;

    const modal = document.getElementById('sessionDetailModal');
    if (!modal) return;

    document.getElementById('sessDetailId').innerText = `Log Sesi #${s.id} • ${s.date}`;
    document.getElementById('sessDetailPIB').innerText = s.pibName;
    document.getElementById('sessDetailSchool').innerText = `${s.schoolName} — ${s.className}`;
    document.getElementById('sessDetailStudent').innerText = s.studentName;
    document.getElementById('sessDetailNotes').innerText = s.notes;

    const verifBadge = document.getElementById('sessDetailVerifBadge');
    if (verifBadge) {
        if (s.verificationStatus === 'TERVERIFIKASI') {
            verifBadge.innerHTML = `<span class="typo-fine-print font-bold text-[#8E9F6A]">✓ Terverifikasi GPK</span>`;
        } else {
            verifBadge.innerHTML = `<button onclick="verifySessionAction('${s.id}'); closeModal('sessionDetailModal');" class="button-primary text-xs py-1 px-3">Verifikasi Sesi Ini</button>`;
        }
    }

    modal.classList.remove('hidden');
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
        showToast(`${count} sesi tertunda berhasil diverifikasi!`, "success");
        renderSessionsList();
    } else {
        showToast("Semua sesi sudah terverifikasi.", "info");
    }
}

// ==========================================
// 7. LAPORAN OUTCOME CHARTS
// ==========================================
function renderOutcomeCharts() {
    if (typeof Chart === 'undefined') return;

    const ctxRadar = document.getElementById('chartOutcomeRadar');
    if (ctxRadar) {
        if (radarChartInstance) radarChartInstance.destroy();
        radarChartInstance = new Chart(ctxRadar, {
            type: 'radar',
            data: {
                labels: ['Komunikasi (78%)', 'Partisipasi (82%)', 'Kemandirian (75%)', 'Sosial (80%)'],
                datasets: [
                    {
                        label: 'Baseline (Awal)',
                        data: [62, 63, 61, 62],
                        borderColor: '#7a7a7a',
                        backgroundColor: 'rgba(122, 122, 122, 0.2)',
                        borderWidth: 1.5
                    },
                    {
                        label: 'Capaian Saat Ini',
                        data: [78, 82, 75, 80],
                        borderColor: '#DF6E3D',
                        backgroundColor: 'rgba(223, 110, 61, 0.25)',
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 600,
                    easing: 'easeOutQuart'
                },
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#cccccc', font: { size: 11 } } }
                },
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                        grid: { color: 'rgba(255, 255, 255, 0.08)' },
                        pointLabels: { font: { size: 11, weight: 'bold' }, color: '#ffffff' },
                        suggestedMin: 40,
                        suggestedMax: 100
                    }
                }
            }
        });
    }
}

function drilldownOutcome(dim) {
    const details = {
        'Komunikasi': 'Dimensi Komunikasi (78%): Capaian AAC +18%, respon chunking verbal +14%.',
        'Partisipasi': 'Dimensi Partisipasi (82%): Ketuntasan tugas tematik +20%, fokus 10/2 +18%.',
        'Kemandirian': 'Dimensi Kemandirian (75%): Pengelolaan alat tulis mandiri +12%, quiet corner +15%.',
        'Sosial': 'Dimensi Sosial (80%): Kolaborasi bermain sebaya +22%, berbagi media +14%.'
    };
    const msg = details[dim] || 'Evaluasi outcome 4 dimensi terpadu.';
    showToast(msg, 'info');
}

// ==========================================
// 8. MOBILE SIMULATOR
// ==========================================
function switchMobileTab(tabName) {
    document.querySelectorAll('.mobile-tab-pane').forEach(el => el.classList.add('hidden'));
    const target = document.getElementById(`mTab-${tabName}`);
    if (target) target.classList.remove('hidden');

    document.querySelectorAll('.mob-nav-btn').forEach(btn => {
        if (btn.getAttribute('data-tab') === tabName) {
            btn.className = "mob-nav-btn flex flex-col items-center text-[#DF6E3D] font-bold";
        } else {
            btn.className = "mob-nav-btn flex flex-col items-center text-[#7a7a7a]";
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

function openModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.remove('hidden');
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
window.addEventListener('DOMContentLoaded', async () => {
    initCommandPalette();
    initVoiceAI();
    checkAuthState();
    renderModulesList();
    renderPIBDirectory();
    renderSchoolDirectory();
    renderSessionsList();
    renderOutcomeCharts();
    renderDashboardCharts();
    triggerAllCounters();

    if (window.store && typeof window.store.syncWithBackend === 'function') {
        await window.store.syncWithBackend();
        renderModulesList();
        renderPIBDirectory();
        renderSchoolDirectory();
        renderSessionsList();
        renderDashboardCharts();
    }
});
