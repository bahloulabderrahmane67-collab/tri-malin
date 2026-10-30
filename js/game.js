/* ================= TRI MALIN ================= */
'use strict';

const ITEMS = ['arrosoir','basket','bougie','brosse-bois','brosse','cactus-bleu','cactus','cadeau',
  'canard','casque','ciseaux','citron','citrouille','croissant','cupcake','fraise','grenouille','jus',
  'livre','macaron','marguerite','ourson','pain','parfum','pasteque','pomme','reveil','tasse',
  'theiere','thermos','vernis','voiture'];
const BACS = ['bac-chene','bac-blanc','bac-menthe','bac-noyer'];
const SAVE = 'trimalin.v1';
const MAX_NIVEAU = 30;

/* ---------- sauvegarde ---------- */
function charger(){
  try{
    const d = JSON.parse(localStorage.getItem(SAVE) || '{}');
    return {niveau: d.niveau || 1, etoiles: d.etoiles || {}, score: d.score || 0};
  }catch(e){ return {niveau:1, etoiles:{}, score:0}; }
}
function sauver(){
  try{ localStorage.setItem(SAVE, JSON.stringify({niveau:P.niveau, etoiles:P.etoiles, score:P.score})); }
  catch(e){ /* mode prive : on joue sans sauvegarde */ }
}
const P = charger();

/* ---------- son (synthetise, aucun fichier) ---------- */
let actx = null, sonOn = true;
function ton(freq, dur, type='sine', vol=.18, delai=0){
  if(!sonOn) return;
  try{
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    if(actx.state === 'suspended') actx.resume();
    const t0 = actx.currentTime + delai;
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + .012);
    g.gain.exponentialRampToValueAtTime(.0001, t0 + dur);
    o.connect(g); g.connect(actx.destination);
    o.start(t0); o.stop(t0 + dur + .02);
  }catch(e){}
}
const SFX = {
  prendre: () => ton(620, .09, 'triangle', .14),
  poser:   () => ton(420, .11, 'triangle', .14),
  refus:   () => ton(150, .14, 'sawtooth', .09),
  trio:    () => [0,1,2,3].forEach(i => ton([523,659,784,1047][i], .2, 'sine', .16, i*.055)),
  gagne:   () => [0,1,2,3,4,5].forEach(i => ton([523,659,784,1047,1319,1568][i], .32, 'sine', .15, i*.085)),
};

/* ---------- niveaux ---------- */
function config(n){
  const types = Math.min(3 + Math.floor((n - 1) / 3), 6);
  const libres = n <= 2 ? 2 : 1;
  return {types, bacs: types + libres, melange: Math.min(15 + n * 5, 80)};
}
const melangeTab = a => { for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]];} return a; };

function coupAleatoire(bacs){
  const pleins = bacs.map((b,i)=>i).filter(i => bacs[i].some(x => x !== null));
  const libres = bacs.map((b,i)=>i).filter(i => bacs[i].some(x => x === null));
  if(!pleins.length || !libres.length) return;
  const a = pleins[(Math.random()*pleins.length)|0];
  const cibles = libres.filter(i => i !== a);
  if(!cibles.length) return;
  const b = cibles[(Math.random()*cibles.length)|0];
  const occ = bacs[a].map((x,i)=>x!==null?i:-1).filter(i=>i>=0);
  const si = occ[(Math.random()*occ.length)|0];
  const di = bacs[b].indexOf(null);
  bacs[b][di] = bacs[a][si]; bacs[a][si] = null;
}
const aUnTrio = bacs => bacs.some(b => b[0] !== null && b[0] === b[1] && b[1] === b[2]);
const estVide = bacs => bacs.every(b => b.every(x => x === null));

