/**
 * CIPHER ENGINE & MATHEMATICAL STEP-BY-STEP GENERATOR
 * Modul Edukatif untuk Fungsi Komposisi dan Invers
 * Ditampilkan dalam format matematika bersih & alami (bukan kode mentah komputer)
 */

const CipherEngine = {

  // Helper untuk membuat tampilan pecahan matematika yang rapi dan responsif
  renderFraction(numerator, denominator) {
    return `<span class="inline-flex flex-col text-center align-middle mx-1 font-mono font-bold text-xs sm:text-sm"><span class="border-b-2 border-slate-700 px-1 pb-0.5 leading-tight">${numerator}</span><span class="pt-0.5 leading-tight">${denominator}</span></span>`;
  },

  // 1. Kuantifikasi Teks: A=1 s/d Z=26, Spasi=0
  quantifyText(text) {
    const clean = text.toUpperCase();
    const result = [];
    for (let i = 0; i < clean.length; i++) {
      const char = clean[i];
      const val = ALPHABET_MAP[char] !== undefined ? ALPHABET_MAP[char] : -1;
      result.push({ char, val, index: i + 1 });
    }
    return result;
  },

  // 2. Komposisi dua fungsi linear f dan g (6 Tahap Aljabar Lengkap & Runtut)
  compose(f, g, operation = 'gof') {
    let compA, compB, title, steps;

    if (operation === 'gof') {
      // (g o f)(x) = g(f(x)) = g(a_f*x + b_f) = a_g*(a_f*x + b_f) + b_g
      compA = g.a * f.a;
      const prodB = g.a * f.b;
      compB = prodB + g.b;

      const bSign = compB >= 0 ? `+ ${compB}` : `- ${Math.abs(compB)}`;
      const fbSign = f.b >= 0 ? `+ ${f.b}` : `- ${Math.abs(f.b)}`;
      const gbSign = g.b >= 0 ? `+ ${g.b}` : `- ${Math.abs(g.b)}`;
      const prodBSign = prodB >= 0 ? `+ ${prodB}` : `- ${Math.abs(prodB)}`;

      title = `(g ∘ f)(x) = ${compA}x ${bSign}`;

      steps = [
        {
          label: 'Definisi Fungsi Komposisi',
          badge: 'Konsep',
          math: `(g ∘ f)(x) = g( <span class="fx-color">f(x)</span> )`,
          explanation: 'Fungsi f(x) diproses terlebih dahulu sebagai input ke dalam fungsi g(x).'
        },
        {
          label: 'Substitusi Bentuk Fungsi Dalam',
          badge: 'Substitusi',
          math: `= g( <span class="fx-color">${f.a}x ${fbSign}</span> )`,
          explanation: `Gantikan f(x) dengan seluruh bentuk persamaannya yaitu (${f.a}x ${fbSign}).`
        },
        {
          label: 'Masukkan ke Kerangka Fungsi Luar',
          badge: 'Pemetaan',
          math: `= ${g.a}( <span class="fx-color">${f.a}x ${fbSign}</span> ) ${gbSign}`,
          explanation: `Gantikan setiap variabel x pada fungsi g(x) dengan bentuk kurung (${f.a}x ${fbSign}).`
        },
        {
          label: 'Penjabaran Sifat Distributif',
          badge: 'Aljabar',
          math: `= (${g.a} × ${f.a}x) + (${g.a} × ${f.b >= 0 ? f.b : `(${f.b})`}) ${gbSign} = ${compA}x ${prodBSign} ${gbSign}`,
          explanation: `Buka kurung dengan mengalikan koefisien luar ${g.a} ke setiap suku di dalam kurung.`
        },
        {
          label: 'Pengelompokan Suku Sejenis',
          badge: 'Penyederhanaan',
          math: `= ${compA}x + (${prodB} ${gbSign}) = ${compA}x ${bSign}`,
          explanation: `Gabungkan dan hitung konstanta yang sejenis: ${prodB} ${gbSign} = ${compB >= 0 ? '+' + compB : compB}.`
        },
        {
          label: 'Rumus Operasional Enkripsi Final',
          badge: 'Hasil Akhir',
          math: `<span class="comp-color">(g ∘ f)(x) = ${compA}x ${bSign}</span>`,
          explanation: 'Rumus fungsi sandi tunggal berhasil diperoleh. Setiap angka huruf (x) dimasukkan ke rumus ini.'
        }
      ];
    } else {
      // (f o g)(x) = f(g(x)) = a_f*(a_g*x + b_g) + b_f
      compA = f.a * g.a;
      const prodB = f.a * g.b;
      compB = prodB + f.b;

      const bSign = compB >= 0 ? `+ ${compB}` : `- ${Math.abs(compB)}`;
      const gbSign = g.b >= 0 ? `+ ${g.b}` : `- ${Math.abs(g.b)}`;
      const fbSign = f.b >= 0 ? `+ ${f.b}` : `- ${Math.abs(f.b)}`;
      const prodBSign = prodB >= 0 ? `+ ${prodB}` : `- ${Math.abs(prodB)}`;

      title = `(f ∘ g)(x) = ${compA}x ${bSign}`;

      steps = [
        {
          label: 'Definisi Fungsi Komposisi',
          badge: 'Konsep',
          math: `(f ∘ g)(x) = f( <span class="gx-color">g(x)</span> )`,
          explanation: 'Fungsi g(x) diproses terlebih dahulu sebagai input ke dalam fungsi f(x).'
        },
        {
          label: 'Substitusi Bentuk Fungsi Dalam',
          badge: 'Substitusi',
          math: `= f( <span class="gx-color">${g.a}x ${gbSign}</span> )`,
          explanation: `Gantikan g(x) dengan seluruh bentuk persamaannya yaitu (${g.a}x ${gbSign}).`
        },
        {
          label: 'Masukkan ke Kerangka Fungsi Luar',
          badge: 'Pemetaan',
          math: `= ${f.a}( <span class="gx-color">${g.a}x ${gbSign}</span> ) ${fbSign}`,
          explanation: `Gantikan setiap variabel x pada fungsi f(x) dengan bentuk kurung (${g.a}x ${gbSign}).`
        },
        {
          label: 'Penjabaran Sifat Distributif',
          badge: 'Aljabar',
          math: `= (${f.a} × ${g.a}x) + (${f.a} × ${g.b >= 0 ? g.b : `(${g.b})`}) ${fbSign} = ${compA}x ${prodBSign} ${fbSign}`,
          explanation: `Buka kurung dengan mengalikan koefisien luar ${f.a} ke setiap suku di dalam kurung.`
        },
        {
          label: 'Pengelompokan Suku Sejenis',
          badge: 'Penyederhanaan',
          math: `= ${compA}x + (${prodB} ${fbSign}) = ${compA}x ${bSign}`,
          explanation: `Gabungkan dan hitung konstanta yang sejenis: ${prodB} ${fbSign} = ${compB >= 0 ? '+' + compB : compB}.`
        },
        {
          label: 'Rumus Operasional Enkripsi Final',
          badge: 'Hasil Akhir',
          math: `<span class="comp-color">(f ∘ g)(x) = ${compA}x ${bSign}</span>`,
          explanation: 'Rumus fungsi sandi tunggal berhasil diperoleh. Setiap angka huruf (x) dimasukkan ke rumus ini.'
        }
      ];
    }

    return { compA, compB, title, steps, operation };
  },

  // 3. Penurunan Fungsi Invers secara Aljabar Nyata (6 Tahap Lengkap & Runtut)
  deriveInverse(compA, compB, opSymbol = '(g ∘ f)') {
    const bSign = compB >= 0 ? `- ${compB}` : `+ ${Math.abs(compB)}`;
    const origBSign = compB >= 0 ? `+ ${compB}` : `- ${Math.abs(compB)}`;

    const fractionHTML = this.renderFraction(`y ${bSign}`, compA);

    const steps = [
      {
        label: 'Tulis Persamaan Output Sandi',
        badge: 'Persamaan Awal',
        math: `y = ${compA}x ${origBSign}`,
        explanation: 'Misalkan y adalah angka sandi yang diterima dari pengirim, dan x adalah nilai huruf asli yang dicari.'
      },
      {
        label: 'Isolasi Suku Bervariabel x',
        badge: 'Prinsip Kesetaraan',
        math: `y ${bSign} = ${compA}x`,
        explanation: `Kedua ruas ${compB >= 0 ? 'dikurangi ' + compB : 'ditambah ' + Math.abs(compB)} agar suku bervariabel ${compA}x terpisah dari konstanta.`
      },
      {
        label: 'Penyelarasan Posisi Variabel',
        badge: 'Sifat Simetris',
        math: `${compA}x = y ${bSign}`,
        explanation: 'Tukar posisi ruas kiri dan ruas kanan agar suku x berada di sebelah kiri persamaan.'
      },
      {
        label: 'Bagi dengan Koefisien x',
        badge: 'Eliminasi Koefisien',
        math: `x = ${fractionHTML}`,
        explanation: `Bagi kedua ruas dengan angka depan x yaitu ${compA} sehingga variabel x berdiri sendiri bernilai koefisien 1.`
      },
      {
        label: 'Penerapan Definisi Fungsi Invers',
        badge: 'Definisi Invers',
        math: `x = ${opSymbol}⁻¹(y)`,
        explanation: `Berdasarkan definisi matematika, pemetaan balik dari variabel y ke x dinyatakan sebagai notasi ${opSymbol}⁻¹(y).`
      },
      {
        label: 'Rumus Operasional Dekripsi Final',
        badge: 'Hasil Akhir',
        math: `<span class="comp-color">${opSymbol}⁻¹(y) = ${fractionHTML}</span>`,
        explanation: 'Rumus invers resmi siap digunakan. Masukkan setiap angka sandi y ke posisi pembilang untuk menemukan huruf aslinya.'
      }
    ];

    const formulaString = `${opSymbol}⁻¹(y) = (y ${bSign}) / ${compA}`;

    return { compA, compB, steps, formulaString };
  },

  // 4. Contoh Bedah Kasus Nyata (Enkripsi Satu Karakter)
  getEncryptSample(item, compA, compB, opSymbol = '(g ∘ f)') {
    if (!item) return null;
    const valX = item.val !== undefined ? item.val : item.valX;
    const isSpace = item.char === ' ';
    const charName = isSpace ? 'SPASI' : `'${item.char}'`;
    const bSign = compB >= 0 ? `+ ${compB}` : `- ${Math.abs(compB)}`;
    const prod = compA * valX;
    const finalVal = prod + compB;

    return {
      char: item.char,
      charName: charName,
      valX: valX,
      compA: compA,
      compB: compB,
      opSymbol: opSymbol,
      formula: `${opSymbol}(x) = ${compA}x ${bSign}`,
      subst: `${opSymbol}(${valX}) = ${compA}(${valX}) ${bSign}`,
      multi: `= ${prod} ${bSign}`,
      finalVal: finalVal,
      explanation: isSpace
        ? `Karakter SPASI bernilai 0. Substitusi x = 0 menghasilkan konstanta ${finalVal}.`
        : `Karakter ${charName} berada di urutan ke-${valX} alfabet (x = ${valX}). Dimasukkan ke rumus: ${compA}(${valX}) ${bSign} = ${finalVal}.`
    };
  },

  // 5. Contoh Bedah Kasus Nyata (Dekripsi Satu Sandi)
  getDecryptSample(valY, compA, compB, opSymbol = '(g ∘ f)') {
    if (valY === undefined || isNaN(valY)) return null;
    const bSign = compB >= 0 ? `- ${compB}` : `+ ${Math.abs(compB)}`;
    const diff = valY - compB;
    const valX = diff / compA;
    const isInteger = Number.isInteger(valX) && valX >= 0 && valX <= 26;
    const char = isInteger ? REVERSE_ALPHABET_MAP[valX] : '?';
    const isSpace = char === ' ';
    const charName = isSpace ? 'SPASI' : `'${char}'`;

    return {
      valY: valY,
      compA: compA,
      compB: compB,
      opSymbol: opSymbol,
      diff: diff,
      valX: valX,
      isInteger: isInteger,
      char: char,
      charName: charName,
      fractionStep: this.renderFraction(`${valY} ${bSign}`, compA),
      reducedFraction: this.renderFraction(`${diff}`, compA),
      explanation: isInteger
        ? (isSpace
            ? `Angka sandi ${valY} menghasilkan x = 0 yang merupakan representasi karakter SPASI.`
            : `Angka sandi ${valY} menghasilkan bilangan bulat ${valX}. Pada tabel alfabet, angka ${valX} adalah huruf ${charName}.`)
        : `Angka sandi ${valY} menghasilkan ${valX.toFixed(2)} (bukan bilangan bulat 0-26). Periksa kembali rumus atau input angka Anda.`
    };
  },

  // 6. Enkripsi Teks Penuh
  encrypt(text, compA, compB) {
    const quantified = this.quantifyText(text);
    const rows = [];
    const cipherNumbers = [];
    const bSign = compB >= 0 ? `+ ${compB}` : `- ${Math.abs(compB)}`;

    quantified.forEach(item => {
      if (item.val === -1) {
        // Karakter di luar alfabet diabaikan atau ditandai
      } else {
        const valY = compA * item.val + compB;
        cipherNumbers.push(valY);
        rows.push({
          index: item.index,
          char: item.char,
          valX: item.val,
          calcStr: `${compA}(${item.val}) ${bSign} = ${compA * item.val} ${bSign}`,
          valY: valY
        });
      }
    });

    return { rows, cipherNumbers, cipherString: cipherNumbers.join(' - ') };
  },

  // 7. Dekripsi Deretan Angka
  decrypt(cipherNumbers, compA, compB) {
    const rows = [];
    let decryptedText = '';
    const bSign = compB >= 0 ? `- ${compB}` : `+ ${Math.abs(compB)}`;

    cipherNumbers.forEach((valY, idx) => {
      const valX = (valY - compB) / compA;
      const isInteger = Number.isInteger(valX) && valX >= 0 && valX <= 26;
      const char = isInteger ? REVERSE_ALPHABET_MAP[valX] : '?';
      
      decryptedText += char;

      rows.push({
        index: idx + 1,
        valY: valY,
        calcStr: `(${valY} ${bSign}) ÷ ${compA} = ${valY - compB} ÷ ${compA}`,
        valX: valX,
        isInteger: isInteger,
        char: char
      });
    });

    return { rows, decryptedText };
  }

};