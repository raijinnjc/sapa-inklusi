/**
 * SAPA INKLUSI - Apple & Vercel-grade Master SPA Controller
 * Spotlight Mouse Physics, Command Menu (⌘K), Token Streaming AI, Tabular Interpolated Counters
 */

// Global State
let activeView = 'dashboard';
let outcomeChartInstance = null;
let donutChartInstance = null;
let radarChartInstance = null;
let speechRec = null;
let isRec = false;
let isDarkMode = false;

// ==========================================
// SPOTLIGHT CURSOR PHYSICS (Vercel Signature)
// ==========================================
function initSpotlightPhysics() {
    document.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll('.spotlight-card');
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================
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
        'success': 'bg-[#2E6F40] text-white border border-[#2E6F40]',
        'info': 'bg-[#C85A32] text-white border border-[#C85A32]',
        'warning': 'bg-[#E29547] text-white border border-[#E29547]',
        'error': 'bg-[#BA1A1A] text-white border border-[#BA1A1A]'
    };

    const toast = document.createElement('div');
    toast.className = `toast-msg flex items-center gap-2.5 px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold ${colorMap[type] || colorMap.info} glass-panel`;
    toast.innerHTML = `
        <span class="material-symbols-outlined text-base">${iconMap[type] || 'info'}</span>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(12px)';
        toast.style.transition = 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => toast.remove(), 250);
    }, 3000);
}

// ==========================================
// ANIMATED COUNTER (Tabular Interpolation)
// ==========================================
function animateCounter(id, target, duration = 800, isDecimal = false) {
    const el = document.getElementById(id);
    if (!el) return;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease Out Quart
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
    animateCounter('kpiPIBVal', 128, 700);
    animateCounter('kpiSchoolVal', 46, 650);
    animateCounter('kpiAssistVal', 92, 750);
    animateCounter('kpiStudentVal', 214, 850);
    animateCounter('kpiNorthStarVal', 73.9, 900, true);
}

// ==========================================
// COMMAND PALETTE MENU (⌘K / Ctrl + K)
// ==========================================
const COMMAND_ACTIONS = [
    { title: "Dashboard Pemantauan", category: "Navigasi", icon: "space_dashboard", action: () => navigateTo('dashboard') },
    { title: "Kurikulum Microcredential (8 Modul)", category: "Navigasi", icon: "school", action: () => navigateTo('microcredential') },
    { title: "Asisten AI Kelas & Voice", category: "Navigasi", icon: "smart_toy", action: () => navigateTo('asisten-ai') },
    { title: "Direktori Pendamping Inklusi (PIB)", category: "Navigasi", icon: "diversity_3", action: () => navigateTo('pib') },
    { title: "Sekolah Mitra & Matching Engine", category: "Navigasi", icon: "location_city", action: () => navigateTo('sekolah') },
    { title: "Monitoring Pendampingan Harian", category: "Navigasi", icon: "fact_check", action: () => navigateTo('pendampingan') },
    { title: "Laporan & Evaluasi Outcome", category: "Navigasi", icon: "insights", action: () => navigateTo('laporan') },
    { title: "Buka Simulator Mobile PIB", category: "Aksi Cepat", icon: "phone_iphone", action: () => navigateTo('simulator') },
    { title: "Catat Sesi Pendampingan Baru", category: "Aksi Cepat", icon: "add", action: () => openModal('addSessionModal') },
    { title: "Daftarkan Sekolah Mitra Baru", category: "Aksi Cepat", icon: "add_business", action: () => openModal('addSchoolModal') },
    { title: "Tambah Pendamping Inklusi Baru", category: "Aksi Cepat", icon: "person_add", action: () => openModal('addPibModal') },
    { title: "Ekspor Seluruh Log Sesi ke CSV", category: "Data", icon: "download", action: () => { window.store.exportToCSV('sessions'); showToast("CSV Sesi diunduh", "success"); } },
    { title: "Ganti Tema Gelap / Terang (Dark Mode)", category: "Tampilan", icon: "dark_mode", action: () => toggleTheme() },
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
        }
    });
}

function toggleCommandMenu() {
    const modal = document.getElementById('commandMenuModal');
    if (!modal) return;
    if (modal.classList.contains('hidden')) {
        openCommandMenu();
    } else {
        closeCommandMenu();
    }
}

function openCommandMenu() {
    const modal = document.getElementById('commandMenuModal');
    if (!modal) return;
    modal.classList.remove('hidden');
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
    const list = document.getElementById('cmdItemsList');
    if (!list) return;
    list.innerHTML = '';

    if (items.length === 0) {
        list.innerHTML = `<div class="p-6 text-center text-xs text-[#8F95A0]">Tidak ada hasil untuk perintah ini.</div>`;
        return;
    }

    items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = `cmd-item flex items-center justify-between p-3 rounded-xl cursor-pointer text-xs font-medium text-[#1C2024] dark:text-[#F2F4F8] hover:bg-[#F6F3ED] dark:hover:bg-[#181B20] ${index === 0 ? 'bg-[#F6F3ED]/80 dark:bg-[#181B20]/80 text-[#C85A32]' : ''}`;
        div.onclick = () => {
            closeCommandMenu();
            item.action();
        };
        div.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-base text-[#8F95A0]">${item.icon}</span>
                <span>${item.title}</span>
            </div>
            <span class="text-[10px] text-[#8F95A0] uppercase tracking-wider font-bold">${item.category}</span>
        `;
        list.appendChild(div);
    });
}

// ==========================================
// DARK / LIGHT THEME TOGGLE
// ==========================================
function initTheme() {
    const saved = localStorage.getItem('SAPA_THEME');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setTheme(true);
    } else {
        setTheme(false);
    }
}

function toggleTheme() {
    setTheme(!isDarkMode);
    showToast(`Tema dialihkan ke mode ${isDarkMode ? 'Gelap (OLED)' : 'Terang'}`, 'info');
}

function setTheme(dark) {
    isDarkMode = dark;
    const root = document.documentElement;
    const icon = document.getElementById('themeToggleIcon');
    if (dark) {
        root.classList.add('dark');
        localStorage.setItem('SAPA_THEME', 'dark');
        if (icon) icon.innerText = 'light_mode';
    } else {
        root.classList.remove('dark');
        localStorage.setItem('SAPA_THEME', 'light');
        if (icon) icon.innerText = 'dark_mode';
    }
    if (outcomeChartInstance || donutChartInstance || radarChartInstance) {
        renderDashboardCharts();
        renderOutcomeCharts();
    }
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
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    if (emailInput) emailInput.value = email;
    if (passwordInput) passwordInput.value = 'password123';

    // Highlight selected demo card
    document.querySelectorAll('.demo-role-card').forEach(c => {
        if (c.getAttribute('data-email') === email) {
            c.classList.add('border-[#C85A32]', 'bg-[#FDF3EE]', 'dark:bg-[#241A16]');
            c.classList.remove('border-[#EAE4D9]', 'bg-white', 'dark:bg-[#121418]');
        } else {
            c.classList.remove('border-[#C85A32]', 'bg-[#FDF3EE]', 'dark:bg-[#241A16]');
            c.classList.add('border-[#EAE4D9]', 'bg-white', 'dark:bg-[#121418]');
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
    }, 450);
}

function handleLogout() {
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
    activeView = viewId;

    // Update nav links
    document.querySelectorAll('.nav-item').forEach(el => {
        const target = el.getAttribute('data-view');
        if (target === viewId) {
            el.className = "nav-item flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold bg-[#C85A32]/10 text-[#C85A32] dark:text-[#E07A5F] transition-all";
            const icon = el.querySelector('.material-symbols-outlined');
            if (icon) icon.classList.add('fill');
        } else {
            el.className = "nav-item flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-[#656A73] dark:text-[#9BA1AD] hover:text-[#C85A32] dark:hover:text-[#E07A5F] hover:bg-[#F6F3ED] dark:hover:bg-[#181B20] transition-all";
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
// 1. DASHBOARD VIEW & DYNAMIC FILTERS
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

    animateCounter('kpiPIBVal', pibCount, 500);
    animateCounter('kpiSchoolVal', schoolCount, 500);
    animateCounter('kpiAssistVal', assistCount, 500);
    animateCounter('kpiStudentVal', studentCount, 500);

    showToast(`Filter diterapkan: ${region} • ${level}`, 'info');
    renderDashboardCharts();
}

function resetDashboardFilter() {
    document.getElementById('filterDashRegion').value = 'ALL';
    document.getElementById('filterDashLevel').value = 'ALL';
    triggerAllCounters();
    showToast('Filter di-reset ke seluruh wilayah.', 'info');
    renderDashboardCharts();
}

function renderDashboardCharts() {
    if (typeof Chart === 'undefined') return;

    const isDark = document.documentElement.classList.contains('dark');
    const gridColor = isDark ? '#23272F' : '#F0ECE4';
    const textColor = isDark ? '#9BA1AD' : '#656A73';

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
                        backgroundColor: isDark ? '#1C2027' : '#1C2024',
                        padding: 10,
                        titleFont: { family: 'Plus Jakarta Sans', size: 12 },
                        bodyFont: { family: 'Plus Jakarta Sans', size: 12 }
                    }
                },
                scales: {
                    y: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 10 } } },
                    x: { grid: { display: false }, ticks: { color: textColor, font: { size: 11, weight: '600' } } }
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
                cutout: '74%',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: isDark ? '#1C2027' : '#1C2024',
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
function renderModulesList() {
    const list = window.store ? window.store.state.modules : [];
    const container = document.getElementById('modulesGrid');
    if (!container) return;
    container.innerHTML = '';

    list.forEach(m => {
        const card = document.createElement('div');
        card.className = "spotlight-card p-5 flex flex-col justify-between";
        card.innerHTML = `
            <div class="relative z-10">
                <div class="flex justify-between items-start mb-3">
                    <span class="w-7 h-7 rounded-lg bg-[#C85A32]/10 text-[#C85A32] font-bold text-xs flex items-center justify-center">${m.number}</span>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#5B6E43]/15 text-[#5B6E43]">${m.category}</span>
                </div>
                <h3 class="font-bold text-sm text-[#1C2024] dark:text-[#F2F4F8] mb-1.5 leading-snug">${m.title}</h3>
                <p class="text-xs text-[#656A73] dark:text-[#9BA1AD] line-clamp-2 leading-relaxed mb-4">${m.description}</p>
            </div>
            <div class="pt-3 border-t border-[#F0ECE4] dark:border-[#23272F] flex items-center justify-between relative z-10">
                <span class="text-[11px] text-[#8F95A0] font-medium flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm">schedule</span> ${m.durationHours} Jam
                </span>
                <div class="flex gap-1.5">
                    <button onclick="openModuleLessonModal('${m.id}')" class="px-2.5 py-1.5 rounded-lg bg-[#F6F3ED] dark:bg-[#1C2027] hover:bg-[#EAE4D9] dark:hover:bg-[#282E38] text-[#1C2024] dark:text-[#F2F4F8] text-xs font-bold transition-colors">
                        Materi
                    </button>
                    <button onclick="takeQuizModal('${m.id}')" class="px-3 py-1.5 rounded-lg bg-[#C85A32] hover:bg-[#B04A25] text-white text-xs font-bold transition-colors">
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
    if (catEl) catEl.innerText = `${m.category} • Durasi: ${m.durationHours} Jam Pelatihan`;
    if (contentEl) {
        contentEl.innerHTML = `
            <div class="prose text-xs text-[#1C2024] dark:text-[#F2F4F8] space-y-3 leading-relaxed">
                <div class="p-3 bg-[#FDF3EE] dark:bg-[#241A16] rounded-xl border border-[#C85A32]/20 text-[#C85A32] dark:text-[#E07A5F] font-medium">
                    <strong>Tujuan Pembelajaran:</strong> ${m.description}
                </div>
                ${m.lessonContent || '<p>Materi pembelajaran interaktif siap dipelajari.</p>'}
                <div class="p-3 bg-[#F6F3ED] dark:bg-[#181B20] rounded-xl border border-[#EAE4D9] dark:border-[#23272F] mt-4">
                    <h5 class="font-bold text-[#1C2024] dark:text-[#F2F4F8] mb-1">Studi Kasus Lapangan:</h5>
                    <p class="text-[#656A73] dark:text-[#9BA1AD]">Bagaimana merancang instruksi diferensiasi jika ada 2 anak autisme di kelas reguler dengan 28 siswa lain?</p>
                </div>
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
            <span class="text-xs font-bold text-[#C85A32] dark:text-[#E07A5F]">Modul ${m.number} • Asesmen Uji Kompetensi</span>
            <button onclick="closeModal('quizModal')" class="text-[#8F95A0] hover:text-[#1C2024]"><span class="material-symbols-outlined">close</span></button>
        </div>
        <h3 class="font-bold text-base text-[#1C2024] dark:text-[#F2F4F8] mb-4">${m.title}</h3>
        <div class="p-4 rounded-xl bg-[#F6F3ED] dark:bg-[#181B20] border border-[#EAE4D9] dark:border-[#23272F] mb-4 text-xs font-medium text-[#1C2024] dark:text-[#F2F4F8]">
            <p class="font-bold mb-3">${q.q}</p>
            <div class="space-y-2">
                ${q.a.map((opt, idx) => `
                    <label class="flex items-center gap-2 p-2.5 rounded-lg bg-white dark:bg-[#121418] border border-[#EAE4D9] dark:border-[#23272F] cursor-pointer hover:border-[#C85A32]">
                        <input type="radio" name="quizAns" value="${idx}" class="text-[#C85A32] focus:ring-[#C85A32]">
                        <span>${opt}</span>
                    </label>
                `).join('')}
            </div>
        </div>
        <div class="flex justify-end gap-2">
            <button onclick="closeModal('quizModal')" class="px-4 py-2 rounded-xl border border-[#EAE4D9] dark:border-[#23272F] text-xs font-bold">Batal</button>
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
}

// ==========================================
// 3. ASISTEN AI KELAS (TOKEN STREAMING)
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

    // User Message Bubble
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

    // AI Response Stream Container
    const fullResponse = window.store.generateAI(promptText);
    const aiDiv = document.createElement('div');
    aiDiv.className = "flex items-start gap-3 max-w-[85%]";
    aiDiv.innerHTML = `
        <div class="w-7 h-7 rounded-full bg-[#C85A32] text-white font-bold text-[10px] flex items-center justify-center shrink-0">AI</div>
        <div class="bg-white dark:bg-[#121418] p-4 rounded-2xl rounded-tl-sm border border-[#EAE4D9] dark:border-[#23272F] text-xs text-[#1C2024] dark:text-[#F2F4F8] leading-relaxed shadow-sm space-y-2">
            <div id="streamingResponseTarget" class="streaming-cursor whitespace-pre-line"></div>
            <div id="streamingResponseActions" class="pt-2 border-t border-[#F0ECE4] dark:border-[#23272F] flex gap-3 hidden">
                <button onclick="speakSpeech(\`${escapeJs(fullResponse)}\`)" class="text-[#C85A32] hover:text-[#B04A25] font-bold flex items-center gap-1 text-[11px]">
                    <span class="material-symbols-outlined text-sm">volume_up</span> Putar Suara (TTS)
                </button>
                <button onclick="copyText(\`${escapeJs(fullResponse)}\`)" class="text-[#656A73] dark:text-[#9BA1AD] hover:text-[#1C2024] flex items-center gap-1 text-[11px]">
                    <span class="material-symbols-outlined text-sm">content_copy</span> Salin
                </button>
            </div>
        </div>
    `;
    feed.appendChild(aiDiv);
    feed.scrollTop = feed.scrollHeight;

    // Stream Token by Token (ChatGPT / Vercel style)
    const target = aiDiv.querySelector('#streamingResponseTarget');
    const actions = aiDiv.querySelector('#streamingResponseActions');
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
            target.classList.remove('streaming-cursor');
            if (actions) actions.classList.remove('hidden');
        }
    }, 28);
}

function speakSpeech(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
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
        tr.className = `hover:bg-[#FBF9F5] dark:hover:bg-[#181B20] transition-colors cursor-pointer border-b border-[#F0ECE4] dark:border-[#23272F] ${idx === 0 ? 'bg-[#FDF3EE]/40 dark:bg-[#241A16]/40' : ''}`;
        tr.onclick = () => selectPibDrawer(p.id);
        tr.innerHTML = `
            <td class="py-3.5 px-4">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style="background-color: ${p.bgColor}">${p.initials}</div>
                    <div>
                        <div class="font-bold text-xs text-[#1C2024] dark:text-[#F2F4F8]">${p.name}</div>
                        <div class="text-[10px] text-[#8F95A0]">${p.email}</div>
                    </div>
                </div>
            </td>
            <td class="py-3.5 px-4 text-xs text-[#656A73] dark:text-[#9BA1AD]">${p.region}</td>
            <td class="py-3.5 px-4">
                <span class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${isCert ? 'bg-[#5B6E43]/15 text-[#5B6E43]' : 'bg-[#C85A32]/10 text-[#C85A32]'}">
                    <span class="material-symbols-outlined text-xs">${isCert ? 'verified' : 'hourglass_top'}</span>
                    ${isCert ? 'Bersertifikat' : 'Dalam Progres'}
                </span>
            </td>
            <td class="py-3.5 px-4">
                <span class="text-[11px] px-2 py-0.5 rounded bg-[#F6F3ED] dark:bg-[#1C2027] text-[#1C2024] dark:text-[#F2F4F8] font-medium">${p.competencies[0]}</span>
            </td>
            <td class="py-3.5 px-4 text-xs font-semibold text-[#1C2024] dark:text-[#F2F4F8]">${p.assignedSchool}</td>
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
    comps.innerHTML = p.competencies.map(c => `<span class="px-2 py-0.5 rounded bg-[#F6F3ED] dark:bg-[#1C2027] text-xs font-medium">${c}</span>`).join('');
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
// 5. SEKOLAH MITRA & MATCHING VIEW
// ==========================================
function renderSchoolDirectory() {
    const list = window.store ? window.store.state.schools : [];
    const container = document.getElementById('schoolListContainer');
    if (!container) return;
    container.innerHTML = '';

    list.forEach(s => {
        const isNeed = s.status === 'BUTUH_PENDAMPING';
        const row = document.createElement('div');
        row.className = "spotlight-card p-4 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-3";
        row.onclick = () => selectSchoolDetail(s.id);
        row.innerHTML = `
            <div class="relative z-10">
                <div class="flex items-center gap-2 mb-1">
                    <span class="font-bold text-sm text-[#1C2024] dark:text-[#F2F4F8]">${s.name}</span>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded ${s.level === 'SD' ? 'bg-[#C85A32]/10 text-[#C85A32]' : 'bg-[#5B6E43]/10 text-[#5B6E43]'}">${s.level}</span>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${isNeed ? 'bg-[#BA1A1A]/10 text-[#BA1A1A]' : 'bg-[#5B6E43]/15 text-[#5B6E43]'}">${isNeed ? 'Butuh PIB' : 'Terpenuhi'}</span>
                </div>
                <p class="text-xs text-[#656A73] dark:text-[#9BA1AD] flex items-center gap-2">
                    <span>${s.region} • ${s.distanceKm} km</span>
                    <span>• Siswa: ${s.studentsCount} anak</span>
                </p>
            </div>
            <div class="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end relative z-10">
                <div class="text-right">
                    <span class="text-xs font-bold text-[#C85A32] block tabular-nums">${s.matchingScore}% Match</span>
                    <span class="text-[10px] text-[#8F95A0]">Tugas: ${s.assignedPIB}/${s.requiredPIB} PIB</span>
                </div>
                <button onclick="event.stopPropagation(); openAssignModal('${s.id}')" class="px-3.5 py-1.5 rounded-lg bg-[#C85A32] hover:bg-[#B04A25] text-white text-xs font-bold transition-colors shadow-sm">
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

    // Matching breakdown bars
    const bd = s.matchingBreakdown || { jarak: 90, kompetensi: 90, jadwal: 90, pengalaman: 90 };
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
        tr.className = "hover:bg-[#FBF9F5] dark:hover:bg-[#181B20] transition-colors border-b border-[#F0ECE4] dark:border-[#23272F] cursor-pointer";
        tr.onclick = () => openSessionDetailModal(s.id);
        tr.innerHTML = `
            <td class="py-3 px-4 text-xs font-semibold text-[#1C2024] dark:text-[#F2F4F8]">${s.date}<br><span class="text-[10px] text-[#8F95A0]">${s.time}</span></td>
            <td class="py-3 px-4 text-xs font-bold text-[#1C2024] dark:text-[#F2F4F8]">${s.pibName}</td>
            <td class="py-3 px-4 text-xs text-[#656A73] dark:text-[#9BA1AD]">${s.schoolName}<br><span class="text-[10px] font-medium text-[#1C2024] dark:text-[#F2F4F8]">${s.className} (${s.studentName})</span></td>
            <td class="py-3 px-4 text-xs text-[#1C2024] dark:text-[#F2F4F8] max-w-[220px] truncate" title="${s.notes}">${s.activity}</td>
            <td class="py-3 px-4">
                <span class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${isDone ? 'bg-[#5B6E43]/15 text-[#5B6E43]' : 'bg-[#C85A32]/10 text-[#C85A32]'}">
                    ${s.status}
                </span>
            </td>
            <td class="py-3 px-4 text-center" onclick="event.stopPropagation()">
                ${isVerif ? `
                    <span class="inline-flex items-center gap-1 text-[10px] font-bold text-[#5B6E43] bg-[#5B6E43]/15 px-2.5 py-1 rounded-full">
                        <span class="material-symbols-outlined text-xs">verified</span> Terverifikasi
                    </span>
                ` : `
                    <button onclick="verifySessionAction('${s.id}')" class="px-3 py-1 rounded-lg bg-[#C85A32] hover:bg-[#B04A25] text-white text-xs font-bold transition-colors shadow-sm">
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

    document.getElementById('sessDetailId').innerText = `Log Sesi #${s.id} • ${s.date} (${s.time})`;
    document.getElementById('sessDetailPIB').innerText = s.pibName;
    document.getElementById('sessDetailSchool').innerText = `${s.schoolName} — ${s.className}`;
    document.getElementById('sessDetailStudent').innerText = s.studentName;
    document.getElementById('sessDetailActivity').innerText = s.activity;
    document.getElementById('sessDetailNotes').innerText = s.notes;

    const verifBadge = document.getElementById('sessDetailVerifBadge');
    if (verifBadge) {
        if (s.verificationStatus === 'TERVERIFIKASI') {
            verifBadge.innerHTML = `<span class="bg-[#5B6E43]/15 text-[#5B6E43] px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1"><span class="material-symbols-outlined text-sm">verified</span> Terverifikasi GPK</span>`;
        } else {
            verifBadge.innerHTML = `<button onclick="verifySessionAction('${s.id}'); closeModal('sessionDetailModal');" class="bg-[#C85A32] hover:bg-[#B04A25] text-white px-4 py-1.5 rounded-xl font-bold text-xs shadow-sm">Verifikasi Sesi Ini</button>`;
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

    const isDark = document.documentElement.classList.contains('dark');
    const gridColor = isDark ? '#23272F' : '#F0ECE4';
    const pointLabelColor = isDark ? '#F2F4F8' : '#1C2024';

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
                        angleLines: { color: gridColor },
                        grid: { color: gridColor },
                        pointLabels: { font: { size: 11, weight: 'bold' }, color: pointLabelColor },
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
window.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initSpotlightPhysics();
    initCommandPalette();
    initVoiceAI();
    checkAuthState();
});
