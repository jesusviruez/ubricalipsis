import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Crosshair, MapPin, Skull, Beer, Wrench, Home, Siren, Shield,
  Footprints, Search, RotateCcw, Flag, Backpack, Zap, HelpCircle, X,
  Sparkles, AlertTriangle, CheckCircle2, XCircle, ChevronDown,
  ChevronUp, Info
} from 'lucide-react';

function Button({ children, className = '', ...props }) {
  return <button className={`px-4 py-2 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${className}`} {...props}>{children}</button>;
}
function Card({ children, className = '', ...props }) { return <div className={className} {...props}>{children}</div>; }
function CardContent({ children, className = '', ...props }) { return <div className={className} {...props}>{children}</div>; }

const MAX_HEALTH = 10;
const MAX_AMMO = 5;

const ACTION_ICONS = { move: Footprints, attack: Crosshair, search: Search, hide: Shield, heal: Beer };
const ACTION_META = {
  move: { label: 'MOVERSE', icon: '👣', help: 'Avanza al nodo elegido en el mapa.' },
  attack: { label: 'ATACAR', icon: '🔫', help: 'Gasta 2 munición y evita el próximo peligro.' },
  search: { label: 'BUSCAR', icon: '🥜', help: 'Gana 1 munición.' },
  hide: { label: 'OCULTARSE', icon: '🛡️', help: 'Evita el próximo peligro, salvo en Zona abierta.' },
  heal: { label: 'CURAR', icon: '🍺', help: 'Recupera 1 salud.' },
};

const ACTION_DECK = [
  { id: 'move_01', type: 'move', name: 'Atajo de toda la vida', cost: 'Gratis', text: 'Recuerdas el camino de memoria. Avanza al lugar elegido.', effectText: 'avanzas siguiendo el camino que ya tenías en la cabeza.' },
  { id: 'move_02', type: 'move', name: 'Carrera cuesta abajo', cost: 'Gratis', text: 'Aprovechas la pendiente y sales disparado.', effectText: 'bajas como una bala entre escombros y persianas dobladas.' },
  { id: 'move_03', type: 'move', name: 'Por donde antes iba tó el mundo', cost: 'Gratis', text: 'El pueblo está hecho polvo, pero sabes por dónde se acorta.', effectText: 'encuentras un paso entre coches volcados y macetas rotas.' },
  { id: 'attack_01', type: 'attack', name: 'Patacabra ofensiva', cost: '-2 munición', text: 'Le lanzas una patacabra al Político zombie.', effectText: 'el próximo peligro queda neutralizado.' },
  { id: 'attack_02', type: 'attack', name: 'Taconazo de emergencia', cost: '-2 munición', text: 'Improvisas un proyectil con un tacón de muestra.', effectText: 'el tacón impacta con dignidad industrial.' },
  { id: 'attack_03', type: 'attack', name: 'Chatarra bien tirá', cost: '-2 munición', text: 'Lanzas un trozo de persiana como si llevaras años entrenando.', effectText: 'la amenaza queda descolocada.' },
  { id: 'attack_04', type: 'attack', name: 'Disparo al aire', cost: '-2 munición', text: 'El ruido espanta hasta al más pesado.', effectText: 'ganas unos segundos vitales.' },
  { id: 'search_01', type: 'search', name: 'Bar de toda la vida', cost: 'Gratis', text: 'Registras el bar. Quedan unas pipas.', effectText: 'encuentras munición escondida detrás de una caja de pipas.' },
  { id: 'search_02', type: 'search', name: 'Cajón sospechoso', cost: 'Gratis', text: 'Abres un cajón que nadie tocaba desde 1998.', effectText: 'aparece algo útil entre papeles amarillentos.' },
  { id: 'search_03', type: 'search', name: 'Bolsa del mandao', cost: 'Gratis', text: 'Una bolsa abandonada contiene recursos inesperados.', effectText: 'encuentras algo aprovechable.' },
  { id: 'search_04', type: 'search', name: 'Debajo del mostrador', cost: 'Gratis', text: 'Miras debajo del mostrador.', effectText: 'aparece otro cartucho para seguir dando guerra.' },
  { id: 'hide_01', type: 'hide', name: 'Portal de confianza', cost: 'Gratis', text: 'Te metes en el portal de siempre.', effectText: 'el silencio del portal te cubre.' },
  { id: 'hide_02', type: 'hide', name: 'Persiana a medio bajar', cost: 'Gratis', text: 'Te cuelas bajo una persiana oxidada.', effectText: 'los zombies pasan de largo.' },
  { id: 'hide_03', type: 'hide', name: 'Tras una furgoneta quemada', cost: 'Gratis', text: 'Te escondes tras una furgoneta quemada.', effectText: 'nadie se acerca demasiado.' },
  { id: 'hide_04', type: 'hide', name: 'Silencio de siesta', cost: 'Gratis', text: 'Te quedas tan quieto como el mobiliario urbano.', effectText: 'ni los zombies se atreven a romper la siesta.' },
  { id: 'heal_01', type: 'heal', name: 'Tercio fresquito', cost: 'Gratis', text: 'Encuentras un tercio de cerveza fresquita.', effectText: 'recuperas algo de fuerza.' },
  { id: 'heal_02', type: 'heal', name: 'Puchero milagroso', cost: 'Gratis', text: 'Una cucharada de puchero templado te devuelve la fe.', effectText: 'te recompone el alma.' },
  { id: 'heal_03', type: 'heal', name: 'Botiquín de peña', cost: 'Gratis', text: 'Encuentras vendas, tiritas y un bote sin etiqueta.', effectText: 'no sabes qué era, pero funciona.' },
  { id: 'heal_04', type: 'heal', name: 'Sombra bendita', cost: 'Gratis', text: 'Te sientas treinta segundos en una sombra.', effectText: 'todavía puedes seguir.' },
];

