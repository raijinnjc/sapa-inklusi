/**
 * =========================================================================
 * SAPA INKLUSI — Automated API Test Suite
 * =========================================================================
 * Tests Health, Auth, Modules, AI Assistant, PIB, Schools, Sessions, Outcomes
 */

const http = require('http');

function request(options, data = null) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => { body += chunk; });
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, body: JSON.parse(body) });
                } catch (e) {
                    resolve({ status: res.statusCode, body: body });
                }
            });
        });

        req.on('error', (err) => reject(err));

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function runTests() {
    console.log('🚀 Starting SAPA Inklusi Backend API Test Suite...\n');
    let passed = 0;
    let failed = 0;

    async function test(name, fn) {
        try {
            await fn();
            console.log(`✅ [PASS] ${name}`);
            passed++;
        } catch (e) {
            console.error(`❌ [FAIL] ${name}:`, e.message || e);
            failed++;
        }
    }

    // 1. Health Check
    await test('GET /api/health should return status OK', async () => {
        const res = await request({ host: '127.0.0.1', port: 3000, path: '/api/health', method: 'GET' });
        if (res.status !== 200 || res.body.status !== 'OK') throw new Error('Health check failed');
    });

    // 2. Auth Login
    await test('POST /api/auth/login with GPK credentials', async () => {
        const res = await request(
            { host: '127.0.0.1', port: 3000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
            { email: 'gpk@sapa.id', password: 'password123' }
        );
        if (res.status !== 200 || !res.body.user || res.body.user.role !== 'GPK_KOORDINATOR') throw new Error('Auth login failed');
    });

    // 3. Modules List
    await test('GET /api/modules should return 8 modules', async () => {
        const res = await request({ host: '127.0.0.1', port: 3000, path: '/api/modules', method: 'GET' });
        if (res.status !== 200 || res.body.count !== 8) throw new Error(`Expected 8 modules, got ${res.body.count}`);
    });

    // 4. Submit Quiz
    await test('POST /api/modules/MOD-01/quiz should validate quiz answers & return certificate', async () => {
        const res = await request(
            { host: '127.0.0.1', port: 3000, path: '/api/modules/MOD-01/quiz', method: 'POST', headers: { 'Content-Type': 'application/json' } },
            { selectedAnswerIndex: 1, userName: 'Rina Maharani, S.Pd' }
        );
        if (res.status !== 200 || !res.body.passed || !res.body.certificate) throw new Error('Quiz submission failed');
    });

    // 5. AI Assistant
    await test('POST /api/ai/assistant should return simplified instruction', async () => {
        const res = await request(
            { host: '127.0.0.1', port: 3000, path: '/api/ai/assistant', method: 'POST', headers: { 'Content-Type': 'application/json' } },
            { prompt: 'Sederhanakan instruksi membaca buku paket halaman 45' }
        );
        if (res.status !== 200 || !res.body.response.includes('Langkah')) throw new Error('AI Assistant response invalid');
    });

    // 6. PIB Directory
    await test('GET /api/pib should return list of certified pendamping', async () => {
        const res = await request({ host: '127.0.0.1', port: 3000, path: '/api/pib', method: 'GET' });
        if (res.status !== 200 || !Array.isArray(res.body.data)) throw new Error('PIB fetch failed');
    });

    // 7. Create Session
    await test('POST /api/sessions should record new assistance session', async () => {
        const res = await request(
            { host: '127.0.0.1', port: 3000, path: '/api/sessions', method: 'POST', headers: { 'Content-Type': 'application/json' } },
            {
                pibName: 'Rina Maharani, S.Pd',
                schoolName: 'SDN Harapan 1',
                className: 'Kelas 4A',
                studentName: 'Ananda Fikri',
                activity: 'Modifikasi materi visual'
            }
        );
        if (res.status !== 201 || !res.body.data.id) throw new Error('Session creation failed');
    });

    // 8. Verify All Sessions
    await test('POST /api/sessions/verify-all should batch verify pending sessions', async () => {
        const res = await request({ host: '127.0.0.1', port: 3000, path: '/api/sessions/verify-all', method: 'POST' });
        if (res.status !== 200 || res.body.success !== true) throw new Error('Batch verification failed');
    });

    // 9. Outcome Metrics
    await test('GET /api/outcomes should return North Star and 4 dimensions', async () => {
        const res = await request({ host: '127.0.0.1', port: 3000, path: '/api/outcomes', method: 'GET' });
        if (res.status !== 200 || !res.body.data.dimensions.komunikasi) throw new Error('Outcome metrics failed');
    });

    console.log(`\n=========================================`);
    console.log(`Test Summary: ${passed} Passed, ${failed} Failed`);
    console.log(`=========================================`);
}

// Start server in background then run tests
const server = require('./standalone-server');
setTimeout(async () => {
    try {
        await runTests();
    } catch(e) {
        console.error(e);
    } finally {
        server.close();
        process.exit(0);
    }
}, 500);
