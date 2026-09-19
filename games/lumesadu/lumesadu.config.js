window.LUMESADU_CONFIG = Object.freeze({
  version: "0.1.0-prototype",
  title: "LUMESADU",
  subtitle: "Leia õige pilt",
  modeLabel: "Rahulik",
  questionCount: 10,
  maxErrors: 5,
  iceCubesPerRow: 4,
  fallDurationMs: 14000,
  feedback: Object.freeze({
    correctMs: 700,
    wrongMs: 520,
    correctAfterWrongMs: 820,
    iceGrowMs: 520,
    betweenQuestionsMs: 180
  }),
  items: Object.freeze([
    { id: "lumi", word: "lumi", icon: "❄️", alt: "lumi" },
    { id: "kelk", word: "kelk", icon: "🛷", alt: "kelk" },
    { id: "lumememm", word: "lumememm", icon: "⛄", alt: "lumememm" },
    { id: "myts", word: "müts", icon: "🧢", alt: "müts" },
    { id: "sall", word: "sall", icon: "🧣", alt: "sall" },
    { id: "kindad", word: "kindad", icon: "🧤", alt: "kindad" },
    { id: "saapad", word: "saapad", icon: "🥾", alt: "saapad" },
    { id: "uisud", word: "uisud", icon: "⛸️", alt: "uisud" },
    { id: "suusad", word: "suusad", icon: "🎿", alt: "suusad" },
    { id: "lumehelves", word: "lumehelves", icon: "❄️", alt: "lumehelves" }
  ])
});