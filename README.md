# Laufey Concert - Booking System

Dokumentasi ini berisi panduan untuk menjalankan aplikasi Laufey Concert yang terdiri dari frontend (Next.js) dan backend (Express.js + Prisma).

## Prasyarat
Sebelum memulai, pastikan Anda sudah menginstal:
- [Node.js](https://nodejs.org/) (v18 ke atas)
- [PostgreSQL](https://www.postgresql.org/) (sudah terinstal dan sedang berjalan)

## Struktur Proyek
- `/` - Direktori utama untuk **Frontend** (Next.js)
- `/backend` - Direktori untuk **Backend** (Express.js, Prisma, PostgreSQL)

---

## Langkah Persiapan

### 1. Konfigurasi Database (Backend)
Masuk ke direktori `backend` dan buat file `.env` untuk menyimpan konfigurasi sensitif.
```bash
cd backend
touch .env
```
Isi file `.env` dengan format berikut:
```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DATABASE_NAME?schema=public"
JWT_SECRET="masukkan_kode_secret_anda_bebas"
```
*Ganti `USER`, `PASSWORD`, dan `DATABASE_NAME` sesuai dengan konfigurasi PostgreSQL lokal Anda.*

### 2. Instalasi Dependensi

**Instalasi di Backend:**
```bash
cd backend
npm install
```

**Instalasi di Frontend:**
```bash
# Kembali ke direktori root
cd ..
npm install
```

### 3. Setup Database & Seeding (Backend)
Jalankan perintah berikut di dalam direktori `backend` untuk melakukan sinkronisasi database dan mengisi data awal (event & seats):
```bash
cd backend
npx prisma migrate dev --name init
node prisma/seed.js
```

---

## Cara Menjalankan Aplikasi

### Menjalankan Backend
Backend harus dijalankan agar frontend dapat mengakses API. Backend akan berjalan di port `3001`.
```bash
cd backend
npm run dev
```

### Menjalankan Frontend
Jalankan frontend di terminal baru dari direktori root. Frontend akan berjalan di port `3000`.
```bash
# Dari root direktori
npm run dev
```

---

## Akses Aplikasi
- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:3001/api](http://localhost:3001/api)

## Catatan Penting
- **Urutan Menjalankan:** Pastikan backend sudah berjalan (`npm run dev` di folder backend) sebelum Anda mencoba fitur Login atau Booking di Frontend.
- **Data Awal:** Jika Anda tidak menjalankan `node prisma/seed.js`, halaman pemilihan kursi mungkin akan kosong karena tidak ada data event dan kategori kursi di database.
- **Port:** Frontend dikonfigurasi untuk menghubungi backend di `http://localhost:3001`. Jika Anda mengubah port backend, pastikan untuk menyesuaikan `lib/api.ts` di folder frontend.
