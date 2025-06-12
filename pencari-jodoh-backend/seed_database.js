// simpan file ini dengan nama `seed_database.js` di dalam folder `pencari-jodoh-backend`

const fs = require('fs');
const path = require('path');
const pool = require('./config/database');

/**
 * Script ini akan mengisi (seed) data awal ke dalam database, termasuk:
 * - Data pengguna dari array `usersData`.
 * - Foto profil dari folder `./data/fotoJKT/`.
 * - Data relasi hobi di tabel `user_hobi`.
 * * Untuk menjalankan:
 * 1. Pastikan ekstensi pgcrypto sudah aktif di database Anda: CREATE EXTENSION IF NOT EXISTS pgcrypto;
 * 2. Buka terminal di folder `pencari-jodoh-backend`.
 * 3. Jalankan perintah: node seed_database.js
 */

// --- DATA PENGGUNA YANG AKAN DIMASUKKAN ---
const usersData = [
    {
        email: 'alyaamanda@gmail.com',
        password: 'alyaamanda123',
        nama: 'Alya Amanda',
        tanggal_lahir: '2006-08-26',
        jenis_kelamin: 'Wanita',
        kepribadian_id: 11,
        kota_id: 34,
        agama_id: 1,
        pendidikan_terakhir: 'SMA',
        tinggi_badan: 165,
        pekerjaan: 'Idol',
        bio: 'Jika hatimu sedang menangis aku akan datang sebagai pelangi.',
        photo_filename: 'alya_amanda.jpg',
        hobi_ids: [1, 2, 13]
    },
    {
        email: 'amandasukma@gmail.com',
        password: 'amandasukma123',
        nama: 'Amanda Sukma',
        tanggal_lahir: '2004-12-17',
        jenis_kelamin: 'Wanita',
        kepribadian_id: 12,
        kota_id: 39,
        agama_id: 1,
        pendidikan_terakhir: 'SMA',
        tinggi_badan: 160,
        pekerjaan: 'Idol',
        bio: 'Aku akan membuat hatimu berdebar kencang seperti lagu dengan 1.000 BPM.',
        photo_filename: 'amanda_sukma.jpg',
        hobi_ids: [2, 6, 10]
    },
    {
        email: 'angelinachristy@gmail.com',
        password: 'angelinachristy123',
        nama: 'Angelina Christy',
        tanggal_lahir: '2005-12-05',
        jenis_kelamin: 'Wanita',
        kepribadian_id: 15,
        kota_id: 35,
        agama_id: 2,
        pendidikan_terakhir: 'SMA',
        tinggi_badan: 163,
        pekerjaan: 'Idol',
        bio: 'Peduli dan berbaik hati, siapakah dia?',
        photo_filename: 'angelina_christy.jpg',
        hobi_ids: [3, 7]
    },
    {
        email: 'anindyaramadhani@gmail.com',
        password: 'anindyaramadhani123',
        nama: 'Anindya Ramadhani',
        tanggal_lahir: '2005-10-18',
        jenis_kelamin: 'Wanita',
        kepribadian_id: 11,
        kota_id: 35,
        agama_id: 1,
        pendidikan_terakhir: 'SMA',
        tinggi_badan: 154,
        pekerjaan: 'Idol',
        bio: 'Si mungil hadir semanis mangga.',
        photo_filename: 'anindya_ramadhani.jpg',
        hobi_ids: [4, 9]
    },
    {
        email: 'aurellia@gmail.com',
        password: 'aurellia123',
        nama: 'Aurellia',
        tanggal_lahir: '2002-10-29',
        jenis_kelamin: 'Wanita',
        kepribadian_id: 11,
        kota_id: 35,
        agama_id: 2,
        pendidikan_terakhir: 'S1',
        tinggi_badan: 155,
        pekerjaan: 'Idol',
        bio: 'Si social butterfly yang energik dan periang!',
        photo_filename: 'aurellia.jpg',
        hobi_ids: [1, 5, 7]
    },
    {
        email: 'aurhelalana@gmail.com',
        password: 'aurhelalana123',
        nama: 'Aurhel Alana',
        tanggal_lahir: '2006-09-14',
        jenis_kelamin: 'Wanita',
        kepribadian_id: 15,
        kota_id: 35,
        agama_id: 2,
        pendidikan_terakhir: 'SMA',
        tinggi_badan: 163,
        pekerjaan: 'Idol',
        bio: 'Dengan kekuatan bulan, aku akan menyihirmu dengan pesonaku.',
        photo_filename: 'aurhel_alana.jpg',
        hobi_ids: [8, 10]
    },
    {
        email: 'cathleennixie@gmail.com',
        password: 'cathleennixie123',
        nama: 'Cathleen Nixie',
        tanggal_lahir: '2009-05-28',
        jenis_kelamin: 'Wanita',
        kepribadian_id: 13,
        kota_id: 35,
        agama_id: 2,
        pendidikan_terakhir: 'SMP',
        tinggi_badan: 158,
        pekerjaan: 'Idol',
        bio: 'Tring! Si peri cantik jelita, itulah Aku!',
        photo_filename: 'cathleen_nixie.jpg',
        hobi_ids: [3, 8, 12]
    },
    {
        email: 'cellinethefani@gmail.com',
        password: 'cellinethefani123',
        nama: 'Celline Thefani',
        tanggal_lahir: '2007-04-09',
        jenis_kelamin: 'Wanita',
        kepribadian_id: 6,
        kota_id: 36,
        agama_id: 2,
        pendidikan_terakhir: 'SMP',
        tinggi_badan: 163,
        pekerjaan: 'Idol',
        bio: 'Semanis permen kapas dan seindah bunga lavender.',
        photo_filename: 'celline_thefani.jpg',
        hobi_ids: [7, 15]
    },
    {
        email: 'chelseadavina@gmail.com',
        password: 'chelseadavina123',
        nama: 'Chelsea Davina',
        tanggal_lahir: '2009-12-23',
        jenis_kelamin: 'Wanita',
        kepribadian_id: 14,
        kota_id: 36,
        agama_id: 1,
        pendidikan_terakhir: 'SMP',
        tinggi_badan: 163,
        pekerjaan: 'Idol',
        bio: 'As bright as a shooting star in the starry night sky!',
        photo_filename: 'chelsea_davina.jpg',
        hobi_ids: [4, 6, 12]
    },
    {
        email: 'corneliavanisa@gmail.com',
        password: 'corneliavanisa123',
        nama: 'Cornelia Vanisa',
        tanggal_lahir: '2002-06-26',
        jenis_kelamin: 'Wanita',
        kepribadian_id: 10,
        kota_id: 38,
        agama_id: 1,
        pendidikan_terakhir: 'S1',
        tinggi_badan: 162,
        pekerjaan: 'Idol',
        bio: 'Seperti teka-teki, kalian akan selalu penasaran denganku.',
        photo_filename: 'cornelia_vanisa.jpg',
        hobi_ids: [2, 7, 15]
    },
    {
        email: 'cynthiayaputera@gmail.com',
        password: 'cynthiayaputera123',
        nama: 'Cynthia Yaputera',
        tanggal_lahir: '2003-11-22',
        jenis_kelamin: 'Wanita',
        kepribadian_id: 3,
        kota_id: 32,
        agama_id: 2,
        pendidikan_terakhir: 'SMA',
        tinggi_badan: 158,
        pekerjaan: 'Idol',
        bio: 'Semangatku terus menerus meluap. POP! POP! Aku Cynthia yang selalu semangat!',
        photo_filename: 'cynthia_yaputera.jpg',
        hobi_ids: [2, 3, 7]
    },
    {
        email: 'denanatalia@gmail.com',
        password: 'denanatalia123',
        nama: 'Dena Natalia',
        tanggal_lahir: '2005-12-16',
        jenis_kelamin: 'Wanita',
        kepribadian_id: 16,
        kota_id: 37,
        agama_id: 2,
        pendidikan_terakhir: 'SMA',
        tinggi_badan: 162,
        pekerjaan: 'Idol',
        bio: 'Tok-tok! Si penari yang akan menarikmu ke duniaku!',
        photo_filename: 'dena_natalia.jpg',
        hobi_ids: [1, 4]
    },
    {
        email: 'desynatalia@gmail.com',
        password: 'desynatalia123',
        nama: 'Desy Natalia',
        tanggal_lahir: '2005-12-16',
        jenis_kelamin: 'Wanita',
        kepribadian_id: 4,
        kota_id: 37,
        agama_id: 2,
        pendidikan_terakhir: 'SMA',
        tinggi_badan: 158,
        pekerjaan: 'Idol',
        bio: 'Seperti bunga daisy, aku akan memancarkan kesegaran dan kebahagiaan!',
        photo_filename: 'desy_natalia.jpg',
        hobi_ids: [5, 6]
    },
    {
        email: 'febriolasinambela@gmail.com',
        password: 'febriolasinambela123',
        nama: 'Febriola Sinambela',
        tanggal_lahir: '2005-02-26',
        jenis_kelamin: 'Wanita',
        kepribadian_id: 16,
        kota_id: 6,
        agama_id: 2,
        pendidikan_terakhir: 'S1',
        tinggi_badan: 154,
        pekerjaan: 'Idol',
        bio: 'Dengan keajaibanku, aku akan membuat kalian selalu tertawa. Halo, Aku Olla si mechanic girl!',
        photo_filename: 'febriola_sinambela.jpg',
        hobi_ids: [4, 5]
    },
    {
        email: 'fenifitriyanti@gmail.com',
        password: 'fenifitriyanti123',
        nama: 'Feni Fitriyanti',
        tanggal_lahir: '1999-01-16',
        jenis_kelamin: 'Wanita',
        kepribadian_id: 12,
        kota_id: 41,
        agama_id: 1,
        pendidikan_terakhir: 'S1',
        tinggi_badan: 162,
        pekerjaan: 'Idol',
        bio: 'Matahari yang indah yang akan selalu memberikan kehangatan setiap harinya. Aku Feni!',
        photo_filename: 'feni_fitriyanti.jpg',
        hobi_ids: [7, 11]
    },
    {
        email: 'fionyalveria@gmail.com',
        password: 'fionyalveria123',
        nama: 'Fiony Alveria',
        tanggal_lahir: '2002-02-04',
        jenis_kelamin: 'Wanita',
        kepribadian_id: 1,
        kota_id: 35,
        agama_id: 2,
        pendidikan_terakhir: 'S1',
        tinggi_badan: 158,
        pekerjaan: 'Idol',
        bio: 'Seperti symfony yang menenangkan hati. Halo aku Fiony!',
        photo_filename: 'fiony_alveria.jpg',
        hobi_ids: [2, 15]
    },
    {
        email: 'freyajayawardana@gmail.com',
        password: 'freyajayawardana123',
        nama: 'Freya Jayawardana',
        tanggal_lahir: '2006-02-13',
        jenis_kelamin: 'Wanita',
        kepribadian_id: 8,
        kota_id: 52,
        agama_id: 1,
        pendidikan_terakhir: 'SMA',
        tinggi_badan: 154,
        pekerjaan: 'Idol',
        bio: 'Gadis koleris yang suka berimajinasi terangi harimu dengan senyum karamelku. Aku Freya~',
        photo_filename: 'freya_jayawardana.jpg',
        hobi_ids: [1, 3]
    },
    {
        email: 'fritzyrosmerian@gmail.com',
        password: 'fritzyrosmerian123',
        nama: 'Fritzy Rosmerian',
        tanggal_lahir: '2008-07-28',
        jenis_kelamin: 'Wanita',
        kepribadian_id: 14,
        kota_id: 32,
        agama_id: 2,
        pendidikan_terakhir: 'SMP',
        tinggi_badan: 157,
        pekerjaan: 'Idol',
        bio: 'Abracadabra..si pesulap yang siap membuat..hatimu terpikat!',
        photo_filename: 'fritzy_rosmerian.jpg',
        hobi_ids: [5, 9]
    },
    {
        email: 'gabrielaabigail@gmail.com',
        password: 'gabrielaabigail123',
        nama: 'Gabriela Abigail',
        tanggal_lahir: '2006-08-07',
        jenis_kelamin: 'Wanita',
        kepribadian_id: 13,
        kota_id: 64,
        agama_id: 2,
        pendidikan_terakhir: 'SMA',
        tinggi_badan: 160,
        pekerjaan: 'Idol',
        bio: 'Ohayo! Konnichiwa! Oyasumi! Aku ingin ada di setiap waktumu.',
        photo_filename: 'gabriela_abigail.jpg',
        hobi_ids: [6, 12]
    },
    {
        email: 'gendismayrannisa@gmail.com',
        password: 'gendismayrannisa123',
        nama: 'Gendis Mayrannisa',
        tanggal_lahir: '2010-06-23',
        jenis_kelamin: 'Wanita',
        kepribadian_id: 12,
        kota_id: 65,
        agama_id: 2,
        pendidikan_terakhir: 'SMP',
        tinggi_badan: 160,
        pekerjaan: 'Idol',
        bio: 'Bonjour, periang dan pencair suasana itulah aku.',
        photo_filename: 'gendis_mayrannisa.jpg',
        hobi_ids: [1, 13]
    },
    {
        email: 'gitasekarandarini@gmail.com',
        password: 'gitasekarandarini123',
        nama: 'Gita Sekar Andarini',
        tanggal_lahir: '2001-06-30',
        jenis_kelamin: 'Wanita',
        kepribadian_id: 1,
        kota_id: 65,
        agama_id: 1,
        pendidikan_terakhir: 'S1',
        tinggi_badan: 165,
        pekerjaan: 'Idol',
        bio: 'Diam bukan berarti tidak memperhatikanmu, aku Gita!',
        photo_filename: 'gita_sekar_andarini.jpg',
        hobi_ids: [1, 2, 3]
    },
    {
        email: 'graceoctaviani@gmail.com',
        password: 'graceoctaviani123',
        nama: 'Grace Octaviani',
        tanggal_lahir: '2007-10-18',
        jenis_kelamin: 'Wanita',
        kepribadian_id: 7,
        kota_id: 64,
        agama_id: 2,
        pendidikan_terakhir: 'SMP',
        tinggi_badan: 165,
        pekerjaan: 'Idol',
        bio: 'Manis seperti gulali, imut seperti kelinci. Xixixi Gracie!',
        photo_filename: 'grace_octaviani.jpg',
        hobi_ids: [2, 3, 7]
    },
    {
        email: 'greesellaadhalia@gmail.com',
        password: 'greesellaadhalia123',
        nama: 'Greesella Adhalia',
        tanggal_lahir: '2006-01-10',
        jenis_kelamin: 'Wanita',
        kepribadian_id: 15,
        kota_id: 39,
        agama_id: 1,
        pendidikan_terakhir: 'SMA',
        tinggi_badan: 165,
        pekerjaan: 'Idol',
        bio: 'Pandangan mataku akan menyinari hatimu bagaikan kunang-kunang di malam hari.',
        photo_filename: 'greesella_adhalia.jpg',
        hobi_ids: [13, 14]
    },
    {
        email: 'helismaputri@gmail.com',
        password: 'helismaputri123',
        nama: 'Helisma Putri',
        tanggal_lahir: '2000-06-15',
        jenis_kelamin: 'Wanita',
        kepribadian_id: 10,
        kota_id: 37,
        agama_id: 1,
        pendidikan_terakhir: 'S1',
        tinggi_badan: 165,
        pekerjaan: 'Idol',
        bio: 'Aprikot aprikot aprikot aprikot, pang! Dengan energi kegembiraanku aku akan menghangatkan suasana. Halo halo aku Eli!',
        photo_filename: 'helisma_putri.jpg',
        hobi_ids: [3, 9]
    },
    {
        email: 'indahcahya@gmail.com',
        password: 'indahcahya123',
        nama: 'Indah Cahya',
        tanggal_lahir: '2001-03-20',
        jenis_kelamin: 'Wanita',
        kepribadian_id: 6,
        kota_id: 22,
        agama_id: 1,
        pendidikan_terakhir: 'S1',
        tinggi_badan: 165,
        pekerjaan: 'Idol',
        bio: 'Tak banyak bicara bercerita lewat tulisan. Hai aku Indah!',
        photo_filename: 'indah_cahya.jpg',
        hobi_ids: [1, 7, 11]
    },
    {
        email: 'indiraseruni@gmail.com',
        password: 'indiraseruni123',
        nama: 'Indira Seruni',
        tanggal_lahir: '2004-04-26',
        jenis_kelamin: 'Wanita',
        kepribadian_id: 7,
        kota_id: 37,
        agama_id: 1,
        pendidikan_terakhir: 'SMA',
        tinggi_badan: 160,
        pekerjaan: 'Idol',
        bio: 'Watashi no kokoro unlock, akan menemani hari-harimu dengan sepenuh hati. Hai, aku Indira!',
        photo_filename: 'indira_seruni.jpg',
        hobi_ids: [7, 13]
    },
    {
        email: 'jessicachandra@gmail.com',
        password: 'jessicachandra123',
        nama: 'Jessica Chandra',
        tanggal_lahir: '2005-09-23',
        jenis_kelamin: 'Wanita',
        kepribadian_id: 11,
        kota_id: 33,
        agama_id: 2,
        pendidikan_terakhir: 'SMA',
        tinggi_badan: 163,
        pekerjaan: 'Idol',
        bio: 'Suka menari dan akan berusaha menjadi sumber energimu. Hai, aku Jessi.',
        photo_filename: 'jessica_chandra.jpg',
        hobi_ids: [3, 7]
    },
    {
        email: 'jesslynelly@gmail.com',
        password: 'jesslynelly123',
        nama: 'Jesslyn Elly',
        tanggal_lahir: '2001-09-13',
        jenis_kelamin: 'Wanita',
        kepribadian_id: 14,
        kota_id: 64,
        agama_id: 2,
        pendidikan_terakhir: 'S1',
        tinggi_badan: 155,
        pekerjaan: 'Idol',
        bio: 'Seperti ombak laut yang tenang, tiba-tiba aku akan menyapumu dengan banyak cinta! Aku Lyn!',
        photo_filename: 'jesslyn_elly.jpg',
        hobi_ids: [7, 11]
    },
    {
        email: 'kathrinairene@gmail.com',
        password: 'kathrinairene123',
        nama: 'Kathrina Irene',
        tanggal_lahir: '2006-07-26',
        jenis_kelamin: 'Wanita',
        kepribadian_id: 14,
        kota_id: 35,
        agama_id: 3,
        pendidikan_terakhir: 'SMA',
        tinggi_badan: 165,
        pekerjaan: 'Idol',
        bio: 'Never miss a chance to be a star! Hai Semua, aku Kathrina!',
        photo_filename: 'kathrina_irene.jpg',
        hobi_ids: [4, 9]
    },
    {
        email: 'lulusalsabila@gmail.com',
        password: 'lulusalsabila123',
        nama: 'Lulu Salsabila',
        tanggal_lahir: '2002-10-23',
        jenis_kelamin: 'Wanita',
        kepribadian_id: 9,
        kota_id: 33,
        agama_id: 1,
        pendidikan_terakhir: 'S1',
        tinggi_badan: 157,
        pekerjaan: 'Idol',
        bio: 'Terang seperti bulan, bersinar seperti bintang. Aku Lulu!',
        photo_filename: 'lulu_salsabila.jpg',
        hobi_ids: [7, 15]
    },
    {
        email: 'marshalenathea@gmail.com',
        password: 'marshalenathea123',
        nama: 'Marsha Lenathea',
        tanggal_lahir: '2006-01-09',
        jenis_kelamin: 'Wanita',
        kepribadian_id: 3,
        kota_id: 79,
        agama_id: 2,
        pendidikan_terakhir: 'SMA',
        tinggi_badan: 163,
        pekerjaan: 'Idol',
        bio: 'Seperti pizza yang selalu dinanti-nantikan semua orang. Selalu nantikan aku ya! Aku Marsha!',
        photo_filename: 'marsha_lenathea.jpg',
        hobi_ids: [3, 6, 7]
    },
    {
        email: 'michellealexandra@gmail.com',
        password: 'michellealexandra123',
        nama: 'Michelle Alexandra',
        tanggal_lahir: '2009-04-22',
        jenis_kelamin: 'Wanita',
        kepribadian_id: 8,
        kota_id: 35,
        agama_id: 2,
        pendidikan_terakhir: 'SMP',
        tinggi_badan: 160,
        pekerjaan: 'Idol',
        bio: 'Always your number one. To infinity and beyond. Hello everyone it is Michie!',
        photo_filename: 'michelle_alexandra.jpg',
        hobi_ids: [2, 3, 7]
    },
    {
        email: 'mutiaraazzahra@gmail.com',
        password: 'mutiaraazzahra123',
        nama: 'Mutiara Azzahra',
        tanggal_lahir: '2004-07-12',
        jenis_kelamin: 'Wanita',
        kepribadian_id: 9,
        kota_id: 38,
        agama_id: 1,
        pendidikan_terakhir: 'S1',
        tinggi_badan: 158,
        pekerjaan: 'Idol',
        bio: 'Dengan kelincahanku, aku akan menari setiap hari. Panggil aku Mu Mu Mu Muthe!',
        photo_filename: 'mutiara_azzahra.jpg',
        hobi_ids: [7, 12]
    },
    {
        email: 'raishasyifa@gmail.com',
        password: 'raishasyifa123',
        nama: 'Raisha Syifa',
        tanggal_lahir: '2007-11-11',
        jenis_kelamin: 'Wanita',
        kepribadian_id: 2,
        kota_id: 35,
        agama_id: 2,
        pendidikan_terakhir: 'SMP',
        tinggi_badan: 163,
        pekerjaan: 'Idol',
        bio: 'Kalau sakura itu kembang, Aku itu kembanggaanmu! Hai, aku Raisha!',
        photo_filename: 'raisha_syifa.jpg',
        hobi_ids: [5, 13]
    },
    {
        email: 'shaniagracia@gmail.com',
        password: 'shaniagracia123',
        nama: 'Shania Gracia',
        tanggal_lahir: '1999-08-31',
        jenis_kelamin: 'Wanita',
        kepribadian_id: 13,
        kota_id: 35,
        agama_id: 2,
        pendidikan_terakhir: 'S1',
        tinggi_badan: 161,
        pekerjaan: 'Idol',
        bio: 'Senyumku akan terekam jelas dalam ingatanmu seperti foto dengan sejuta warna. Namaku Gracia. Always smile!',
        photo_filename: 'shania_gracia.jpg',
        hobi_ids: [1, 2, 3]
    }
];

