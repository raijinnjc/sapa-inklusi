/**
 * =========================================================================
 * SAPA INKLUSI - Core State Store (PRD v1.0 Compliant Architecture)
 * =========================================================================
 * Deep Models: 8 Microcredential Modules, 6-Variable Matching Engine,
 * Adaptive Classroom AI Copilot, Longitudinal Outcome Evaluator.
 */

const STORAGE_KEY = 'SAPA_INKLUSI_MASTER_V4';
const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? (window.location.port === '3000' ? '/api' : 'http://localhost:3000/api')
    : '/api';

const DEMO_ACCOUNTS = {
    'gpk@sapa.id': {
        role: 'GPK_KOORDINATOR',
        roleLabel: 'GPK Koordinator',
        name: 'Dr. Sari Wulandari, M.Pd',
        email: 'gpk@sapa.id',
        nip: '19820415 200604 2 008',
        avatarInitials: 'SW',
        avatarColor: '#DF6E3D',
        institution: 'Pusat Layanan Inklusif Wilayah'
    },
    'sekolah@sapa.id': {
        role: 'SEKOLAH_MITRA',
        roleLabel: 'Koordinator Sekolah Mitra',
        name: 'Ibu Nurhayati, S.Pd',
        email: 'sekolah@sapa.id',
        nip: '19880112 201101 2 004',
        avatarInitials: 'NH',
        avatarColor: '#8E9F6A',
        institution: 'SDN Harapan 1 Sukamaju'
    },
    'dinas@sapa.id': {
        role: 'DINAS_PENDIDIKAN',
        roleLabel: 'Pengawas Dinas Pendidikan',
        name: 'Drs. Hendra Kusuma, M.Si',
        email: 'dinas@sapa.id',
        nip: '19750918 199903 1 002',
        avatarInitials: 'HK',
        avatarColor: '#DF6E3D',
        institution: 'Dinas Pendidikan Jawa Barat'
    },
    'pib@sapa.id': {
        role: 'PIB',
        roleLabel: 'Pendamping Inklusi Bersertifikat',
        name: 'Rina Maharani, S.Pd',
        email: 'pib@sapa.id',
        nip: 'PIB-2026-089',
        avatarInitials: 'RM',
        avatarColor: '#DF6E3D',
        institution: 'Ikatan Pendamping Inklusi'
    }
};