function genererNiveau(n){
  const cfg = config(n);
  const pool = melangeTab(ITEMS.slice()).slice(0, cfg.types);
  let bacs;
  for(let essai = 0; essai < 80; essai++){
    bacs = pool.map(t => [t, t, t]);
    while(bacs.length < cfg.bacs) bacs.push([null, null, null]);
    melangeTab(bacs);
    for(let i = 0; i < cfg.melange; i++) coupAleatoire(bacs);
    if(!aUnTrio(bacs)) break;
  }
  // par = chaque type garde un groupe en place, les autres objets bougent
  return {bacs, par: cfg.types * 2, types: cfg.types};
}

/* ---------- etat ---------- */
let S = null;
const $ = s => document.querySelector(s);
const board = $('#board'), fxLayer = $('#fx-layer');

function demarrer(n){
  const g = genererNiveau(n);
  S = {
    niveau: n,
    bacs: g.bacs.map((items, i) => ({items, kind: BACS[i % BACS.length]})),
    par: g.par, coups: 0, score: 0,
    pris: null, histo: [], indices: 3, bacsBonus: 1, fini: false
  };
  ecran('game');          // d'abord visible, sinon les mesures valent zero
  construireBoard();
  majHud();
}

/* ---------- rendu ---------- */
/* Choisit le nombre de colonnes qui donne les plus grands bacs possible
   dans la zone disponible, puis fixe la largeur du plateau au pixel pres. */
const GAP = 12, CELL_MAX = 260;

function meilleureGrille(n, dispoW, dispoH){
  let best = {cols: 1, cell: 0};
  for(let c = 1; c <= Math.min(n, 6); c++){
    const rows = Math.ceil(n / c);
    const cell = Math.min(
      (dispoW - GAP * (c - 1)) / c,
      (dispoH - GAP * (rows - 1)) / rows
    );
    if(cell > best.cell) best = {cols: c, cell};
  }
  best.cell = Math.floor(Math.min(best.cell, CELL_MAX));
  return best;
}

function ajusterBoard(){
  if(!S) return;
  const wrap = document.querySelector('.board-wrap');
  const dispoW = Math.min(wrap.clientWidth, 580), dispoH = wrap.clientHeight;
  if(dispoW <= 0 || dispoH <= 0){ requestAnimationFrame(ajusterBoard); return; }

  const n = S.bacs.length;
  const {cols, cell} = meilleureGrille(n, dispoW, dispoH);
  board.style.setProperty('--cols', cols);
  board.style.setProperty('--cell', cell + 'px');
  board.style.width = (cell * cols + GAP * (cols - 1)) + 'px';

  // un seul bac sur la derniere rangee : on le centre
  const orphelin = n % cols === 1 && n > cols;
  [...board.children].forEach((el, i) =>
    el.classList.toggle('is-orphan', orphelin && i === n - 1));
}

function construireBoard(){
  board.innerHTML = '';
  S.bacs.forEach((bac, ti) => {
    const el = document.createElement('div');
    el.className = 'tray'; el.dataset.tray = ti;
    el.innerHTML = `<img class="tray-img" src="assets/containers/${bac.kind}.webp" alt="" width="420" height="420">
      <div class="tray-slots">${[0,1,2].map(i => `<div class="slot" data-slot="${i}"></div>`).join('')}</div>`;
    board.appendChild(el);
  });
  syncSlots();
  ajusterBoard();
}

function syncSlots(){
  S.bacs.forEach((bac, ti) => {
    bac.items.forEach((it, si) => {
      const slot = board.querySelector(`[data-tray="${ti}"] [data-slot="${si}"]`);
      if(!slot) return;
      const actuel = slot.firstElementChild;
      const nom = actuel ? actuel.dataset.item : null;
      if(nom === it) return;                       // inchange : on garde l'animation tranquille
      slot.innerHTML = '';
      if(it){
        const img = document.createElement('img');
        img.className = 'item'; img.dataset.item = it; img.alt = it;
        img.src = `assets/items/${it}.webp`; img.width = 256; img.height = 256;
        slot.appendChild(img);
      }
    });
  });
  majSelection();
}

