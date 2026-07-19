# 📋 Absensi QR – Sistem Absensi Siswa

Website dashboard absensi siswa berbasis QR Code. Guru/operator scan QR milik siswa → data siswa muncul otomatis → tandai status Hadir / Izin / Sakit / Alpha.

![Tech Stack](https://img.shields.io/badge/React-18-blue?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) ![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange?logo=firebase) ![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite)

---

## ✨ Fitur

- 📷 **Scan QR real-time** menggunakan kamera device
- 👤 **Data siswa otomatis muncul** setelah QR ter-scan
- ✅ **Tandai kehadiran** — Hadir / Izin / Sakit / Alpha + kolom catatan
- 📊 **Statistik real-time** — counter Hadir, Izin/Sakit, Alpha
- 📝 **Log absensi harian** — entri terbaru muncul di atas
- 🔄 **Update live** tanpa perlu refresh halaman

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Database | Firebase Firestore |
| QR Scanner | html5-qrcode |
| Styling | CSS Modules |
| Date | date-fns |

---

## 🚀 Cara Menjalankan (Development)

### 1. Clone repository

```bash
git clone https://github.com/USERNAME/REPO_NAME.git
cd REPO_NAME
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup Firebase

#### a. Buat Firebase Project
1. Buka [https://console.firebase.google.com](https://console.firebase.google.com)
2. Klik **"Add project"** → beri nama (misal: `absensi-sekolah`) → klik Continue
3. Nonaktifkan Google Analytics jika tidak diperlukan → klik **Create project**

#### b. Aktifkan Firestore
1. Di sidebar Firebase → **Build → Firestore Database**
2. Klik **"Create database"**
3. Pilih mode **"Start in test mode"** → klik Next
4. Pilih region (pilih `asia-southeast1` untuk server Asia) → klik **Enable**

#### c. Dapatkan konfigurasi Firebase
1. Di Firebase Console → klik ikon ⚙️ → **Project settings**
2. Scroll ke bawah → bagian **"Your apps"** → klik ikon `</>`  (Web)
3. Daftarkan app (beri nama bebas) → klik **Register app**
4. Copy konfigurasi yang muncul

#### d. Isi konfigurasi di project
Buka file `src/lib/firebase.ts` dan ganti dengan konfigurasi kamu:

```ts
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "nama-project.firebaseapp.com",
  projectId: "nama-project",
  storageBucket: "nama-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
}
```

### 4. Setup Firestore Security Rules

Di Firebase Console → **Firestore Database → Rules**, ganti isinya dengan:

**Mode Testing (development):**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

Klik **Publish**.

> ⚠️ Rules ini hanya untuk development. Ganti ke rules yang lebih ketat sebelum production.

### 5. Jalankan aplikasi

```bash
npm run dev
```

Buka browser → [http://localhost:5173](http://localhost:5173)

---

## 👥 Cara Input Data Siswa

### Opsi A — Halaman Seed (data dummy/contoh)

Buka [http://localhost:5173/seed](http://localhost:5173/seed) → klik **"Mulai Seed Data"**

Ini akan mengisi 6 siswa contoh ke Firestore secara otomatis.

### Opsi B — Input manual via Firebase Console

1. Buka Firebase Console → **Firestore Database**
2. Klik **"+ Start collection"** → nama collection: `students`
3. Klik **"+ Add document"**
4. **Document ID** = NISN siswa (contoh: `0054321789`)
5. Isi field-field berikut:

| Field | Type | Contoh |
|-------|------|--------|
| `id` | string | `0054321789` |
| `nisn` | string | `0054321789` |
| `name` | string | `Dafa Alfiansyah` |
| `kelas` | string | `XI RPL 1` |
| `gender` | string | `Laki-laki` |
| `ttl` | string | `Jakarta, 20 Mei 2010` |
| `alamat` | string | `Jl. Merdeka, Jakarta Pusat` |
| `noHp` | string | `081234560001` |
| `fotoUrl` | string | *(kosongkan)* |

> ⚠️ **Penting:** `id` dan `nisn` harus sama persis dengan Document ID.

---

## 🔲 Cara Membuat QR Code Siswa

Setiap siswa punya QR Code yang berisi **NISN** mereka.

### Langkah-langkah:

1. Buka [https://qr.io](https://qr.io) atau [https://www.qrcode-monkey.com](https://www.qrcode-monkey.com)
2. Pilih tipe **"Text"**
3. Di kolom teks, ketik **NISN siswa** (hanya NISN, tidak perlu tambahan apapun)

   Contoh:
   ```
   0054321789
   ```

4. Klik **Generate / Create QR Code**
5. **Download** QR Code → cetak → bagikan ke siswa

### Ulangi untuk setiap siswa:

| Nama Siswa | NISN (isi ke QR) |
|------------|-----------------|
| Dafa Alfiansyah | `0054321789` |
| (siswa lain) | (NISN masing-masing) |

> 💡 **Tips:** Buat QR dalam ukuran minimal 3x3 cm agar mudah di-scan. Bisa dicetak di kartu ID atau ditempel di buku siswa.

---

## 📁 Struktur Folder

```
src/
├── components/
│   ├── QrScanner.tsx         # Komponen kamera QR real-time
│   ├── QrScanner.module.css
│   ├── StudentCard.tsx        # Card data siswa setelah scan
│   ├── StudentCard.module.css
│   ├── AttendanceLog.tsx      # Log absensi hari ini
│   └── AttendanceLog.module.css
├── lib/
│   ├── firebase.ts            # Konfigurasi Firebase ⬅️ isi di sini
│   ├── db.ts                  # Fungsi baca/tulis Firestore
│   └── types.ts               # TypeScript types
├── pages/
│   ├── Dashboard.tsx          # Halaman utama dashboard
│   ├── Dashboard.module.css
│   └── SeedPage.tsx           # Halaman seed data dummy
├── styles/
│   └── global.css
├── App.tsx
└── main.tsx
```

---

## 🗃️ Struktur Database Firestore

### Collection: `students`
```
students/
└── {nisn}/                    ← Document ID = NISN siswa
    ├── id: string
    ├── nisn: string
    ├── name: string
    ├── kelas: string
    ├── gender: string
    ├── ttl: string
    ├── alamat: string
    ├── noHp: string
    └── fotoUrl: string