const INITIAL_STATE = {
    isLoggedIn: true,
    currentUser: {
        role: 'GPK_KOORDINATOR',
        roleLabel: 'GPK Koordinator',
        name: 'Dr. Sari Wulandari, M.Pd',
        email: 'gpk@sapa.id',
        nip: '19820415 200604 2 008',
        avatarInitials: 'SW',
        avatarColor: '#DF6E3D',
        institution: 'Pusat Layanan Inklusif Wilayah'
    },
    userRole: 'GPK_KOORDINATOR',
    userName: 'Dr. Sari Wulandari, M.Pd',
    userRoleLabel: 'GPK Koordinator',
    
    // Core KPIs
    stats: {
        pibAktif: 128,
        sekolahMitra: 46,
        pendampinganAktif: 92,
        anakDidampingi: 214,
        northStarMetric: 73.9 // % Sekolah Mitra dengan PIB aktif & pencatatan konsisten
    },
    
    // 8 Standard PRD Modules with Rich Lesson Content
    modules: [
        {
            id: "MOD-01",
            number: 1,
            title: "Dasar Pendidikan Inklusif",
            category: "Fondasi",
            durationHours: 6,
            description: "Filosofi hak pendidikan anak, regulasi UU No 8/2016, Permendikbud No 70/2009, dan paradigma sekolah ramah anak.",
            lessonContent: `
                <h4>1. Paradigma Pendidikan Inklusif di Indonesia</h4>
                <p>Pendidikan inklusif adalah sistem penyelenggaraan pendidikan yang memberikan kesempatan kepada semua peserta didik yang memiliki kebutuhan khusus dan potensi kecerdasan istimewa untuk belajar bersama di kelas reguler.</p>
                <h4>2. Prinsip Non-Diskriminasi & Akomodasi yang Layak</h4>
                <p>Sekolah reguler wajib memberikan akomodasi yang layak (*reasonable accommodation*) mencakup modifikasi kurikulum, sarana fisik, dan pendampingan personal tanpa diskriminasi.</p>
            `,
            enrolled: 128,
            completed: 128,
            passRate: 98,
            quizQuestions: [
                { q: "Apa prinsip utama akomodasi yang layak dalam pendidikan inklusif?", a: ["Menyesuaikan lingkungan dan instruksi agar ramah bagi semua ragam peserta didik", "Memisahkan kelas berdasarkan tingkat IQ", "Mengharuskan anak mengikuti standar tunggal tanpa bantuan"], correct: 0 }
            ]
        },
        {
            id: "MOD-02",
            number: 2,
            title: "Memahami Ragam Kebutuhan Belajar Anak",
            category: "Identifikasi",
            durationHours: 8,
            description: "Karakteristik dan pemetaan spektrum Autisme, ADHD, Disleksia, Diskalkulia, serta hambatan sensori motorik.",
            lessonContent: `
                <h4>1. Spektrum Autisme & Kebutuhan Sensori</h4>
                <p>Anak dengan spektrum autisme memerlukan prediktabilitas, jadwal visual terstruktur (*visual schedule*), dan ruang jeda sensorik jika mengalami *sensory overload*.</p>
                <h4>2. ADHD & Regulasi Perhatian</h4>
                <p>Strategi *movement break* (jeda gerak terencana) dan penggunaan penanda visual waktu (*visual timer*) meningkatkan rentang atensi secara signifikan.</p>
            `,
            enrolled: 128,
            completed: 115,
            passRate: 92,
            quizQuestions: [
                { q: "Metode awal terbaik saat mendampingi anak dengan spektrum autisme di kelas baru adalah?", a: ["Instruksi lisan panjang tanpa jeda", "Menyediakan jadwal visual dan penataan lingkungan minim distraksi", "Memaksa interaksi kelompok tanpa persiapan"], correct: 1 }
            ]
        },
        {
            id: "MOD-03",
            number: 3,
            title: "Komunikasi Inklusif & Bahasa Adaptif",
            category: "Komunikasi",
            durationHours: 6,
            description: "Penggunaan bahasa visual, PECS, bahasa isyarat dasar, teknik AAC, dan penyederhanaan kalimat instruksi.",
            lessonContent: `
                <h4>1. Augmentative and Alternative Communication (AAC)</h4>
                <p>Penggunaan simbol gambar dan kartu komunikasi membantu anak non-verbal mengekspresikan kebutuhan dasar dan pemahaman pelajaran.</p>
                <h4>2. Chunking Instruksi Verbal</h4>
                <p>Bagi instruksi kompleks menjadi 1-2 tindakan konkret: 'Buka buku' lalu jeda 3 detik, baru kemudian 'Lihat gambar nomor 1'.</p>
            `,
            enrolled: 128,
            completed: 102,
            passRate: 89,
            quizQuestions: [
                { q: "Tujuan utama teknik chunking kalimat instruksi adalah:", a: ["Menurunkan tujuan kurikulum", "Memecah tugas menjadi langkah konkret yang dapat diproses anak secara bertahap", "Menghilangkan teks bacaan"], correct: 1 }
            ]
        },
        {
            id: "MOD-04",
            number: 4,
            title: "Strategi Pendampingan di Kelas Reguler",
            category: "Praktik Kelas",
            durationHours: 8,
            description: "Kolaborasi intensif guru kelas dengan PIB, diferensiasi konten, co-teaching, dan scaffolding terarah.",
            lessonContent: `
                <h4>1. Peran Sinergis PIB dan Guru Kelas</h4>
                <p>Guru kelas memegang kendali pedagogis utama, sementara PIB memfasilitasi jembatan pemahaman (*scaffolding*), regulasi emosi, dan penyesuaian media ajar.</p>
            `,
            enrolled: 128,
            completed: 94,
            passRate: 87,
            quizQuestions: [
                { q: "Peran PIB yang paling tepat saat guru kelas sedang menjelaskan materi adalah:", a: ["Mengambil alih seluruh sesi kelas", "Menjadi fasilitator scaffolding dan menjaga fokus siswa tanpa mengganggu dinamika kelas", "Duduk pasif tanpa mencatat"], correct: 1 }
            ]
        },
        {
            id: "MOD-05",
            number: 5,
            title: "Dukungan Sosial & Regulasi Emosional",
            category: "Psikososial",
            durationHours: 6,
            description: "Teknik de-eskalasi emosi, pencegahan perundungan (anti-bullying), dan fasilitasi lingkaran pertemanan sebaya.",
            lessonContent: `
                <h4>1. De-eskalasi Emosi Positif</h4>
                <p>Kenali *early warning signs* tantrum atau shutdown. Alihkan ke zona tenang, kurangi stimulus suara, dan beri afirmasi tenang.</p>
            `,
            enrolled: 128,
            completed: 88,
            passRate: 85,
            quizQuestions: [
                { q: "Ketika siswa menunjukkan tanda awal sensory overload, tindakan preventif utama adalah:", a: ["Memberikan hukuman kelas", "Membimbing ke sudut tenang (*quiet corner*) dan mereduksi stimulus sensori berlebih", "Memaksa menyelesaikan soal di depan papan tulis"], correct: 1 }
            ]
        },
        {
            id: "MOD-06",
            number: 6,
            title: "Pembelajaran Adaptif & Asisten AI Kelas",
            category: "Teknologi",
            durationHours: 8,
            description: "Pemanfaatan Speech-to-Text, prompt AI untuk simplifikasi modul ajar, Text-to-Speech, dan media interaktif.",
            lessonContent: `
                <h4>1. AI Sebagai Alat Bantu Scaffolding</h4>
                <p>PIB dapat menggunakan Asisten AI untuk mengubah teks bacaan tebal menjadi 3 poin bergambar atau membuat kartu pertanyaan adaptif dalam hitungan detik.</p>
            `,
            enrolled: 128,
            completed: 81,
            passRate: 84,
            quizQuestions: [
                { q: "Bagaimana Asisten AI membantu kerja profesional PIB?", a: ["Menggantikan peran guru dan pendamping", "Menghasilkan alternatif scaffolding materi dan visualisasi instruksi secara instan di lapangan", "Menegakkan diagnosis klinis"], correct: 1 }
            ]
        },
        {
            id: "MOD-07",
            number: 7,
            title: "Praktik Lapangan Terbimbing",
            category: "Praktik",
            durationHours: 10,
            description: "Simulasi pendampingan langsung di sekolah mitra dan observasi reflektif oleh GPK Koordinator.",
            lessonContent: `
                <h4>1. Pencatatan Log Harian Valid</h4>
                <p>Setiap sesi harus mencantumkan tujuan pembelajaran, bentuk modifikasi instruksi yang diterapkan, dan respon kemandirian anak.</p>
            `,
            enrolled: 128,
            completed: 74,
            passRate: 90,
            quizQuestions: [
                { q: "Fokus utama pencatatan sesi pendampingan lapangan adalah:", a: ["Merekam jam kehadiran saja", "Mendokumentasikan kemajuan partisipasi, kemandirian anak, dan catatan adaptasi instruksi", "Menilai angka rapor akhir"], correct: 1 }
            ]
        },
        {
            id: "MOD-08",
            number: 8,
            title: "Asesmen Portofolio & Refleksi Akhir",
            category: "Kelulusan",
            durationHours: 8,
            description: "Evaluasi komprehensif, penyusunan studi kasus nyata, dan penerbitan Sertifikasi Resmi PIB Nasional.",
            lessonContent: `
                <h4>1. Verifikasi Portofolio Akhir</h4>
                <p>GPK Koordinator melakukan validasi bukti karya refleksi dan uji kasus sebelum menerbitkan ID Sertifikasi Nasional.</p>
            `,
            enrolled: 128,
            completed: 68,
            passRate: 88,
            quizQuestions: [
                { q: "Sertifikasi Resmi PIB membuktikan bahwa pendamping:", a: ["Boleh memberikan vonis medis", "Telah memenuhi standar kompetensi nasional dalam memfasilitasi kebutuhan belajar inklusif", "Hanya boleh bertugas secara online"], correct: 1 }
            ]
        }
    ],

    // Certified PIB Directory
    pibs: [
        {
            id: "PIB-001",
            name: "Rina Maharani, S.Pd",
            region: "Sukamaju",
            status: "BERSERTIFIKAT",
            certId: "CERT-PIB-2026-089",
            availability: "TERSEDIA",
            assignedSchool: "SDN Harapan 1",
            assignedSchoolId: "SCH-001",
            studentsCount: 2,
            competencies: ["Autism Spectrum", "Komunikasi Inklusif", "Scaffolding Visual"],
            phone: "0812-3456-7890",
            email: "rina.m@pib.id",
            rating: 4.9,
            sessionsCompleted: 48,
            initials: "RM",
            bgColor: "#DF6E3D"
        },
        {
            id: "PIB-002",
            name: "Ahmad Fauzi, S.Psi",
            region: "Cendekia",
            status: "BERSERTIFIKAT",
            certId: "CERT-PIB-2026-092",
            availability: "TERSEDIA",
            assignedSchool: "SMP Cendekia Inklusi",
            assignedSchoolId: "SCH-002",
            studentsCount: 3,
            competencies: ["ADHD Support", "Regulasi Emosional", "De-eskalasi"],
            phone: "0813-9876-5432",
            email: "ahmad.f@pib.id",
            rating: 4.8,
            sessionsCompleted: 36,
            initials: "AF",
            bgColor: "#8E9F6A"
        },
        {
            id: "PIB-003",
            name: "Dewi Lestari, S.Pd",
            region: "Harapan",
            status: "BERSERTIFIKAT",
            certId: "CERT-PIB-2026-104",
            availability: "SEDANG_BERTUGAS",
            assignedSchool: "SD Harapan Bangsa",
            assignedSchoolId: "SCH-003",
            studentsCount: 1,
            competencies: ["Disleksia", "Bahasa Isyarat", "Literasi Adaptif"],
            phone: "0811-2233-4455",
            email: "dewi.l@pib.id",
            rating: 4.95,
            sessionsCompleted: 52,
            initials: "DL",
            bgColor: "#DF6E3D"
        },
        {
            id: "PIB-004",
            name: "Budi Santoso, S.Pd",
            region: "Sukamaju",
            status: "DALAM_PROGRES",
            certId: null,
            availability: "TERSEDIA",
            assignedSchool: "Menunggu Penempatan",
            assignedSchoolId: null,
            studentsCount: 0,
            competencies: ["Dasar Inklusif", "Sensori Motorik"],
            phone: "0815-6677-8899",
            email: "budi.s@pib.id",
            rating: 4.7,
            sessionsCompleted: 12,
            initials: "BS",
            bgColor: "#8E9F6A"
        }
    ],

    // Partner Schools & Matching Matrix
    schools: [
        {
            id: "SCH-001",
            name: "SDN Harapan 1",
            level: "SD",
            region: "Sukamaju",
            address: "Jl. Pendidikan No. 12, Sukamaju",
            distanceKm: 1.8,
            requiredPIB: 2,
            assignedPIB: 1,
            status: "BUTUH_PENDAMPING",
            studentsCount: 4,
            requiredCompetencies: ["Autism Spectrum", "Komunikasi Inklusif"],
            coordinatorName: "Ibu Nurhayati, S.Pd",
            matchingScore: 92,
            matchingBreakdown: { jarak: 95, kompetensi: 92, jadwal: 90, pengalaman: 91 }
        },
        {
            id: "SCH-002",
            name: "SMP Cendekia Inklusi",
            level: "SMP",
            region: "Cendekia",
            address: "Jl. Merdeka No. 45, Cendekia",
            distanceKm: 3.4,
            requiredPIB: 2,
            assignedPIB: 2,
            status: "TERPENUHI",
            studentsCount: 3,
            requiredCompetencies: ["ADHD Support", "Regulasi Emosional"],
            coordinatorName: "Bpk. Bambang Sutrisno, M.Pd",
            matchingScore: 88,
            matchingBreakdown: { jarak: 84, kompetensi: 90, jadwal: 92, pengalaman: 86 }
        },
        {
            id: "SCH-003",
            name: "SD Harapan Bangsa",
            level: "SD",
            region: "Harapan",
            address: "Jl. Pemuda No. 8, Harapan",
            distanceKm: 2.1,
            requiredPIB: 1,
            assignedPIB: 1,
            status: "TERPENUHI",
            studentsCount: 2,
            requiredCompetencies: ["Disleksia", "Literasi Adaptif"],
            coordinatorName: "Ibu Ratna Juwita, S.Pd",
            matchingScore: 95,
            matchingBreakdown: { jarak: 96, kompetensi: 95, jadwal: 94, pengalaman: 95 }
        },
        {
            id: "SCH-004",
            name: "SMAN 1 Inklusi Sukamaju",
            level: "SMA",
            region: "Sukamaju",
            address: "Jl. Raya Timur No. 102, Sukamaju",
            distanceKm: 4.2,
            requiredPIB: 2,
            assignedPIB: 0,
            status: "BUTUH_PENDAMPING",
            studentsCount: 5,
            requiredCompetencies: ["Autism Spectrum", "ADHD Support", "Scaffolding Visual"],
            coordinatorName: "Drs. Eko Prasetyo",
            matchingScore: 86,
            matchingBreakdown: { jarak: 78, kompetensi: 92, jadwal: 88, pengalaman: 86 }
        }
    ],

    // Daily Assistance Monitoring Sessions
    sessions: [
        {
            id: "SES-001",
            date: "18 Agu 2026",
            time: "08:00 - 10:00",
            pibName: "Rina Maharani, S.Pd",
            schoolName: "SDN Harapan 1",
            className: "Kelas 4A",
            studentName: "Ananda Fikri (Autism Spectrum)",
            activity: "Adaptasi tugas membaca tematik & scaffolding 4 langkah bergambar.",
            notes: "Siswa mampu menyelesaikan 2 dari 3 tugas mandiri dengan bantuan visual schedule.",
            status: "SELESAI",
            verificationStatus: "TERVERIFIKASI"
        },
        {
            id: "SES-002",
            date: "18 Agu 2026",
            time: "10:15 - 12:00",
            pibName: "Ahmad Fauzi, S.Psi",
            schoolName: "SMP Cendekia Inklusi",
            className: "Kelas 7B",
            studentName: "Ananda Bagas (ADHD)",
            activity: "Fasilitasi fokus matematika dengan metode interval 10/2 & sensory timer.",
            notes: "Rentang atensi meningkat menjadi 18 menit tanpa distraksi motorik berlebih.",
            status: "SELESAI",
            verificationStatus: "MENUNGGU_VERIFIKASI"
        },
        {
            id: "SES-003",
            date: "17 Agu 2026",
            time: "08:30 - 11:00",
            pibName: "Dewi Lestari, S.Pd",
            schoolName: "SD Harapan Bangsa",
            className: "Kelas 3C",
            studentName: "Ananda Tiara (Disleksia)",
            activity: "Latihan membaca berpasangan dengan reading guide strip & text-to-speech.",
            notes: "Siswa mengenali pola fonem lebih cepat dan merasa percaya diri di depan kelas.",
            status: "SELESAI",
            verificationStatus: "TERVERIFIKASI"
        }
    ]
};

