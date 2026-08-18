/**
 * =========================================================================
 * SAPA INKLUSI — Zero-Dependency Native Node.js REST API Server
 * =========================================================================
 * Uses built-in 'http', 'fs', 'path', and 'url' modules.
 * Runs instantly without requiring npm install!
 * Port: 3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const db = require('./config/database');
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, '..');

function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end(JSON.stringify(data));
}

function parseBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (e) {
                resolve({});
            }
        });
    });
}

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        });
        return res.end();
    }

    console.log(`[${new Date().toISOString()}] ${method} ${pathname}`);

    // ==========================================
    // REST API ROUTING
    // ==========================================
    if (pathname.startsWith('/api/')) {
        // 1. Health Check
        if (pathname === '/api/health' && method === 'GET') {
            return sendJSON(res, 200, {
                status: 'OK',
                server: 'SAPA Inklusi Native Server',
                version: '1.0.0',
                timestamp: new Date().toISOString()
            });
        }

        // 2. Auth Endpoints
        if (pathname === '/api/auth/login' && method === 'POST') {
            const body = await parseBody(req);
            const email = (body.email || '').toLowerCase().trim();
            const user = db.data.users.find(u => u.email.toLowerCase() === email) || {
                id: `USR-${Date.now().toString().slice(-4)}`,
                email: email || 'user@sapa.id',
                name: email ? email.split('@')[0] : 'Pengguna Baru',
                role: 'GPK_KOORDINATOR',
                schoolName: 'Unit Layanan Inklusi'
            };
            return sendJSON(res, 200, { success: true, user, token: 'sapa-token-' + user.id });
        }

        if (pathname === '/api/auth/me' && method === 'GET') {
            return sendJSON(res, 200, { success: true, user: db.data.users[0] });
        }

        // 3. Modules Endpoints
        if (pathname === '/api/modules' && method === 'GET') {
            return sendJSON(res, 200, { success: true, count: db.data.modules.length, data: db.data.modules });
        }

        if (pathname.startsWith('/api/modules/') && pathname.endsWith('/quiz') && method === 'POST') {
            const modId = pathname.split('/')[3];
            const body = await parseBody(req);
            const mod = db.data.modules.find(m => m.id === modId);
            const correct = mod && mod.quizQuestions ? mod.quizQuestions[0].correct : 0;
            const passed = parseInt(body.selectedAnswerIndex) === correct;

            return sendJSON(res, 200, {
                success: true,
                passed,
                score: passed ? 100 : 50,
                certificate: passed ? {
                    certId: `CERT-PIB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                    recipientName: body.userName || 'Rina Maharani, S.Pd',
                    issueDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                } : null
            });
        }

        if (pathname.startsWith('/api/modules/') && method === 'GET') {
            const modId = pathname.split('/')[3];
            const mod = db.data.modules.find(m => m.id === modId || m.number === modId);
            if (!mod) return sendJSON(res, 404, { success: false, message: 'Modul tidak ditemukan' });
            return sendJSON(res, 200, { success: true, data: mod });
        }

        // 4. AI Assistant Endpoint
        if (pathname === '/api/ai/assistant' && method === 'POST') {
            const body = await parseBody(req);
            const lower = (body.prompt || '').toLowerCase();
            let text = '';

            if (lower.includes('sederhana') || lower.includes('baca') || lower.includes('instruksi')) {
                text = `**Langkah Instruksi Sederhana (3 Langkah Visual):**\n1. 📖 Buka buku paket halaman 45.\n2. ✏️ Tandai 2 kalimat yang memiliki gambar hewan.\n3. ⭐ Angkat tangan jika sudah selesai untuk mendapatkan stiker bintang.\n\n*Catatan untuk Pendamping: Berikan jeda 3 menit setelah langkah kedua.*`;
            } else if (lower.includes('sensori') || lower.includes('adhd') || lower.includes('tantrum')) {
                text = `**Protokol Jeda Sensori & Regulasi Emosi (3 Menit):**\n1. **Teknik 5 Jari:** Tarik nafas dalam sambil menyentuh ujung kelima jari secara perlahan.\n2. **Aktivitas Fisik Ringan:** Gerakan meremas bola stres atau peregangan bahu lembut.\n3. **Transisi:** Berikan aba-aba visual 1 menit sebelum kembali ke materi kelas.`;
            } else {
                text = `**Rekomendasi Modifikasi Pembelajaran:**\n1. **Pemecahan Tugas (Chunking):** Bagi materi menjadi sub-tugas kecil 10 menit.\n2. **Dukungan Visual Konkret:** Gunakan kartu gambar alur kerja.\n3. **Penguatan Positif:** Berikan apresiasi spesifik atas usaha mandiri peserta didik.`;
            }

            return sendJSON(res, 200, { success: true, response: text, model: 'SAPA-AI-v1.0' });
        }

        // 5. PIB Endpoints
        if (pathname === '/api/pib' && method === 'GET') {
            return sendJSON(res, 200, { success: true, count: db.data.pibs.length, data: db.data.pibs });
        }

        if (pathname === '/api/pib' && method === 'POST') {
            const body = await parseBody(req);
            const initials = (body.name || 'PB').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
            const newPib = {
                id: `PIB-${String(db.data.pibs.length + 1).padStart(3, '0')}`,
                name: body.name,
                initials: initials || 'PB',
                region: body.region || 'Sukamaju',
                phone: body.phone || '0812-0000-0000',
                email: body.email || 'pib@sapa.id',
                status: 'BERSERTIFIKAT',
                rating: 4.8,
                sessionsCompleted: 0,
                competencies: Array.isArray(body.competencies) ? body.competencies : [body.competencies || 'Pedagogi Inklusif'],
                assignedSchool: 'Belum Ditugaskan',
                studentsCount: 0,
                availability: 'TERSEDIA'
            };
            db.data.pibs.unshift(newPib);
            db.saveData();
            return sendJSON(res, 201, { success: true, message: 'PIB berhasil didaftarkan', data: newPib });
        }

        // 6. Schools Endpoints
        if (pathname === '/api/schools' && method === 'GET') {
            return sendJSON(res, 200, { success: true, count: db.data.schools.length, data: db.data.schools });
        }

        if (pathname.startsWith('/api/schools/') && pathname.endsWith('/assign') && method === 'POST') {
            const schoolId = pathname.split('/')[3];
            const body = await parseBody(req);
            const school = db.data.schools.find(s => s.id === schoolId);
            const pib = db.data.pibs.find(p => p.id === body.pibId);

            if (!school || !pib) return sendJSON(res, 404, { success: false, message: 'Sekolah atau PIB tidak ditemukan' });

            pib.availability = 'BERTUGAS';
            pib.assignedSchool = school.name;
            pib.studentsCount = Math.max(1, Math.round(school.studentsCount / school.requiredPIB));
            school.assignedPIB = Math.min(school.requiredPIB, (school.assignedPIB || 0) + 1);
            if (school.assignedPIB >= school.requiredPIB) school.status = 'TERPENUHI';

            db.saveData();
            return sendJSON(res, 200, { success: true, message: 'Penugasan berhasil', data: { school, pib } });
        }

        if (pathname === '/api/schools' && method === 'POST') {
            const body = await parseBody(req);
            const newSchool = {
                id: `SCH-${String(db.data.schools.length + 1).padStart(3, '0')}`,
                name: body.name,
                region: body.region,
                level: body.level || 'SD',
                address: body.address || 'Jl. Pendidikan No. 10',
                distanceKm: 2.1,
                requiredPIB: parseInt(body.requiredPIB) || 2,
                assignedPIB: 0,
                studentsCount: parseInt(body.studentsCount) || 3,
                status: 'BUTUH_PENDAMPING',
                matchingScore: 89,
                requiredCompetencies: Array.isArray(body.requiredCompetencies) ? body.requiredCompetencies : [body.requiredCompetencies || 'Autism Spectrum'],
                coordinatorName: body.coordinatorName || 'Koordinator Sekolah',
                schedule: 'Senin - Jumat (07.30 - 12.00)',
                matchingBreakdown: { jarak: 92, kompetensi: 90, jadwal: 88 }
            };
            db.data.schools.unshift(newSchool);
            db.saveData();
            return sendJSON(res, 201, { success: true, message: 'Sekolah didaftarkan', data: newSchool });
        }

        // 7. Sessions Endpoints
        if (pathname === '/api/sessions' && method === 'GET') {
            return sendJSON(res, 200, { success: true, count: db.data.sessions.length, data: db.data.sessions });
        }

        if (pathname === '/api/sessions' && method === 'POST') {
            const body = await parseBody(req);
            const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
            const newSession = {
                id: `SES-${String(db.data.sessions.length + 1).padStart(3, '0')}`,
                date: today,
                time: body.time || '08:00 - 10:00',
                pibName: body.pibName || 'Rina Maharani, S.Pd',
                schoolName: body.schoolName || 'SDN Harapan 1',
                className: body.className || 'Kelas 4A',
                studentName: body.studentName,
                activity: body.activity,
                notes: body.notes || 'Pendampingan terlaksana dengan baik.',
                status: 'SELESAI',
                verificationStatus: 'TERTUNDA',
                verifiedBy: null,
                verifiedAt: null
            };
            db.data.sessions.unshift(newSession);
            db.saveData();
            return sendJSON(res, 201, { success: true, message: 'Sesi dicatat', data: newSession });
        }

        if (pathname.startsWith('/api/sessions/') && pathname.endsWith('/verify') && method === 'PUT') {
            const sessId = pathname.split('/')[3];
            const session = db.data.sessions.find(s => s.id === sessId);
            if (!session) return sendJSON(res, 404, { success: false, message: 'Sesi tidak ditemukan' });

            session.verificationStatus = 'TERVERIFIKASI';
            session.verifiedBy = 'Dr. Sari Wulandari (GPK Koordinator)';
            session.verifiedAt = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
            db.saveData();

            return sendJSON(res, 200, { success: true, message: 'Sesi diverifikasi', data: session });
        }

        if (pathname === '/api/sessions/verify-all' && method === 'POST') {
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
            return sendJSON(res, 200, { success: true, message: `${count} sesi diverifikasi massal`, verifiedCount: count });
        }

        // 8. Outcomes & Export Endpoints
        if (pathname === '/api/outcomes' && method === 'GET') {
            const totalSchools = db.data.schools.length;
            const fulfilled = db.data.schools.filter(s => s.status === 'TERPENUHI').length;
            return sendJSON(res, 200, {
                success: true,
                data: {
                    northStarRate: totalSchools > 0 ? +((fulfilled / totalSchools) * 100).toFixed(1) : 73.9,
                    dimensions: {
                        komunikasi: { score: 78, delta: '+16%' },
                        partisipasi: { score: 82, delta: '+19%' },
                        kemandirian: { score: 75, delta: '+14%' },
                        sosial: { score: 80, delta: '+18%' }
                    },
                    kpis: {
                        totalPIB: db.data.pibs.length,
                        totalSchools: db.data.schools.length,
                        totalSessions: db.data.sessions.length,
                        totalStudents: 214
                    }
                }
            });
        }

        return sendJSON(res, 404, { success: false, message: 'Endpoint API tidak ditemukan' });
    }

    // ==========================================
    // STATIC FILE SERVING (index.html, css, js)
    // ==========================================
    let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(PUBLIC_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml'
    };

    const contentType = mimeTypes[ext] || 'text/plain';
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(500);
            res.end(`Server Error: ${err.code}`);
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`SAPA INKLUSI Zero-Dependency REST API Server Online:`);
    console.log(`👉 Web Portal : http://localhost:${PORT}`);
    console.log(`👉 API Health  : http://localhost:${PORT}/api/health`);
    console.log(`👉 Modules API : http://localhost:${PORT}/api/modules`);
    console.log(`👉 PIB API     : http://localhost:${PORT}/api/pib`);
    console.log(`👉 Schools API : http://localhost:${PORT}/api/schools`);
    console.log(`👉 Sessions API: http://localhost:${PORT}/api/sessions`);
    console.log(`====================================================`);
});

module.exports = server;