const EVENT_DECK = [
  { id: 'ev_01', name: 'Zombie Político', type: 'Mala', negative: true, text: 'Aparece con un folleto electoral. Pierdes 3 salud.', apply: s => ({ ...s, health: Math.max(0, s.health - 3) }) },
  { id: 'ev_02', name: 'Promesa electoral zombie', type: 'Mala', negative: true, text: 'Te promete arreglarlo todo. Pierdes 2 salud.', apply: s => ({ ...s, health: Math.max(0, s.health - 2) }) },
  { id: 'ev_03', name: 'Mitin improvisado', type: 'Mala', negative: true, text: 'Un corrillo bloquea la calle. Pierdes 1 acción.', apply: s => ({ ...s, actionsLeft: Math.max(0, s.actionsLeft - 1) }) },
  { id: 'ev_04', name: 'Zombie Conocido', type: 'Gradual', negative: true, text: 'Te para a contarte sus cosas. -1 salud durante 2 turnos.', apply: s => ({ ...s, poison: s.poison + 2 }) },
  { id: 'ev_05', name: 'Zombie Empresario', type: 'Mala', negative: true, text: 'Te ofrece un contrato en formación. Pierdes 2 salud y 2 munición.', apply: s => ({ ...s, health: Math.max(0, s.health - 2), ammo: Math.max(0, s.ammo - 2) }) },
  { id: 'ev_06', name: 'Olor a guiso', type: 'Buena', negative: false, text: 'Civilización pura. Recuperas 3 salud.', apply: s => ({ ...s, health: Math.min(MAX_HEALTH, s.health + 3) }) },
  { id: 'ev_07', name: 'Tupper salvador', type: 'Buena', negative: false, text: 'Comida casera. Recuperas 2 salud.', apply: s => ({ ...s, health: Math.min(MAX_HEALTH, s.health + 2) }) },
  { id: 'ev_08', name: 'Botellín intacto', type: 'Buena', negative: false, text: 'Recuperas 1 salud y 1 munición.', apply: s => ({ ...s, health: Math.min(MAX_HEALTH, s.health + 1), ammo: Math.min(MAX_AMMO, s.ammo + 1) }) },
  { id: 'ev_09', name: 'Calle cortada', type: 'Neutra', negative: false, text: 'Sillas de bar bloquean el paso. Pierdes 1 acción.', apply: s => ({ ...s, actionsLeft: Math.max(0, s.actionsLeft - 1) }) },
  { id: 'ev_10', name: 'Bolsa de gas menor', type: 'Mala', negative: true, text: 'Te deja sin aire. Pierdes 2 salud.', apply: s => ({ ...s, health: Math.max(0, s.health - 2) }) },
  { id: 'ev_11', name: 'Silencio raro', type: 'Buena', negative: false, text: 'Robarás 1 carta extra el próximo turno.', apply: s => ({ ...s, extraDraw: 1 }) },
  { id: 'ev_12', name: 'Chispa de suerte', type: 'Buena', negative: false, text: 'Encuentras un cargador. Ganas 2 munición.', apply: s => ({ ...s, ammo: Math.min(MAX_AMMO, s.ammo + 2) }) },
];

const UBRIQUE_QUESTIONS = [
  { q: '¿Ubrique pertenece a la provincia de Cádiz?', a: true },
  { q: '¿Ubrique forma parte de la comarca de la Sierra de Cádiz?', a: true },
  { q: '¿Ubrique es conocido por su industria de la piel y la marroquinería?', a: true },
  { q: '¿El código postal de Ubrique es 11600?', a: true },
  { q: '¿Ubrique se encuentra en Andalucía?', a: true },
  { q: '¿La ciudad romana cercana a Ubrique se llama Ocuri?', a: true },
  { q: '¿El Museo de la Piel se ubica en el antiguo Convento de Capuchinos?', a: true },
  { q: '¿La exposición permanente del Museo de la Piel se llama “Manos y Magia en la Piel”?', a: true },
  { q: '¿La Fuente de los Nueve Caños está relacionada con el patrimonio de Ubrique?', a: true },
  { q: '¿Ubrique está vinculado a la Ruta de los Pueblos Blancos?', a: true },
  { q: '¿Ubrique está junto al entorno de Grazalema y Los Alcornocales?', a: true },
  { q: '¿El río Ubrique atraviesa o divide el municipio?', a: true },
  { q: '¿El gentilicio habitual de Ubrique es ubriqueño o ubriqueña?', a: true },
  { q: '¿San Sebastián es patrón de Ubrique?', a: true },
  { q: '¿La Virgen de los Remedios es patrona de Ubrique?', a: true },
  { q: '¿La fortaleza de Cardela también es conocida como Castillo de Fátima?', a: true },
  { q: '¿Ubrique limita con la provincia de Málaga?', a: true },
  { q: '¿La calzada romana comunica tradicionalmente Ubrique con Benaocaz?', a: true },
  { q: '¿Ubrique está en la provincia de Sevilla?', a: false },
  { q: '¿Ubrique es un municipio costero con playa?', a: false },
  { q: '¿El producto tradicional principal de Ubrique es el mármol?', a: false },
  { q: '¿Ocuri es una ciudad fenicia situada en la costa?', a: false },
  { q: '¿El Museo de la Piel está dedicado principalmente a la pesca?', a: false },
  { q: '¿Ubrique pertenece a la Ruta de los Pueblos Negros?', a: false },
  { q: '¿La capital provincial de Ubrique es Málaga?', a: false },
];

const MAP = {
  ayuntamiento: { name: 'Plaza del Ayuntamiento', short: 'Ayuntamiento', type: 'Inicio', x: 6, y: 51, options: ['trinidad', 'callejones'] },
  trinidad: { name: 'Plaza de la Trinidad', short: 'Trinidad', type: 'Zona abierta', x: 18, y: 31, options: ['avenida', 'estrella'] },
  callejones: { name: 'Los Callejones', short: 'Callejones', type: 'Taller', x: 18, y: 71, options: ['avenida', 'estrella'] },
  avenida: { name: 'Avenida de España', short: 'Av. España', type: 'Refugio', x: 33, y: 31, options: ['ferial', 'vega'] },
  estrella: { name: 'Plaza de la Estrella', short: 'Estrella', type: 'Barricada', x: 33, y: 71, options: ['ferial', 'vega'] },
  ferial: { name: 'Recinto Ferial', short: 'Ferial', type: 'Taller', x: 49, y: 31, options: ['mision', 'canos'] },
  vega: { name: 'La Vega', short: 'La Vega', type: 'Barricada', x: 49, y: 71, options: ['mision', 'canos'] },
  mision: { name: 'Plaza Misión Rescate', short: 'Misión', type: 'Refugio', x: 65, y: 31, options: ['fuente', 'frontera'] },
  canos: { name: 'Los 9 Caños', short: '9 Caños', type: 'Clínica', x: 65, y: 71, options: ['fuente', 'frontera'] },
  fuente: { name: 'Fuente San Francisco', short: 'Fuente S.F.', type: 'Clínica', x: 82, y: 31, options: ['frontera'] },
  frontera: { name: 'La Frontera', short: 'La Frontera', type: 'Salida', x: 94, y: 51, options: [] },
};
const EDGES = Object.entries(MAP).flatMap(([from, n]) => n.options.map(to => ({ from, to })));
const typeIcons = { Inicio: MapPin, 'Zona abierta': Siren, Taller: Wrench, Refugio: Home, Barricada: Skull, Clínica: Heart, Salida: Flag };
const typeColors = { Inicio: 'bg-amber-500 text-stone-950 border-amber-200', 'Zona abierta': 'bg-red-950 text-red-100 border-red-700', Taller: 'bg-orange-900 text-orange-100 border-orange-600', Refugio: 'bg-emerald-950 text-emerald-100 border-emerald-700', Barricada: 'bg-stone-800 text-stone-100 border-stone-500', Clínica: 'bg-sky-950 text-sky-100 border-sky-700', Salida: 'bg-green-800 text-green-50 border-green-400' };

const NODE_TYPE_INFO = {
  'Zona abierta': { tone: 'bad', summary: 'Sin cobertura. Te ven desde todas partes.', detail: 'Al llegar se resolverán 2 eventos en vez de 1. OCULTARSE no sirve de nada aquí: no hay dónde meterse.' },
  Taller: { tone: 'good', summary: 'Restos de ferretería o garaje. Hay piezas sueltas.', detail: 'Ganas +1 munición automáticamente al llegar.' },
  Refugio: { tone: 'good', summary: 'Un sitio para parar y reorganizarte un momento.', detail: 'Robarás 1 carta extra en tu próximo turno.' },
  Barricada: { tone: 'bad', summary: 'El paso está obstruido con escombros o muebles.', detail: 'Pierdes 1 acción este turno al abrirte camino.' },
  Clínica: { tone: 'good', summary: 'Botiquín, ambulatorio o farmacia saqueada.', detail: 'Recuperas +2 salud automáticamente al llegar.' },
  Salida: { tone: 'good', summary: 'El final del camino. La libertad, si llegas con vida.', detail: 'Llegar aquí significa que has escapado de Ubricalipsis.' },
  Inicio: { tone: 'neutral', summary: 'Plaza del Ayuntamiento. Donde empieza todo.', detail: 'Tu punto de partida.' },
};

