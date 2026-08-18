/**
 * SAPA INKLUSI - Core Data Store & Business Logic Engine
 * Version: 1.0 (Based on PRD v1.0)
 */

const STORAGE_KEY = 'SAPA_INKLUSI_STATE_V1';

// Initial Mock State strictly matching PRD definitions
const DEFAULT_STATE = {
    currentUser: {
        id: "USR-001",
        name: "Dr. Sari Wulandari",
        role: "GPK_KOORDINATOR", // GPK_KOORDINATOR | SEKOLAH_MITRA | DINAS_PENDIDIKAN | PIB
        location: "DKI Jakarta & Jawa Barat",
        status: "ACTIVE"
    },
    modules: [
        {
            id: "MOD-01",
            number: 1,
            name: "Dasar Pendidikan Inklusif",
            description: "Prinsip dasar, filosofi, dan regulasi pendidikan inklusif di Indonesia.",
            duration: 6,
            enrolledCount: 128,
            completedCount: 128,
            passRate: 98,
            status: "ACTIVE",
            assessment: "15 Soal Pilihan Ganda & Studi Kasus"
        },
        {
            id: "MOD-02",
            number: 2,
            name: "Memahami Anak Berkebutuhan Khusus",
            description: "Karakteristik spektrum autisme, ADHD, disleksia, dan hambatan sensori.",
            duration: 8,
            enrolledCount: 128,
            completedCount: 115,
            passRate: 92,
            status: "ACTIVE",
            assessment: "20 Soal Pilihan Ganda & Identifikasi Kasus"
        },
        {
            id: "MOD-03",
            number: 3,
            name: "Komunikasi Inklusif",
            description: "Strategi komunikasi verbal, visual, dan bahasa isyarat dasar adaptif.",
            duration: 6,
            enrolledCount: 128,
            completedCount: 102,
            passRate: 89,
            status: "ACTIVE",
            assessment: "Simulasi Video & Asesmen Tertulis"
        },
        {
            id: "MOD-04",
            number: 4,
            name: "Strategi Pendampingan di Kelas Reguler",
            description: "Kolaborasi dengan guru kelas, akomodasi kurikulum, dan manajemen fokus.",
            duration: 8,
            enrolledCount: 128,
            completedCount: 94,
            passRate: 87,
            status: "ACTIVE",
            assessment: "Perancangan Rencana Pendampingan Individual (PPI)"
        },
        {
            id: "MOD-05",
            number: 5,
            name: "Dukungan Sosial dan Emosional",
            description: "Regulasi emosi, pencegahan bullying, dan penanganan sensory overload.",
            duration: 6,
            enrolledCount: 128,
            completedCount: 88,
            passRate: 85,
            status: "ACTIVE",
            assessment: "Studi Kasus De-eskalasi Krisis Emosional"
        },
        {
            id: "MOD-06",
            number: 6,
            name: "Strategi Pembelajaran Adaptif",
            description: "Penyederhanaan instruksi, bahan ajar adaptif, dan integrasi Asisten AI.",
            duration: 8,
            enrolledCount: 128,
            completedCount: 81,
            passRate: 84,
            status: "ACTIVE",
            assessment: "Praktik Penggunaan Prompt AI Inklusi"
        },
        {
            id: "MOD-07",
            number: 7,
            name: "Praktik Pendampingan",
            description: "Simulasi lapangan dan pendampingan terbimbing di sekolah mitra.",
            duration: 10,
            enrolledCount: 128,
            completedCount: 74,
            passRate: 90,
            status: "ACTIVE",
            assessment: "Evaluasi Observasi Langsung GPK"
        },
        {
            id: "MOD-08",
            number: 8,
            name: "Asesmen dan Refleksi",
            description: "Ujian komprehensif akhir, portofolio refleksi, dan sertifikasi resmi.",
            duration: 8,
            enrolledCount: 128,
            completedCount: 68,
            passRate: 88,
            status: "ACTIVE",
            assessment: "Ujian Komprehensif Sertifikasi Nasional"
        }
    ],
    pibList: [
        {
            id: "PIB-001",
            name: "Rina Maharani, S.Pd",
            region: "Sukamaju",
            certificationStatus: "BERSERTIFIKAT",
            certificateId: "CERT-PIB-2026-089",
            competencies: ["Komunikasi Inklusif", "Manajemen Perilaku", "Autism Spectrum"],
            assignedSchoolId: "SCH-001",
            assignedSchoolName: "SDN Harapan 1",
            assignedStudentsCount: 2,
            status: "AKTIF",
            availability: "TERSEDIA", // TERSEDIA | SEDANG_BERTUGAS | TIDAK_TERSEDIA
            progress: 100,
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5L3mOQy1j4sVWiKcN0ljUygLG4eXMWja-rVITlKxC2XxU5v2dD2uOTkv6dAgPy29yAdpWzWhzYmj18ZMYIDejrh6iiWmddfkC_2lLb9kyO2vMVa4GUqkuugOw0e__d6H6_IbYsCvCXE04Sww7GoNPPnGCKB3MPyQ7PoErT8aj9C8qRwsDAbx-MWpt8Ho8UiT-8bCt46uivcxN8Jqs5XrOFrf9_a-Vf5KIX4DoJD4BBNFI525EQSH9",
            recentActivity: "Sesi selesai di Kelas 4A (Matematika)",
            phone: "+62 812-3456-7890"
        },
        {
            id: "PIB-002",
            name: "Andi Pratama, S.Psi",
            region: "Cendekia",
            certificationStatus: "BERSERTIFIKAT",
            certificateId: "CERT-PIB-2026-092",
            competencies: ["Pendampingan Akademik", "ADHD Support", "Dukungan Emosional"],
            assignedSchoolId: "SCH-002",
            assignedSchoolName: "SDN Mekarjaya 2",
            assignedStudentsCount: 1,
            status: "AKTIF",
            availability: "SEDANG_BERTUGAS",
            progress: 100,
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAmgUfox9wVCA6J93YwsfOC4SBEb8CtmO_AuLLjSwCGPIpU2iQBLW6Nm0rsFEP9lrfc8B2XOvL2TGhwELB_HetJc3xoaMgQ0KerkJjPgAYgfQFD8farvkWWEzUTAVWYLQcNRtTv8dvmqJ9ADqUTNIJ0Dwqr3HsDk8ukeiRGWIvdNcBdcnCWmVGVgY4F_f2tqpwa_TMKrB1StdrccpWNeEhQ0IYChDpBbzotE23HKJBsQhRkb4wi7RS7",
            recentActivity: "Pendampingan membaca adaptif di Kelas 5B",
            phone: "+62 813-9876-5432"
        },
        {
            id: "PIB-003",
            name: "Budi Santoso, S.Pd",
            region: "Harapan",
            certificationStatus: "BERSERTIFIKAT",
            certificateId: "CERT-PIB-2026-104",
            competencies: ["Keterampilan Sosial", "Disleksia", "Bahasa Isyarat Dasar"],
            assignedSchoolId: "SCH-003",
            assignedSchoolName: "SDN Inklusi 2",
            assignedStudentsCount: 2,
            status: "AKTIF",
            availability: "TERSEDIA",
            progress: 95,
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFN_p-AXWMbq3kPQAyCtCiOC0WXzIbE21q6fGqEGjIYSGH9EMMHHsvhHZ5W-CxiIla1hsHEX5fMIA1B1xP8w12mhjc1VJzxeRcQAJ3YckWsEdqx-VfmIuLMHikWf4Oi3eVwEls1jNWwN_15ZpeGUZSwkmUWKVqgNvkRiSErqtRdib0gvLgHOsJR9zXn3gVfRRAjB8syPi9jK7P5dcI5JE2zbFN9FEoZJgDFnqoMnj96YD0BaR8zZxq",
            recentActivity: "Latihan interaksi kelompok Kelas 5B",
            phone: "+62 821-4455-6677"
        },
        {
            id: "PIB-004",
            name: "Siti Aisyah, S.Pd.I",
            region: "Merdeka",
            certificationStatus: "DALAM_PROGRES",
            certificateId: null,
            competencies: ["Terapi Wicara Dasar", "Sensory Integration"],
            assignedSchoolId: null,
            assignedSchoolName: "Menunggu Penugasan",
            assignedStudentsCount: 0,
            status: "AKTIF",
            availability: "TERSEDIA",
            progress: 82,
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5L3mOQy1j4sVWiKcN0ljUygLG4eXMWja-rVITlKxC2XxU5v2dD2uOTkv6dAgPy29yAdpWzWhzYmj18ZMYIDejrh6iiWmddfkC_2lLb9kyO2vMVa4GUqkuugOw0e__d6H6_IbYsCvCXE04Sww7GoNPPnGCKB3MPyQ7PoErT8aj9C8qRwsDAbx-MWpt8Ho8UiT-8bCt46uivcxN8Jqs5XrOFrf9_a-Vf5KIX4DoJD4BBNFI525EQSH9",
            recentActivity: "Menyelesaikan Modul 6 Pembelajaran Adaptif",
            phone: "+62 857-1122-3344"
        }
    ],
    schools: [
        {
            id: "SCH-001",
            name: "SDN Harapan 1",
            region: "Sukamaju",
            level: "SD",
            requiredPIB: 2,
            assignedPIB: 1,
            status: "BUTUH_PENDAMPING", // TERPENUHI | BUTUH_PENDAMPING
            priority: "TINGGI", // TINGGI | SEDANG | RENDAH
            studentsCount: 14,
            coordinatorName: "Ibu Nurhayati, S.Pd",
            schedule: "Senin - Jumat (07.30 - 12.00)",
            lat: -6.2912,
            lng: 106.8214,
            distanceKm: 1.8,
            matchingScore: 92,
            requiredCompetencies: ["Komunikasi Inklusif", "Autism Spectrum"],
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2C9EQ1-ZAo0fi2a1ndFlstd4cObRQa5Y1daFnvwdEQ_CW9A87d3kbQBkQE9rF5G1oDhlCwdHz_2yNs8vSB1tPulIJqmABo3wudnd6108fFh1Iekqw6iPY8gRvomGQS2RDBPpzdXs53e4ssSQLZwcucCLL0Yr_0PR7l6iJwBHjI7Nth3vp7RTyCjWO23LKod0MRL8NpNQwnPq6vXb920sRLAJRZts4L02ivCbljC0sfB0kwERrBYTM"
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
            coordinatorName: "Bapak Hendra, M.Pd",
            schedule: "Senin - Kamis (08.00 - 12.30)",
            lat: -6.2845,
            lng: 106.8340,
            distanceKm: 3.4,
            matchingScore: 88,
            requiredCompetencies: ["ADHD Support", "Pendampingan Akademik"],
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2C9EQ1-ZAo0fi2a1ndFlstd4cObRQa5Y1daFnvwdEQ_CW9A87d3kbQBkQE9rF5G1oDhlCwdHz_2yNs8vSB1tPulIJqmABo3wudnd6108fFh1Iekqw6iPY8gRvomGQS2RDBPpzdXs53e4ssSQLZwcucCLL0Yr_0PR7l6iJwBHjI7Nth3vp7RTyCjWO23LKod0MRL8NpNQwnPq6vXb920sRLAJRZts4L02ivCbljC0sfB0kwERrBYTM"
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
            coordinatorName: "Ibu Rahmawati, S.Pd",
            schedule: "Senin - Jumat (07.00 - 13.30)",
            lat: -6.2750,
            lng: 106.8450,
            distanceKm: 4.1,
            matchingScore: 85,
            requiredCompetencies: ["Keterampilan Sosial", "Manajemen Perilaku"],
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2C9EQ1-ZAo0fi2a1ndFlstd4cObRQa5Y1daFnvwdEQ_CW9A87d3kbQBkQE9rF5G1oDhlCwdHz_2yNs8vSB1tPulIJqmABo3wudnd6108fFh1Iekqw6iPY8gRvomGQS2RDBPpzdXs53e4ssSQLZwcucCLL0Yr_0PR7l6iJwBHjI7Nth3vp7RTyCjWO23LKod0MRL8NpNQwnPq6vXb920sRLAJRZts4L02ivCbljC0sfB0kwERrBYTM"
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
            coordinatorName: "Bapak Agus, S.Pd",
            schedule: "Senin - Jumat (07.30 - 13.00)",
            lat: -6.2990,
            lng: 106.8120,
            distanceKm: 2.7,
            matchingScore: 89,
            requiredCompetencies: ["Disleksia", "Pembelajaran Adaptif"],
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2C9EQ1-ZAo0fi2a1ndFlstd4cObRQa5Y1daFnvwdEQ_CW9A87d3kbQBkQE9rF5G1oDhlCwdHz_2yNs8vSB1tPulIJqmABo3wudnd6108fFh1Iekqw6iPY8gRvomGQS2RDBPpzdXs53e4ssSQLZwcucCLL0Yr_0PR7l6iJwBHjI7Nth3vp7RTyCjWO23LKod0MRL8NpNQwnPq6vXb920sRLAJRZts4L02ivCbljC0sfB0kwERrBYTM"
        },
        {
            id: "SCH-005",
            name: "SMAN 1 Bakti",
            region: "Bakti Jaya",
            level: "SMA",
            requiredPIB: 1,
            assignedPIB: 0,
            status: "BUTUH_PENDAMPING",
            priority: "SEDANG",
            studentsCount: 9,
            coordinatorName: "Ibu Dra. Lilis",
            schedule: "Senin - Jumat (07.00 - 14.00)",
            lat: -6.3100,
            lng: 106.8390,
            distanceKm: 5.2,
            matchingScore: 81,
            requiredCompetencies: ["Dukungan Emosional", "Keterampilan Sosial"],
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2C9EQ1-ZAo0fi2a1ndFlstd4cObRQa5Y1daFnvwdEQ_CW9A87d3kbQBkQE9rF5G1oDhlCwdHz_2yNs8vSB1tPulIJqmABo3wudnd6108fFh1Iekqw6iPY8gRvomGQS2RDBPpzdXs53e4ssSQLZwcucCLL0Yr_0PR7l6iJwBHjI7Nth3vp7RTyCjWO23LKod0MRL8NpNQwnPq6vXb920sRLAJRZts4L02ivCbljC0sfB0kwERrBYTM"
        }
    ],
    sessions: [
        {
            id: "SES-2026-0818-01",
            date: "2026-08-18",
            time: "08:00 - 10:00",
            pibId: "PIB-001",
            pibName: "Rina Maharani, S.Pd",
            schoolId: "SCH-001",
            schoolName: "SDN Harapan 1",
            className: "Kelas 4A",
            activity: "Matematika Inklusi & Panduan Fokus",
            studentName: "Ananda Fikri (Autism Spectrum)",
            status: "BERLANGSUNG", // TERJADWAL | BERLANGSUNG | SELESAI | TERTUNDA
            verificationStatus: "MENUNGGU_VERIFIKASI", // MENUNGGU_VERIFIKASI | TERVERIFIKASI | DITOLAK
            notes: "Siswa mampu menyelesaikan 4 dari 5 soal pecahan visual setelah instruksi disederhanakan dengan Asisten AI.",
            timestamp: "2026-08-18T08:00:00Z"
        },
        {
            id: "SES-2026-0818-02",
            date: "2026-08-18",
            time: "07:30 - 09:30",
            pibId: "PIB-003",
            pibName: "Budi Santoso, S.Pd",
            schoolId: "SCH-003",
            schoolName: "SDN Inklusi 2",
            className: "Kelas 5B",
            activity: "Keterampilan Sosial & Dinamika Kelompok",
            studentName: "Ananda Dimas (ADHD)",
            status: "SELESAI",
            verificationStatus: "TERVERIFIKASI",
            notes: "Interaksi kelompok berjalan baik. Berhasil meredam impulse behaviour dengan teknik jeda 3 menit.",
            timestamp: "2026-08-18T07:30:00Z"
        },
        {
            id: "SES-2026-0818-03",
            date: "2026-08-18",
            time: "10:00 - 11:30",
            pibId: "PIB-004",
            pibName: "Siti Aisyah, S.Pd.I",
            schoolId: "SCH-002",
            schoolName: "SDN Merdeka 3",
            className: "Kelas 2C",
            activity: "Terapi Wicara Dasar & Pengenalan Fonem",
            studentName: "Ananda Nayla",
            status: "TERTUNDA",
            verificationStatus: "MENUNGGU_VERIFIKASI",
            notes: "Sesi dijadwalkan ulang karena siswa sakit.",
            timestamp: "2026-08-18T10:00:00Z"
        },
        {
            id: "SES-2026-0817-01",
            date: "2026-08-17",
            time: "09:00 - 11:00",
            pibId: "PIB-002",
            pibName: "Andi Pratama, S.Psi",
            schoolId: "SCH-001",
            schoolName: "SDN Harapan 1",
            className: "Kelas 6A",
            activity: "Observasi Perilaku & Adaptasi Baca",
            studentName: "Ananda Rehan (Disleksia)",
            status: "SELESAI",
            verificationStatus: "TERVERIFIKASI",
            notes: "Menggunakan kartu visual bergambar untuk materi IPA siklus air.",
            timestamp: "2026-08-17T09:00:00Z"
        }
    ],
    outcomes: {
        longitudinal: [
            { month: "Januari", score: 62 },
            { month: "Februari", score: 65 },
            { month: "Maret", score: 69 },
            { month: "April", score: 72 },
            { month: "Mei", score: 76 },
            { month: "Juni", score: 79 }
        ],
        indicators: {
            komunikasi: 78,
            partisipasi: 82,
            kemandirian: 75,
            interaksiSosial: 80
        }
    },
    aiChatHistory: [
        {
            sender: "ai",
            message: "Halo! Saya Asisten AI Kelas SAPA Inklusi. Silakan ucapkan atau ketik instruksi yang ingin disederhanakan, atau minta alternatif aktivitas pembelajaran adaptif."
        }
    ]
};

