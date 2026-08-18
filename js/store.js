/**
 * SAPA INKLUSI - Core State Store (PRD v1.0 Compliant)
 * Author: Antigravity AI Engine
 */

const STORAGE_KEY = 'SAPA_INKLUSI_MASTER_V2';

const INITIAL_STATE = {
    userRole: 'GPK_KOORDINATOR', // GPK_KOORDINATOR | SEKOLAH_MITRA | DINAS_PENDIDIKAN | PIB
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
    
    // 8 Standard PRD Modules
    modules: [
        {
            id: "MOD-01",
            number: 1,
            title: "Dasar Pendidikan Inklusif",
            category: "Fondasi",
            durationHours: 6,
            description: "Filosofi hak pendidikan anak, regulasi UU No 8/2016, dan paradigma sekolah ramah anak.",
            enrolled: 128,
            completed: 128,
            passRate: 98,
            quizQuestions: [
                { q: "Apa prinsip utama pendidikan inklusif?", a: ["Menyesuaikan sekolah dengan kebutuhan beragam anak", "Memisahkan kelas berdasarkan IQ", "Mengharuskan anak mengikuti standar tunggal"], correct: 0 }
            ]
        },
        {
            id: "MOD-02",
            number: 2,
            title: "Memahami Anak Berkebutuhan Khusus",
            category: "Identifikasi",
            durationHours: 8,
            description: "Karakteristik dan pemetaan spektrum Autisme, ADHD, Disleksia, serta hambatan sensori motorik.",
            enrolled: 128,
            completed: 115,
            passRate: 92,
            quizQuestions: [
                { q: "Metode awal terbaik saat mendampingi anak dengan spektrum autisme adalah?", a: ["Instruksi verbal cepat", "Visual schedule dan penataan lingkungan minim distraksi", "Memberikan tugas ganda"], correct: 1 }
            ]
        },
        {
            id: "MOD-03",
            number: 3,
            title: "Komunikasi Inklusif & Adaptif",
            category: "Komunikasi",
            durationHours: 6,
            description: "Penggunaan bahasa visual, PECS, bahasa isyarat dasar, dan penyederhanaan kalimat instruksi.",
            enrolled: 128,
            completed: 102,
            passRate: 89,
            quizQuestions: [
                { q: "Tujuan penyederhanaan instruksi di kelas reguler adalah:", a: ["Menurunkan ekspektasi kemampuan", "Memecah tugas menjadi langkah-langkah konkret yang dapat dieksekusi", "Menghapus kurikulum"], correct: 1 }
            ]
        },
        {
            id: "MOD-04",
            number: 4,
            title: "Strategi Pendampingan di Kelas Reguler",
            category: "Praktik Kelas",
            durationHours: 8,
            description: "Kolaborasi intensif guru kelas dengan PIB, diferensiasi konten, dan pengelolaan fokus belajar.",
            enrolled: 128,
            completed: 94,
            passRate: 87,
            quizQuestions: [
                { q: "Peran PIB saat guru kelas mengajar adalah:", a: ["Mengambil alih seluruh sesi", "Menjadi fasilitator scaffolding dan menjaga regulasi fokus siswa", "Duduk pasif di belakang"], correct: 1 }
            ]
        },
        {
            id: "MOD-05",
            number: 5,
            title: "Dukungan Sosial & Regulasi Emosional",
            category: "Psikososial",
            durationHours: 6,
            description: "Teknik de-eskalasi emosi, pencegahan perundungan (anti-bullying), dan integrasi teman sebaya.",
            enrolled: 128,
            completed: 88,
            passRate: 85,
            quizQuestions: [
                { q: "Ketika siswa mengalami sensory overload, langkah pertama PIB adalah:", a: ["Memarahi siswa", "Mengajak ke sudut tenang (quiet space) dan menurunkan stimulasi sensori", "Memaksa tetap di keramaian"], correct: 1 }
            ]
        },
        {
            id: "MOD-06",
            number: 6,
            title: "Strategi Pembelajaran Adaptif & Asisten AI",
            category: "Teknologi",
            durationHours: 8,
            description: "Pemanfaatan Speech-to-Text, prompt AI untuk simplifikasi modul ajar, dan media interaktif.",
            enrolled: 128,
            completed: 81,
            passRate: 84,
            quizQuestions: [
                { q: "Bagaimana Asisten AI membantu PIB di kelas?", a: ["Menggantikan guru", "Menghasilkan alternatif scaffolding materi dan visualisasi instruksi secara instan", "Menilai diagnosis medis"], correct: 1 }
            ]
        },
        {
            id: "MOD-07",
            number: 7,
            title: "Praktik Lapangan Terbimbing",
            category: "Praktik",
            durationHours: 10,
            description: "Simulasi pendampingan langsung di sekolah mitra dan observasi reflektif oleh GPK Koordinator.",
            enrolled: 128,
            completed: 74,
            passRate: 90,
            quizQuestions: [
                { q: "Fokus utama pencatatan sesi pendampingan adalah:", a: ["Menghitung jam kerja semata", "Merekam kemajuan partisipasi, kemandirian, dan catatan adaptasi", "Menilai peringkat nilai"], correct: 1 }
            ]
        },
        {
            id: "MOD-08",
            number: 8,
            title: "Asesmen Portofolio & Refleksi Akhir",
            category: "Kelulusan",
            durationHours: 8,
            description: "Evaluasi komprehensif, penyusunan studi kasus, dan penerbitan Sertifikasi Resmi PIB.",
            enrolled: 128,
            completed: 68,
            passRate: 88,
            quizQuestions: [
                { q: "Sertifikasi PIB membuktikan bahwa pendamping:", a: ["Siap mendiagnosis medis", "Memiliki kompetensi terstandar dalam memfasilitasi kebutuhan belajar inklusif", "Hanya boleh mengajar di SLB"], correct: 1 }
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
            requiredCompetencies: ["Disleksia", "Pembelajaran Adaptif"],
            coordinatorName: "Bapak Agus, S.Pd",
            address: "Jl. Beringin No. 19, Karang Sari",
            schedule: "Senin - Jumat (07.30 - 13.00)"
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

    // Role
    setRole(roleKey) {
        this.state.userRole = roleKey;
        if (roleKey === 'GPK_KOORDINATOR') this.state.userRoleLabel = 'GPK Koordinator';
        if (roleKey === 'SEKOLAH_MITRA') this.state.userRoleLabel = 'Koordinator Sekolah';
        if (roleKey === 'DINAS_PENDIDIKAN') this.state.userRoleLabel = 'Pengawas Dinas';
        if (roleKey === 'PIB') this.state.userRoleLabel = 'Pendamping PIB';
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
        const colors = ['#C85A32', '#5B6E43', '#E29547', '#3B6082', '#6D5B8E'];
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
        if (q.includes("sederhanakan") || q.includes("instruksi")) {
            return "📘 **Instruksi yang Disederhanakan (Format 4 Langkah Visual):**\n\n1. 📖 **Buka Halaman 24** buku tematik.\n2. ✏️ **Pilih 2 soal** yang ada gambar buah.\n3. 🎨 **Beri warna hijau** pada jawaban yang benar.\n4. ✋ **Angkat kartu jempol** jika sudah selesai.";
        } else if (q.includes("adhd") || q.includes("fokus") || q.includes("diam") || q.includes("gerak")) {
            return "💡 **Strategi Belajar Adaptif untuk Siswa ADHD:**\n\n• **Interval 10/2**: 10 menit aktivitas terstruktur + 2 menit peregangan fisik.\n• **Fidget Band**: Pasang karet elastis di kaki kursi untuk menyalurkan energi motorik.\n• **Visual Timer**: Gunakan jam pasir warna agar siswa memahami batasan waktu.";
        } else if (q.includes("autis") || q.includes("sensorik") || q.includes("overload")) {
            return "🧩 **Protokol De-eskalasi & Regulasi Sensori (Autism Spectrum):**\n\n• Segera bimbing siswa ke sudut tenang (*quiet corner*).\n• Berikan penutup telinga (*noise-cancelling headphones*) jika bising.\n• Gunakan kartu komunikasi visual 'Saya Butuh Istirahat' tanpa memaksa kontak mata.";
        } else {
            return "✨ **Rekomendasi Pembelajaran Inklusif:**\n\nInstruksi dapat dipecah menjadi unit-unit kecil (*chunking*). Berikan penguatan positif instan (token bintang) dan pastikan materi disajikan dalam format multisensori (audio + visual + kinestetik).";
        }
    }
}

window.store = new SapaStore();