function SurvivorIcon({ size = 28, className = '' }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* backpack strap */}
      <path d="M14 20 Q12 30 14 38" stroke="#3f3022" strokeWidth="3" strokeLinecap="round" />
      {/* backpack body */}
      <rect x="6" y="19" width="9" height="14" rx="3" fill="#5b4326" stroke="#2c2014" strokeWidth="1.5" />
      <rect x="8" y="22" width="5" height="3" rx="1" fill="#7a5c34" />
      {/* body / coat */}
      <path d="M16 22 Q24 17 32 22 L33 40 Q24 44 15 40 Z" fill="#3c4a3a" stroke="#1f2a1d" strokeWidth="1.5" />
      {/* belt */}
      <rect x="16" y="31" width="16" height="2.4" fill="#2c2014" />
      {/* arms */}
      <path d="M16 23 Q11 27 12 33" stroke="#3c4a3a" strokeWidth="4" strokeLinecap="round" />
      <path d="M32 23 Q37 27 35 32" stroke="#3c4a3a" strokeWidth="4" strokeLinecap="round" />
      {/* head */}
      <circle cx="24" cy="13" r="7" fill="#caa874" stroke="#7a5c34" strokeWidth="1.2" />
      {/* hood / hair */}
      <path d="M17 12 Q17 5 24 5 Q31 5 31 12 Q31 8 24 8 Q17 8 17 12Z" fill="#241c12" />
      {/* mascarilla / pañuelo */}
      <path d="M18.5 14.5 Q24 19 29.5 14.5 L29 17.5 Q24 21 19 17.5 Z" fill="#8a2f2f" stroke="#5c1c1c" strokeWidth="0.8" />
      {/* eyes glint */}
      <circle cx="21" cy="12.5" r="0.9" fill="#1c140a" />
      <circle cx="27" cy="12.5" r="0.9" fill="#1c140a" />
    </svg>
  );
}


const MOVE_REACTIONS = [
  { kind: 'good', title: 'Atajo inesperado', text: 'Una vecina te señala una calle limpia. Recuperas 1 salud.', effect: s => ({ ...s, health: Math.min(MAX_HEALTH, s.health + 1) }), log: '✨ Reacción buena de movimiento: recuperas 1 salud.' },
  { kind: 'good', title: 'Bolso abandonado', text: 'Encuentras un cargador oculto. Ganas 1 munición.', effect: s => ({ ...s, ammo: Math.min(MAX_AMMO, s.ammo + 1) }), log: '✨ Reacción buena de movimiento: ganas 1 munición.' },
  { kind: 'good', title: 'Balconazo salvador', text: 'Te avisan de un peligro cercano. Ignoras el próximo peligro.', effect: s => ({ ...s, skipNextDanger: true }), log: '✨ Reacción buena de movimiento: ignoras el próximo peligro.' },
  { kind: 'bad', title: 'Cristales en el suelo', text: 'Pisoteas sin mirar. Pierdes 1 salud.', effect: s => ({ ...s, health: Math.max(0, s.health - 1) }), log: '💥 Reacción mala de movimiento: pierdes 1 salud.' },
  { kind: 'bad', title: 'Zarandeo zombie', text: 'Un zombie te agarra al pasar. Pierdes 2 salud.', effect: s => ({ ...s, health: Math.max(0, s.health - 2) }), log: '💥 Reacción mala de movimiento: pierdes 2 salud.' },
  { kind: 'bad', title: 'Cargador embarrado', text: 'Se te cae parte de la munición. Pierdes 1 munición.', effect: s => ({ ...s, ammo: Math.max(0, s.ammo - 1) }), log: '💥 Reacción mala de movimiento: pierdes 1 munición.' },
  { kind: 'question', title: 'Pregunta de supervivencia local', text: 'Responde correctamente una pregunta sobre Ubrique.' },
  { kind: 'question', title: 'Memoria ubriqueña', text: 'Demuestra que conoces el pueblo.' },
  { kind: 'question', title: 'Señal pintada en la pared', text: 'Una pista local te indica por dónde seguir.' },
];
const ACTION_REACTIONS = [
  { kind: 'good', title: 'Acción redonda', text: 'La jugada sale mejor de lo esperado. Recuperas 1 salud.', effect: s => ({ ...s, health: Math.min(MAX_HEALTH, s.health + 1) }), log: '✨ Reacción buena de acción: recuperas 1 salud.' },
  { kind: 'good', title: 'Manos firmes', text: 'Revisas el equipo mientras actúas. Ganas 1 munición.', effect: s => ({ ...s, ammo: Math.min(MAX_AMMO, s.ammo + 1) }), log: '✨ Reacción buena de acción: ganas 1 munición.' },
  { kind: 'good', title: 'Preparación útil', text: 'Te organizas mejor. Robarás 1 carta extra el próximo turno.', effect: s => ({ ...s, extraDraw: 1 }), log: '✨ Reacción buena de acción: robarás 1 carta extra.' },
  { kind: 'bad', title: 'Ruido inoportuno', text: 'La acción hace demasiado ruido. Pierdes 1 salud.', effect: s => ({ ...s, health: Math.max(0, s.health - 1) }), log: '💥 Reacción mala de acción: pierdes 1 salud.' },
  { kind: 'bad', title: 'Recurso desperdiciado', text: 'Algo sale torcido. Pierdes 1 munición.', effect: s => ({ ...s, ammo: Math.max(0, s.ammo - 1) }), log: '💥 Reacción mala de acción: pierdes 1 munición.' },
  { kind: 'bad', title: 'Tiempo perdido', text: 'Te entretienes demasiado. Pierdes 1 acción.', effect: s => ({ ...s, actionsLeft: Math.max(0, s.actionsLeft - 1) }), log: '💥 Reacción mala de acción: pierdes 1 acción.' },
];

