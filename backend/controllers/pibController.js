/**
 * PIB Directory Controller for SAPA Inklusi
 */
const db = require('../config/database');

exports.getAllPIB = (req, res) => {
    const { region, availability, search } = req.query;
    let list = db.data.pibs;

    if (region && region !== 'ALL') {
        list = list.filter(p => p.region.toLowerCase() === region.toLowerCase());
    }

    if (availability && availability !== 'ALL') {
        list = list.filter(p => p.availability === availability);
    }

    if (search) {
        const q = search.toLowerCase();
        list = list.filter(p => 
            p.name.toLowerCase().includes(q) ||
            p.competencies.some(c => c.toLowerCase().includes(q)) ||
            p.region.toLowerCase().includes(q)
        );
    }

    return res.json({
        success: true,
        count: list.length,
        data: list
    });
};

exports.getPIBById = (req, res) => {
    const { id } = req.params;
    const pib = db.data.pibs.find(p => p.id === id);
    if (!pib) {
        return res.status(404).json({ success: false, message: 'PIB tidak ditemukan' });
    }
    return res.json({ success: true, data: pib });
};

exports.createPIB = (req, res) => {
    const { name, region, phone, email, competencies } = req.body;
    if (!name || !region) {
        return res.status(400).json({ success: false, message: 'Nama dan wilayah wajib diisi' });
    }

    const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    const newPIB = {
        id: `PIB-${String(db.data.pibs.length + 1).padStart(3, '0')}`,
        name,
        initials: initials || 'PB',
        region,
        phone: phone || '0812-0000-0000',
        email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@sapa.id`,
        status: 'BERSERTIFIKAT',
        rating: 4.8,
        sessionsCompleted: 0,
        competencies: Array.isArray(competencies) ? competencies : [competencies || 'Pedagogi Inklusif'],
        assignedSchool: 'Belum Ditugaskan',
        studentsCount: 0,
        availability: 'TERSEDIA'
    };

    db.data.pibs.unshift(newPIB);
    db.saveData();

    return res.status(201).json({
        success: true,
        message: 'Pendamping Inklusi berhasil didaftarkan',
        data: newPIB
    });
};

exports.updatePIB = (req, res) => {
    const { id } = req.params;
    const pibIndex = db.data.pibs.findIndex(p => p.id === id);
    if (pibIndex === -1) {
        return res.status(404).json({ success: false, message: 'PIB tidak ditemukan' });
    }

    db.data.pibs[pibIndex] = { ...db.data.pibs[pibIndex], ...req.body };
    db.saveData();

    return res.json({
        success: true,
        message: 'Data PIB diperbarui',
        data: db.data.pibs[pibIndex]
    });
};
