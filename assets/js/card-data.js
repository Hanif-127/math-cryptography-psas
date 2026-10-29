/**
 * MASTER DATA KARTU & KUANTIFIKASI
 * Game Edukasi Kriptografi Matematika "SECRET MESSAGE"
 * SMK Telkom Purwokerto - XI PPLG 1
 */

const ALPHABET_MAP = {
  ' ': 0, 'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5,
  'F': 6, 'G': 7, 'H': 8, 'I': 9, 'J': 10, 'K': 11,
  'L': 12, 'M': 13, 'N': 14, 'O': 15, 'P': 16, 'Q': 17,
  'R': 18, 'S': 19, 'T': 20, 'U': 21, 'V': 22, 'W': 23,
  'X': 24, 'Y': 25, 'Z': 26
};

const REVERSE_ALPHABET_MAP = {};
for (let char in ALPHABET_MAP) {
  REVERSE_ALPHABET_MAP[ALPHABET_MAP[char]] = char;
}

const CARDS_F = {
  'F1': {
    id: 'F-01',
    nfcUid: '04:A1:B2:F1',
    name: 'Kartu Fungsi F-01',
    a: 2,
    b: 5,
    formula: 'f(x) = 2x + 5',
    color: '#0284c7', // Sky blue
    concept: 'Fungsi linear dengan kemiringan (gradien) 2 dan pergeseran konstanta +5.',
    image: 'assets/images/cards/F-01.jpeg'
  },
  'F2': {
    id: 'F-02',
    nfcUid: '04:A1:B2:F2',
    name: 'Kartu Fungsi F-02',
    a: 3,
    b: 1,
    formula: 'f(x) = 3x + 1',
    color: '#0284c7',
    concept: 'Fungsi linear dengan kemiringan 3 dan pergeseran konstanta +1.',
    image: 'assets/images/cards/F-02.jpeg'
  },
  'F3': {
    id: 'F-03',
    nfcUid: '04:A1:B2:F3',
    name: 'Kartu Fungsi F-03',
    a: 1,
    b: 4,
    formula: 'f(x) = x + 4',
    color: '#0284c7',
    concept: 'Fungsi translasi murni: menambahkan 4 pada setiap nilai x.',
    image: 'assets/images/cards/F-03.jpeg'
  },
  'F4': {
    id: 'F-04',
    nfcUid: '04:A1:B2:F4',
    name: 'Kartu Fungsi F-04',
    a: 4,
    b: -3,
    formula: 'f(x) = 4x - 3',
    color: '#0284c7',
    concept: 'Fungsi linear dengan gradien 4 dan konstanta negatif -3.',
    image: 'assets/images/cards/F-04.jpeg'
  },
  'F5': {
    id: 'F-05',
    nfcUid: '04:A1:B2:F5',
    name: 'Kartu Fungsi F-05',
    a: 5,
    b: 2,
    formula: 'f(x) = 5x + 2',
    color: '#0284c7',
    concept: 'Fungsi linear dengan perkalian 5 dan pergeseran +2.',
    image: 'assets/images/cards/F-05.jpeg'
  }
};

