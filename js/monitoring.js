/**
 * SAPA INKLUSI - Monitoring Pendampingan & Verifikasi GPK
 */

function renderSessionTable() {
    const sessions = window.sapaStore ? window.sapaStore.getSessions() : [];
    const tbody = document.getElementById('sessionTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    sessions.forEach(s => {
        const isOngoing = s.status === 'BERLANGSUNG';
        const isVerified = s.verificationStatus === 'TERVERIFIKASI';
        const row = `
            <tr class="hover:bg-surface/50 transition-colors">
                <td class="py-3 px-4 whitespace-nowrap font-medium">${s.date.slice(5)}, ${s.time.split(' - ')[0]}</td>
                <td class="py-3 px-4 font-bold text-on-surface">${s.pibName}</td>
                <td class="py-3 px-4">
                    <div class="leading-tight">${s.schoolName}<br/><span class="text-[10px] text-on-surface-variant">${s.className} (${s.studentName || ''})</span></div>
                </td>
                <td class="py-3 px-4 text-on-surface-variant max-w-[200px] truncate" title="${s.notes || ''}">${s.activity}</td>
                <td class="py-3 px-4">
                    <span class="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md font-bold ${isOngoing ? 'bg-primary-container/15 text-primary' : 'bg-secondary/15 text-secondary'}">
                        ${s.status}
                    </span>
                </td>
                <td class="py-3 px-4 text-center">
                    ${isVerified ? `
                        <span class="inline-flex items-center gap-1 text-[10px] text-secondary font-bold bg-secondary-container/30 px-2.5 py-1 rounded-full">
                            <span class="material-symbols-outlined text-xs">verified</span> Terverifikasi
                        </span>
                    ` : `
                        <button onclick="verifySingleSession('${s.id}')" class="bg-primary hover:bg-primary-container text-on-primary text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm transition-colors">
                            Setujui Sesi
                        </button>
                    `}
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

function verifySingleSession(sessionId) {
    if (window.sapaStore) {
        window.sapaStore.verifySession(sessionId, true);
        alert("Sesi pendampingan berhasil diverifikasi oleh GPK Koordinator!");
        renderSessionTable();
    }
}

function verifyAllPendingSessions() {
    if (window.sapaStore) {
        const sessions = window.sapaStore.getSessions();
        sessions.forEach(s => {
            if (s.verificationStatus === 'MENUNGGU_VERIFIKASI') {
                window.sapaStore.verifySession(s.id, true);
            }
        });
        alert("Seluruh sesi yang tertunda telah diverifikasi!");
        renderSessionTable();
    }
}

function filterSessions() {
    const input = document.getElementById('sessionSearchInput');
    if (!input) return;
    const q = input.value.toLowerCase();
    const rows = document.querySelectorAll('#sessionTableBody tr');
    rows.forEach(r => {
        r.style.display = r.innerText.toLowerCase().includes(q) ? '' : 'none';
    });
}

function openAddSessionModal() {
    const modal = document.getElementById('addSessionModal');
    if (modal) modal.classList.remove('hidden');
}

function closeAddSessionModal() {
    const modal = document.getElementById('addSessionModal');
    if (modal) modal.classList.add('hidden');
}

function handleAddSessionSubmit(e) {
    e.preventDefault();
    const pibName = document.getElementById('newSessionPIB').value;
    const schoolName = document.getElementById('newSessionSchool').value;
    const studentName = document.getElementById('newSessionStudent').value;
    const activity = document.getElementById('newSessionActivity').value;

    if (window.sapaStore) {
        window.sapaStore.addSession({
            date: new Date().toISOString().slice(0, 10),
            time: "08:00 - 10:00",
            pibName,
            schoolName,
            className: "Kelas Reguler",
            studentName,
            activity,
            notes: activity
        });
        alert("Sesi pendampingan baru berhasil dicatat!");
        closeAddSessionModal();
        renderSessionTable();
    }
}

window.addEventListener('DOMContentLoaded', () => {
    renderSessionTable();
});
