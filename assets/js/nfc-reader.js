/**
 * AMBIENT WEB NFC READER & CARD SCANNER
 * Mendeteksi tap kartu fisik langsung di latar belakang tanpa tombol simulator yang mengganggu.
 */

const NFCReader = {
  isScanning: false,
  ndef: null,

  initAutoReader() {
    this.updateStatusPill();
    return this.init();
  },

  async init() {
    if (!('NDEFReader' in window)) {
      this.updateStatusPill('unsupported');
      return;
    }

    try {
      if (!this.ndef) {
        this.ndef = new NDEFReader();
      }
      await this.ndef.scan();
      this.isScanning = true;
      this.updateStatusPill('active');

      this.ndef.addEventListener('reading', ({ message, serialNumber }) => {
        let textData = '';
        for (const record of message.records) {
          if (record.recordType === 'text') {
            const textDecoder = new TextDecoder(record.encoding || 'utf-8');
            textData = textDecoder.decode(record.data);
          } else if (record.recordType === 'url') {
            const textDecoder = new TextDecoder();
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
      this.isScanning = false;
      this.updateStatusPill('waiting_click');
    }
  },

  async manualActivate() {
    if (!('NDEFReader' in window)) {
      this.showToast('Browser ini belum mendukung Web NFC. Gunakan Chrome di HP Android.');
      return;
    }
    await this.init();
    if (this.isScanning) {
      this.showToast('✅ Sensor NFC Browser Aktif! Tempelkan kartu kapan saja.');
    }
  },

  updateStatusPill(status) {
    const pill = document.getElementById('nfc-live-pill');
    const text = document.getElementById('nfc-live-text');
    const dot = document.getElementById('nfc-live-dot');
    if (!pill || !text) return;

    if (status === 'active' || this.isScanning) {
      pill.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition border border-emerald-300 bg-emerald-50 text-emerald-800 shadow-2xs';
      text.innerText = 'NFC Siap Tap';
      if (dot) dot.className = 'w-2 h-2 rounded-full bg-emerald-500 animate-pulse';
    } else if (status === 'unsupported') {
      pill.classList.add('hidden');
    } else {
      pill.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition border border-rose-300 bg-rose-50 text-telkom-700 shadow-2xs cursor-pointer hover:bg-rose-100';
      text.innerText = 'Aktifkan NFC Tap';
      if (dot) dot.className = 'w-2 h-2 rounded-full bg-rose-500';
    }
  },

  // Process detected card code (bisa ID langsung 'F-01', atau URL 'https://.../?card=F-01')
  handleCardData(code, serialNumber = '') {
    if (!code) return;
    code = code.trim();

    // Jika input berupa URL atau query param, ambil nilai param 'card'
    if (code.includes('card=')) {
      try {
        const parsedUrl = new URL(code, window.location.origin);
        const cardVal = parsedUrl.searchParams.get('card');
        if (cardVal) code = cardVal;
      } catch (e) {
        const match = code.match(/card=([A-Za-z0-9_-]+)/i);
        if (match && match[1]) code = match[1];
      }
    }

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
      // Langsung ubah dropdown / nilai tanpa perlu modal yang mengganggu
      this.applyCardDirectly(cardInfo);
    } else {
      this.showToast(`Kartu NFC terdeteksi: "${code}".`);
    }
  },

  // Langsung terapkan kartu ke aplikasi (Drop-in Dropdown Replacement)
  applyCardDirectly(cardInfo) {
    if (!cardInfo) return;

    if (cardInfo.type === 'f') {
      const selFx = document.getElementById('select-fx');
      const decFx = document.getElementById('dec-select-fx');
      if (selFx) selFx.value = cardInfo.key;
      if (decFx) decFx.value = cardInfo.key;

      // Update kalkulasi tanpa mereset kartu g(x)!
      App.updateEncryption();
      App.updateDecryption();
      App.saveState();

      this.showToast(`⚡ NFC: Kartu f(x) diganti ke ${cardInfo.data.id} (${cardInfo.data.formula})`);
      if (navigator.vibrate) navigator.vibrate(50);

    } else if (cardInfo.type === 'g') {
      const selGx = document.getElementById('select-gx');
      const decGx = document.getElementById('dec-select-gx');
      if (selGx) selGx.value = cardInfo.key;
      if (decGx) decGx.value = cardInfo.key;

      // Update kalkulasi tanpa mereset kartu f(x)!
      App.updateEncryption();
      App.updateDecryption();
      App.saveState();

      this.showToast(`⚡ NFC: Kartu g(x) diganti ke ${cardInfo.data.id} (${cardInfo.data.formula})`);
      if (navigator.vibrate) navigator.vibrate(50);

    } else if (cardInfo.type === 'word') {
      const input = document.getElementById('input-plaintext');
      if (input) {
        let cur = input.value.trim();
        input.value = cur ? cur + ' ' + cardInfo.data.word : cardInfo.data.word;
      }
      App.updateEncryption();
      App.saveState();

      this.showToast(`⚡ NFC: Kata "${cardInfo.data.word}" ditambahkan ke kalimat!`);
      if (navigator.vibrate) navigator.vibrate(50);

    } else if (cardInfo.type === 'helper') {
      if (cardInfo.key === 'H-01') {
        App.switchTab('tab-alphabet');
        this.showToast(`⚡ NFC: Membuka Kalkulator Kuantifikasi Huruf`);
      } else if (cardInfo.key === 'H-02') {
        App.switchTab('tab-rules');
        this.showToast(`⚡ NFC: Membuka Panduan Aturan & Operasi`);
      }
      if (navigator.vibrate) navigator.vibrate(50);
    }

    // Bersihkan URL query parameter agar tidak memicu reload jika browser di-refresh
    if (window.location.search) {
      window.history.replaceState({}, document.title, window.location.pathname);
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
          <span class="text-sm font-semibold text-rose-900">${card.id === 'H-01' ? 'Tabel konversi huruf kapital A=1 s/d Z=26 dan Spasi=0.' : 'Panduan alur rumus enkripsi, dekripsi, dan integritas aljabar.'}</span>
        </div>
      `;
      actionsEl.innerHTML = card.id === 'H-01' ? `
        <button onclick="App.switchTab('tab-alphabet'); NFCReader.closeNfcModal();" class="w-full py-2.5 px-4 bg-telkom-700 hover:bg-telkom-800 text-white text-xs font-bold rounded-xl transition">
          Buka Kalkulator Kuantifikasi
        </button>
      ` : `
        <button onclick="App.switchTab('tab-rules'); NFCReader.closeNfcModal();" class="w-full py-2.5 px-4 bg-telkom-700 hover:bg-telkom-800 text-white text-xs font-bold rounded-xl transition">
          Buka Panduan Aturan & Aljabar
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