```

### Collection: `attendance`
```
attendance/
└── {auto-id}/
    ├── studentId: string      ← NISN siswa
    ├── studentName: string
    ├── studentNisn: string
    ├── kelas: string
    ├── status: string         ← "Hadir" | "Izin" | "Sakit" | "Alpha"
    ├── date: string           ← format: "YYYY-MM-DD"
    ├── time: string           ← format: "HH:mm"
    ├── createdAt: number      ← timestamp ms
    └── catatan: string
```

---

## 📦 Build untuk Production

```bash
npm run build
```

Output ada di folder `dist/`. Bisa di-deploy ke:

### Vercel (direkomendasikan)
```bash
npm install -g vercel
vercel
```

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting      # pilih folder dist
npm run build
firebase deploy
```

### Netlify
```bash
npm run build
# drag & drop folder dist ke https://app.netlify.com
```

---

## 🔒 Security Rules untuk Production

Setelah selesai testing, ganti Firestore rules ke yang lebih aman:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /students/{id} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    match /attendance/{id} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## ❓ Troubleshooting

**❌ Log absensi tidak muncul / stuck "Memuat data..."**
→ Cek Firestore Rules sudah di-Publish dan menggunakan mode test (`allow read, write: if true`)

**❌ Scan QR muncul dua layar kamera**
→ Sudah diperbaiki di versi terbaru `QrScanner.tsx` menggunakan `startedRef` guard

**❌ Siswa tidak ditemukan setelah scan**
→ Pastikan QR berisi NISN yang sama persis dengan Document ID di Firestore collection `students`

**❌ Error "Missing or insufficient permissions"**
→ Firestore Rules belum di-Publish atau masih pakai rules lama. Ganti ke mode test dulu.

**❌ Kamera tidak mau aktif**
→ Pastikan browser sudah diberi izin akses kamera. Coba buka via HTTPS (localhost sudah aman).

---

## 📄 License

MIT License — bebas digunakan dan dimodifikasi.