// Store Engine Class
class SapaInklusiStore {
    constructor() {
        this.loadState();
    }

    loadState() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                this.state = JSON.parse(saved);
            } else {
                this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
                this.saveState();
            }
        } catch (e) {
            console.error("Failed to load state from localStorage:", e);
            this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
        }
    }

    saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
            window.dispatchEvent(new CustomEvent('sapa_state_updated', { detail: this.state }));
        } catch (e) {
            console.error("Failed to save state:", e);
        }
    }

    resetToDefault() {
        this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
        this.saveState();
    }

    // Role Management
    getCurrentUser() {
        return this.state.currentUser;
    }

    setRole(roleName) {
        this.state.currentUser.role = roleName;
        this.saveState();
    }

    // KPI Metrics Calculator (PRD Section 11 & 24)
    getKPISummary() {
        const totalPIB = this.state.pibList.length;
        const activePIB = this.state.pibList.filter(p => p.status === 'AKTIF').length;
        const certifiedPIB = this.state.pibList.filter(p => p.certificationStatus === 'BERSERTIFIKAT').length;
        const totalSchools = this.state.schools.length;
        const schoolsNeedingPIB = this.state.schools.filter(s => s.status === 'BUTUH_PENDAMPING').length;
        const fulfilledSchools = this.state.schools.filter(s => s.status === 'TERPENUHI').length;
        const activeSessions = this.state.sessions.filter(s => s.status === 'BERLANGSUNG' || s.status === 'TERJADWAL').length;
        const totalStudents = this.state.schools.reduce((acc, s) => acc + (s.studentsCount || 0), 0);
        const northStarRate = totalSchools > 0 ? ((fulfilledSchools / totalSchools) * 100).toFixed(1) : 0;

        return {
            totalPIB,
            activePIB: 128, // Aggregate baseline from PRD
            certifiedPIB: 68,
            totalSchools: 46,
            schoolsNeedingPIB: 12,
            fulfilledSchools: 34,
            activeAssistance: 92,
            totalStudentsAssisted: 214,
            northStarRate: "73.9%"
        };
    }

    // PIB Methods
    getPIBs() {
        return this.state.pibList;
    }

    getPIBById(id) {
        return this.state.pibList.find(p => p.id === id);
    }

    addPIB(newPIB) {
        const id = "PIB-" + String(this.state.pibList.length + 1).padStart(3, '0');
        const pib = {
            id,
            progress: 0,
            status: "AKTIF",
            availability: "TERSEDIA",
            certificationStatus: "DALAM_PROGRES",
            certificateId: null,
            assignedSchoolId: null,
            assignedSchoolName: "Menunggu Penugasan",
            assignedStudentsCount: 0,
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5L3mOQy1j4sVWiKcN0ljUygLG4eXMWja-rVITlKxC2XxU5v2dD2uOTkv6dAgPy29yAdpWzWhzYmj18ZMYIDejrh6iiWmddfkC_2lLb9kyO2vMVa4GUqkuugOw0e__d6H6_IbYsCvCXE04Sww7GoNPPnGCKB3MPyQ7PoErT8aj9C8qRwsDAbx-MWpt8Ho8UiT-8bCt46uivcxN8Jqs5XrOFrf9_a-Vf5KIX4DoJD4BBNFI525EQSH9",
            ...newPIB
        };
        this.state.pibList.unshift(pib);
        this.saveState();
        return pib;
    }

    // Module Methods
    getModules() {
        return this.state.modules;
    }

    addModule(newModule) {
        const id = "MOD-" + String(this.state.modules.length + 1).padStart(2, '0');
        const mod = {
            id,
            number: this.state.modules.length + 1,
            enrolledCount: 0,
            completedCount: 0,
            passRate: 100,
            status: "ACTIVE",
            ...newModule
        };
        this.state.modules.push(mod);
        this.saveState();
        return mod;
    }

    // School Methods & Matching Engine (PRD Section 10)
    getSchools() {
        return this.state.schools;
    }

    calculateMatchingScore(pib, school) {
        let score = 50; // Base score
        // 1. Availability (+20)
        if (pib.availability === 'TERSEDIA') score += 20;
        // 2. Competency match (+20)
        if (school.requiredCompetencies && pib.competencies) {
            const hasCommon = school.requiredCompetencies.some(c => pib.competencies.includes(c));
            if (hasCommon) score += 20;
        }
        // 3. Certified (+10)
        if (pib.certificationStatus === 'BERSERTIFIKAT') score += 10;
        return Math.min(score, 99);
    }

    assignPIBToSchool(pibId, schoolId) {
        const pib = this.getPIBById(pibId);
        const school = this.state.schools.find(s => s.id === schoolId);
        if (pib && school) {
            pib.assignedSchoolId = school.id;
            pib.assignedSchoolName = school.name;
            pib.availability = "SEDANG_BERTUGAS";
            school.assignedPIB = (school.assignedPIB || 0) + 1;
            if (school.assignedPIB >= school.requiredPIB) {
                school.status = "TERPENUHI";
            }
            this.saveState();
            return true;
        }
        return false;
    }

    // Assistance Session Methods (PRD Section 12 & 18)
    getSessions() {
        return this.state.sessions;
    }

    addSession(newSession) {
        const id = "SES-" + new Date().toISOString().slice(0, 10).replace(/-/g, '') + "-" + String(this.state.sessions.length + 1).padStart(2, '0');
        const session = {
            id,
            timestamp: new Date().toISOString(),
            status: "BERLANGSUNG",
            verificationStatus: "MENUNGGU_VERIFIKASI",
            ...newSession
        };
        this.state.sessions.unshift(session);
        this.saveState();
        return session;
    }

    verifySession(sessionId, isApproved = true) {
        const session = this.state.sessions.find(s => s.id === sessionId);
        if (session) {
            session.verificationStatus = isApproved ? "TERVERIFIKASI" : "DITOLAK";
            if (isApproved && session.status === 'BERLANGSUNG') {
                session.status = 'SELESAI';
            }
            this.saveState();
            return true;
        }
        return false;
    }

    // AI Assistant Methods (PRD Feature 2)
    generateAIResponse(promptText) {
        const lower = promptText.toLowerCase();
        if (lower.includes("sederhanakan") || lower.includes("instruksi")) {
            return "Berikut instruksi yang disederhanakan dengan bahasa visual:\n\n1. 📘 Buka buku halaman 24.\n2. ✏️ Ambil pensil warna hijau.\n3. ⭕ Lingkari 3 gambar buah yang kamu sukai.\n4. ✋ Angkat tangan jika sudah selesai.";
        } else if (lower.includes("alternatif") || lower.includes("adhd") || lower.includes("autis") || lower.includes("fokus")) {
            return "Rekomendasi Alternatif Pembelajaran Adaptif:\n\n• Metode 'Chunking': Bagi tugas menjadi 3 interval 7 menit dengan jeda sensory 2 menit.\n• Visual Timer: Gunakan kartu warna untuk menandakan waktu mulai dan selesai.\n• Fidget Tool: Berikan sensory tactile ball saat mendengarkan penjelasan.";
        } else if (lower.includes("langkah") || lower.includes("matematika")) {
            return "Langkah Pembelajaran Adaptif:\n\nLangkah 1: Gunakan kancing/benda konkret untuk menunjukkan jumlah bilangan.\nLangkah 2: Tuliskan lambang bilangan di samping benda.\nLangkah 3: Pandu siswa menunjuk dan menghitung satu per satu dengan ketukan ritmis.";
        } else {
            return "Saya siap membantu. Anda dapat meminta saya untuk menyederhanakan kalimat instruksi guru kelas, menyusun visual schedule, atau memberikan strategi de-eskalasi emosi yang ramah bagi anak berkebutuhan khusus.";
        }
    }
}

// Global Singleton Instance
window.sapaStore = new SapaInklusiStore();
