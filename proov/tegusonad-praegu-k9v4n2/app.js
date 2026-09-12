const IMG = window.EDUKASS_IMG;
const verbs = {
"JOOMA":      { MINA:"joon", SINA:"jood", TEMA:"joob", MEIE:"joome", TEIE:"joote", NEMAD:"joovad" },
"SÖÖMA":      { MINA:"söön", SINA:"sööd", TEMA:"sööb", MEIE:"sööme", TEIE:"sööte", NEMAD:"söövad" },
"LUGEMA":     { MINA:"loen", SINA:"loed", TEMA:"loeb", MEIE:"loeme", TEIE:"loete", NEMAD:"loevad" },
"KIRJUTAMA":  { MINA:"kirjutan", SINA:"kirjutad", TEMA:"kirjutab", MEIE:"kirjutame", TEIE:"kirjutate", NEMAD:"kirjutavad" },
"MÄNGIMA":    { MINA:"mängin", SINA:"mängid", TEMA:"mängib", MEIE:"mängime", TEIE:"mängite", NEMAD:"mängivad" }
};
const shortSubj = { MINA:"Ma", SINA:"Sa", TEMA:"Ta", MEIE:"Me", TEIE:"Te", NEMAD:"Nad" };
const STORAGE_KEY = "edukass-tegusonad-praegu-v1";
const SOUND_KEY = "edukass-tegusonad-praegu-sound";
let soundOn = localStorage.getItem(SOUND_KEY) !== "off";
function beep(ok) {
if (!soundOn) return;
try {
const AC = window.AudioContext || window.webkitAudioContext;
const ctx = new AC();
const osc = ctx.createOscillator();
const gain = ctx.createGain();
osc.type = "sine";
osc.frequency.value = ok ? 620 : 230;
gain.gain.setValueAtTime(0.0001, ctx.currentTime);
gain.gain.exponentialRampToValueAtTime(ok ? 0.045 : 0.026, ctx.currentTime + 0.015);
gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (ok ? 0.18 : 0.14));
osc.connect(gain); gain.connect(ctx.destination);
osc.start(); osc.stop(ctx.currentTime + (ok ? 0.20 : 0.16));
osc.onended = () => ctx.close();
} catch (_) {}
}
function syncSoundButton() {
const b = document.getElementById("soundBtn");
if (!b) return;
b.textContent = soundOn ? "🔊" : "🔇";
b.setAttribute("aria-label", soundOn ? "Heli välja" : "Heli sisse");
}
function saveProgress() {
try {
localStorage.setItem(STORAGE_KEY, JSON.stringify({
phase,
queue: queue.map(t => t.id),
done: [...doneSet]
}));
} catch (_) {}
}
function clearProgress() {
try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
}
function restoreProgress() {
try {
const raw = localStorage.getItem(STORAGE_KEY);
if (!raw) return false;
const saved = JSON.parse(raw);
const pool = saved.phase === "write" ? writeTasks : choiceTasks;
const prefix = saved.phase === "write" ? "w" : "c";
const map = new Map(pool.map((t, i) => [prefix + i, {...t, id:prefix + i}]));
const restored = (saved.queue || []).map(id => map.get(id)).filter(Boolean);
if (!restored.length) return false;
phase = saved.phase === "write" ? "write" : "choice";
queue = restored;
doneSet = new Set((saved.done || []).filter(id => map.has(id)));
return true;
} catch (_) {
return false;
}
}
function imgKey(verb, person) {
const plural = ["MEIE","TEIE","NEMAD"].includes(person);
const v = verb === "SÖÖMA" ? "SOOMA" : (verb === "MÄNGIMA" ? "MANGIMA" : verb);
return v + "_" + (plural ? "GROUP" : "SINGLE");
}
function shuffle(arr) {
const a = [...arr];
for (let i = a.length - 1; i > 0; i--) {
const j = Math.floor(Math.random() * (i + 1));
[a[i], a[j]] = [a[j], a[i]];
}
return a;
}
const verbNames = Object.keys(verbs);
const choiceTasks = [];
for (const verb of verbNames) {
for (const person of ["TEMA","NEMAD"]) {
const correct = verbs[verb][person];
const wrongs = person === "TEMA"
? [verbs[verb].MINA, verbs[verb].SINA]
: [verbs[verb].MEIE, verbs[verb].TEIE];
choiceTasks.push({ type:"choice", verb, person, correct, options: shuffle([correct, ...wrongs]) });
}
}
choiceTasks.sort((a,b) => {
const aa = (a.verb === "JOOMA" && a.person === "TEMA") ? 0 : 1;
const bb = (b.verb === "JOOMA" && b.person === "TEMA") ? 0 : 1;
return aa - bb;
});
const writeTasks = [];
for (const verb of verbNames) {
for (const person of ["MINA","SINA","TEMA","MEIE","TEIE"]) {
writeTasks.push({ type:"write", verb, person, correct: verbs[verb][person] });
}
}
let phase = "choice";
let queue = choiceTasks.map((t, i) => ({...t, id:"c"+i}));
let doneSet = new Set();
let current = null;
let locked = false;
const $ = id => document.getElementById(id);
function renderStars(done, total) {
const thresholds = total === 10 ? [4,7,10] : [9,17,25];
$("stars").innerHTML = thresholds.map(t => `<span class="star ${done >= t ? "filled" : ""}">★</span>`).join("");
}
function updateProgress() {
const total = phase === "choice" ? 10 : 25;
const done = doneSet.size;
$("counter").textContent = `${done} / ${total}`;
renderStars(done, total);
}
function nextTask() {
queue.shift();
saveProgress();
if (queue.length === 0) {
if (phase === "choice") {
phase = "write";
queue = writeTasks.map((t, i) => ({...t, id:"w"+i}));
doneSet = new Set();
saveProgress();
render();
return;
}
$("game").style.display = "none";
$("finish").classList.add("show");
clearProgress();
return;
}
render();
}
function render() {
locked = false;
current = queue[0];
$("subtitle").textContent = current.type === "choice" ? "Vali õige vorm" : "Kirjuta õige vorm";
$("person").textContent = current.person;
$("verb").textContent = current.verb;
$("sceneImg").src = IMG[imgKey(current.verb, current.person)];
$("sceneImg").alt = `${current.person} – ${current.verb}`;
updateProgress();
const area = $("answerArea");
area.innerHTML = "";
if (current.type === "choice") {
const wrap = document.createElement("div");
wrap.className = "answers";
current.options.forEach(form => {
const btn = document.createElement("button");
btn.className = "answer";
btn.type = "button";
btn.innerHTML = `<span>${shortSubj[current.person]} ${form}.</span>`;
btn.onclick = () => checkChoice(btn, form, wrap);
wrap.appendChild(btn);
});
area.appendChild(wrap);
} else {
const box = document.createElement("div");
box.className = "writebox";
box.innerHTML = `
<div class="promptline" id="promptline">
<span>${shortSubj[current.person]}</span>
<input id="writeInput" autocomplete="off" autocapitalize="none" spellcheck="false" enterkeyhint="done" />
<span>.</span>
</div>
`;
area.appendChild(box);
const input = $("writeInput");
input.addEventListener("keydown", e => {
if (e.key === "Enter") checkWrite();
});
setTimeout(() => input.focus(), 50);
}
}
function markDone(ok) {
if (ok) doneSet.add(current.id);
else queue.push({...current});
updateProgress();
saveProgress();
}
function checkChoice(btn, chosen, wrap) {
if (locked) return;
locked = true;
const buttons = [...wrap.querySelectorAll(".answer")];
const ok = chosen === current.correct;
if (ok) {
btn.classList.add("correct");
btn.insertAdjacentHTML("beforeend", '<span class="mark">✓</span>');
} else {
btn.classList.add("wrong");
const right = buttons.find(b => b.textContent.trim() === `${shortSubj[current.person]} ${current.correct}.`);
if (right) {
right.classList.add("correct");
right.insertAdjacentHTML("beforeend", '<span class="mark">✓</span>');
}
}
beep(ok);
$("live").textContent = ok ? "Õige." : "Vale. Õige vastus on märgitud roheliselt.";
markDone(ok);
setTimeout(nextTask, ok ? 850 : 1250);
}
function checkWrite() {
if (locked) return;
const input = $("writeInput");
const line = $("promptline");
const typed = input.value.trim().toLocaleLowerCase("et-EE");
if (!typed) return;
locked = true;
const ok = typed === current.correct.toLocaleLowerCase("et-EE");
if (ok) {
line.classList.add("good");
} else {
line.classList.add("bad");
input.value = current.correct;
input.style.color = "#23a255";
}
beep(ok);
$("live").textContent = ok ? "Õige." : "Vale. Õige vastus on märgitud roheliselt.";
markDone(ok);
setTimeout(nextTask, ok ? 850 : 1250);
}
document.getElementById("soundBtn").addEventListener("click", () => {
soundOn = !soundOn;
try { localStorage.setItem(SOUND_KEY, soundOn ? "on" : "off"); } catch (_) {}
syncSoundButton();
});
document.getElementById("shareBtn").addEventListener("click", async () => {
const url = location.href.split("#")[0];
try {
if (navigator.share) {
await navigator.share({ title:"TEGUSÕNAD — PRAEGU", url });
} else if (navigator.clipboard) {
await navigator.clipboard.writeText(url);
}
} catch (_) {}
});
syncSoundButton();
restoreProgress();
render();