class SapaStore {
    constructor() {
        this.load();
    }

    load() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (data) {
                this.state = JSON.parse(data);
            } else {
                this.state = JSON.parse(JSON.stringify(INITIAL_STATE));
                this.save();
            }
        } catch (e) {
            console.error("Store error:", e);
            this.state = JSON.parse(JSON.stringify(INITIAL_STATE));
        }
    }

    save() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
            window.dispatchEvent(new CustomEvent('sapa_data_change', { detail: this.state }));
        } catch (e) {
            console.error("Save error:", e);
        }
    }

    reset() {
        this.state = JSON.parse(JSON.stringify(INITIAL_STATE));
        this.save();
    }

    // Authentication Logic
    login(email) {
        const acc = DEMO_ACCOUNTS[email] || {
            role: 'GPK_KOORDINATOR',
            roleLabel: 'GPK Koordinator',
            name: email.split('@')[0].toUpperCase(),
            email: email,
            nip: '19850101 201001 1 001',
            avatarInitials: email.slice(0, 2).toUpperCase(),
            avatarColor: '#DF6E3D',
            institution: 'SAPA Inklusi Mitra'
        };

        this.state.isLoggedIn = true;
        this.state.currentUser = acc;
        this.state.userRole = acc.role;
        this.state.userRoleLabel = acc.roleLabel;
        this.state.userName = acc.name;
        this.save();
        return acc;
    }

    logout() {
        this.state.isLoggedIn = false;
        this.state.currentUser = null;
        this.save();
    }

    // Role
    setRole(roleKey) {
        this.state.userRole = roleKey;
        if (roleKey === 'GPK_KOORDINATOR') {
            this.state.userRoleLabel = 'GPK Koordinator';
            this.state.userName = 'Dr. Sari Wulandari, M.Pd';
        }
        if (roleKey === 'SEKOLAH_MITRA') {
            this.state.userRoleLabel = 'Koordinator Sekolah';
            this.state.userName = 'Ibu Nurhayati, S.Pd';
        }
        if (roleKey === 'DINAS_PENDIDIKAN') {
            this.state.userRoleLabel = 'Pengawas Dinas';
            this.state.userName = 'Drs. Hendra Kusuma, M.Si';
        }
        if (roleKey === 'PIB') {
            this.state.userRoleLabel = 'Pendamping PIB';
            this.state.userName = 'Rina Maharani, S.Pd';
        }
        this.save();
    }

    // Module CRUD
    addModule(mod) {
        const id = "MOD-" + String(this.state.modules.length + 1).padStart(2, '0');
        const newMod = {
            id,
            number: this.state.modules.length + 1,
            enrolled: 128,
            completed: 0,
            passRate: 100,
            lessonContent: `<h4>Materi Pembelajaran Baru</h4><p>${mod.description}</p>`,
            quizQuestions: [
                { q: `Prinsip utama materi ${mod.title}?`, a: ["Penerapan adaptif di kelas", "Pengabaian kebutuhan siswa"], correct: 0 }
            ],
            ...mod
        };
        this.state.modules.push(newMod);
        this.save();
        return newMod;
    }

    // PIB CRUD
    addPIB(pibData) {
        const id = "PIB-" + String(this.state.pibs.length + 1).padStart(3, '0');
        const initials = pibData.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
        const colors = ['#DF6E3D', '#8E9F6A', '#C8592A', '#738350', '#272729'];
        const bgColor = colors[this.state.pibs.length % colors.length];

        const newPIB = {
            id,
            status: "DALAM_PROGRES",
            certId: null,
            availability: "TERSEDIA",
            assignedSchool: "Menunggu Penempatan",
            assignedSchoolId: null,
            studentsCount: 0,
            rating: 5.0,
            sessionsCompleted: 0,
            initials,
            bgColor,
            ...pibData
        };
        this.state.pibs.unshift(newPIB);
        this.state.stats.pibAktif += 1;
        this.save();
        return newPIB;
    }

    // Add School Mitra
    addSchool(schoolData) {
        const id = "SCH-" + String(this.state.schools.length + 1).padStart(3, '0');
        const newSchool = {
            id,
            assignedPIB: 0,
            status: "BUTUH_PENDAMPING",
            priority: "TINGGI",
            distanceKm: 2.5,
            matchingScore: 90,
            matchingBreakdown: { jarak: 90, kompetensi: 90, jadwal: 90, pengalaman: 90 },
            ...schoolData
        };
        this.state.schools.unshift(newSchool);
        this.state.stats.sekolahMitra += 1;
        this.save();
        return newSchool;
    }

    // Assign PIB to School (Matching Engine)
    assignPIB(pibId, schoolId) {
        const pib = this.state.pibs.find(p => p.id === pibId);
        const school = this.state.schools.find(s => s.id === schoolId);
        if (pib && school) {
            pib.assignedSchool = school.name;
            pib.assignedSchoolId = school.id;
            pib.availability = "SEDANG_BERTUGAS";
            school.assignedPIB = (school.assignedPIB || 0) + 1;
            if (school.assignedPIB >= school.requiredPIB) {
                school.status = "TERPENUHI";
            }
            this.save();
            return true;
        }
        return false;
    }

    // Session Recording & Verification
    addSession(sessData) {
        const id = "SES-" + String(this.state.sessions.length + 1).padStart(3, '0');
        const newSession = {
            id,
            date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
            verificationStatus: "MENUNGGU_VERIFIKASI",
            status: "SELESAI",
            ...sessData
        };
        this.state.sessions.unshift(newSession);
        this.state.stats.pendampinganAktif += 1;
        this.save();
        return newSession;
    }

    verifySession(sessionId, approved = true) {
        const sess = this.state.sessions.find(s => s.id === sessionId);
        if (sess) {
            sess.verificationStatus = approved ? "TERVERIFIKASI" : "DITOLAK";
            if (sess.status === "BERLANGSUNG") sess.status = "SELESAI";
            this.save();
            return true;
        }
        return false;
    }

    verifyAllPending() {
        let count = 0;
        this.state.sessions.forEach(s => {
            if (s.verificationStatus === 'MENUNGGU_VERIFIKASI') {
                s.verificationStatus = 'TERVERIFIKASI';
                if (s.status === 'BERLANGSUNG') s.status = 'SELESAI';
                count++;
            }
        });
        if (count > 0) this.save();
        return count;
    }

    // AI Adaptive Responses Logic
    generateAI(prompt) {
        const q = prompt.toLowerCase();
        if (q.includes("sederhanakan") || q.includes("instruksi") || q.includes("tugas")) {
            return "📘 **Instruksi yang Disederhanakan (Format 4 Langkah Visual):**\n\n1. 📖 **Buka Halaman 24** buku tematik.\n2. ✏️ **Pilih 2 soal** yang ada gambar buah.\n3. 🎨 **Beri warna hijau** pada jawaban yang benar.\n4. ✋ **Angkat kartu jempol** jika sudah selesai.";
        } else if (q.includes("adhd") || q.includes("fokus") || q.includes("diam") || q.includes("gerak")) {
            return "💡 **Strategi Belajar Adaptif untuk Siswa ADHD:**\n\n• **Interval 10/2**: 10 menit aktivitas terstruktur + 2 menit peregangan fisik.\n• **Fidget Band**: Pasang karet elastis di kaki kursi untuk menyalurkan energi motorik.\n• **Visual Timer**: Gunakan jam pasir warna agar siswa memahami batasan waktu.";
        } else if (q.includes("autis") || q.includes("sensorik") || q.includes("overload")) {
            return "🧩 **Protokol De-eskalasi & Regulasi Sensori (Autism Spectrum):**\n\n• Segera bimbing siswa ke sudut tenang (*quiet corner*).\n• Berikan penutup telinga (*noise-cancelling headphones*) jika bising.\n• Gunakan kartu komunikasi visual 'Saya Butuh Istirahat' tanpa memaksa kontak mata.";
        } else if (q.includes("disleksia") || q.includes("baca") || q.includes("huruf")) {
            return "🔤 **Dukungan Pembelajaran Disleksia:**\n\n• Gunakan font berjarak longgar (seperti OpenDyslexic / sans-serif).\n• Beri penggaris warna (*reading guide strip*) untuk memandu baris teks.\n• Izinkan perekaman suara atau Text-to-Speech untuk pemahaman materi panjang.";
        } else if (q.includes("wicara") || q.includes("bicara") || q.includes("komunikasi") || q.includes("pecs")) {
            return "🗣️ **Protokol Komunikasi PECS & Bahasa Visual:**\n\n• Sediakan papan pilihan gambar (*choice board*) dengan 4 simbol kata kerja dasar.\n• Berikan jeda 5 detik (*wait time*) setelah bertanya sebelum mengulang pertanyaan.\n• Gunakan gestur tangan penjelas bersamaan dengan kata kunci verbal.";
        } else if (q.includes("down syndrome") || q.includes("motorik") || q.includes("tulis")) {
            return "🌟 **Akomodasi Pembelajaran Siswa Down Syndrome:**\n\n• Gunakan pegangan pensil segitiga (*pencil grip*) untuk mempermudah motorik halus.\n• Sajikan konsep matematika dengan benda konkret (kancing warna / balok hitung).\n• Berikan penguatan verbal positif (*positive praise*) setiap menyelesaikan satu sub-langkah.";
        } else {
            return "✨ **Rekomendasi Pembelajaran Inklusif Terpadu:**\n\nInstruksi dapat dipecah menjadi unit-unit kecil (*chunking*). Berikan penguatan positif instan (token bintang) dan pastikan materi disajikan dalam format multisensori (audio + visual + kinestetik).";
        }
    }

    // Export Data Helper
    exportToCSV(type = 'sessions') {
        let csvContent = "data:text/csv;charset=utf-8,";
        if (type === 'sessions') {
            csvContent += "ID,Tanggal,Jam,Nama PIB,Sekolah,Kelas,Siswa,Aktivitas,Status,Verifikasi\n";
            this.state.sessions.forEach(s => {
                csvContent += `"${s.id}","${s.date}","${s.time}","${s.pibName}","${s.schoolName}","${s.className}","${s.studentName}","${s.activity}","${s.status}","${s.verificationStatus}"\n`;
            });
        } else if (type === 'pib') {
            csvContent += "ID,Nama,Wilayah,Status Sertifikasi,Ketersediaan,Penempatan,Rating,Sesi Selesai\n";
            this.state.pibs.forEach(p => {
                csvContent += `"${p.id}","${p.name}","${p.region}","${p.status}","${p.availability}","${p.assignedSchool}","${p.rating}","${p.sessionsCompleted}"\n`;
            });
        }
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `SAPA_Inklusi_${type}_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Hybrid Backend API Sync
    async syncWithBackend() {
        try {
            const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET', signal: AbortSignal.timeout(1200) });
            if (res.ok) {
                console.log('⚡ SAPA Inklusi Backend API connected successfully!');
                const [pibRes, schoolRes, sessionRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/pib`).then(r => r.json()).catch(() => null),
                    fetch(`${API_BASE_URL}/schools`).then(r => r.json()).catch(() => null),
                    fetch(`${API_BASE_URL}/sessions`).then(r => r.json()).catch(() => null)
                ]);

                if (pibRes && pibRes.data) this.state.pibs = pibRes.data;
                if (schoolRes && schoolRes.data) this.state.schools = schoolRes.data;
                if (sessionRes && sessionRes.data) this.state.sessions = sessionRes.data;
                this.save();
                return true;
            }
        } catch (e) {
            // Silently fallback to offline localStorage mode
            console.log('ℹ️ Running in standalone static client mode (Offline / GitHub Pages / Vercel)');
            return false;
        }
    }
}

window.store = new SapaStore();
window.DEMO_ACCOUNTS = DEMO_ACCOUNTS;
