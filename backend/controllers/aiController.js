/**
 * Adaptive Classroom AI Assistant Controller for SAPA Inklusi
 */

exports.generateClassroomAssistant = (req, res) => {
    const { prompt, studentProfile } = req.body;
    const lower = (prompt || '').toLowerCase();

    let responseText = '';

    if (lower.includes('sederhana') || lower.includes('baca') || lower.includes('instruksi')) {
        responseText = `**Langkah Instruksi Sederhana (3 Langkah Visual):**\n1. 📖 Buka buku paket halaman 45.\n2. ✏️ Tandai 2 kalimat yang memiliki gambar hewan.\n3. ⭐ Angkat tangan jika sudah selesai untuk mendapatkan stiker bintang.\n\n*Catatan untuk Pendamping: Berikan jeda 3 menit setelah langkah kedua.*`;
    } else if (lower.includes('sensori') || lower.includes('adhd') || lower.includes('tantrum') || lower.includes('fokus')) {
        responseText = `**Protokol Jeda Sensori & Regulasi Emosi (Durasi: 3 Menit):**\n1. **Teknik 5 Jari:** Tarik nafas dalam sambil menyentuh ujung kelima jari secara perlahan.\n2. **Aktivitas Fisik Ringan:** Gerakan meremas bola stres atau peregangan bahu lembut.\n3. **Transisi:** Berikan aba-aba visual 1 menit sebelum kembali ke lembar kerja matematika.`;
    } else if (lower.includes('disleksia') || lower.includes('tulis') || lower.includes('eja')) {
        responseText = `**Adaptasi Pembelajaran Literasi (Disleksia):**\n1. **Gunakan Font Khusus / Spasi Lebar:** Perbesar spasi baris menjadi 1.5x.\n2. **Bantuan Visual Warna:** Gunakan stabilo kuning untuk kata benda dan hijau untuk kata kerja.\n3. **Alternatif Jawaban Lisan:** Izinkan siswa merekam suaranya daripada menulis panjang.`;
    } else {
        responseText = `**Rekomendasi Modifikasi Pembelajaran:**\n1. **Pemecahan Tugas (Chunking):** Bagi materi menjadi sub-tugas kecil berdurasi 10 menit.\n2. **Dukungan Visual Konkret:** Gunakan kartu gambar alur kerja.\n3. **Penguatan Positif:** Berikan apresiasi spesifik atas usaha mandiri peserta didik.`;
    }

    return res.json({
        success: true,
        prompt: prompt,
        response: responseText,
        model: 'SAPA-Classroom-AI-v1.0',
        timestamp: new Date().toISOString()
    });
};
