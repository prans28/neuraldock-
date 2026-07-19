const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
header.classList.toggle('scrolled', window.scrollY > 10);
});
const cursorGlow = document.getElementById('cursorGlow');
if (cursorGlow && !reduceMotion && matchMedia('(hover:hover)').matches) {
let gx = 0, gy = 0, cx = 0, cy = 0;
window.addEventListener('mousemove', (e) => {
gx = e.clientX; gy = e.clientY;
cursorGlow.style.opacity = '1';
});
window.addEventListener('mouseleave', () => { cursorGlow.style.opacity = '0'; });
(function followCursor(){
cx += (gx - cx) * 0.12;
cy += (gy - cy) * 0.12;
cursorGlow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
requestAnimationFrame(followCursor);
})();
}
const magnetic = document.getElementById('magneticBtn');
if (magnetic && !reduceMotion && matchMedia('(hover:hover)').matches) {
const btn = magnetic.querySelector('button');
magnetic.addEventListener('mousemove', (e) => {
const rect = magnetic.getBoundingClientRect();
const relX = e.clientX - rect.left - rect.width / 2;
const relY = e.clientY - rect.top - rect.height / 2;
btn.style.transform = `translate(${relX * 0.3}px, ${relY * 0.5}px)`;
});
magnetic.addEventListener('mouseleave', () => {
btn.style.transform = 'translate(0, 0)';
});
}
const readingBar = document.getElementById('readingProgress');
if (readingBar){
function updateReadingProgress(){
const scrollTop = window.scrollY;
const docHeight = document.documentElement.scrollHeight - window.innerHeight;
const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
readingBar.style.width = pct + '%';
}
window.addEventListener('scroll', updateReadingProgress);
updateReadingProgress();
}
const articleParas = document.querySelectorAll('.article-body p');
if ('IntersectionObserver' in window && articleParas.length){
const pio = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting){
entry.target.classList.add('in-view');
pio.unobserve(entry.target);
}
});
}, { threshold: 0.15 });
articleParas.forEach(p => pio.observe(p));
} else {
articleParas.forEach(p => p.classList.add('in-view'));
}
(function(){
const cover = document.getElementById('articleCover');
if (!cover) return;
const ctx = cover.getContext('2d');
let w, h, points;
function resize(){
w = cover.width = cover.offsetWidth * devicePixelRatio;
h = cover.height = cover.offsetHeight * devicePixelRatio;
points = Array.from({ length: 26 }, () => ({
x: Math.random() * w,
y: Math.random() * h,
vx: (Math.random() - 0.5) * 0.18 * devicePixelRatio,
vy: (Math.random() - 0.5) * 0.18 * devicePixelRatio,
}));
}
window.addEventListener('resize', resize);
resize();
function frame(){
ctx.clearRect(0, 0, w, h);
for (const p of points){
p.x += p.vx; p.y += p.vy;
if (p.x < 0 || p.x > w) p.vx *= -1;
if (p.y < 0 || p.y > h) p.vy *= -1;
}
for (let i = 0; i < points.length; i++){
for (let j = i + 1; j < points.length; j++){
const dx = points[i].x - points[j].x, dy = points[i].y - points[j].y;
const dist = Math.sqrt(dx * dx + dy * dy);
const linkDist = 120 * devicePixelRatio;
if (dist < linkDist){
ctx.strokeStyle = `rgba(45,225,194,${0.18 * (1 - dist / linkDist)})`;
ctx.lineWidth = 1;
ctx.beginPath();
ctx.moveTo(points[i].x, points[i].y);
ctx.lineTo(points[j].x, points[j].y);
ctx.stroke();
}
}
}
for (const p of points){
ctx.fillStyle = 'rgba(45,225,194,0.6)';
ctx.beginPath();
ctx.arc(p.x, p.y, 1.5 * devicePixelRatio, 0, Math.PI * 2);
ctx.fill();
}
if (!reduceMotion) requestAnimationFrame(frame);
}
frame();
})();
const wordmarks = document.querySelectorAll('.brand-word[data-word]');
wordmarks.forEach((el) => {
const word = el.dataset.word;
const dot = el.querySelector('.dot');
const lettersHtml = word.split('').map(ch => `<span class="letter">${ch}</span>`).join('');
el.innerHTML = lettersHtml;
if (dot) el.appendChild(dot);
});
function pulseWordmark(el){
const letters = el.querySelectorAll('.letter');
letters.forEach((letter, i) => {
setTimeout(() => {
letter.classList.add('lit');
setTimeout(() => letter.classList.remove('lit'), 260);
}, i * 70);
});
}
if (!reduceMotion){
wordmarks.forEach(el => pulseWordmark(el));
setInterval(() => wordmarks.forEach(el => pulseWordmark(el)), 5000);
}
const timelineWrap = document.querySelector('.timeline-wrap');
const timelineProgress = document.getElementById('timelineProgress');
if (timelineWrap && timelineProgress){
function updateTimelineProgress(){
const rect = timelineWrap.getBoundingClientRect();
const viewportMid = window.innerHeight * 0.5;
const total = timelineWrap.offsetHeight - viewportMid;
const scrolled = Math.min(Math.max(-rect.top + viewportMid, 0), total);
const pct = total > 0 ? (scrolled / total) * 100 : 0;
timelineProgress.style.height = pct + '%';
}
window.addEventListener('scroll', updateTimelineProgress);
window.addEventListener('resize', updateTimelineProgress);
updateTimelineProgress();
}
const timelineItems = document.querySelectorAll('.timeline-item');
if ('IntersectionObserver' in window && timelineItems.length){
const tio = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting){
entry.target.classList.add('in-view');
tio.unobserve(entry.target);
}
});
}, { threshold: 0.25 });
timelineItems.forEach(el => tio.observe(el));
} else {
timelineItems.forEach(el => el.classList.add('in-view'));
}
const countdownEl = document.getElementById('countdown');
if (countdownEl){
const launchDate = new Date('2027-01-10T00:00:00');
const dEl = document.getElementById('cd-days');
const hEl = document.getElementById('cd-hours');
const mEl = document.getElementById('cd-mins');
const sEl = document.getElementById('cd-secs');
const pad = n => String(n).padStart(2, '0');
function tickCountdown(){
const diff = launchDate - new Date();
if (diff <= 0){
dEl.textContent = hEl.textContent = mEl.textContent = sEl.textContent = '00';
return;
}
const days = Math.floor(diff / 86400000);
const hours = Math.floor((diff % 86400000) / 3600000);
const mins = Math.floor((diff % 3600000) / 60000);
const secs = Math.floor((diff % 60000) / 1000);
dEl.textContent = pad(days);
hEl.textContent = pad(hours);
mEl.textContent = pad(mins);
sEl.textContent = pad(secs);
}
tickCountdown();
setInterval(tickCountdown, 1000);
}
document.querySelectorAll('.line[data-text]').forEach((line, lineIndex) => {
const words = line.dataset.text.split(' ');
line.innerHTML = words
.map((w, i) => `<span class="word" style="animation-delay:${0.15 + lineIndex * 0.25 + i * 0.06}s">${w}</span>`)
.join(' ');
});
const counterEl = document.getElementById('counter');
if (counterEl) {
const target = 312;
let counted = false;
const countUp = () => {
if (counted) return;
counted = true;
const duration = 1400;
const start = performance.now();
function tick(now){
const progress = Math.min((now - start) / duration, 1);
const eased = 1 - Math.pow(1 - progress, 3);
counterEl.textContent = Math.round(eased * target);
if (progress < 1) requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
};
setTimeout(countUp, 900);
}
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
const io = new IntersectionObserver((entries) => {
entries.forEach((entry, idx) => {
if (entry.isIntersecting) {
setTimeout(() => entry.target.classList.add('in-view'), idx * 80);
io.unobserve(entry.target);
}
});
}, { threshold: 0.2 });
revealEls.forEach(el => io.observe(el));
} else {
revealEls.forEach(el => el.classList.add('in-view'));
}
const heroForm = document.getElementById('heroForm');
const heroPlug = document.getElementById('heroPlug');
const heroStatus = document.getElementById('heroStatus');
if (heroForm) {
heroForm.addEventListener('submit', (e) => {
e.preventDefault();
heroPlug.classList.add('plugged');
setTimeout(() => heroPlug.classList.remove('plugged'), 400);
fetch(heroForm.action, { method: 'POST', body: new FormData(heroForm) })
.then(res => res.text().then(msg => ({ ok: res.ok, msg })))
.then(({ ok, msg }) => {
heroStatus.textContent = msg || (ok ? 'connection established ✓' : 'something went wrong — try again');
heroStatus.classList.toggle('status-error', !ok);
heroStatus.classList.add('show');
setTimeout(() => heroStatus.classList.remove('show'), 4000);
})
.catch(() => {
heroStatus.textContent = 'connection failed — check your network';
heroStatus.classList.add('status-error', 'show');
setTimeout(() => heroStatus.classList.remove('show', 'status-error'), 4000);
});
heroForm.reset();
});
}
const dockForm = document.getElementById('dockForm');
const dockPlug = document.getElementById('dockPlug');
const dockStatus = document.getElementById('dockStatus');
if (dockForm) {
dockForm.addEventListener('submit', (e) => {
e.preventDefault();
dockPlug.classList.add('plugged');
setTimeout(() => dockPlug.classList.remove('plugged'), 600);
fetch(dockForm.action, { method: 'POST', body: new FormData(dockForm) })
.then(res => res.text().then(msg => ({ ok: res.ok, msg })))
.then(({ ok, msg }) => {
dockStatus.textContent = msg || (ok ? 'connection established ✓' : 'something went wrong — try again');
dockStatus.classList.toggle('status-error', !ok);
dockStatus.classList.add('show');
setTimeout(() => dockStatus.classList.remove('show'), 3200);
})
.catch(() => {
dockStatus.textContent = 'connection failed — check your network';
dockStatus.classList.add('status-error', 'show');
setTimeout(() => dockStatus.classList.remove('show', 'status-error'), 3200);
});
dockForm.reset();
});
}
(function(){
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
let w, h, points;
const mouse = { x: null, y: null, radius: 140 };
function resize(){
w = canvas.width = canvas.offsetWidth * devicePixelRatio;
h = canvas.height = canvas.offsetHeight * devicePixelRatio;
const count = Math.round((canvas.offsetWidth * canvas.offsetHeight) / 26000);
points = Array.from({ length: Math.max(14, count) }, () => ({
x: Math.random() * w,
y: Math.random() * h,
vx: (Math.random() - 0.5) * 0.25 * devicePixelRatio,
vy: (Math.random() - 0.5) * 0.25 * devicePixelRatio,
}));
}
window.addEventListener('resize', resize);
resize();
canvas.addEventListener('mousemove', (e) => {
const rect = canvas.getBoundingClientRect();
mouse.x = (e.clientX - rect.left) * devicePixelRatio;
mouse.y = (e.clientY - rect.top) * devicePixelRatio;
});
canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });
function frame(){
ctx.clearRect(0, 0, w, h);
const linkDist = 150 * devicePixelRatio;
const mouseRadius = mouse.radius * devicePixelRatio;
for (const p of points){
p.x += p.vx; p.y += p.vy;
if (p.x < 0 || p.x > w) p.vx *= -1;
if (p.y < 0 || p.y > h) p.vy *= -1;
if (mouse.x !== null){
const dx = p.x - mouse.x, dy = p.y - mouse.y;
const dist = Math.sqrt(dx * dx + dy * dy);
if (dist < mouseRadius && dist > 0){
const force = (1 - dist / mouseRadius) * 0.6;
p.x += (dx / dist) * force;
p.y += (dy / dist) * force;
}
}
}
for (let i = 0; i < points.length; i++){
for (let j = i + 1; j < points.length; j++){
const dx = points[i].x - points[j].x;
const dy = points[i].y - points[j].y;
const dist = Math.sqrt(dx * dx + dy * dy);
if (dist < linkDist){
ctx.strokeStyle = `rgba(45,225,194,${0.16 * (1 - dist / linkDist)})`;
ctx.lineWidth = 1;
ctx.beginPath();
ctx.moveTo(points[i].x, points[i].y);
ctx.lineTo(points[j].x, points[j].y);
ctx.stroke();
}
}
}
for (const p of points){
ctx.fillStyle = 'rgba(45,225,194,0.55)';
ctx.beginPath();
ctx.arc(p.x, p.y, 1.6 * devicePixelRatio, 0, Math.PI * 2);
ctx.fill();
}
if (!reduceMotion) requestAnimationFrame(frame);
}
frame();
})();