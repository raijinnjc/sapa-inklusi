/**
 * SAPA INKLUSI - Core State Store (PRD v1.0 Compliant)
 * Author: Antigravity AI Engine
 * Hybrid Support: Works both fully standalone offline (GitHub Pages) & with REST API Backend
 */

const STORAGE_KEY = 'SAPA_INKLUSI_MASTER_V2';
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
        avatarColor: '#C85A32',
        institution: 'Pusat Layanan Inklusif Wilayah'
    },
    'sekolah@sapa.id': {
        role: 'SEKOLAH_MITRA',
        roleLabel: 'Koordinator Sekolah Mitra',
        name: 'Ibu Nurhayati, S.Pd',
        email: 'sekolah@sapa.id',
        nip: '19880112 201101 2 004',
        avatarInitials: 'NH',
        avatarColor: '#5B6E43',
        institution: 'SDN Harapan 1 Sukamaju'
    },
    'dinas@sapa.id': {
        role: 'DINAS_PENDIDIKAN',
        roleLabel: 'Pengawas Dinas Pendidikan',
        name: 'Drs. Hendra Kusuma, M.Si',
        email: 'dinas@sapa.id',
        nip: '19750918 199903 1 002',
        avatarInitials: 'HK',
        avatarColor: '#E29547',
        institution: 'Dinas Pendidikan Jawa Barat'
    },
    'pib@sapa.id': {
        role: 'PIB',
        roleLabel: 'Pendamping Inklusi Bersertifikat',
        name: 'Rina Maharani, S.Pd',
        email: 'pib@sapa.id',
        nip: 'PIB-2026-089',
        avatarInitials: 'RM',
        avatarColor: '#C85A32',
        institution: 'Ikatan Pendamping Inklusi'
    }
};

