/**
 * Module & Microcredential Controller for SAPA Inklusi
 */
const db = require('../config/database');

exports.getAllModules = (req, res) => {
    return res.json({
        success: true,
        count: db.data.modules.length,
        data: db.data.modules
    });
};

exports.getModuleById = (req, res) => {
    const { id } = req.params;
    const module = db.data.modules.find(m => m.id === id || m.number === id);
    if (!module) {
        return res.status(404).json({ success: false, message: 'Modul tidak ditemukan' });
    }
    return res.json({ success: true, data: module });
};

exports.submitQuiz = (req, res) => {
    const { id } = req.params;
    const { selectedAnswerIndex, userName } = req.body;
    const module = db.data.modules.find(m => m.id === id);

    if (!module) {
        return res.status(404).json({ success: false, message: 'Modul tidak ditemukan' });
    }

    const quiz = module.quizQuestions ? module.quizQuestions[0] : { correct: 0 };
    const isCorrect = parseInt(selectedAnswerIndex) === quiz.correct;

    if (isCorrect) {
        const certId = `CERT-PIB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        return res.json({
            success: true,
            passed: true,
            score: 100,
            certificate: {
                certId,
                recipientName: userName || 'Rina Maharani, S.Pd',
                issueDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
                verifiedBy: 'Dr. Sari Wulandari, M.Pd (GPK Koordinator)'
            }
        });
    } else {
        return res.json({
            success: true,
            passed: false,
            score: 50,
            message: 'Jawaban belum tepat. Silakan pelajari kembali materi dan ulangi kuis.'
        });
    }
};