function majSelection(){
  board.querySelectorAll('.item').forEach(i => i.classList.remove('is-picked'));
  board.querySelectorAll('.tray').forEach(t => t.classList.remove('is-target'));
  if(!S.pris) return;
  const el = board.querySelector(`[data-tray="${S.pris.t}"] [data-slot="${S.pris.s}"] .item`);
  if(el) el.classList.add('is-picked');
  S.bacs.forEach((bac, ti) => {
    if(ti !== S.pris.t && bac.items.includes(null))
      board.querySelector(`[data-tray="${ti}"]`).classList.add('is-target');
  });
}

function majHud(){
  $('#hud-level').textContent = 'Niveau ' + S.niveau;
  $('#hud-moves').textContent = S.coups;
  $('#count-hint').textContent = S.indices;
  $('#count-addtray').textContent = S.bacsBonus;
  $('[data-action="undo"]').disabled = !S.histo.length;
  $('[data-action="hint"]').disabled = S.indices <= 0;
  $('[data-action="addtray"]').disabled = S.bacsBonus <= 0;
}

/* ---------- effets ---------- */
function effet(nom, x, y, taille, classe){
  const img = document.createElement('img');
  img.className = 'fx ' + classe; img.src = `assets/fx/${nom}.webp`; img.alt = '';
  img.style.cssText = `left:${x}px;top:${y}px;width:${taille}px;height:${taille}px`;
  fxLayer.appendChild(img);
  setTimeout(() => img.remove(), 1100);
}
function effetTrio(ti, pts){
  const r = board.querySelector(`[data-tray="${ti}"]`).getBoundingClientRect();
  const x = r.left + r.width / 2, y = r.top + r.height / 2;
  effet('fx-etincelle', x, y, r.width * 1.5, 'fx-pop');
  effet('fx-confettis', x, y, r.width * 1.7, 'fx-rise');
  effet('fx-anneau', x, y, r.width * 1.3, 'fx-pop');
  const s = document.createElement('div');
  s.className = 'score-pop'; s.textContent = '+' + pts;
  s.style.cssText = `left:${x}px;top:${y}px`;
  fxLayer.appendChild(s); setTimeout(() => s.remove(), 1100);
}

/* ---------- coups ---------- */
function clicBoard(e){
  if(S.fini) return;
  const item = e.target.closest('.item');
  const tray = e.target.closest('.tray');
  if(!tray) return;
  const ti = +tray.dataset.tray;

  if(item){
    const si = +item.parentElement.dataset.slot;
    if(S.pris && S.pris.t === ti && S.pris.s === si){ S.pris = null; majSelection(); return; }
    // objet d'un autre bac : on depose si ce bac a de la place,
    // sinon on considere que le joueur veut selectionner cet objet-la
    if(S.pris && S.pris.t !== ti && S.bacs[ti].items.includes(null)){
      jouer(S.pris.t, S.pris.s, ti); return;
    }
    S.pris = {t: ti, s: si}; SFX.prendre(); majSelection(); return;
  }
  if(S.pris && S.pris.t !== ti) jouer(S.pris.t, S.pris.s, ti);
}

function jouer(de, si, vers){
  const cible = S.bacs[vers];
  const di = cible.items.indexOf(null);
  if(di < 0){ SFX.refus(); secouer(vers); return; }

  const objet = S.bacs[de].items[si];
  S.bacs[de].items[si] = null;
  cible.items[di] = objet;
  S.coups++; S.pris = null;
  SFX.poser();
  syncSlots();

  const entree = {de, si, vers, di, objet, vide: null, pts: 0};
  S.histo.push(entree);

  if(cible.items[0] && cible.items[0] === cible.items[1] && cible.items[1] === cible.items[2]){
    const pts = 100;
    entree.vide = cible.items[0]; entree.pts = pts;
    S.score += pts;
    const trayEl = board.querySelector(`[data-tray="${vers}"]`);
    trayEl.classList.add('is-clearing');
    trayEl.querySelectorAll('.item').forEach(i => i.classList.add('is-gone'));
    SFX.trio(); effetTrio(vers, pts);
    setTimeout(() => {
      cible.items = [null, null, null];
      trayEl.classList.remove('is-clearing');
      syncSlots();
      if(estVide(S.bacs.map(b => b.items))) gagner();
    }, 380);
  }
  majHud();
}

