# SAPA Inklusi — REST API Backend Server

Backend server resmi untuk ekosistem **SAPA Inklusi (Platform Digital Pendampingan Pendidikan Inklusif)**.

---

## 🚀 Cara Menjalankan Backend

### Opsi 1: Mode Instan Zero-Dependency (Rekomendasi)
Dapat langsung dijalankan dengan Node.js bawaan tanpa perlu install modul tambahan:

```bash
node backend/standalone-server.js
```

Server akan aktif di: **`http://localhost:3000`**

---

### Opsi 2: Mode Express.js
```bash
cd backend
npm install
npm start
```

---

## 🧪 Menjalankan Automated API Test Suite

```bash
node backend/test-api.js
```

Hasil pengujian otomatis akan memverifikasi 9 endpoint utama (Auth, Microcredential, AI Assistant, PIB, Matching Sekolah, Log Sesi, Outcome Longitudinal).

---

## 📚 Ringkasan Endpoint REST API

| Endpoint | Method | Keterangan |
|---|---|---|
| `/api/health` | GET | Status kesehatan server |
| `/api/auth/login` | POST | Login dan pengambilan token & peran pengguna |
| `/api/auth/me` | GET | Profil sesi pengguna aktif |
| `/api/modules` | GET | Daftar 8 modul kurikulum microcredential |
| `/api/modules/:id` | GET | Detail isi materi modul interaktif |
| `/api/modules/:id/quiz` | POST | Submit kuis & penerbitan sertifikat digital resmi |
| `/api/ai/assistant` | POST | AI Copilot kelas (chunking tugas & adaptasi materi) |
| `/api/pib` | GET, POST | Direktori & pendaftaran Pendamping Inklusi (PIB) |
| `/api/schools` | GET, POST | Direktori & registrasi sekolah mitra baru |
| `/api/schools/:id/assign` | POST | Penugasan PIB ke sekolah mitra (Matching Engine) |
| `/api/sessions` | GET, POST | Log aktivitas harian pendampingan kelas |
| `/api/sessions/:id/verify`| PUT | Verifikasi log sesi oleh GPK Koordinator |
| `/api/sessions/verify-all`| POST | Verifikasi massal seluruh sesi tertunda |
| `/api/outcomes` | GET | Metrik longitudinal 4 dimensi & North Star Metric |
| `/api/export/:type` | GET | Unduh data format CSV (`pib`, `schools`, `sessions`) |

---

## 🛡️ Arsitektur Hibrida (Online & Offline)
- **Mode Server**: Saat backend aktif di `http://localhost:3000`, frontend secara otomatis tersinkronisasi dengan database backend.
- **Mode Offline (GitHub Pages)**: Jika server backend tidak aktif, frontend secara transparan beralih ke penyimpanan lokal (*localStorage*) tanpa error.
