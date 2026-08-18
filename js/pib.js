/**
 * SAPA INKLUSI - Manajemen PIB Controller
 */

function renderPIBTable() {
    const list = window.sapaStore ? window.sapaStore.getPIBs() : [];
    const tbody = document.getElementById('pibTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    list.forEach((pib, idx) => {
        const isCert = pib.certificationStatus === 'BERSERTIFIKAT';
        const row = `
            <tr onclick="selectPIB('${pib.id}')" class="hover:bg-surface-container/50 transition-colors cursor-pointer ${idx === 0 ? 'bg-secondary-container/10' : ''}">
                <td class="py-3 px-5">
                    <div class="flex items-center gap-2.5">
                        <img class="w-8 h-8 rounded-full object-cover" src="${pib.avatar}">
                        <span class="font-bold text-on-surface">${pib.name}</span>
                    </div>
                </td>
                <td class="py-3 px-4 text-on-surface-variant">${pib.region}</td>
                <td class="py-3 px-4">
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${isCert ? 'bg-secondary-container/30 text-secondary' : 'bg-primary/10 text-primary'}">
                        <span class="material-symbols-outlined text-xs">${isCert ? 'verified' : 'pending'}</span>
                        ${isCert ? 'Bersertifikat' : 'Dalam Progres'}
                    </span>
                </td>
                <td class="py-3 px-4">
                    <span class="px-2 py-0.5 rounded bg-surface-container text-xs text-on-surface">${pib.competencies ? pib.competencies[0] : '-'}</span>
                </td>
                <td class="py-3 px-4 text-on-surface-variant font-medium">${pib.assignedSchoolName || 'Menunggu Penugasan'}</td>
                <td class="py-3 px-4">
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${pib.availability === 'TERSEDIA' ? 'bg-secondary-container/20 text-secondary' : 'bg-tertiary-container/20 text-tertiary'}">
                        <span class="w-1.5 h-1.5 rounded-full ${pib.availability === 'TERSEDIA' ? 'bg-secondary' : 'bg-tertiary'}"></span>
                        ${pib.availability === 'TERSEDIA' ? 'Tersedia' : 'Sedang Bertugas'}
                    </span>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

function selectPIB(id) {
    const pib = window.sapaStore ? window.sapaStore.getPIBById(id) : null;
    if (!pib) return;

    const drawerName = document.getElementById('drawerName');
    if (drawerName) drawerName.innerText = pib.name;
    const drawerRegion = document.getElementById('drawerRegion');
    if (drawerRegion) drawerRegion.innerText = `${pib.region} • ID: ${pib.id}`;
    const drawerAvatar = document.getElementById('drawerAvatar');
    if (drawerAvatar) drawerAvatar.src = pib.avatar;
    const drawerSchool = document.getElementById('drawerSchool');
    if (drawerSchool) drawerSchool.innerText = pib.assignedSchoolName || 'Belum ditugaskan';
    const drawerStudents = document.getElementById('drawerStudents');
    if (drawerStudents) drawerStudents.innerText = `${pib.assignedStudentsCount || 0} Siswa didampingi`;
    const drawerActivity = document.getElementById('drawerActivity');
    if (drawerActivity) drawerActivity.innerText = pib.recentActivity || 'Belum ada catatan aktivitas';

    const compContainer = document.getElementById('drawerCompetencies');
    if (compContainer) {
        compContainer.innerHTML = (pib.competencies || []).map(c => `<span class="px-2 py-0.5 rounded bg-surface-container text-on-surface">${c}</span>`).join('');
    }
}

function filterPIBTable() {
    const queryEl = document.getElementById('searchPibInput');
    const regionEl = document.getElementById('pibRegionFilter');
    const certEl = document.getElementById('pibCertFilter');
    if (!queryEl || !regionEl || !certEl) return;

    const query = queryEl.value.toLowerCase();
    const region = regionEl.value;
    const cert = certEl.value;

    const rows = document.querySelectorAll('#pibTableBody tr');
    rows.forEach(r => {
        const text = r.innerText.toLowerCase();
        const matchQuery = !query || text.includes(query);
        const matchRegion = region === 'ALL' || text.includes(region.toLowerCase());
        const matchCert = cert === 'ALL' || (cert === 'BERSERTIFIKAT' ? text.includes('bersertifikat') : text.includes('dalam progres'));
        r.style.display = (matchQuery && matchRegion && matchCert) ? '' : 'none';
    });
}

function openAddPIBModal() {
    const modal = document.getElementById('addPIBModal');
    if (modal) modal.classList.remove('hidden');
}

function closeAddPIBModal() {
    const modal = document.getElementById('addPIBModal');
    if (modal) modal.classList.add('hidden');
}

function handleAddPIBSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('pibNameInput').value;
    const region = document.getElementById('pibRegionInput').value;
    const phone = document.getElementById('pibPhoneInput').value;
    const comps = document.getElementById('pibCompInput').value.split(',').map(s => s.trim());

    if (window.sapaStore) {
        window.sapaStore.addPIB({
            name,
            region,
            phone,
            competencies: comps
        });
        alert(`PIB ${name} berhasil ditambahkan!`);
        closeAddPIBModal();
        renderPIBTable();
    }
}

window.addEventListener('DOMContentLoaded', () => {
    renderPIBTable();
});