function secouer(ti){
  const el = board.querySelector(`[data-tray="${ti}"]`);
  el.animate([{transform:'translateX(0)'},{transform:'translateX(-7px)'},
              {transform:'translateX(7px)'},{transform:'translateX(0)'}], {duration:220});
}

function annuler(){
  const h = S.histo.pop();
  if(!h) return;
  if(h.vide){ S.bacs[h.vers].items = [h.vide, h.vide, h.vide]; S.score -= h.pts; }
  S.bacs[h.vers].items[h.di] = null;
  S.bacs[h.de].items[h.si] = h.objet;
  S.coups--; S.pris = null; S.fini = false;
  SFX.poser(); syncSlots(); majHud();
}

function ajouterBac(){
  if(S.bacsBonus <= 0) return;
  S.bacsBonus--;
  S.bacs.push({items:[null,null,null], kind: BACS[S.bacs.length % BACS.length]});
  construireBoard(); majHud(); SFX.poser();
}

function indice(){
  if(S.indices <= 0) return;
  const compte = b => { const c = {}; b.items.forEach(x => { if(x) c[x] = (c[x]||0)+1; }); return c; };
  let best = null;
  for(let a = 0; a < S.bacs.length; a++){
    for(let si = 0; si < 3; si++){
      const obj = S.bacs[a].items[si];
      if(!obj) continue;
      for(let b = 0; b < S.bacs.length; b++){
        if(b === a || !S.bacs[b].items.includes(null)) continue;
        const n = compte(S.bacs[b])[obj] || 0;
        const rang = n === 2 ? 3 : n === 1 ? 2 : 1;
        if(!best || rang > best.rang) best = {a, si, b, rang};
      }
    }
  }
  if(!best) return;
  S.indices--;
  S.pris = {t: best.a, s: best.si};
  majSelection();
  const el = board.querySelector(`[data-tray="${best.b}"]`);
  el.classList.add('is-hint');
  setTimeout(() => el.classList.remove('is-hint'), 2100);
  majHud();
}

/* ---------- fin de niveau ---------- */
function gagner(){
  if(S.fini) return;
  S.fini = true;
  const e = S.coups <= S.par + 2 ? 3 : S.coups <= S.par + 7 ? 2 : 1;
  const bonus = Math.max(0, (S.par + 8 - S.coups)) * 20;
  S.score += bonus;
  P.etoiles[S.niveau] = Math.max(P.etoiles[S.niveau] || 0, e);
  P.score += S.score;
  if(S.niveau >= P.niveau) P.niveau = Math.min(S.niveau + 1, MAX_NIVEAU);
  sauver();
  SFX.gagne();
  setTimeout(() => {
    const dernier = S.niveau >= MAX_NIVEAU;
    modale({
      mascotte: 'chat-joie',
      titre: dernier ? 'Tout fini !' : 'Bravo !',
      etoiles: e,
      texte: `Résolu en <b>${S.coups} coups</b> · <b>${S.score} points</b>`,
      actions: dernier
        ? [['Menu', 'menu', 'btn']]
        : [['Niveau suivant', 'next', 'btn'], ['Rejouer', 'again', 'btn btn-2']]
    });
  }, 650);
}

