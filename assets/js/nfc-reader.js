/**
 * AMBIENT WEB NFC READER & CARD SCANNER
 * Mendeteksi tap kartu fisik langsung di latar belakang tanpa tombol simulator yang mengganggu.
 */

const NFCReader = {
  isScanning: false,
  ndef: null,

  initAutoReader() {
    return this.init();
  },

  async init() {
    if ('NDEFReader' in window) {
      try {
        this.ndef = new NDEFReader();
        await this.ndef.scan();
        this.isScanning = true;

        this.ndef.addEventListener('reading', ({ message, serialNumber }) => {
          let textData = '';
          for (const record of message.records) {
            if (record.recordType === 'text') {
              const textDecoder = new TextDecoder(record.encoding || 'utf-8');
              textData = textDecoder.decode(record.data);
            }
          }
          if (textData) {
            this.handleCardData(textData.trim(), serialNumber);
          }
        });

        this.ndef.addEventListener('readingerror', () => {
          this.showToast('Gagal membaca kartu NFC. Coba tempelkan ulang.');
        });

      } catch (err) {
        console.log('NFC standby or waiting for user tap');
      }
    }
  },

  // Process detected card code
  handleCardData(code, serialNumber = '') {
    code = code.toUpperCase().trim();
    let cardInfo = null;

    // 1. Kartu f(x): F-01 .. F-05
    for (let key in CARDS_F) {
      if (CARDS_F[key].id === code || code === key) {
        cardInfo = { type: 'f', key: key, data: CARDS_F[key] };
        break;
      }
    }

    // 2. Kartu g(x): G-01 .. G-05
    if (!cardInfo) {
      for (let key in CARDS_G) {
        if (CARDS_G[key].id === code || code === key) {
          cardInfo = { type: 'g', key: key, data: CARDS_G[key] };
          break;
        }
      }
    }

    // 3. Kartu Kata: K-01 .. K-32
    if (!cardInfo) {
      for (let item of WORDS_DATA) {
        if (item.id === code || item.word === code) {
          cardInfo = { type: 'word', data: item };
          break;
        }
      }
    }

    // 4. Kartu Bantu: H-01 or H-02
    if (!cardInfo) {
      if (CARDS_HELPER[code]) {
        cardInfo = { type: 'helper', key: code, data: CARDS_HELPER[code] };
      }
    }

    if (cardInfo) {
      this.openNfcModal(cardInfo);
    } else {
      this.showToast(`Kartu NFC terdeteksi: "${code}".`);
    }
  },

  // Modal interaktif saat kartu fisik ditempelkan
  openNfcModal(cardInfo) {
    const modal = document.getElementById('nfc-card-modal');
    if (!modal) return;

    const imgEl = document.getElementById('nfc-modal-img');
    const badgeEl = document.getElementById('nfc-modal-badge');
    const titleEl = document.getElementById('nfc-modal-title');
    const descEl = document.getElementById('nfc-modal-desc');
    const mathEl = document.getElementById('nfc-modal-math');
    const actionsEl = document.getElementById('nfc-modal-actions');

    if (cardInfo.type === 'f') {
      const card = cardInfo.data;
      badgeEl.className = 'px-2.5 py-0.5 rounded text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200';
      badgeEl.innerText = card.id;
      titleEl.innerText = card.name;
      descEl.innerText = card.concept;
      mathEl.innerHTML = `
        <div class="p-3 bg-sky-50 border border-sky-200 rounded-xl text-center">
          <span class="text-xs text-sky-600 block font-semibold mb-0.5">Rumus Fungsi:</span>
          <span class="text-2xl font-mono font-bold text-sky-900">${card.formula}</span>
        </div>
      `;
      actionsEl.innerHTML = `
        <button onclick="NFCReader.applyCardToEncrypt('${cardInfo.key}', 'f')" class="flex-1 py-2.5 px-4 bg-telkom-700 hover:bg-telkom-800 text-white text-xs font-bold rounded-xl transition">
          Gunakan di Enkripsi
        </button>
        <button onclick="NFCReader.applyCardToDecrypt('${cardInfo.key}', 'f')" class="flex-1 py-2.5 px-4 bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold rounded-xl transition">
          Gunakan di Dekripsi
        </button>
      `;
      imgEl.src = card.image;

    } else if (cardInfo.type === 'g') {
      const card = cardInfo.data;
      badgeEl.className = 'px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200';
      badgeEl.innerText = card.id;
      titleEl.innerText = card.name;
      descEl.innerText = card.concept;
      mathEl.innerHTML = `
        <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
          <span class="text-xs text-emerald-600 block font-semibold mb-0.5">Rumus Fungsi:</span>
          <span class="text-2xl font-mono font-bold text-emerald-900">${card.formula}</span>
        </div>
      `;
      actionsEl.innerHTML = `
        <button onclick="NFCReader.applyCardToEncrypt('${cardInfo.key}', 'g')" class="flex-1 py-2.5 px-4 bg-telkom-700 hover:bg-telkom-800 text-white text-xs font-bold rounded-xl transition">
          Gunakan di Enkripsi
        </button>
        <button onclick="NFCReader.applyCardToDecrypt('${cardInfo.key}', 'g')" class="flex-1 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition">
          Gunakan di Dekripsi
        </button>
      `;
      imgEl.src = card.image;

    } else if (cardInfo.type === 'word') {
      const card = cardInfo.data;
      badgeEl.className = 'px-2.5 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200';
      badgeEl.innerText = card.id;
      titleEl.innerText = `Kartu Kata: ${card.word}`;
      descEl.innerText = `Kategori Tata Bahasa: ${card.category}.`;

      const letterBreakdown = card.word.split('').map(c => `${c} = ${ALPHABET_MAP[c]}`).join('  •  ');
      mathEl.innerHTML = `
        <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
          <span class="text-xs text-amber-600 block font-semibold mb-0.5">Nilai Huruf:</span>
          <span class="text-base font-mono font-bold text-amber-900">${letterBreakdown}</span>
        </div>
      `;
      actionsEl.innerHTML = `
        <button onclick="NFCReader.appendWordToMessage('${card.word}')" class="w-full py-2.5 px-4 bg-telkom-700 hover:bg-telkom-800 text-white text-xs font-bold rounded-xl transition">
          + Tambahkan Kata ke Kalimat Pesan
        </button>
      `;
      imgEl.src = `assets/images/cards/${card.id}.jpeg`;

    } else if (cardInfo.type === 'helper') {
      const card = cardInfo.data;
      badgeEl.className = 'px-2.5 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200';
      badgeEl.innerText = card.id;
      titleEl.innerText = card.name;
      descEl.innerText = card.description;
      mathEl.innerHTML = `
        <div class="p-3 bg-rose-50 border border-rose-200 rounded-xl text-center">
          <span class="text-xs text-rose-600 block font-semibold mb-0.5">Fungsi Kartu:</span>
          <span class="text-sm font-semibold text-rose-900">Bantuan referensi kuantifikasi huruf dan aturan aljabar.</span>
        </div>
      `;
      actionsEl.innerHTML = `
        <button onclick="App.switchTab('tab-alphabet'); NFCReader.closeNfcModal();" class="w-full py-2.5 px-4 bg-telkom-700 hover:bg-telkom-800 text-white text-xs font-bold rounded-xl transition">
          Buka Tabel Huruf
        </button>
      `;
      imgEl.src = card.image;
    }

    modal.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  },

  closeNfcModal() {
    const modal = document.getElementById('nfc-card-modal');
    if (modal) modal.classList.add('hidden');
  },

  applyCardToEncrypt(key, type) {
    if (type === 'f') {
      const sel = document.getElementById('select-fx');
      if (sel) sel.value = key;
    } else {
      const sel = document.getElementById('select-gx');
      if (sel) sel.value = key;
    }
    App.switchTab('tab-encrypt');
    App.updateEncryption();
    this.closeNfcModal();
    this.showToast(`Kartu berhasil dipasang di Mode Enkripsi!`);
  },

  applyCardToDecrypt(key, type) {
    if (type === 'f') {
      const sel = document.getElementById('dec-select-fx');
      if (sel) sel.value = key;
    } else {
      const sel = document.getElementById('dec-select-gx');
      if (sel) sel.value = key;
    }
    App.switchTab('tab-decrypt');
    App.updateDecryption();
    this.closeNfcModal();
    this.showToast(`Kartu berhasil dipasang di Mode Dekripsi!`);
  },

  appendWordToMessage(word) {
    const input = document.getElementById('input-plaintext');
    if (input) {
      let cur = input.value.trim();
      input.value = cur ? cur + ' ' + word : word;
    }
    App.switchTab('tab-encrypt');
    App.updateEncryption();
    this.closeNfcModal();
    this.showToast(`Kata "${word}" ditambahkan ke kalimat!`);
  },

  showToast(msg) {
    const toast = document.getElementById('app-toast');
    if (toast) {
      toast.innerText = msg;
      toast.classList.remove('translate-y-24', 'opacity-0');
      setTimeout(() => {
        toast.classList.add('translate-y-24', 'opacity-0');
      }, 3000);
    }
  }
};