const INITIAL_STATE = {
    isLoggedIn: false,
    currentUser: null,
    userRole: 'GPK_KOORDINATOR',
    userName: 'Dr. Sari Wulandari, M.Pd',
    userRoleLabel: 'GPK Koordinator',
    
    // Filters State
    filters: {
        wilayah: 'ALL',
        jenjang: 'ALL',
        periode: '2026-S1'
    },

    // Core KPIs
    stats: {
        pibAktif: 128,
        sekolahMitra: 46,
        pendampinganAktif: 92,
        anakDidampingi: 214,
        northStarMetric: 73.9 // % Sekolah Mitra dengan PIB aktif & pencatatan konsisten
    },
    
    // 8 Standard PRD Modules with Deep Learning Lessons
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
                <p>Pendidikan inklusif adalah sistem penyelenggaraan pendidikan yang memberikan kesempatan kepada semua peserta didik yang memiliki kelainan dan memiliki potensi kecerdasan dan/atau bakat istimewa untuk mengikuti pendidikan atau pembelajaran dalam satu lingkungan pendidikan secara bersama-sama dengan peserta didik pada umumnya.</p>
                <h4>2. Prinsip Non-Diskriminasi</h4>
                <p>Sekolah reguler wajib melakukan akomodasi yang layak (*reasonable accommodation*) mencakup modifikasi kurikulum, sarana prasarana, dan pendampingan individu.</p>
            `,
            enrolled: 128,
            completed: 128,
            passRate: 98,
            quizQuestions: [
                { q: "Apa prinsip utama akomodasi yang layak dalam pendidikan inklusif?", a: ["Menyesuaikan lingkungan dan instruksi agar ramah bagi semua ragam peserta didik", "Memisahkan kelas berdasarkan IQ", "Mengharuskan anak mengikuti standar tunggal tanpa bantuan"], correct: 0 }
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
            rating: 4.9,
            sessionsCompleted: 48,
            competencies: ["Autism Spectrum", "Komunikasi Inklusif", "Manajemen Perilaku"],
            phone: "+62 812-3456-7890",
            email: "rina.maharani@pib.id",
            initials: "RM",
            bgColor: "#C85A32"
        },
        {
            id: "PIB-002",
            name: "Andi Pratama, S.Psi",
            region: "Cendekia",
            status: "BERSERTIFIKAT",
            certId: "CERT-PIB-2026-092",
            availability: "SEDANG_BERTUGAS",
            assignedSchool: "SDN Mekarjaya 2",
            assignedSchoolId: "SCH-002",
            studentsCount: 1,
            rating: 4.8,
            sessionsCompleted: 36,
            competencies: ["ADHD Support", "Pendampingan Akademik", "Regulasi Emosi"],
            phone: "+62 813-9876-5432",
            email: "andi.pratama@pib.id",
            initials: "AP",
            bgColor: "#5B6E43"
        },
        {
            id: "PIB-003",
            name: "Budi Santoso, S.Pd",
            region: "Harapan",
            status: "BERSERTIFIKAT",
            certId: "CERT-PIB-2026-104",
            availability: "TERSEDIA",
            assignedSchool: "SMPN 4 Cendekia",
            assignedSchoolId: "SCH-003",
            studentsCount: 2,
            rating: 5.0,
            sessionsCompleted: 62,
            competencies: ["Disleksia", "Keterampilan Sosial", "Bahasa Isyarat"],
            phone: "+62 821-4455-6677",
            email: "budi.santoso@pib.id",
            initials: "BS",
            bgColor: "#E29547"
        },
        {
            id: "PIB-004",
            name: "Siti Aisyah, S.Pd.I",
            region: "Merdeka",
            status: "DALAM_PROGRES",
            certId: null,
            availability: "TERSEDIA",
            assignedSchool: "Menunggu Penempatan",
            assignedSchoolId: null,
            studentsCount: 0,
            rating: 4.7,
            sessionsCompleted: 14,
            competencies: ["Sensory Integration", "Komunikasi Visual"],
            phone: "+62 857-1122-3344",
            email: "siti.aisyah@pib.id",
            initials: "SA",
            bgColor: "#656A73"
        },
        {
            id: "PIB-005",
            name: "Fajar Nugraha, S.Pd",
            region: "Sukamaju",
            status: "BERSERTIFIKAT",
            certId: "CERT-PIB-2026-118",
            availability: "TERSEDIA",
            assignedSchool: "Menunggu Penempatan",
            assignedSchoolId: null,
            studentsCount: 0,
            rating: 4.9,
            sessionsCompleted: 28,
            competencies: ["Autism Spectrum", "Alat Bantu Visual", "Sensory Integration"],
            phone: "+62 812-7788-9900",
            email: "fajar.nugraha@pib.id",
            initials: "FN",
            bgColor: "#2E6F40"
        }
    ],

    // School Partners & Matching Matrix
    schools: [
        {
            id: "SCH-001",
            name: "SDN Harapan 1",
            region: "Sukamaju",
            level: "SD",
            requiredPIB: 2,
            assignedPIB: 1,
            status: "BUTUH_PENDAMPING",
            priority: "TINGGI",
            studentsCount: 14,
            distanceKm: 1.8,
            matchingScore: 92,
            matchingBreakdown: { jarak: 95, kompetensi: 92, jadwal: 90, pengalaman: 90 },
            requiredCompetencies: ["Autism Spectrum", "Komunikasi Inklusif"],
            coordinatorName: "Ibu Nurhayati, S.Pd",
            address: "Jl. Pendidikan No. 12, Sukamaju",
            schedule: "Senin - Jumat (07.30 - 12.00)"
        },
        {
            id: "SCH-002",
            name: "SDN Mekarjaya 2",
            region: "Harapan",
            level: "SD",
            requiredPIB: 1,
            assignedPIB: 1,
            status: "TERPENUHI",
            priority: "SEDANG",
            studentsCount: 8,
            distanceKm: 3.4,
            matchingScore: 88,
            matchingBreakdown: { jarak: 85, kompetensi: 90, jadwal: 90, pengalaman: 86 },
            requiredCompetencies: ["ADHD Support", "Pendampingan Akademik"],
            coordinatorName: "Bapak Hendra, M.Pd",
            address: "Jl. Melati No. 45, Harapan",
            schedule: "Senin - Kamis (08.00 - 12.30)"
        },
        {
            id: "SCH-003",
            name: "SMPN 4 Cendekia",
            region: "Cendekia",
            level: "SMP",
            requiredPIB: 2,
            assignedPIB: 2,
            status: "TERPENUHI",
            priority: "RENDAH",
            studentsCount: 18,
            distanceKm: 4.1,
            matchingScore: 85,
            matchingBreakdown: { jarak: 80, kompetensi: 88, jadwal: 85, pengalaman: 88 },
            requiredCompetencies: ["Keterampilan Sosial", "Manajemen Perilaku"],
            coordinatorName: "Ibu Rahmawati, S.Pd",
            address: "Jl. Cendekia Raya No. 88",
            schedule: "Senin - Jumat (07.00 - 13.30)"
        },
        {
            id: "SCH-004",
            name: "SMPN 2 Karang Sari",
            region: "Karang Sari",
            level: "SMP",
            requiredPIB: 1,
            assignedPIB: 0,
            status: "BUTUH_PENDAMPING",
            priority: "SEDANG",
            studentsCount: 6,
            distanceKm: 2.7,
            matchingScore: 89,
            matchingBreakdown: { jarak: 90, kompetensi: 90, jadwal: 88, pengalaman: 86 },
            requiredCompetencies: ["Disleksia", "Pembelajaran Adaptif"],
            coordinatorName: "Bapak Agus, S.Pd",
            address: "Jl. Beringin No. 19, Karang Sari",
            schedule: "Senin - Jumat (07.30 - 13.00)"
        },
        {
            id: "SCH-005",
            name: "SMAN 1 Bakti",
            region: "Merdeka",
            level: "SMA",
            requiredPIB: 2,
            assignedPIB: 1,
            status: "BUTUH_PENDAMPING",
            priority: "SEDANG",
            studentsCount: 10,
            distanceKm: 3.1,
            matchingScore: 87,
            matchingBreakdown: { jarak: 88, kompetensi: 86, jadwal: 85, pengalaman: 89 },
            requiredCompetencies: ["Manajemen Perilaku", "Dukungan Sosial"],
            coordinatorName: "Dra. Farida, M.Pd",
            address: "Jl. Pemuda No. 7, Merdeka",
            schedule: "Senin - Jumat (07.00 - 14.00)"
        }
    ],

    // Assistance Sessions & Logs
    sessions: [
        {
            id: "SES-01",
            date: "2026-08-18",
            time: "08:00 - 10:00",
            pibName: "Rina Maharani, S.Pd",
            pibId: "PIB-001",
            schoolName: "SDN Harapan 1",
            schoolId: "SCH-001",
            className: "Kelas 4A",
            studentName: "Ananda Fikri (Autism Spectrum)",
            activity: "Matematika Pecahan Adaptif",
            notes: "Instruksi disederhanakan dengan kartu pecahan visual. Fokus meningkat 20 menit tanpa tantrum.",
            status: "BERLANGSUNG",
            verificationStatus: "MENUNGGU_VERIFIKASI"
        },
        {
            id: "SES-02",
            date: "2026-08-18",
            time: "07:30 - 09:30",
            pibName: "Budi Santoso, S.Pd",
            pibId: "PIB-003",
            schoolName: "SMPN 4 Cendekia",
            schoolId: "SCH-003",
            className: "Kelas 7B",
            studentName: "Ananda Dimas (ADHD)",
            activity: "Keterampilan Sosial Dinamika Kelompok",
            notes: "Latihan kerja kelompok IPA. Menggunakan teknik jeda sensorik 2 menit secara efektif.",
            status: "SELESAI",
            verificationStatus: "TERVERIFIKASI"
        },
        {
            id: "SES-03",
            date: "2026-08-17",
            time: "09:00 - 11:00",
            pibName: "Andi Pratama, S.Psi",
            pibId: "PIB-002",
            schoolName: "SDN Mekarjaya 2",
            schoolId: "SCH-002",
            className: "Kelas 5B",
            studentName: "Ananda Rehan (Disleksia)",
            activity: "Literasi Membaca Bersuara Adaptif",
            notes: "Menggunakan kartu fonem warna-warni dan bantuan text-to-speech.",
            status: "SELESAI",
            verificationStatus: "TERVERIFIKASI"
        }
    ],

    // Longitudinal Outcome Records (Semester 1)
    outcome: {
        months: ["Januari", "Februari", "Maret", "April", "Mei", "Juni"],
        overallScores: [62, 65, 69, 72, 76, 79],
        indicators: {
            komunikasi: 78,
            partisipasi: 82,
            kemandirian: 75,
            interaksiSosial: 80
        }
    }
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
            avatarColor: '#C85A32',
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
        const colors = ['#C85A32', '#5B6E43', '#E29547', '#3B6082', '#6D5B8E', '#2E6F40'];
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
        this.state.stats.pibAktif = this.state.pibs.length;
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
        this.state.stats.sekolahMitra = this.state.schools.length;
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
        const id = "SES-" + String(this.state.sessions.length + 1).padStart(2, '0');
        const newSess = {
            id,
            date: new Date().toISOString().slice(0, 10),
            status: "BERLANGSUNG",
            verificationStatus: "MENUNGGU_VERIFIKASI",
            ...sessData
        };
        this.state.sessions.unshift(newSess);
        this.save();
        return newSess;
    }

    verifySession(sessionId, isApproved = true) {
        const sess = this.state.sessions.find(s => s.id === sessionId);
        if (sess) {
            sess.verificationStatus = isApproved ? "TERVERIFIKASI" : "DITOLAK";
            if (isApproved && sess.status === 'BERLANGSUNG') {
                sess.status = 'SELESAI';
            }
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

    // AI Responses Logic
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
        } else {
            return "✨ **Rekomendasi Pembelajaran Inklusif:**\n\nInstruksi dapat dipecah menjadi unit-unit kecil (*chunking*). Berikan penguatan positif instan (token bintang) dan pastikan materi disajikan dalam format multisensori (audio + visual + kinestetik).";
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
            console.log('ℹ️ Running in standalone static client mode (Offline / GitHub Pages)');
            return false;
        }
    }
}

window.store = new SapaStore();
window.DEMO_ACCOUNTS = DEMO_ACCOUNTS;
