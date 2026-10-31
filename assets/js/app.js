/**
 * APP CONTROLLER & INTERACTION ENGINE
 * Game Edukasi Kriptografi Matematika "SECRET MESSAGE"
 * SMK Telkom Purwokerto - XI PPLG 1
 */

const App = {
  currentOp: 'gof',
  currentDecOp: 'gof',

  init() {
    this.setupDropdowns();
    this.setupQuickWords();
    this.setupAlphabetGrid();
    this.updateEncryption();
    this.updateDecryption();

    // Start background NFC listener automatically on Android Chrome
    if (window.NFCReader) {
      NFCReader.initAutoReader();
    }

    // Cek parameter URL (misal: saat kartu NFC di-tap dari luar browser: ?card=F-01)
    const urlParams = new URLSearchParams(window.location.search);
    const cardParam = urlParams.get('card');
    const tabParam = urlParams.get('tab');

    if (tabParam) {
      this.switchTab(tabParam);
    }

    if (cardParam && window.NFCReader) {
      setTimeout(() => {
        NFCReader.handleCardData(cardParam);
      }, 350);
    }
  },

  // 1. Tab Switching Controller
  switchTab(tabId) {
    const tabs = ['tab-encrypt', 'tab-decrypt', 'tab-alphabet', 'tab-rules'];
    tabs.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });

    const target = document.getElementById(tabId);
    if (target) target.classList.remove('hidden');

    // Update active tab buttons (desktop & mobile)
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });

    const activeBtn = document.getElementById('btn-' + tabId);
    if (activeBtn) activeBtn.classList.add('active');

    const mActiveBtn = document.getElementById('m-btn-' + tabId);
    if (mActiveBtn) mActiveBtn.classList.add('active');

    if (window.lucide) lucide.createIcons();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // 2. Encryption Controller
  setOperation(op) {
    this.currentOp = op;
    const btnGof = document.getElementById('btn-op-gof');
    const btnFog = document.getElementById('btn-op-fog');

    if (op === 'gof') {
      btnGof.className = 'py-2.5 px-3 rounded-xl border-2 border-telkom-600 bg-rose-50/50 font-mono font-extrabold text-xs sm:text-sm text-telkom-800 shadow-sm flex items-center justify-center gap-1.5 transition';
      btnFog.className = 'py-2.5 px-3 rounded-xl border border-slate-300 bg-white font-mono font-semibold text-xs sm:text-sm text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition';
    } else {
      btnFog.className = 'py-2.5 px-3 rounded-xl border-2 border-telkom-600 bg-rose-50/50 font-mono font-extrabold text-xs sm:text-sm text-telkom-800 shadow-sm flex items-center justify-center gap-1.5 transition';
      btnGof.className = 'py-2.5 px-3 rounded-xl border border-slate-300 bg-white font-mono font-semibold text-xs sm:text-sm text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition';
    }
    this.updateEncryption();
  },

  updateEncryption() {
    const fKey = document.getElementById('select-fx').value;
    const gKey = document.getElementById('select-gx').value;
    const f = CARDS_F[fKey];
    const g = CARDS_G[gKey];

    // Update Card UI displays
    document.getElementById('badge-fx').innerText = f.id;
    document.getElementById('formula-fx').innerText = f.formula;
    document.getElementById('img-thumb-fx').src = f.image;

    document.getElementById('badge-gx').innerText = g.id;
    document.getElementById('formula-gx').innerText = g.formula;
    document.getElementById('img-thumb-gx').src = g.image;

    // Compose
    const comp = CipherEngine.compose(f, g, this.currentOp);
    document.getElementById('formula-comp').innerText = comp.title;

    // Render 6 Detailed Educational Steps
    const stepsContainer = document.getElementById('edu-steps-encrypt');
    if (stepsContainer) {
      stepsContainer.innerHTML = '';
      comp.steps.forEach((st, idx) => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'p-4 bg-slate-50/80 hover:bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-sm transition space-y-2 flex flex-col justify-between';
        stepDiv.innerHTML = `
          <div class="space-y-1.5">
            <div class="flex items-center justify-between gap-2">
              <span class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-100 text-telkom-700">
                Tahap ${idx + 1}
              </span>
              <span class="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200/60">
                ${st.badge}
              </span>
            </div>
            <h4 class="font-bold text-slate-800 text-xs sm:text-sm leading-tight">${st.label}</h4>
          </div>
          <div class="py-2.5 px-3 bg-white rounded-xl border border-slate-200 font-mono text-xs sm:text-sm font-bold text-slate-900 shadow-2xs overflow-x-auto">
            ${st.math}
          </div>
          <p class="text-[11px] sm:text-xs text-slate-600 leading-relaxed">${st.explanation}</p>
        `;
        stepsContainer.appendChild(stepDiv);
      });
    }

    // Encrypt Text
    const text = document.getElementById('input-plaintext').value.toUpperCase();
    const encResult = CipherEngine.encrypt(text, comp.compA, comp.compB);

    // Render Spotlight / Real Walkthrough Example
    const sampleContainer = document.getElementById('edu-sample-encrypt');
    if (sampleContainer) {
      if (encResult.rows.length > 0) {
        const firstRow = encResult.rows[0];
        const sample = CipherEngine.getEncryptSample(firstRow, comp.compA, comp.compB, this.currentOp === 'gof' ? '(g ∘ f)' : '(f ∘ g)');
        sampleContainer.innerHTML = `
          <div class="space-y-3">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-rose-100">
              <div class="flex items-center gap-2.5">
                <span class="w-8 h-8 rounded-xl bg-telkom-700 text-white font-mono font-black text-sm flex items-center justify-center shadow-xs shrink-0">
                  ${sample.char === ' ' ? '␣' : sample.char}
                </span>
                <div>
                  <div class="text-xs sm:text-sm font-extrabold text-slate-900">
                    Bedah Hitungan Karakter ${sample.charName} (Nilai Asli x = ${sample.valX})
                  </div>
                  <p class="text-[11px] text-slate-500">Alur aljabar bagaimana rumus mengubah huruf ini menjadi angka sandi.</p>
                </div>
              </div>
              <div class="text-left sm:text-right font-mono text-xs">
                <span class="text-slate-500 font-semibold">Hasil Sandi:</span>
                <span class="font-black text-base text-telkom-700 ml-1">${sample.finalVal}</span>
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs font-mono">
              <div class="p-2.5 bg-white rounded-xl border border-slate-200">
                <div class="text-[10px] text-slate-400 font-sans font-bold uppercase mb-0.5">1. Kuantifikasi Huruf</div>
                <div class="font-bold text-slate-800">${sample.charName} &rarr; x = ${sample.valX}</div>
              </div>
              <div class="p-2.5 bg-white rounded-xl border border-slate-200">
                <div class="text-[10px] text-slate-400 font-sans font-bold uppercase mb-0.5">2. Masukkan ke Rumus</div>
                <div class="font-bold text-slate-800">${sample.compA}(${sample.valX}) ${sample.compB >= 0 ? '+' : '-'} ${Math.abs(sample.compB)}</div>
              </div>
              <div class="p-2.5 bg-white rounded-xl border border-slate-200">
                <div class="text-[10px] text-slate-400 font-sans font-bold uppercase mb-0.5">3. Kalikan Koefisien</div>
                <div class="font-bold text-slate-800">${sample.compA * sample.valX} ${sample.compB >= 0 ? '+' : '-'} ${Math.abs(sample.compB)}</div>
              </div>
              <div class="p-2.5 bg-white rounded-xl border border-rose-300 bg-rose-50/40">
                <div class="text-[10px] text-rose-700 font-sans font-bold uppercase mb-0.5">4. Hasil Sandi Final (y)</div>
                <div class="font-black text-telkom-700 text-sm">= ${sample.finalVal}</div>
              </div>
            </div>
            <p class="text-xs text-slate-600 bg-white/80 p-2.5 rounded-xl border border-slate-200/60 leading-relaxed font-sans">
              <strong class="text-slate-800">Penjelasan Aljabar Siswa:</strong> ${sample.explanation}
            </p>
          </div>
        `;
      } else {
        sampleContainer.innerHTML = '<p class="text-xs text-slate-500 italic text-center py-2">Ketik kalimat pesan di atas untuk memunculkan bedah contoh hitungan nyata.</p>';
      }
    }

    // Render Table Rows
    const tbody = document.getElementById('table-encrypt-rows');
    tbody.innerHTML = '';

    encResult.rows.forEach(r => {
      const tr = document.createElement('tr');
      tr.className = 'hover:bg-slate-50 transition font-mono text-sm';
      const isSpace = r.char === ' ';
      tr.innerHTML = `
        <td class="p-3 text-slate-400 font-medium">${r.index}</td>
        <td class="p-3 font-bold ${isSpace ? 'text-rose-600' : 'text-slate-900'}">${isSpace ? '<span class="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-xs font-sans font-bold">SPASI</span>' : r.char}</td>
        <td class="p-3 font-bold text-slate-700">${r.valX}</td>
        <td class="p-3 text-slate-600 text-xs sm:text-sm">${r.calcStr}</td>
        <td class="p-3 text-right font-black text-base text-telkom-700">${r.valY}</td>
      `;
      tbody.appendChild(tr);
    });

    document.getElementById('final-cipher-string').innerText = encResult.cipherString || '-';
    document.getElementById('space-code-val').innerText = comp.compB;
    if (window.lucide) lucide.createIcons();

    // Otomatis sinkronkan halaman & state Dekripsi agar langsung menyesuaikan dengan Enkripsi
    this.syncToDecryption();
  },

  // Sinkronisasi Real-Time: Mentransfer f(x), g(x), operasi, dan deretan sandi ke Dekripsi
  syncToDecryption() {
    const selFx = document.getElementById('select-fx');
    const selGx = document.getElementById('select-gx');
    const fKey = selFx ? selFx.value : 'F1';
    const gKey = selGx ? selGx.value : 'G1';
    const cipherText = document.getElementById('final-cipher-string')?.innerText;

    // 1. Sinkronkan pilihan kartu fungsi
    const decFx = document.getElementById('dec-select-fx');
    const decGx = document.getElementById('dec-select-gx');
    if (decFx) decFx.value = fKey;
    if (decGx) decGx.value = gKey;

    // 2. Sinkronkan urutan operasi komposisi & invers
    this.currentDecOp = this.currentOp;
    const btnGof = document.getElementById('dec-btn-gof');
    const btnFog = document.getElementById('dec-btn-fog');
    if (btnGof && btnFog) {
      if (this.currentOp === 'gof') {
        btnGof.className = 'py-2.5 px-3 rounded-xl border-2 border-sky-600 bg-sky-50/50 font-mono font-extrabold text-xs sm:text-sm text-sky-800 shadow-sm flex items-center justify-center gap-1.5 transition';
        btnFog.className = 'py-2.5 px-3 rounded-xl border border-slate-300 bg-white font-mono font-semibold text-xs sm:text-sm text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition';
      } else {
        btnFog.className = 'py-2.5 px-3 rounded-xl border-2 border-sky-600 bg-sky-50/50 font-mono font-extrabold text-xs sm:text-sm text-sky-800 shadow-sm flex items-center justify-center gap-1.5 transition';
        btnGof.className = 'py-2.5 px-3 rounded-xl border border-slate-300 bg-white font-mono font-semibold text-xs sm:text-sm text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition';
      }
    }

    // 3. Sinkronkan deretan angka sandi yang dihasilkan enkripsi
    const decInput = document.getElementById('input-cipher');
    if (decInput && cipherText && cipherText !== '-') {
      decInput.value = cipherText;
    }

    // 4. Kalkulasi ulang dekripsi
    this.updateDecryption();
  },

  goToDecrypt() {
    this.syncToDecryption();
    this.switchTab('tab-decrypt');
    if (window.NFCReader) {
      NFCReader.showToast('Data & kode sandi berhasil disinkronkan ke Dekripsi!');
    }
  },

  syncNow() {
    this.syncToDecryption();
    if (window.NFCReader) {
      NFCReader.showToast('Berhasil menarik dan menyinkronkan data dari Enkripsi!');
    }
  },

  // 3. Decryption Controller
  setDecOperation(op) {
    this.currentDecOp = op;
    const btnGof = document.getElementById('dec-btn-gof');
    const btnFog = document.getElementById('dec-btn-fog');

    if (op === 'gof') {
      btnGof.className = 'py-2.5 px-3 rounded-xl border-2 border-sky-600 bg-sky-50/50 font-mono font-extrabold text-xs sm:text-sm text-sky-800 shadow-sm flex items-center justify-center gap-1.5 transition';
      btnFog.className = 'py-2.5 px-3 rounded-xl border border-slate-300 bg-white font-mono font-semibold text-xs sm:text-sm text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition';
    } else {
      btnFog.className = 'py-2.5 px-3 rounded-xl border-2 border-sky-600 bg-sky-50/50 font-mono font-extrabold text-xs sm:text-sm text-sky-800 shadow-sm flex items-center justify-center gap-1.5 transition';
      btnGof.className = 'py-2.5 px-3 rounded-xl border border-slate-300 bg-white font-mono font-semibold text-xs sm:text-sm text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition';
    }
    this.updateDecryption();
  },

  updateDecryption() {
    const fKey = document.getElementById('dec-select-fx').value;
    const gKey = document.getElementById('dec-select-gx').value;
    const f = CARDS_F[fKey];
    const g = CARDS_G[gKey];

    document.getElementById('dec-badge-fx').innerText = f.id;
    document.getElementById('dec-formula-fx').innerText = f.formula;
    document.getElementById('dec-img-thumb-fx').src = f.image;

    document.getElementById('dec-badge-gx').innerText = g.id;
    document.getElementById('dec-formula-gx').innerText = g.formula;
    document.getElementById('dec-img-thumb-gx').src = g.image;

    const comp = CipherEngine.compose(f, g, this.currentDecOp);
    const opSym = this.currentDecOp === 'gof' ? '(g ∘ f)' : '(f ∘ g)';
    const inv = CipherEngine.deriveInverse(comp.compA, comp.compB, opSym);

    const invFormulaEl = document.getElementById('dec-formula-invers');
    if (invFormulaEl) {
      invFormulaEl.innerHTML = inv.formulaHTML || inv.formulaString;
    }

    // Render 6 Detailed Educational Steps for Inversion
    const stepsContainer = document.getElementById('edu-steps-decrypt');
    if (stepsContainer) {
      stepsContainer.innerHTML = '';
      inv.steps.forEach((st, idx) => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'p-4 bg-slate-50/80 hover:bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-sm transition space-y-2 flex flex-col justify-between';
        stepDiv.innerHTML = `
          <div class="space-y-1.5">
            <div class="flex items-center justify-between gap-2">
              <span class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-sky-100 text-sky-800">
                Tahap ${idx + 1}
              </span>
              <span class="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200/60">
                ${st.badge}
              </span>
            </div>
            <h4 class="font-bold text-slate-800 text-xs sm:text-sm leading-tight">${st.label}</h4>
          </div>
          <div class="py-2.5 px-3 bg-white rounded-xl border border-slate-200 font-mono text-xs sm:text-sm font-bold text-slate-900 shadow-2xs overflow-x-auto">
            ${st.math}
          </div>
          <p class="text-[11px] sm:text-xs text-slate-600 leading-relaxed">${st.explanation}</p>
        `;
        stepsContainer.appendChild(stepDiv);
      });
    }

    // Parse input cipher numbers
    const rawInput = document.getElementById('input-cipher').value;
    const numbers = rawInput.split(/[\s,\-]+/).map(n => parseInt(n.trim())).filter(n => !isNaN(n));

    const decResult = CipherEngine.decrypt(numbers, comp.compA, comp.compB);

    // Render Spotlight / Real Walkthrough Example for Decryption
    const sampleContainer = document.getElementById('edu-sample-decrypt');
    if (sampleContainer) {
      if (decResult.rows.length > 0) {
        const firstRow = decResult.rows[0];
        const sample = CipherEngine.getDecryptSample(firstRow.valY, comp.compA, comp.compB, opSym);
        sampleContainer.innerHTML = `
          <div class="space-y-3">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-sky-100">
              <div class="flex items-center gap-2.5">
                <span class="w-8 h-8 rounded-xl bg-sky-800 text-white font-mono font-black text-sm flex items-center justify-center shadow-xs shrink-0">
                  ${sample.valY}
                </span>
                <div>
                  <div class="text-xs sm:text-sm font-extrabold text-slate-900">
                    Bedah Pembalikan Sandi Angka ${sample.valY} (Menemukan Huruf Asli x)
                  </div>
                  <p class="text-[11px] text-slate-500">Alur aljabar bagaimana fungsi invers mengembalikan angka sandi ke huruf aslinya.</p>
                </div>
              </div>
              <div class="text-left sm:text-right font-mono text-xs">
                <span class="text-slate-500 font-semibold">Huruf Terungkap:</span>
                <span class="font-black text-base text-sky-800 ml-1">${sample.charName} (${sample.valX})</span>
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs font-mono">
              <div class="p-2.5 bg-white rounded-xl border border-slate-200">
                <div class="text-[10px] text-slate-400 font-sans font-bold uppercase mb-0.5">1. Angka Sandi (y)</div>
                <div class="font-bold text-slate-800">y = ${sample.valY}</div>
              </div>
              <div class="p-2.5 bg-white rounded-xl border border-slate-200">
                <div class="text-[10px] text-slate-400 font-sans font-bold uppercase mb-0.5">2. Substitusi ke Invers</div>
                <div class="font-bold text-slate-800 flex items-center">x = ${sample.fractionStep}</div>
              </div>
              <div class="p-2.5 bg-white rounded-xl border border-slate-200">
                <div class="text-[10px] text-slate-400 font-sans font-bold uppercase mb-0.5">3. Hitung Pembilang</div>
                <div class="font-bold text-slate-800 flex items-center">x = ${sample.reducedFraction}</div>
              </div>
              <div class="p-2.5 bg-white rounded-xl border border-sky-300 bg-sky-50/40">
                <div class="text-[10px] text-sky-800 font-sans font-bold uppercase mb-0.5">4. Hasil Nilai Huruf</div>
                <div class="font-black text-sky-800 text-sm">x = ${sample.valX} &rarr; ${sample.charName}</div>
              </div>
            </div>
            <p class="text-xs text-slate-600 bg-white/80 p-2.5 rounded-xl border border-slate-200/60 leading-relaxed font-sans">
              <strong class="text-slate-800">Penjelasan Aljabar Siswa:</strong> ${sample.explanation}
            </p>
          </div>
        `;
      } else {
        sampleContainer.innerHTML = '<p class="text-xs text-slate-500 italic text-center py-2">Masukkan angka kode sandi di atas untuk memunculkan bedah contoh hitungan pembalikan nyata.</p>';
      }
    }

    // Render Table Rows
    const tbody = document.getElementById('table-decrypt-rows');
    tbody.innerHTML = '';

    decResult.rows.forEach(r => {
      const tr = document.createElement('tr');
      tr.className = 'hover:bg-slate-50 transition font-mono text-sm';
      const isSpace = r.char === ' ';
      tr.innerHTML = `
        <td class="p-3 text-slate-400 font-medium">${r.index}</td>
        <td class="p-3 font-black text-sky-800 text-base">${r.valY}</td>
        <td class="p-3 text-slate-600 text-xs sm:text-sm">${r.calcStr}</td>
        <td class="p-3 font-bold ${r.isInteger ? 'text-slate-900' : 'text-rose-600'}">${r.isInteger ? r.valX : r.valX.toFixed(2) + ' (Di luar batas)'}</td>
        <td class="p-3 text-right font-black text-lg ${isSpace ? 'text-sky-600' : 'text-slate-900'}">${isSpace ? '<span class="px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-xs font-sans font-bold">SPASI</span>' : r.char}</td>
      `;
      tbody.appendChild(tr);
    });

    document.getElementById('final-decrypted-text').innerText = decResult.decryptedText || '-';
    if (window.lucide) lucide.createIcons();
  },

  // 4. Quick Words Setup
  setupQuickWords() {
    const container = document.getElementById('word-chips');
    if (!container) return;
    container.innerHTML = '';

    WORDS_DATA.forEach(w => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'px-3 py-1.5 text-xs font-mono font-bold bg-white hover:bg-rose-50 text-slate-700 hover:text-telkom-700 border border-slate-200 rounded-lg transition card-hover-effect';
      chip.innerText = w.word;
      chip.onclick = () => {
        const input = document.getElementById('input-plaintext');
        let cur = input.value.trim();
        input.value = cur ? cur + ' ' + w.word : w.word;
        App.updateEncryption();
      };
      container.appendChild(chip);
    });
  },

  // 5. Dropdowns Setup
  setupDropdowns() {
    // Already populated in HTML
  },

  // 6. Calculator Keypad Setup (1 Baris Isi 3 Kotakan di HP)
  setupAlphabetGrid() {
    this.setupCalculatorKeypad();
  },

  setupCalculatorKeypad() {
    const grid = document.getElementById('calc-keypad-grid');
    if (!grid) return;
    grid.innerHTML = '';

    // 26 Huruf: A sampai Z
    for (let i = 1; i <= 26; i++) {
      const char = String.fromCharCode(64 + i);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'calc-key-btn bg-white hover:bg-rose-50 border-2 border-slate-200 hover:border-telkom-500 rounded-2xl py-2.5 px-1.5 sm:py-3 sm:px-2 text-center transition active:scale-95 shadow-2xs flex flex-col items-center justify-center gap-1 group cursor-pointer';
      btn.onclick = () => App.calcPressKey(char);
      btn.innerHTML = `
        <span class="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-telkom-700 leading-none">${char}</span>
        <span class="text-[11px] sm:text-xs font-extrabold text-telkom-700 bg-rose-50 group-hover:bg-rose-100 px-2 py-0.5 rounded-full border border-rose-200/80">${i}</span>
      `;
      grid.appendChild(btn);
    }

    // Kotak ke-27: SPASI = 0 (Menjadikan tepat 9 baris x 3 kolom)
    const spaceBtn = document.createElement('button');
    spaceBtn.type = 'button';
    spaceBtn.className = 'calc-key-btn bg-slate-100 hover:bg-rose-50 border-2 border-dashed border-rose-300 hover:border-telkom-500 rounded-2xl py-2.5 px-1.5 sm:py-3 sm:px-2 text-center transition active:scale-95 shadow-2xs flex flex-col items-center justify-center gap-1 group cursor-pointer';
    spaceBtn.onclick = () => App.calcPressKey(' ');
    spaceBtn.innerHTML = `
      <span class="text-xs sm:text-sm font-black text-slate-800 group-hover:text-telkom-700 leading-none flex items-center gap-1">␣ SPASI</span>
      <span class="text-[11px] sm:text-xs font-black text-white bg-telkom-700 px-2.5 py-0.5 rounded-full shadow-2xs">0</span>
    `;
    grid.appendChild(spaceBtn);

    this.updateCalcDisplay();
  },

  calcPressKey(char) {
    const input = document.getElementById('calc-input-text');
    if (!input) return;
    input.value += char;
    this.updateCalcDisplay();
  },

  calcBackspace() {
    const input = document.getElementById('calc-input-text');
    if (!input || !input.value) return;
    input.value = input.value.slice(0, -1);
    this.updateCalcDisplay();
  },

  calcClear() {
    const input = document.getElementById('calc-input-text');
    if (!input) return;
    input.value = '';
    this.updateCalcDisplay();
  },

  onCalcTextInput() {
    this.updateCalcDisplay();
  },

  updateCalcDisplay() {
    const input = document.getElementById('calc-input-text');
    const output = document.getElementById('calc-output-numbers');
    const countEl = document.getElementById('calc-char-count');
    if (!input || !output) return;

    const text = input.value.toUpperCase();
    if (countEl) {
      countEl.innerText = `${text.length} karakter`;
    }

    const numbers = [];
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (ALPHABET_MAP[c] !== undefined) {
        numbers.push(ALPHABET_MAP[c]);
      }
    }

    output.innerText = numbers.length > 0 ? numbers.join(', ') : '-';
  },

  copyCalcNumbers() {
    const output = document.getElementById('calc-output-numbers');
    if (!output || output.innerText === '-') return;
    navigator.clipboard.writeText(output.innerText).then(() => {
      if (window.NFCReader) {
        NFCReader.showToast('Angka kuantifikasi berhasil disalin!');
      }
    });
  },

  applyCalcToEncrypt() {
    const input = document.getElementById('calc-input-text');
    if (!input || !input.value.trim()) {
      if (window.NFCReader) {
        NFCReader.showToast('Ketik atau tekan huruf terlebih dahulu!');
      }
      return;
    }
    const encInput = document.getElementById('input-plaintext');
    if (encInput) {
      encInput.value = input.value.toUpperCase().trim();
    }
    this.updateEncryption();
    this.switchTab('tab-encrypt');
    if (window.NFCReader) {
      NFCReader.showToast('Kalimat berhasil dipasang ke mode Enkripsi!');
    }
  },

  liveConvert() {
    this.updateCalcDisplay();
  },

  // 7. Utility: Copy to Clipboard
  copyCipher() {
    const text = document.getElementById('final-cipher-string').innerText;
    navigator.clipboard.writeText(text).then(() => {
      NFCReader.showToast('Deretan angka sandi berhasil disalin!');
    });
  },

  loadSample() {
    document.getElementById('input-cipher').value = '19, 37, 67, 79, 13, 91, 19, 67, 97, 13, 25, 103, 85, 19';
    document.getElementById('dec-select-fx').value = 'F1';
    document.getElementById('dec-select-gx').value = 'G1';
    this.setDecOperation('gof');
    this.updateDecryption();
    NFCReader.showToast('Contoh sandi berhasil dimuat!');
  }

};

window.addEventListener('DOMContentLoaded', () => {
  App.init();
});