/**
 * Monitoring Sessions & GPK Verification Controller for SAPA Inklusi
 */
const db = require('../config/database');

exports.getAllSessions = (req, res) => {
    const { status, verificationStatus, pibName, schoolName } = req.query;
    let list = db.data.sessions;

    if (status && status !== 'ALL') {
        list = list.filter(s => s.status === status);
    }

    if (verificationStatus && verificationStatus !== 'ALL') {
        list = list.filter(s => s.verificationStatus === verificationStatus);
    }

    if (pibName) {
        list = list.filter(s => s.pibName.toLowerCase().includes(pibName.toLowerCase()));
    }

    return res.json({
        success: true,
        count: list.length,
        data: list
    });
};

exports.getSessionById = (req, res) => {
    const { id } = req.params;
    const session = db.data.sessions.find(s => s.id === id);
    if (!session) {
        return res.status(404).json({ success: false, message: 'Log sesi tidak ditemukan' });
    }
    return res.json({ success: true, data: session });
};

exports.createSession = (req, res) => {
    const { pibName, schoolName, className, studentName, activity, notes, time } = req.body;
    if (!studentName || !activity) {
        return res.status(400).json({ success: false, message: 'Nama siswa dan aktivitas wajib diisi' });
    }

    const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    const newSession = {
        id: `SES-${String(db.data.sessions.length + 1).padStart(3, '0')}`,
        date: today,
        time: time || '08:00 - 10:00',
        pibName: pibName || 'Rina Maharani, S.Pd',
        schoolName: schoolName || 'SDN Harapan 1',
        className: className || 'Kelas 4A',
        studentName,
        activity,
        notes: notes || 'Aktivitas adaptasi materi dan pendampingan mandiri terlaksana dengan baik.',
        status: 'SELESAI',
        verificationStatus: 'TERTUNDA',
        verifiedBy: null,
        verifiedAt: null
    };

    db.data.sessions.unshift(newSession);
    db.saveData();

    return res.status(201).json({
        success: true,
        message: 'Log sesi pendampingan berhasil dicatat',
        data: newSession
    });
};

exports.verifySession = (req, res) => {
    const { id } = req.params;
    const { verifiedBy } = req.body;

    const session = db.data.sessions.find(s => s.id === id);
    if (!session) {
        return res.status(404).json({ success: false, message: 'Sesi tidak ditemukan' });
    }

    session.verificationStatus = 'TERVERIFIKASI';
    session.verifiedBy = verifiedBy || 'Dr. Sari Wulandari (GPK Koordinator)';
    session.verifiedAt = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    db.saveData();

    return res.json({
        success: true,
        message: 'Sesi pendampingan berhasil diverifikasi oleh GPK Koordinator',
        data: session
    });
};

exports.verifyAllSessions = (req, res) => {
    let count = 0;
    const now = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    
    db.data.sessions.forEach(s => {
        if (s.verificationStatus !== 'TERVERIFIKASI') {
            s.verificationStatus = 'TERVERIFIKASI';
            s.verifiedBy = 'Dr. Sari Wulandari (GPK Koordinator)';
            s.verifiedAt = now;
            count++;
        }
    });

    db.saveData();

    return res.json({
        success: true,
        message: `${count} sesi tertunda berhasil diverifikasi secara massal`,
        verifiedCount: count
    });
};