const CARDS_G = {
  'G1': {
    id: 'G-01',
    nfcUid: '04:B2:C3:G1',
    name: 'Kartu Fungsi G-01',
    a: 3,
    b: -2,
    formula: 'g(x) = 3x - 2',
    color: '#059669', // Emerald green
    concept: 'Fungsi pengubah kedua dengan perkalian 3 lalu dikurangi 2.',
    image: 'assets/images/cards/G-01.jpeg'
  },
  'G2': {
    id: 'G-02',
    nfcUid: '04:B2:C3:G2',
    name: 'Kartu Fungsi G-02',
    a: 2,
    b: 3,
    formula: 'g(x) = 2x + 3',
    color: '#059669',
    concept: 'Fungsi pengubah kedua dengan perkalian 2 lalu ditambah 3.',
    image: 'assets/images/cards/G-02.jpeg'
  },
  'G3': {
    id: 'G-03',
    nfcUid: '04:B2:C3:G3',
    name: 'Kartu Fungsi G-03',
    a: 4,
    b: 1,
    formula: 'g(x) = 4x + 1',
    color: '#059669',
    concept: 'Fungsi pengubah kedua dengan perkalian 4 lalu ditambah 1.',
    image: 'assets/images/cards/G-03.jpeg'
  },
  'G4': {
    id: 'G-04',
    nfcUid: '04:B2:C3:G4',
    name: 'Kartu Fungsi G-04',
    a: 2,
    b: -1,
    formula: 'g(x) = 2x - 1',
    color: '#059669',
    concept: 'Fungsi pengubah kedua dengan perkalian 2 lalu dikurangi 1.',
    image: 'assets/images/cards/G-04.jpeg'
  },
  'G5': {
    id: 'G-05',
    nfcUid: '04:B2:C3:G5',
    name: 'Kartu Fungsi G-05',
    a: 1,
    b: 5,
    formula: 'g(x) = x + 5',
    color: '#059669',
    concept: 'Fungsi pergeseran kedua: menambahkan 5 pada hasil fungsi pertama.',
    image: 'assets/images/cards/G-05.jpeg'
  }
};

const WORDS_DATA = [
  { id: 'K-01', word: 'AKU', category: 'Subjek' },
  { id: 'K-02', word: 'KAMU', category: 'Subjek' },
  { id: 'K-03', word: 'KAMI', category: 'Subjek' },
  { id: 'K-04', word: 'KITA', category: 'Subjek' },
  { id: 'K-05', word: 'DIA', category: 'Subjek' },
  { id: 'K-06', word: 'MEREKA', category: 'Subjek' },
  { id: 'K-07', word: 'IBU', category: 'Subjek' },
  { id: 'K-08', word: 'AYAH', category: 'Subjek' },
  { id: 'K-09', word: 'KAKAK', category: 'Subjek' },
  { id: 'K-10', word: 'ADIK', category: 'Subjek' },
  { id: 'K-11', word: 'TEMAN', category: 'Subjek' },
  { id: 'K-12', word: 'GURU', category: 'Subjek' },
  { id: 'K-13', word: 'MAKAN', category: 'Predikat' },
  { id: 'K-14', word: 'MINUM', category: 'Predikat' },
  { id: 'K-15', word: 'BELAJAR', category: 'Predikat' },
  { id: 'K-16', word: 'MAIN', category: 'Predikat' },
  { id: 'K-17', word: 'BACA', category: 'Predikat' },
  { id: 'K-18', word: 'TULIS', category: 'Predikat' },
  { id: 'K-19', word: 'BANTU', category: 'Predikat' },
  { id: 'K-20', word: 'LIHAT', category: 'Predikat' },
  { id: 'K-21', word: 'BUKU', category: 'Objek' },
  { id: 'K-22', word: 'BOLA', category: 'Objek' },
  { id: 'K-23', word: 'ROTI', category: 'Objek' },
  { id: 'K-24', word: 'NASI', category: 'Objek' },
  { id: 'K-25', word: 'KELAS', category: 'Keterangan' },
  { id: 'K-26', word: 'RUMAH', category: 'Keterangan' },
  { id: 'K-27', word: 'TAMAN', category: 'Keterangan' },
  { id: 'K-28', word: 'SEKOLAH', category: 'Keterangan' },
  { id: 'K-29', word: 'PASAR', category: 'Keterangan' },
  { id: 'K-30', word: 'LAPANGAN', category: 'Keterangan' },
  { id: 'K-31', word: 'DI', category: 'Preposisi' },
  { id: 'K-32', word: 'KE', category: 'Preposisi' }
];

const CARDS_HELPER = {
  'H-01': {
    id: 'H-01',
    name: 'Kartu Bantu Kuantifikasi Huruf',
    description: 'Tabel konversi huruf kapital A=1 s/d Z=26 dan Spasi=0.',
    image: 'assets/images/cards/H-01.jpeg'
  },
  'H-02': {
    id: 'H-02',
    name: 'Kartu Panduan Alur Operasi',
    description: 'Langkah alur enkripsi, alur dekripsi, dan integritas matematika.',
    image: 'assets/images/cards/H-02.jpeg'
  }
};
