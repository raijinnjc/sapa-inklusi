/**
 * SAPA INKLUSI - Manajemen Sekolah Mitra & Matching Engine
 */

function renderSchoolList() {
    const schools = window.sapaStore ? window.sapaStore.getSchools() : [];
    const container = document.getElementById('schoolListBody');
    if (!container) return;
    container.innerHTML = '';

    schools.forEach(s => {
        const isNeeds = s.status === 'BUTUH_PENDAMPING';
        const row = `
            <div onclick="selectSchoolPreview('${s.id}')" class="grid grid-cols-12 gap-2 items-center p-3.5 hover:bg-surface-container/50 transition-colors cursor-pointer ${s.id === 'SCH-001' ? 'bg-secondary-container/10' : ''}">
                <div class="col-span-4 font-bold text-on-surface">${s.name}</div>
                <div class="col-span-2 text-on-surface-variant">${s.region}</div>
                <div class="col-span-1 text-on-surface-variant font-bold">${s.level}</div>
                <div class="col-span-2 text-center font-bold">
                    <span class="${isNeeds ? 'text-primary' : 'text-secondary'}">${s.assignedPIB}</span> / <span class="text-on-surface-variant">${s.requiredPIB}</span>
                </div>
                <div class="col-span-2">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${isNeeds ? 'bg-error-container text-primary' : 'bg-secondary-container text-secondary'}">
                        ${isNeeds ? 'Butuh PIB' : 'Terpenuhi'}
                    </span>
                </div>
                <div class="col-span-1 text-center font-bold text-primary">${s.matchingScore || 90}%</div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', row);
    });
}

function selectSchoolPreview(schoolId) {
    const schools = window.sapaStore ? window.sapaStore.getSchools() : [];
    const s = schools.find(item => item.id === schoolId);
    if (!s) return;

    const nameEl = document.getElementById('previewSchoolName');
    if (nameEl) nameEl.innerText = s.name;
    const locEl = document.getElementById('previewSchoolLoc');
    if (locEl) locEl.innerHTML = `<span class="material-symbols-outlined text-sm">location_on</span> ${s.region}, Jawa Barat (${s.distanceKm || 2} km)`;
    const matchEl = document.getElementById('previewSchoolMatch');
    if (matchEl) matchEl.innerText = `${s.matchingScore || 90}% Match Score`;
    const reqEl = document.getElementById('previewSchoolReq');
    if (reqEl) reqEl.innerText = `Butuh ${s.requiredPIB}, Ditugaskan ${s.assignedPIB}`;
    const compEl = document.getElementById('previewSchoolComps');
    if (compEl) compEl.innerText = (s.requiredCompetencies || []).join(', ');
    const coordEl = document.getElementById('previewSchoolCoord');
    if (coordEl) coordEl.innerText = s.coordinatorName || 'Koordinator Sekolah';
}

function filterSchoolList() {
    const input = document.getElementById('schoolSearchInput');
    if (!input) return;
    const q = input.value.toLowerCase();
    const rows = document.querySelectorAll('#schoolListBody > div');
    rows.forEach(r => {
        r.style.display = r.innerText.toLowerCase().includes(q) ? '' : 'none';
    });
}

function openAssignModal(preselectedSchoolId) {
    const schools = window.sapaStore ? window.sapaStore.getSchools() : [];
    const pibs = window.sapaStore ? window.sapaStore.getPIBs() : [];

    const schoolSelect = document.getElementById('assignSchoolSelect');
    if (schoolSelect) {
        schoolSelect.innerHTML = schools.map(s => `<option value="${s.id}" ${s.id === preselectedSchoolId ? 'selected' : ''}>${s.name} (${s.status === 'BUTUH_PENDAMPING' ? 'Butuh PIB' : 'Terpenuhi'})</option>`).join('');
    }

    const pibSelect = document.getElementById('assignPIBSelect');
    if (pibSelect) {
        pibSelect.innerHTML = pibs.map(p => `<option value="${p.id}">${p.name} - ${p.region} (${p.availability === 'TERSEDIA' ? 'Tersedia' : 'Sedang Bertugas'})</option>`).join('');
    }

    const modal = document.getElementById('assignModal');
    if (modal) modal.classList.remove('hidden');
}

function closeAssignModal() {
    const modal = document.getElementById('assignModal');
    if (modal) modal.classList.add('hidden');
}

function handleAssignSubmit(e) {
    e.preventDefault();
    const schoolId = document.getElementById('assignSchoolSelect').value;
    const pibId = document.getElementById('assignPIBSelect').value;

    if (window.sapaStore) {
        window.sapaStore.assignPIBToSchool(pibId, schoolId);
        alert("Penugasan PIB ke sekolah berhasil dicatat!");
        closeAssignModal();
        renderSchoolList();
        selectSchoolPreview(schoolId);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    renderSchoolList();
});
