## Website Link
cek deployment ini : https://uas-fe-frontend.vercel.app

## Setup Project di Local

Setup yang harus dilakukan jika ingin mengembangkan lebih lanjut

### Program yang diperlukan
PostgreSQL dan pg Admin 4

### Langkah-langkah
1. Install semua package yang diperlukan backend dan frontend.
2. Buat database terlebih dahulu.
3. Konfigurasi .env sesuai dengan database yang ada.
4. Di file db.js pada direktori src/config, hapus field ssl, karena koneksi database terjadi secara local.
5. Khusus variabel env DATABASE_URL diperlukan untuk menjalankan tool migrasi yang digunakan pada project ini,
   yaitu node-pg-migrate (hanya digunakan dalam keperluan migrasi local).
6. Pergi ke root direktory folder backend, jalankan command npm run migrate redo 6.
7. Untuk mengisi data awal, jalankan:
   node database\seeds\users_seeder.js
   node database\seeds\foods_seeder.js
   node database\seeds\address_seeder.js
   Pastikan berada di root directory folder backend.
9. Jalankan backend dengan command npm start atau node index.js.
10. Pergi ke root direktori frontend, yaitu project_uas, kemudian jalankan command npm run dev.

repo backend : https://github.com/VincentWu503/uas-fe-backend