function makeId(prefix = 'id') { return crypto.randomUUID ? crypto.randomUUID() : `${prefix}-${Date.now()}-${Math.random()}`; }
function randomFrom(deck) { return deck[Math.floor(Math.random() * deck.length)]; }
function randomEvent() { return randomFrom(EVENT_DECK); }
function createLogEntry(text, fresh = false) { return { id: makeId('log'), text, fresh }; }
function drawHand(extra = 0, ensureMove = false) {
  const count = 3 + extra;
  if (!ensureMove) return Array.from({ length: count }, (_, i) => ({ ...randomFrom(ACTION_DECK), uid: makeId(`card-${i}`) }));
  const moveCards = ACTION_DECK.filter(c => c.type === 'move');
  const nonMoveCards = ACTION_DECK.filter(c => c.type !== 'move');
  const hand = [{ ...randomFrom(moveCards), uid: makeId('move-guaranteed') }];
  while (hand.length < count) hand.push({ ...randomFrom(nonMoveCards), uid: makeId(`card-${hand.length}`) });
  return hand.sort(() => Math.random() - 0.5);
}
function createInitialGame() {
  return { health: 10, ammo: 3, current: 'ayuntamiento', chosenNext: 'trinidad', hand: drawHand(0, true), actionsLeft: 2, turn: 1, poison: 0, skipNextDanger: false, extraDraw: 0, doubleEvent: false, status: 'playing', needsActionAfterMove: false, noMoveDraws: 0 };
}
function createMovementReaction(destinationName) {
  const template = randomFrom(MOVE_REACTIONS);
  const base = { id: makeId('move-reaction'), destinationName, ...template };
  return template.kind === 'question' ? { ...base, question: randomFrom(UBRIQUE_QUESTIONS) } : base;
}
function createActionReaction(card) { return { id: makeId('action-reaction'), sourceCard: card.name, sourceType: card.type, ...randomFrom(ACTION_REACTIONS) }; }
function getCurrentTip(game) {
  const node = MAP[game.current];
  const hasMove = game.hand.some(c => c.type === 'move');
  const hasHeal = game.hand.some(c => c.type === 'heal');
  const hasSearch = game.hand.some(c => c.type === 'search');
  const hasAttack = game.hand.some(c => c.type === 'attack');
  if (game.status === 'won') return '🏁 Has llegado a La Frontera. Reinicia si quieres probar otra ruta.';
  if (game.status === 'lost') return '💀 Has caído en Ubricalipsis. Reinicia y prepara mejor la ruta.';
  if (game.needsActionAfterMove) return '⚠️ Te has movido y no tienes cartas de MOVERSE. Juega una acción para prepararte.';
  if (game.health <= 3 && hasHeal) return '❤️ Tu salud está baja. Juega CURAR antes de terminar turno.';
  if (game.ammo <= 1 && hasSearch) return '🔫 Tienes poca munición. Juega BUSCAR o pasa por un Taller.';
  if (node.type === 'Zona abierta' && hasAttack) return '⚡ Estás en Zona abierta: habrá 2 eventos. ATACAR puede evitar el próximo peligro.';
  if (node.type === 'Zona abierta') return '⚡ Estás en Zona abierta. OCULTARSE no funciona aquí.';
  if (game.chosenNext && hasMove) return `👣 Ruta elegida: ${MAP[game.chosenNext].name}. Juega MOVERSE para avanzar.`;
  if (game.chosenNext && !hasMove) return '⏳ Ya tienes ruta elegida, pero no tienes MOVERSE. Terminar turno te dará MOVERSE en máximo 2 robos.';
  return '👉 Elige uno de los caminos amarillos y juega una carta MOVERSE.';
}
function PipBar({ value, max, icon: Icon, label }) {
  return <div className="space-y-1"><div className="flex items-center gap-2 text-sm font-semibold text-amber-100"><Icon className="h-4 w-4" />{label}: {value}/{max}</div><div className="flex gap-1 flex-wrap">{Array.from({ length: max }).map((_, i) => <motion.span key={i} animate={{ scale: i < value ? [1, 1.25, 1] : 1 }} className={`h-3 w-5 rounded-sm border border-amber-900/70 ${i < value ? 'bg-amber-400' : 'bg-stone-900/70'}`} />)}</div></div>;
}
function applyNodeEffect(node, state) {
  let s = { ...state }; const logs = [];
  if (node.type === 'Taller') { s.ammo = Math.min(MAX_AMMO, s.ammo + 1); logs.push(`🔧 ${node.name}: +1 munición.`); }
  if (node.type === 'Clínica') { s.health = Math.min(MAX_HEALTH, s.health + 2); logs.push(`🏥 ${node.name}: +2 salud.`); }
  if (node.type === 'Refugio') { s.extraDraw = 1; logs.push(`🏚️ ${node.name}: robarás 1 carta extra.`); }
  if (node.type === 'Barricada') { s.actionsLeft = Math.max(0, s.actionsLeft - 1); logs.push(`🚧 ${node.name}: pierdes 1 acción este turno.`); }
  if (node.type === 'Zona abierta') { s.doubleEvent = true; logs.push(`⚡ ${node.name}: se resolverán 2 eventos.`); }
  return { state: s, logs };
}