/* ---------- modales ---------- */
function modale({mascotte, titre, texte, etoiles, actions, contenu}){
  $('#modal-mascot').src = `assets/ui/${mascotte}.webp`;
  $('#modal-title').textContent = titre;
  $('#modal-text').innerHTML = contenu || texte || '';
  const st = $('#modal-stars');
  st.hidden = !etoiles;
  if(etoiles) [...st.children].forEach((img, i) => img.classList.toggle('on', i < etoiles));
  const act = $('#modal-actions'); act.innerHTML = '';
  (actions || []).forEach(([label, action, cls]) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = cls || 'btn'; b.textContent = label; b.dataset.modalAction = action;
    act.appendChild(b);
  });
  $('#modal').hidden = false;
}
const fermerModale = () => { $('#modal').hidden = true; };

function ecranNiveaux(){
  const cases = [];
  for(let n = 1; n <= MAX_NIVEAU; n++){
    const e = P.etoiles[n] || 0;
    const cls = n === P.niveau ? 'lvl now' : e ? 'lvl done' : 'lvl';
    const bloque = n > P.niveau ? ' disabled' : '';
    cases.push(`<button type="button" class="${cls}" data-goto="${n}"${bloque}>${n}</button>`);
  }
  modale({
    mascotte: 'chat-surpris', titre: 'Niveaux',
    contenu: `<div class="lvl-grid">${cases.join('')}</div>`,
    actions: [['Fermer', 'close', 'btn btn-2']]
  });
}

function ecranAide(){
  modale({
    mascotte: 'chat-salut', titre: 'Comment jouer',
    contenu: `<ol class="how">
      <li>Touche un objet pour le prendre.</li>
      <li>Touche un bac avec de la place pour l'y déposer.</li>
      <li>Réunis <b>3 objets identiques</b> dans un même bac : ils disparaissent.</li>
      <li>Vide tout le plateau pour gagner le niveau.</li>
      <li>Moins tu joues de coups, plus tu gagnes d'étoiles.</li>
    </ol>`,
    actions: [['Compris', 'close', 'btn']]
  });
}

/* ---------- navigation ---------- */
function ecran(nom){
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('is-active'));
  $('#screen-' + nom).classList.add('is-active');
  if(nom === 'menu') majMenu();
}
function majMenu(){
  const tot = Object.values(P.etoiles).reduce((a, b) => a + b, 0);
  $('#stat-stars').textContent = tot;
  $('#stat-level').textContent = P.niveau;
  $('#start-label').textContent = P.niveau > 1 ? 'Reprendre — niveau ' + P.niveau : 'Commencer';
}

/* ---------- evenements ---------- */
board.addEventListener('click', clicBoard);

document.addEventListener('click', e => {
  const ma = e.target.closest('[data-modal-action]');
  if(ma){
    const a = ma.dataset.modalAction;
    fermerModale();
    if(a === 'next') demarrer(Math.min(S.niveau + 1, MAX_NIVEAU));
    else if(a === 'again') demarrer(S.niveau);
    else if(a === 'menu') ecran('menu');
    return;
  }
  const g = e.target.closest('[data-goto]');
  if(g){ fermerModale(); demarrer(+g.dataset.goto); return; }

  const btn = e.target.closest('[data-action]');
  if(!btn) return;
  switch(btn.dataset.action){
    case 'start':   demarrer(P.niveau); break;
    case 'levels':  ecranNiveaux(); break;
    case 'how':     ecranAide(); break;
    case 'menu':    ecran('menu'); break;
    case 'undo':    annuler(); break;
    case 'addtray': ajouterBac(); break;
    case 'hint':    indice(); break;
    case 'restart': demarrer(S.niveau); break;
    case 'sound':
      sonOn = !sonOn;
      btn.classList.toggle('is-off', !sonOn);
      if(sonOn) SFX.poser();
      break;
  }
});

document.addEventListener('keydown', e => { if(e.key === 'Escape') fermerModale(); });

let rzTimer;
window.addEventListener('resize', () => { clearTimeout(rzTimer); rzTimer = setTimeout(ajusterBoard, 120); });
window.addEventListener('orientationchange', () => setTimeout(ajusterBoard, 260));

majMenu();

/* ---------- service worker ---------- */
if('serviceWorker' in navigator){
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