const seedDatabase = async () => {
    const client = await pool.connect();
    console.log('Koneksi ke database berhasil.');

    try {
        await client.query('CREATE EXTENSION IF NOT EXISTS pgcrypto;');
        console.log('Ekstensi pgcrypto dipastikan aktif.');

        await client.query('BEGIN');

        const photoDirectory = path.join(__dirname, 'data', 'fotoJKT');

        for (const userData of usersData) {
            console.log(`\nMemproses: ${userData.nama}`);

            const filePath = path.join(photoDirectory, userData.photo_filename);
            let imageBuffer = null;

            if (fs.existsSync(filePath)) {
                imageBuffer = fs.readFileSync(filePath);
            } else {
                console.warn(`--> PERINGATAN: Foto ${userData.photo_filename} tidak ditemukan.`);
            }
            
            const insertUserQuery = `
                INSERT INTO users (
                    email, password, nama, tanggal_lahir, jenis_kelamin, 
                    kepribadian_id, kota_id, agama_id, pendidikan_terakhir, 
                    tinggi_badan, pekerjaan, bio, profile_picture
                ) VALUES ($1, crypt($2, gen_salt('bf', 10)), $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                ON CONFLICT (email) DO NOTHING;
            `;

            const userValues = [
                userData.email, userData.password, userData.nama, userData.tanggal_lahir, 
                userData.jenis_kelamin, userData.kepribadian_id, userData.kota_id, 
                userData.agama_id, userData.pendidikan_terakhir, userData.tinggi_badan, 
                userData.pekerjaan, userData.bio, imageBuffer
            ];

            await client.query(insertUserQuery, userValues);
            
            // 1. Ambil user_id berdasarkan email.
            const userResult = await client.query('SELECT user_id FROM users WHERE email = $1', [userData.email]);
            
            if (userResult.rows.length === 0) {
                console.warn(`--> Gagal menemukan user dengan email: ${userData.email}. Hobi dilewati.`);
                continue; // Lanjut ke user berikutnya
            }
            const userId = userResult.rows[0].user_id;

            // 2. Masukkan hobi yang baru dari array hobi_ids.
            if (userData.hobi_ids && userData.hobi_ids.length > 0) {
                console.log(`--> Memperbarui hobi untuk user_id: ${userId}`);
                const insertHobiQuery = 'INSERT INTO user_hobi (user_id, hobi_id) VALUES ($1, $2)';
                
                for (const hobiId of userData.hobi_ids) {
                    await client.query(insertHobiQuery, [userId, hobiId]);
                }
                console.log(`--> ${userData.hobi_ids.length} hobi berhasil ditambahkan/diperbarui.`);
            }
        }

        await client.query('COMMIT');
        console.log('\n-----------------------------------');
        console.log('Proses seeding data berhasil diselesaikan.');
        console.log('-----------------------------------');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('\n!!! TERJADI ERROR SAAT SEEDING !!!');
        console.error(error);
    } finally {
        client.release();
        await pool.end();
        console.log('Koneksi ke database ditutup.');
    }
};

seedDatabase();