function HelpModal({ onClose }) {
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"><motion.div initial={{ scale: .92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: .92, y: 20 }} className="max-w-2xl w-full max-h-[90vh] overflow-auto rounded-2xl border border-amber-700 bg-stone-950 text-amber-50 shadow-2xl"><div className="sticky top-0 flex justify-between gap-3 border-b border-amber-900/70 bg-stone-950 p-5"><div><h2 className="text-2xl font-black text-amber-300">¿Cómo jugar?</h2><p className="mt-1 text-sm text-amber-100/70">Guía rápida para sobrevivir a Ubricalipsis.</p></div><button onClick={onClose} className="rounded-full bg-stone-900 p-2 hover:bg-stone-800"><X className="h-5 w-5" /></button></div><div className="space-y-5 p-5 text-sm leading-relaxed"><div><h3 className="font-black text-amber-300">Objetivo</h3><p>Llega hasta <b>La Frontera</b> antes de quedarte sin salud.</p></div><div><h3 className="font-black text-amber-300">Reglas nuevas</h3><ol className="list-decimal space-y-1 pl-5"><li>Terminar turno cuesta <b>1 salud</b>.</li><li>Cada movimiento lanza una reacción: buena, mala o pregunta.</li><li>Cada carta de acción también lanza reacción buena o mala.</li><li>Si una reacción de acción es mala, puedes gastar otra carta de acción para cancelarla.</li><li>Si no tienes MOVERSE, el juego te garantiza una carta de MOVERSE en máximo 2 robos.</li></ol></div><div><h3 className="font-black text-amber-300">Cartas</h3><div className="grid sm:grid-cols-2 gap-2">{Object.values(ACTION_META).map(m => <div key={m.label} className="rounded-xl border border-amber-900/60 bg-stone-900/80 p-3"><b>{m.icon} {m.label}</b><br /><span className="text-amber-100/75">{m.help}</span></div>)}</div></div></div></motion.div></motion.div>;
}
function MovementReactionModal({ reaction, onApply, onAnswer }) {
  const isQuestion = reaction.kind === 'question';
  const icon = reaction.kind === 'good' ? <Sparkles className="h-8 w-8" /> : reaction.kind === 'bad' ? <AlertTriangle className="h-8 w-8" /> : <HelpCircle className="h-8 w-8" />;
  const color = reaction.kind === 'good' ? 'border-green-500 bg-green-950/95' : reaction.kind === 'bad' ? 'border-red-500 bg-red-950/95' : 'border-yellow-400 bg-stone-950/95';
  return <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.div initial={{ scale: .72, rotate: -2, y: 40 }} animate={{ scale: 1, rotate: 0, y: 0 }} exit={{ scale: .88, opacity: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 18 }} className={`w-full max-w-xl rounded-3xl border-2 ${color} p-6 text-amber-50 shadow-2xl`}><div className="flex items-center gap-3"><div className="rounded-2xl bg-black/30 p-3 text-amber-300">{icon}</div><div><p className="text-xs uppercase tracking-[0.35em] text-amber-200/70">Reacción de movimiento</p><h2 className="text-2xl font-black text-amber-300">{reaction.title}</h2></div></div><p className="mt-4 text-sm text-amber-100/85">Al llegar a <b>{reaction.destinationName}</b> ocurre algo...</p><p className="mt-3 rounded-2xl border border-amber-800/50 bg-black/25 p-4">{reaction.text}</p>{isQuestion ? <div className="mt-5 space-y-4"><div className="rounded-2xl border border-yellow-500/50 bg-yellow-950/40 p-4 text-lg font-bold">{reaction.question.q}</div><div className="grid grid-cols-2 gap-3"><Button onClick={() => onAnswer(true)} className="bg-green-600 hover:bg-green-500 text-white font-black"><CheckCircle2 className="mr-2 inline h-5 w-5" />Sí</Button><Button onClick={() => onAnswer(false)} className="bg-red-700 hover:bg-red-600 text-white font-black"><XCircle className="mr-2 inline h-5 w-5" />No</Button></div></div> : <Button onClick={onApply} className="mt-5 w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-black">Continuar</Button>}</motion.div></motion.div>;
}
function ActionReactionModal({ reaction, mitigationCards, onApply, onMitigate }) {
  const isBad = reaction.kind === 'bad';
  const color = isBad ? 'border-red-500 bg-red-950/95' : 'border-green-500 bg-green-950/95';
  return <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.div initial={{ scale: .72, rotate: 2, y: 40 }} animate={{ scale: 1, rotate: 0, y: 0 }} exit={{ scale: .88, opacity: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 18 }} className={`w-full max-w-xl rounded-3xl border-2 ${color} p-6 text-amber-50 shadow-2xl`}><div className="flex items-center gap-3"><div className="rounded-2xl bg-black/30 p-3 text-amber-300">{isBad ? <AlertTriangle className="h-8 w-8" /> : <Sparkles className="h-8 w-8" />}</div><div><p className="text-xs uppercase tracking-[0.35em] text-amber-200/70">Reacción de acción</p><h2 className="text-2xl font-black text-amber-300">{reaction.title}</h2></div></div><p className="mt-4 text-sm text-amber-100/85">La carta <b>{reaction.sourceCard}</b> desencadena una consecuencia.</p><p className="mt-3 rounded-2xl border border-amber-800/50 bg-black/25 p-4">{reaction.text}</p>{isBad && mitigationCards.length > 0 && <div className="mt-5 rounded-2xl border border-yellow-500/50 bg-yellow-950/30 p-4"><p className="mb-3 text-sm font-bold text-yellow-100">Puedes usar otra carta de acción para paliarla y cancelar el efecto:</p><div className="grid gap-2 sm:grid-cols-2">{mitigationCards.map(card => <Button key={card.uid} onClick={() => onMitigate(card)} className="bg-yellow-400 text-stone-950 hover:bg-yellow-300 text-left font-black">{ACTION_META[card.type].icon} {card.name}</Button>)}</div></div>}{isBad && mitigationCards.length === 0 && <div className="mt-5 rounded-2xl border border-red-500/50 bg-red-950/30 p-4 text-sm text-red-100">No tienes cartas de acción para paliarla. Tendrás que asumirla.</div>}<Button onClick={onApply} className={`mt-5 w-full font-black ${isBad ? 'bg-red-700 hover:bg-red-600 text-white' : 'bg-amber-500 hover:bg-amber-400 text-stone-950'}`}>{isBad ? 'Asumir reacción' : 'Continuar'}</Button></motion.div></motion.div>;
}
function BranchMap({ current, chosenNext, onChoose, health, ammo }) {
  const currentOptions = MAP[current].options;
  const currentNode = MAP[current];
  const healthPct = health / MAX_HEALTH;
  const ammoPct = ammo / MAX_AMMO;
  const healthTone = healthPct <= 0.3 ? '#ef4444' : healthPct <= 0.6 ? '#f59e0b' : '#4ade80';
  return <div className="overflow-x-auto rounded-2xl border border-amber-900/70 bg-stone-950/70 p-2 shadow-inner"><div className="relative h-[350px] min-w-[980px] overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_center,#3a2818,#120d09_72%)]">
    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(30deg, rgba(245,158,11,.22) 1px, transparent 1px), linear-gradient(150deg, rgba(245,158,11,.16) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

    {/* HUD integrado: salud y munición, esquina superior izquierda del tablero */}
    <div className="absolute left-3 top-3 z-30 flex flex-col gap-1.5 rounded-xl border border-amber-700/60 bg-stone-950/85 px-3 py-2 backdrop-blur-sm shadow-lg">
      <div className="flex items-center gap-2">
        <Heart className="h-3.5 w-3.5 shrink-0" style={{ color: healthTone }} />
        <div className="flex gap-[2px]">{Array.from({ length: MAX_HEALTH }).map((_, i) => <motion.span key={i} animate={{ scale: i < health ? [1, 1.2, 1] : 1 }} className="h-2.5 w-2 rounded-[1px]" style={{ background: i < health ? healthTone : 'rgba(120,113,108,.35)' }} />)}</div>
        <span className="ml-0.5 text-[11px] font-black tabular-nums text-amber-50">{health}/{MAX_HEALTH}</span>
      </div>
      <div className="flex items-center gap-2">
        <Crosshair className="h-3.5 w-3.5 shrink-0 text-amber-400" />
        <div className="flex gap-[2px]">{Array.from({ length: MAX_AMMO }).map((_, i) => <motion.span key={i} animate={{ scale: i < ammo ? [1, 1.2, 1] : 1 }} className="h-2.5 w-2 rounded-[1px]" style={{ background: i < ammo ? '#fbbf24' : 'rgba(120,113,108,.35)' }} />)}</div>
        <span className="ml-0.5 text-[11px] font-black tabular-nums text-amber-50">{ammo}/{MAX_AMMO}</span>
      </div>
    </div>

    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">{EDGES.map(e => { const a = MAP[e.from]; const b = MAP[e.to]; const active = e.from === current && e.to === chosenNext; const available = e.from === current && currentOptions.includes(e.to); return <motion.line key={`${e.from}-${e.to}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={active ? '#facc15' : available ? '#f59e0b' : '#57534e'} strokeWidth={active ? 1.1 : available ? .8 : .45} strokeDasharray={active ? '2 1' : available ? '1.5 1.5' : '0'} opacity={active ? 1 : available ? .9 : .4} />; })}</svg>

    <motion.div className="absolute z-20 -translate-x-1/2 -translate-y-1/2" animate={{ left: `${currentNode.x}%`, top: `${currentNode.y}%` }} transition={{ type: 'spring', stiffness: 70, damping: 14, mass: .9 }}>
      <motion.div animate={{ boxShadow: ['0 0 16px rgba(250,204,21,.55)', '0 0 28px rgba(250,204,21,.9)', '0 0 16px rgba(250,204,21,.55)'] }} transition={{ repeat: Infinity, duration: 2.2 }} className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-yellow-300 bg-gradient-to-b from-amber-200 to-amber-500 text-stone-950">
        <SurvivorIcon size={26} />
      </motion.div>
    </motion.div>

    {Object.entries(MAP).map(([id, n]) => { const Icon = typeIcons[n.type] || MapPin; const active = id === current; const selectable = currentOptions.includes(id); const selected = chosenNext === id; return <motion.button key={id} onClick={() => selectable && onChoose(id)} whileHover={{ scale: selectable ? 1.08 : 1.02 }} className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 w-28 rounded-2xl border-2 p-2 text-center shadow-xl backdrop-blur-sm transition ${typeColors[n.type]} ${selectable ? 'cursor-pointer ring-4 ring-amber-400/50' : 'cursor-default opacity-90'} ${selected ? 'ring-4 ring-yellow-300 shadow-yellow-500/40' : ''} ${active ? 'opacity-100' : ''}`} style={{ left: `${n.x}%`, top: `${n.y}%` }}><div className="flex justify-center"><Icon className="h-5 w-5" /></div><div className="mt-1 text-xs font-black leading-tight">{n.short}</div><div className="text-[10px] opacity-80">{n.type}</div>{selected && !active && <div className="mt-1 rounded-full bg-yellow-300 px-1 text-[10px] font-black text-stone-950">RUTA</div>}</motion.button>; })}
  </div><p className="px-2 py-2 text-xs text-amber-100/70">Tablero horizontal: en móvil puedes deslizar lateralmente. Tu salud y munición se ven en la esquina del mapa.</p></div>;
}

function RouteInfoPanel({ nodeId }) {
  if (!nodeId) return null;
  const node = MAP[nodeId];
  const info = NODE_TYPE_INFO[node.type];
  const Icon = typeIcons[node.type] || MapPin;
  const toneStyles = info.tone === 'bad'
    ? 'border-red-700/70 bg-red-950/40'
    : info.tone === 'good'
      ? 'border-emerald-700/60 bg-emerald-950/30'
      : 'border-amber-700/60 bg-amber-950/30';
  return (
    <AnimatePresence mode="wait">
      <motion.div key={nodeId} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .22 }} className={`mt-2 rounded-2xl border p-3 ${toneStyles}`}>
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-black/30 p-2"><Icon className="h-5 w-5 text-amber-200" /></div>
          <div className="flex-1">
            <div className="flex flex-wrap items-baseline gap-2">
              <h3 className="font-black text-amber-200">{node.name}</h3>
              <span className="text-[11px] uppercase tracking-wider text-amber-100/60">{node.type}</span>
            </div>
            <p className="mt-0.5 text-sm text-amber-50/90">{info.summary}</p>
            <p className="mt-1 text-xs text-amber-100/70"><Info className="mr-1 inline h-3 w-3" />{info.detail}</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function GameLog({ log }) {
  const [open, setOpen] = useState(false);
  const latest = log[0];
  return (
    <div className="rounded-2xl border border-amber-700/70 bg-stone-950/80 shadow-xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition hover:bg-stone-900/60">
        <div className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">Registro</span>
          <AnimatePresence mode="wait">
            <motion.span key={latest?.id || 'empty'} initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }} className="truncate text-sm text-amber-50/90">{latest ? latest.text : 'Sin acontecimientos todavía.'}</motion.span>
          </AnimatePresence>
        </div>
        {open ? <ChevronUp className="h-4 w-4 shrink-0 text-amber-300" /> : <ChevronDown className="h-4 w-4 shrink-0 text-amber-300" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .25 }} className="overflow-hidden border-t border-amber-900/60">
            <div className="max-h-[220px] space-y-2 overflow-auto p-3 pr-2">
              <AnimatePresence initial={false}>{log.map(entry => <motion.div key={entry.id} initial={{ x: 24, opacity: 0, scale: .98 }} animate={{ x: 0, opacity: 1, scale: 1, backgroundColor: entry.fresh ? 'rgba(250, 204, 21, 0.22)' : 'rgba(28, 25, 23, 0.82)', borderColor: entry.fresh ? 'rgba(250, 204, 21, 0.95)' : 'rgba(120, 53, 15, 0.50)' }} exit={{ x: -20, opacity: 0 }} transition={{ duration: .3 }} className="rounded-xl border p-2 text-sm text-amber-50">{entry.text}</motion.div>)}</AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
function DeckSummary() { const actionCounts = ACTION_DECK.reduce((acc, c) => ({ ...acc, [c.type]: (acc[c.type] || 0) + 1 }), {}); return <Card className="bg-stone-950/70 border border-amber-900 rounded-2xl"><CardContent className="p-4"><h2 className="text-xl font-bold text-amber-300 mb-3">Equilibrio beta</h2><div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3"><div className="rounded-xl bg-stone-900/80 p-2 border border-amber-900/50"><Backpack className="h-4 w-4 inline mr-1" />Acciones: <b>{ACTION_DECK.length}</b></div><div className="rounded-xl bg-stone-900/80 p-2 border border-amber-900/50"><Zap className="h-4 w-4 inline mr-1" />Preguntas: <b>{UBRIQUE_QUESTIONS.length}</b></div><div className="rounded-xl bg-stone-900/80 p-2 border border-amber-900/50">Moverse: <b>{actionCounts.move}</b></div><div className="rounded-xl bg-stone-900/80 p-2 border border-amber-900/50">Robo: <b>-1 salud</b></div><div className="rounded-xl bg-stone-900/80 p-2 border border-amber-900/50">Garantía: <b>≤2 robos</b></div><div className="rounded-xl bg-stone-900/80 p-2 border border-amber-900/50">Reacción: <b>acción/mov.</b></div></div></CardContent></Card>; }

export default function Ubricalipsis() {
  const [player, setPlayer] = useState('');
  const [started, setStarted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [game, setGame] = useState(createInitialGame());
  const [pendingMoveReaction, setPendingMoveReaction] = useState(null);
  const [pendingActionReaction, setPendingActionReaction] = useState(null);
  const [lastEvent, setLastEvent] = useState(null);
  const [log, setLog] = useState([createLogEntry('Ubrique tiembla. Toca correr hacia la frontera.', false), createLogEntry('👣 Empiezas con una carta de MOVERSE.', false)]);
  const options = MAP[game.current].options;
  const tip = getCurrentTip(game);
  const addLog = lines => setLog(current => [...lines.map(t => createLogEntry(t, true)), ...current.map(e => ({ ...e, fresh: false }))].slice(0, 12));

  function chooseNext(id) { if (pendingMoveReaction || pendingActionReaction) return; setGame(g => ({ ...g, chosenNext: id })); addLog([`🧭 Ruta seleccionada: ${MAP[id].name}.`]); }
  function applyMoveReaction(reaction, answer = null) {
    const lines = [];
    if (reaction.kind === 'question') {
      const correct = answer === reaction.question.a;
      if (correct) { setGame(g => ({ ...g, health: Math.min(MAX_HEALTH, g.health + 1), ammo: Math.min(MAX_AMMO, g.ammo + 1) })); lines.push(`✅ Pregunta acertada: ${reaction.question.q} Ganas 1 salud y 1 munición.`); }
      else { setGame(g => ({ ...g, health: Math.max(0, g.health - 2), status: g.health - 2 <= 0 ? 'lost' : g.status })); lines.push(`❌ Pregunta fallada: ${reaction.question.q} Pierdes 2 salud.`); }
    } else { setGame(g => { const u = reaction.effect(g); return { ...u, status: u.health <= 0 ? 'lost' : u.status }; }); lines.push(reaction.log); }
    setPendingMoveReaction(null); addLog(lines);
  }
  function applyActionReaction(reaction) { setGame(g => { const u = reaction.effect(g); return { ...u, status: u.health <= 0 ? 'lost' : u.status }; }); setPendingActionReaction(null); addLog([reaction.log]); }
  function mitigateActionReaction(card) { setGame(g => ({ ...g, hand: g.hand.filter(c => c.uid !== card.uid) })); setPendingActionReaction(null); addLog([`🛠️ Usas ${card.name} para paliar la reacción mala. Cancelas su efecto.`]); }

  function playCard(card) {
    if (pendingMoveReaction || pendingActionReaction) { addLog(['⏸️ Resuelve primero la reacción pendiente.']); return; }
    if (game.status !== 'playing') { addLog(['ℹ️ La partida ha terminado. Pulsa Reiniciar.']); return; }
    if (game.actionsLeft <= 0) { addLog(['⏳ No te quedan acciones. Termina turno para robar.']); return; }
    let g = { ...game, hand: game.hand.filter(c => c.uid !== card.uid), actionsLeft: game.actionsLeft - 1, needsActionAfterMove: false };
    const lines = [];
    if (card.type === 'move') {
      const destination = g.chosenNext || options[0];
      if (!destination) { addLog(['🧭 No tienes ruta disponible.']); return; }
      g.current = destination; g.chosenNext = MAP[destination].options[0] || null; g.noMoveDraws = 0;
      lines.push(`👣 ${card.name}: ${card.effectText}`); lines.push(`📍 Avanzas hasta ${MAP[destination].name}.`);
      if (destination === 'frontera') { g.status = 'won'; lines.push('🏁 Has llegado a La Frontera. ¡Has sobrevivido!'); }
      else { const applied = applyNodeEffect(MAP[destination], g); g = applied.state; lines.push(...applied.logs); if (!g.hand.some(c => c.type === 'move')) { g.needsActionAfterMove = true; lines.push('⚠️ No te quedan cartas de MOVERSE.'); } setPendingMoveReaction(createMovementReaction(MAP[destination].name)); }
    }
    if (card.type === 'attack') { if (g.ammo < 2) { addLog(['🔫 No tienes munición suficiente.']); return; } g.ammo -= 2; g.skipNextDanger = true; lines.push(`🪓 ${card.name}: ${card.effectText}`); }
    if (card.type === 'search') { g.ammo = Math.min(MAX_AMMO, g.ammo + 1); lines.push(`🥜 ${card.name}: ${card.effectText} +1 munición.`); }
    if (card.type === 'hide') { if (MAP[g.current].type === 'Zona abierta') lines.push(`🛡️ ${card.name}: en Zona abierta no sirve de nada.`); else { g.skipNextDanger = true; lines.push(`🛡️ ${card.name}: ${card.effectText} Ignoras el próximo peligro.`); } }
    if (card.type === 'heal') { g.health = Math.min(MAX_HEALTH, g.health + 1); lines.push(`🍺 ${card.name}: ${card.effectText} +1 salud.`); }
    if (card.type !== 'move' && g.status === 'playing') { g.needsActionAfterMove = false; setPendingActionReaction(createActionReaction(card)); }
    if (g.health <= 0) g.status = 'lost';
    setGame(g); addLog(lines);
  }

  function resolveEvents(base) { let g = { ...base }; const lines = []; const count = g.doubleEvent ? 2 : 1; for (let i = 0; i < count; i++) { const ev = randomEvent(); setLastEvent(ev); if (ev.negative && g.skipNextDanger) { lines.push(`🙈 Evitas ${ev.name}.`); g.skipNextDanger = false; } else { g = ev.apply(g); lines.push(`🃏 ${ev.name}: ${ev.text}`); } } g.doubleEvent = false; return { g, lines }; }
  function endTurn() {
    if (pendingMoveReaction || pendingActionReaction) { addLog(['⏸️ Resuelve primero la reacción pendiente.']); return; }
    if (game.status !== 'playing') return;
    let g = { ...game, needsActionAfterMove: false }; const lines = [];
    g.health = Math.max(0, g.health - 1); lines.push('🩸 Robar nuevas cartas te cuesta 1 salud.');
    if (g.health <= 0) { g.status = 'lost'; lines.push('💀 Tu salud llega a cero.'); }
    else { if (g.poison > 0) { g.health = Math.max(0, g.health - 1); g.poison -= 1; lines.push('🧟 El efecto gradual sigue dando la lata. -1 salud.'); } const ev = resolveEvents(g); g = ev.g; lines.push(...ev.lines); if (g.health <= 0) { g.status = 'lost'; lines.push('💀 Tu salud llega a cero.'); } }
    const hadNoMoveBeforeDraw = !game.hand.some(c => c.type === 'move');
    const guaranteeMove = hadNoMoveBeforeDraw && (game.noMoveDraws || 0) >= 1;
    const newHand = drawHand(g.extraDraw || 0, guaranteeMove);
    const newHandHasMove = newHand.some(c => c.type === 'move');
    g.hand = newHand; g.noMoveDraws = newHandHasMove ? 0 : (hadNoMoveBeforeDraw ? (game.noMoveDraws || 0) + 1 : 0);
    if (guaranteeMove) lines.push('👣 Carta de MOVERSE garantizada tras varios robos sin movimiento.');
    else if (hadNoMoveBeforeDraw && !newHandHasMove) lines.push('👣 Sigues sin MOVERSE. Si vuelves a robar sin movimiento, recibirás una garantizada.');
    g.turn += 1; g.actionsLeft = 2; g.extraDraw = 0; setGame(g); addLog(lines);
  }
  function reset() { setGame(createInitialGame()); setPendingMoveReaction(null); setPendingActionReaction(null); setLastEvent(null); setLog([createLogEntry('Nueva partida. Empiezas con MOVERSE.', true), createLogEntry('🩸 Terminar turno cuesta 1 salud.', true), createLogEntry('🎲 Movimientos y acciones tienen reacción.', true)]); }

  if (!started) return <div className="relative min-h-screen p-4 text-amber-50 flex items-center justify-center overflow-hidden sm:p-6" style={{ backgroundImage: `linear-gradient(rgba(10, 8, 6, 0.50), rgba(10, 8, 6, 0.82)), url('${import.meta.env.BASE_URL}fondo-inicio.png')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}><div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.10),rgba(0,0,0,0.68))]" /><AnimatePresence>{showHelp && <HelpModal onClose={() => setShowHelp(false)} />}</AnimatePresence><Card className="relative z-10 max-w-xl w-full bg-stone-950/75 border border-amber-700/80 shadow-2xl rounded-2xl backdrop-blur-md"><CardContent className="p-5 space-y-5 sm:p-8"><div><p className="mb-2 text-xs uppercase tracking-[0.25em] text-amber-200/80 sm:tracking-[0.35em]">Supervivencia en Ubrique</p><h1 className="text-4xl font-black tracking-tight text-amber-300 drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] sm:text-6xl">UBRICALIPSIS</h1><p className="mt-4 text-sm text-amber-100/90 leading-relaxed sm:text-base">Una explosión bajo Ubrique ha convertido a medio pueblo en zombies que chupan vitalidad. Tu misión: llegar a La Frontera.</p></div><input value={player} onChange={e => setPlayer(e.target.value)} placeholder="Nombre del superviviente" className="w-full rounded-xl bg-stone-950/80 border border-amber-700 p-3 outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-amber-100/40" /><div className="grid gap-3 sm:grid-cols-2"><Button onClick={() => setStarted(true)} className="rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black shadow-lg shadow-black/40">Empezar huida</Button><Button onClick={() => setShowHelp(true)} className="rounded-xl bg-stone-950/80 hover:bg-stone-900 border border-amber-700 text-amber-100"><HelpCircle className="h-4 w-4 inline mr-2" />Cómo jugar</Button></div></CardContent></Card></div>;
  return <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#76552d,#1a130d_60%)] text-amber-50 p-3 sm:p-4 md:p-6">
    <AnimatePresence>{showHelp && <HelpModal onClose={() => setShowHelp(false)} />}</AnimatePresence>
    <AnimatePresence>{pendingMoveReaction && <MovementReactionModal reaction={pendingMoveReaction} onApply={() => applyMoveReaction(pendingMoveReaction)} onAnswer={answer => applyMoveReaction(pendingMoveReaction, answer)} />}</AnimatePresence>
    <AnimatePresence>{pendingActionReaction && <ActionReactionModal reaction={pendingActionReaction} mitigationCards={game.hand.filter(c => c.type !== 'move')} onApply={() => applyActionReaction(pendingActionReaction)} onMitigate={card => mitigateActionReaction(card)} />}</AnimatePresence>

    <div className="mx-auto max-w-7xl space-y-3">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-amber-300 drop-shadow sm:text-4xl">UBRICALIPSIS</h1>
          <p className="text-sm text-amber-100/75 sm:text-base">Superviviente: <b>{player || 'Anónimo/a'}</b> · Turno {game.turn} · Acciones: {game.actionsLeft}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <Button onClick={() => setShowHelp(true)} className="rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black"><HelpCircle className="h-4 w-4 mr-2 inline" />Cómo jugar</Button>
          <Button onClick={reset} className="rounded-xl border border-amber-700 text-amber-100 bg-stone-950/40 hover:bg-stone-900"><RotateCcw className="h-4 w-4 mr-2 inline" />Reiniciar</Button>
        </div>
      </header>

      {/* Registro colapsado: barra fina con el último evento */}
      <GameLog log={log} />

      {/* Tablero con HUD de salud/munición integrado + panel de ruta seleccionada */}
      <Card className="bg-stone-950/70 border border-amber-900 rounded-2xl">
        <CardContent className="p-3 sm:p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold text-amber-300">Tablero de huida</h2>
            {game.status !== 'playing' && <span className={`rounded-full px-3 py-1 text-xs font-black ${game.status === 'won' ? 'bg-green-900/70 text-green-100' : 'bg-red-950/80 text-red-100'}`}>{game.status === 'won' ? 'VICTORIA' : 'DERROTA'}</span>}
          </div>
          <BranchMap current={game.current} chosenNext={game.chosenNext} onChoose={chooseNext} health={game.health} ammo={game.ammo} />
          <RouteInfoPanel nodeId={game.chosenNext && game.chosenNext !== game.current ? game.chosenNext : null} />
          <div className={`mt-2 rounded-2xl border p-3 text-sm ${game.needsActionAfterMove ? 'border-yellow-400 bg-yellow-950/50 text-yellow-50' : 'border-amber-700/70 bg-amber-950/40 text-amber-50'}`}><b className="text-amber-300">💡 Consejo actual:</b> {tip}</div>
          {game.status !== 'playing' && <motion.div initial={{ scale: .9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`mt-2 rounded-2xl p-5 text-center font-black text-2xl ${game.status === 'won' ? 'bg-green-900/60 text-green-100' : 'bg-red-950/70 text-red-100'}`}>{game.status === 'won' ? '¡VICTORIA! Has escapado de Ubrique.' : 'DERROTA. Te han absorbido la vitalidad.'}</motion.div>}
        </CardContent>
      </Card>

      {/* Mano de cartas: pegada al tablero para mantener todo en un golpe de vista */}
      <Card className="bg-stone-950/70 border border-amber-900 rounded-2xl">
        <CardContent className="p-4">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold text-amber-300">Mano de cartas</h2>
            <Button onClick={endTurn} className="rounded-xl bg-stone-800 hover:bg-stone-700 border border-amber-800">Terminar turno (-1 salud)</Button>
          </div>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
            <AnimatePresence>{game.hand.map((card, idx) => {
              const Icon = ACTION_ICONS[card.type]; const meta = ACTION_META[card.type];
              const shouldHighlightMove = card.type === 'move' && !!game.chosenNext && game.status === 'playing';
              const shouldHighlightAction = game.needsActionAfterMove && card.type !== 'move' && game.status === 'playing';
              return <motion.div key={card.uid} initial={{ y: -80, opacity: 0, rotate: -8 }} animate={{ y: 0, opacity: 1, rotate: 0, boxShadow: shouldHighlightMove || shouldHighlightAction ? ['0 0 0 rgba(250,204,21,0)', '0 0 26px rgba(250,204,21,.75)', '0 0 0 rgba(250,204,21,0)'] : '0 12px 24px rgba(0,0,0,.35)' }} exit={{ y: -140, opacity: 0, rotate: 14 }} transition={{ delay: idx * .08, boxShadow: { repeat: shouldHighlightMove || shouldHighlightAction ? Infinity : 0, duration: 1.3 } }} whileHover={{ y: -8, rotateX: 6 }} onClick={() => playCard(card)} className={`relative cursor-pointer rounded-2xl bg-gradient-to-br from-amber-200 to-stone-300 text-stone-950 border-4 shadow-xl p-3.5 min-h-[150px] flex flex-col ${shouldHighlightMove || shouldHighlightAction ? 'border-yellow-400 ring-4 ring-yellow-300/60' : 'border-stone-800'}`}>
                {shouldHighlightMove && <div className="absolute -top-3 left-3 rounded-full bg-yellow-300 px-3 py-1 text-[11px] font-black text-stone-950 shadow">ÚSALA PARA AVANZAR</div>}
                {shouldHighlightAction && <div className="absolute -top-3 left-3 rounded-full bg-yellow-300 px-3 py-1 text-[11px] font-black text-stone-950 shadow">JUEGA UNA ACCIÓN</div>}
                <div className="flex justify-between items-start"><h3 className="font-black text-base leading-tight">{card.name}</h3><Icon className="h-5 w-5 shrink-0" /></div>
                <p className="text-xs font-black mt-1 uppercase">{meta.icon} {meta.label} · Coste: {card.cost}</p>
                <p className="mt-2.5 text-sm leading-relaxed flex-1">{card.text}</p>
              </motion.div>;
            })}</AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Información secundaria: equilibrio del mazo y último evento, fuera del golpe de vista principal */}
      <div className="grid gap-4 md:grid-cols-2">
        <DeckSummary />
        <Card className="bg-stone-950/70 border border-amber-900 rounded-2xl">
          <CardContent className="p-4">
            <h2 className="text-xl font-bold text-amber-300 mb-3">Último evento</h2>
            <AnimatePresence mode="wait">
              {lastEvent ? <motion.div key={lastEvent.id + game.turn} initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} exit={{ rotateY: -90, opacity: 0 }} className="rounded-2xl bg-red-950/60 border border-red-800 p-4">
                <div className="font-black text-lg">{lastEvent.name}</div>
                <div className="text-xs text-red-200/70">{lastEvent.type}</div>
                <p className="mt-3 text-sm">{lastEvent.text}</p>
              </motion.div> : <p className="text-amber-100/60">Aún no ha aparecido ningún evento.</p>}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>;
}
