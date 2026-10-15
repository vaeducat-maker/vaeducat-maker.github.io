(function inimeneTervisenaitajadLesson() {
  window.EDUKASS_LESSONS = window.EDUKASS_LESSONS || {};
  const card = document.getElementById('card');
  const pill = document.getElementById('pill');
  const sub = document.getElementById('sub');
  const restart = document.getElementById('restart');
  const libraryBtn = document.getElementById('libraryBtn');
  if (!card || !libraryBtn) return;

  // Every answer is marked by **...** in both languages.
  const PAIRS = [
    {
      et: 'Mõõdetavad tervisenäitajad, mida saab kodustes tingimustes kontrollida, on **pikkus**, **kehakaal** ja **pulss**.',
      ru: 'Измеряемые показатели здоровья, которые можно проверить дома, — это **рост**, **вес** и **пульс**.'
    },
    {
      et: 'Pulsi alusel on võimalik kontrollida **südame tööd**.',
      ru: 'По пульсу можно проверить **работу сердца**.'
    },
    {
      et: 'Pulssi mõõdetakse tavaliselt **randmelt**.',
      ru: 'Пульс обычно измеряют **на запястье**.'
    },
    {
      et: '10–12-aastase lapse süda lööb puhkeolekus **70–80** korda minutis.',
      ru: 'Сердце ребёнка 10–12 лет в состоянии покоя бьётся **70–80** раз в минуту.'
    },
    {
      et: 'Treenitud inimese süda lööb rahuolekus **vähem** kordi kui treenimata isikul.',
      ru: 'У тренированного человека сердце в покое бьётся **реже**, чем у нетренированного.'
    },
    {
      et: 'Südame löögisagedus rahuolekus on **treenituse** näitaja.',
      ru: 'Частота сердцебиения в покое — показатель **тренированности**.'
    },
    {
      et: 'Südame löögisageduse suurenemine viitab **haigusele** või ebapiisavale **taastumisele** treeningute järel.',
      ru: 'Учащение сердцебиения может указывать на **болезнь** или недостаточное **восстановление** после тренировок.'
    }
  ];

  const style = document.createElement('style');
  style.textContent = `
    .tervis2-lesson{display:grid;gap:16px;max-width:820px;margin:0 auto}
    .tervis2-lesson h2{color:#2f6f58;margin:5px 0 6px}
    .tervis2-lesson p{margin:0}
    .tervis2-list{display:grid;gap:12px}
    .tervis2-pair{padding:15px 16px;background:#fff;border:1px solid #dfe8e2;border-radius:14px;line-height:1.55}
    .tervis2-et{font-size:17px;color:#1f332a}
    .tervis2-ru{font-size:15px;color:#55645d;margin-top:9px!important;padding-top:9px;border-top:1px dashed #e0e8e2}
    .tervis2-answer{font-weight:900;color:#215a41}
    @media(max-width:560px){.tervis2-pair{padding:12px}.tervis2-et{font-size:16px}.tervis2-ru{font-size:14px}}
  `;
  document.head.appendChild(style);

  function esc(text) {
    return String(text).replace(/[&<>"']/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
    })[c]);
  }
  function emphasize(text) {
    return text.split(/(\*\*[^*]+\*\*)/g).map(part =>
      part.startsWith('**') && part.endsWith('**')
        ? '<strong class="tervis2-answer">' + esc(part.slice(2, -2)) + '</strong>'
        : esc(part)
    ).join('');
  }
  function renderLesson() {
    if (restart) restart.hidden = true;
    if (pill) pill.textContent = '👤 Inimeseõpetus';
    if (sub) sub.textContent = 'Урок 2 · Tervisenäitajad · A. Täida lüngad';
    card.innerHTML = '<div class="tervis2-lesson">' +
      '<div class="topic-intro"><div class="topic-kicker">👤 Inimeseõpetus · Урок 2</div>' +
      '<h2>Tervisenäitajad</h2><p><strong>A. Täida lüngad.</strong> — Заполни пропуски.</p>' +
      '<p class="tiny">Ответы выделены жирным на эстонском и русском языках.</p></div>' +
      '<div class="tervis2-list">' + PAIRS.map((pair, index) =>
        '<section class="tervis2-pair" aria-label="Предложение ' + (index + 1) + '">' +
          '<p class="tervis2-et" lang="et">' + emphasize(pair.et) + '</p>' +
          '<p class="tervis2-ru" lang="ru">' + emphasize(pair.ru) + '</p>' +
        '</section>'
      ).join('') + '</div>' +
      '<button class="secondary" type="button" id="tervis2Back">← К предметам</button>' +
      '</div>';
    const back = card.querySelector('#tervis2Back');
    if (back) back.onclick = () => libraryBtn.click();
  }
  window.EDUKASS_LESSONS.inimeneTervisenaitajadLesson = renderLesson;
})();
