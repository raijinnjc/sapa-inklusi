/**
 * SAPA INKLUSI - Manajemen Microcredential & Sertifikasi
 */

function renderModules() {
    const modules = window.sapaStore ? window.sapaStore.getModules() : [];
    const tbody = document.getElementById('modulesTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    modules.forEach(m => {
        const row = `
            <tr class="hover:bg-surface-container/50 transition-colors">
                <td class="py-3.5 px-5 font-bold flex items-center gap-3">
                    <span class="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">${m.number}</span>
                    <div>
                        <div class="text-on-surface">${m.name}</div>
                        <div class="text-[11px] text-on-surface-variant font-normal">${m.description}</div>
                    </div>
                </td>
                <td class="py-3.5 px-4 text-on-surface-variant font-medium">${m.duration} Jam</td>
                <td class="py-3.5 px-4 text-center font-bold">${m.completedCount} / ${m.enrolledCount}</td>
                <td class="py-3.5 px-4 text-center"><span class="bg-secondary-container/20 text-secondary px-2 py-0.5 rounded font-bold">${m.passRate}%</span></td>
                <td class="py-3.5 px-4 text-on-surface-variant text-[11px]">${m.assessment}</td>
                <td class="py-3.5 px-4 text-center">
                    <button onclick="alert('Kelola materi modul: ${m.name}')" class="text-primary hover:underline font-bold text-xs">Materi</button>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

function openAddModuleModal() {
    const modal = document.getElementById('addModuleModal');
    if (modal) modal.classList.remove('hidden');
}

function closeAddModuleModal() {
    const modal = document.getElementById('addModuleModal');
    if (modal) modal.classList.add('hidden');
}

function handleAddModuleSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('modNameInput').value;
    const duration = parseInt(document.getElementById('modDurationInput').value);
    const desc = document.getElementById('modDescInput').value;
    const assessment = document.getElementById('modAssessmentInput').value;

    if (window.sapaStore) {
        window.sapaStore.addModule({
            name,
            duration,
            description: desc,
            assessment,
            enrolledCount: 128,
            completedCount: 0
        });
        alert(`Modul "${name}" berhasil ditambahkan ke kurikulum!`);
        closeAddModuleModal();
        renderModules();
    }
}

function openCertModal() {
    const modal = document.getElementById('certModal');
    if (modal) modal.classList.remove('hidden');
}

function closeCertModal() {
    const modal = document.getElementById('certModal');
    if (modal) modal.classList.add('hidden');
}

window.addEventListener('DOMContentLoaded', () => {
    renderModules();
});
