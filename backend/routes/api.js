/**
 * SAPA INKLUSI — API Main Router
 */
const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const moduleController = require('../controllers/moduleController');
const aiController = require('../controllers/aiController');
const pibController = require('../controllers/pibController');
const schoolController = require('../controllers/schoolController');
const sessionController = require('../controllers/sessionController');
const outcomeController = require('../controllers/outcomeController');

// 1. Health & Status
router.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        app: 'SAPA Inklusi REST API',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// 2. Auth Routes
router.post('/auth/login', authController.login);
router.get('/auth/me', authController.getMe);
router.post('/auth/role', authController.switchRole);

// 3. Microcredential Module Routes
router.get('/modules', moduleController.getAllModules);
router.get('/modules/:id', moduleController.getModuleById);
router.post('/modules/:id/quiz', moduleController.submitQuiz);

// 4. AI Assistant Routes
router.post('/ai/assistant', aiController.generateClassroomAssistant);

// 5. PIB Directory Routes
router.get('/pib', pibController.getAllPIB);
router.get('/pib/:id', pibController.getPIBById);
router.post('/pib', pibController.createPIB);
router.put('/pib/:id', pibController.updatePIB);

// 6. School Mitra & Matching Routes
router.get('/schools', schoolController.getAllSchools);
router.get('/schools/:id', schoolController.getSchoolById);
router.post('/schools', schoolController.createSchool);
router.post('/schools/:id/assign', schoolController.assignPIB);

// 7. Monitoring Sessions Routes
router.get('/sessions', sessionController.getAllSessions);
router.get('/sessions/:id', sessionController.getSessionById);
router.post('/sessions', sessionController.createSession);
router.put('/sessions/:id/verify', sessionController.verifySession);
router.post('/sessions/verify-all', sessionController.verifyAllSessions);

// 8. Outcome & Longitudinal Metrics Routes
router.get('/outcomes', outcomeController.getOutcomeMetrics);
router.get('/export/:type', outcomeController.exportCSV);

module.exports = router;
