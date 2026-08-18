/**
 * School Directory & 6-Variable Matching Controller for SAPA Inklusi
 */
const db = require('../config/database');

exports.getAllSchools = (req, res) => {
    const { region, level, status } = req.query;
    let list = db.data.schools;

    if (region && region !== 'ALL') {
        list = list.filter(s => s.region.toLowerCase() === region.toLowerCase());
    }

    if (level && level !== 'ALL') {
        list = list.filter(s => s.level === level);
    }

    if (status && status !== 'ALL') {
        list = list.filter(s => s.status === status);
    }

    return res.json({
        success: true,
        count: list.length,
        data: list
    });
};

exports.getSchoolById = (req, res) => {
    const { id } = req.params;
    const school = db.data.schools.find(s => s.id === id);
    if (!school) {
        return res.status(404).json({ success: false, message: 'Sekolah tidak ditemukan' });
    }
    return res.json({ success: true, data: school });
};

exports.createSchool = (req, res) => {
    const { name, region, level, requiredPIB, studentsCount, requiredCompetencies, coordinatorName, address, schedule } = req.body;
    if (!name || !region) {
        return res.status(400).json({ success: false, message: 'Nama dan wilayah sekolah wajib diisi' });
    }

    const newSchool = {
        id: `SCH-${String(db.data.schools.length + 1).padStart(3, '0')}`,
        name,
        region,
        level: level || 'SD',
        address: address || `Jl. Pendidikan Raya No. ${db.data.schools.length + 1}, ${region}`,
        distanceKm: +(Math.random() * 4 + 1).toFixed(1),
        requiredPIB: parseInt(requiredPIB) || 2,
        assignedPIB: 0,
        studentsCount: parseInt(studentsCount) || 3,
        status: 'BUTUH_PENDAMPING',
        matchingScore: 89,
        requiredCompetencies: Array.isArray(requiredCompetencies) ? requiredCompetencies : [requiredCompetencies || 'Autism Spectrum'],
        coordinatorName: coordinatorName || 'Koordinator Inklusi Sekolah',
        schedule: schedule || 'Senin - Jumat (07.30 - 12.00)',
        matchingBreakdown: { jarak: 92, kompetensi: 90, jadwal: 88 }
    };

    db.data.schools.unshift(newSchool);
    db.saveData();

    return res.status(201).json({
        success: true,
        message: 'Sekolah mitra berhasil didaftarkan',
        data: newSchool
    });
};

exports.assignPIB = (req, res) => {
    const { id } = req.params; // schoolId
    const { pibId } = req.body;

    const school = db.data.schools.find(s => s.id === id);
    const pib = db.data.pibs.find(p => p.id === pibId);

    if (!school || !pib) {
        return res.status(404).json({ success: false, message: 'Sekolah atau PIB tidak ditemukan' });
    }

    pib.availability = 'BERTUGAS';
    pib.assignedSchool = school.name;
    pib.studentsCount = Math.max(1, Math.round(school.studentsCount / school.requiredPIB));

    school.assignedPIB = Math.min(school.requiredPIB, (school.assignedPIB || 0) + 1);
    if (school.assignedPIB >= school.requiredPIB) {
        school.status = 'TERPENUHI';
    }

    db.saveData();

    return res.json({
        success: true,
        message: `PIB ${pib.name} berhasil ditugaskan ke ${school.name}`,
        data: { school, pib }
    });
};
