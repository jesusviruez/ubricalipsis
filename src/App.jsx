import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Crosshair,
  MapPin,
  Skull,
  Beer,
  Wrench,
  Home,
  Siren,
  Shield,
  Footprints,
  Search,
  RotateCcw,
  Flag,
  Backpack,
  Zap,
  HelpCircle,
  X,
  UserRound,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

function Button({ children, className = '', ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function Card({ children, className = '', ...props }) {
  return <div className={className} {...props}>{children}</div>;
}

function CardContent({ children, className = '', ...props }) {
  return <div className={className} {...props}>{children}</div>;
}

const MAX_HEALTH = 10;
const MAX_AMMO = 5;

const ACTION_ICONS = {
  move: Footprints,
  attack: Crosshair,
  search: Search,
  hide: Shield,
  heal: Beer,
};

const ACTION_META = {
  move: { label: 'MOVERSE', icon: '👣', help: 'Avanza al nodo elegido en el mapa.' },
  attack: { label: 'ATACAR', icon: '🔫', help: 'Gasta 2 munición y evita el próximo peligro.' },
  search: { label: 'BUSCAR', icon: '🥜', help: 'Gana 1 munición.' },
  hide: { label: 'OCULTARSE', icon: '🛡️', help: 'Evita el próximo peligro, salvo en Zona abierta.' },
  heal: { label: 'CURAR', icon: '🍺', help: 'Recupera 1 salud.' },
};

const ACTION_DECK = [
  { id: 'move_01', type: 'move', name: 'Atajo de toda la vida', cost: 'Gratis', text: 'Recuerdas el camino de memoria — total, llevas 40 años andando lo mismo. Avanza al lugar elegido.', effectText: 'avanzas siguiendo el camino que ya tenías en la cabeza.' },
  { id: 'move_02', type: 'move', name: 'Carrera cuesta abajo', cost: 'Gratis', text: 'Aprovechas la pendiente y sales disparado. Avanza al lugar elegido.', effectText: 'bajas como una bala entre escombros y persianas dobladas.' },
  { id: 'move_03', type: 'move', name: 'Por donde antes iba tó el mundo', cost: 'Gratis', text: 'El pueblo está hecho polvo, pero tú sabes por dónde se acorta. Avanza al lugar elegido.', effectText: 'encuentras un paso entre coches volcados y macetas rotas.' },
  { id: 'attack_01', type: 'attack', name: 'Patacabra ofensiva', cost: '-2 munición', text: 'Le lanzas una patacabra al Político zombie que muere al no saber usarla.', effectText: 'la patacabra hace su trabajo. El próximo peligro queda neutralizado.' },
  { id: 'attack_02', type: 'attack', name: 'Taconazo de emergencia', cost: '-2 munición', text: 'Improvisas un proyectil con un tacón de muestra.', effectText: 'el tacón impacta con dignidad industrial.' },
  { id: 'attack_03', type: 'attack', name: 'Chatarra bien tirá', cost: '-2 munición', text: 'Coges un trozo de persiana y lo lanzas como si llevaras entrenando años.', effectText: 'la amenaza se queda replanteándose sus decisiones.' },
  { id: 'attack_04', type: 'attack', name: 'Disparo al aire', cost: '-2 munición', text: 'No le das a nada, pero el ruido espanta hasta al más pesado.', effectText: 'el eco recorre Ubrique y ganas unos segundos vitales.' },
  { id: 'search_01', type: 'search', name: 'Bar de toda la vida', cost: 'Gratis', text: 'Registras el bar de toda la vida. Quedan unas pipas.', effectText: 'encuentras munición escondida detrás de una caja de pipas.' },
  { id: 'search_02', type: 'search', name: 'Cajón sospechoso', cost: 'Gratis', text: 'Abres un cajón que nadie se había atrevido a tocar desde 1998.', effectText: 'aparece algo útil entre papeles amarillentos.' },
  { id: 'search_03', type: 'search', name: 'Bolsa del mandao', cost: 'Gratis', text: 'Una bolsa abandonada contiene más supervivencia que la mochila de un explorador.', effectText: 'no preguntas de quién era. Te viene de lujo.' },
  { id: 'search_04', type: 'search', name: 'Debajo del mostrador', cost: 'Gratis', text: 'Miras debajo del mostrador y encuentras justo lo que no esperabas.', effectText: 'otro cartucho para seguir dando guerra.' },
  { id: 'hide_01', type: 'hide', name: 'Portal de confianza', cost: 'Gratis', text: 'Te metes en el portal de siempre.', effectText: 'el silencio del portal te cubre durante unos minutos.' },
  { id: 'hide_02', type: 'hide', name: 'Persiana a medio bajar', cost: 'Gratis', text: 'Te cuelas bajo una persiana oxidada.', effectText: 'los zombies pasan de largo arrastrando los pies.' },
  { id: 'hide_03', type: 'hide', name: 'Tras una furgoneta quemada', cost: 'Gratis', text: 'La furgoneta huele fatal, pero es mejor que discutir con un zombie.', effectText: 'la peste te salva. Nadie se acerca.' },
  { id: 'hide_04', type: 'hide', name: 'Silencio de siesta', cost: 'Gratis', text: 'Te quedas tan quieto que pareces parte del mobiliario urbano.', effectText: 'ni los zombies se atreven a romper la siesta.' },
  { id: 'heal_01', type: 'heal', name: 'Tercio fresquito', cost: 'Gratis', text: 'Encuentras un tercio de cerveza fresquita.', effectText: 'el tercio entra como medicina ancestral.' },
  { id: 'heal_02', type: 'heal', name: 'Puchero milagroso', cost: 'Gratis', text: 'Una cucharada de puchero templado te devuelve la fe.', effectText: 'no estaba caliente, pero te recompone el alma.' },
  { id: 'heal_03', type: 'heal', name: 'Botiquín de peña', cost: 'Gratis', text: 'Entre vendas, tiritas y un bote sin etiqueta encuentras alivio.', effectText: 'no sabes qué era, pero funciona.' },
  { id: 'heal_04', type: 'heal', name: 'Sombra bendita', cost: 'Gratis', text: 'Te sientas treinta segundos en una sombra.', effectText: 'respiras hondo. Todavía puedes seguir.' },
];

const EVENT_DECK = [
  { id: 'ev_politico_01', name: 'Zombie Político', type: 'Binaria mala', negative: true, text: 'Aparece el Político zombie con un folleto electoral. Pierdes 3 de salud.', apply: s => ({ ...s, health: Math.max(0, s.health - 3) }) },
  { id: 'ev_politico_02', name: 'Promesa electoral zombie', type: 'Binaria mala', negative: true, text: 'Te promete arreglarlo todo en cuanto pase la catástrofe. Pierdes 2 de salud.', apply: s => ({ ...s, health: Math.max(0, s.health - 2) }) },
  { id: 'ev_politico_03', name: 'Mitin improvisado', type: 'Neutra negativa', negative: true, text: 'Un corrillo zombie bloquea la calle escuchando un mitin eterno. Pierdes 1 acción.', apply: s => ({ ...s, actionsLeft: Math.max(0, s.actionsLeft - 1) }) },
  { id: 'ev_conocido_01', name: 'Zombie Conocido', type: 'Gradual negativa', negative: true, text: 'Un conocido zombie te para a contarte sus cosas. -1 salud durante 2 turnos.', apply: s => ({ ...s, poison: s.poison + 2 }) },
  { id: 'ev_conocido_02', name: 'El que te conoce de chico', type: 'Gradual negativa', negative: true, text: 'Te agarra del brazo y empieza: “¿Tú de quién eres?”. -1 salud durante 2 turnos.', apply: s => ({ ...s, poison: s.poison + 2 }) },
  { id: 'ev_conocido_03', name: 'Charla en mitad del apocalipsis', type: 'Binaria mala', negative: true, text: 'Te intenta poner al día de toda su familia zombie. Pierdes 2 de salud.', apply: s => ({ ...s, health: Math.max(0, s.health - 2) }) },
  { id: 'ev_empresario_01', name: 'Zombie Empresario', type: 'Binaria mala', negative: true, text: 'Te ofrece un contrato en formación. Pierdes 2 de salud y 2 de munición.', apply: s => ({ ...s, health: Math.max(0, s.health - 2), ammo: Math.max(0, s.ammo - 2) }) },
  { id: 'ev_empresario_02', name: 'Prácticas no remuneradas', type: 'Binaria mala', negative: true, text: 'Te propone sobrevivir “por experiencia”. Pierdes 2 de salud y 1 de munición.', apply: s => ({ ...s, health: Math.max(0, s.health - 2), ammo: Math.max(0, s.ammo - 1) }) },
  { id: 'ev_guiso_01', name: 'Olor a guiso', type: 'Binaria buena', negative: false, text: 'Alguien dejó un puchero en el fuego. Recupera 3 de salud.', apply: s => ({ ...s, health: Math.min(MAX_HEALTH, s.health + 3) }) },
  { id: 'ev_guiso_02', name: 'Tupper salvador', type: 'Binaria buena', negative: false, text: 'Encuentras un tupper con comida casera. Recupera 2 de salud.', apply: s => ({ ...s, health: Math.min(MAX_HEALTH, s.health + 2) }) },
  { id: 'ev_guiso_03', name: 'Botellín intacto', type: 'Binaria buena', negative: false, text: 'Aparece un botellín intacto. Recupera 1 salud y 1 munición.', apply: s => ({ ...s, health: Math.min(MAX_HEALTH, s.health + 1), ammo: Math.min(MAX_AMMO, s.ammo + 1) }) },
  { id: 'ev_calle_01', name: 'Calle cortada', type: 'Neutra', negative: false, text: 'La calle está bloqueada con sillas de bar. Pierdes una acción.', apply: s => ({ ...s, actionsLeft: Math.max(0, s.actionsLeft - 1) }) },
  { id: 'ev_calle_02', name: 'Escombros traicioneros', type: 'Binaria mala', negative: true, text: 'Pisoteas cascotes y te tuerces el tobillo. Pierdes 1 salud.', apply: s => ({ ...s, health: Math.max(0, s.health - 1) }) },
  { id: 'ev_zona_01', name: 'Eco subterráneo', type: 'Gradual negativa', negative: true, text: 'La tierra vibra bajo tus pies. -1 salud durante 2 turnos.', apply: s => ({ ...s, poison: s.poison + 2 }) },
  { id: 'ev_zona_02', name: 'Bolsa de gas menor', type: 'Binaria mala', negative: true, text: 'Una pequeña fuga te deja sin aire. Pierdes 2 salud.', apply: s => ({ ...s, health: Math.max(0, s.health - 2) }) },
  { id: 'ev_zona_03', name: 'Silencio raro', type: 'Buena situacional', negative: false, text: 'No se oye nada. Robarás 1 carta extra el próximo turno.', apply: s => ({ ...s, extraDraw: 1 }) },
  { id: 'ev_zona_04', name: 'Chispa de suerte', type: 'Binaria buena', negative: false, text: 'Encuentras un cargador olvidado. Gana 2 munición.', apply: s => ({ ...s, ammo: Math.min(MAX_AMMO, s.ammo + 2) }) },
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
  { q: '¿Ubrique está junto al entorno de los parques naturales de Grazalema y Los Alcornocales?', a: true },
  { q: '¿El río Ubrique atraviesa o divide el municipio?', a: true },
  { q: '¿El gentilicio habitual de Ubrique es ubriqueño o ubriqueña?', a: true },
  { q: '¿San Sebastián es patrón de Ubrique?', a: true },
  { q: '¿La Virgen de los Remedios es patrona de Ubrique?', a: true },
  { q: '¿La fortaleza de Cardela también es conocida como Castillo de Fátima?', a: true },
  { q: '¿Ubrique limita con la provincia de Málaga?', a: true },
  { q: '¿La calzada romana comunica tradicionalmente Ubrique con Benaocaz?', a: true },
  { q: '¿Ubrique está en la provincia de Sevilla?', a: false },
  { q: '¿Ubrique es un municipio costero con playa?', a: false },
  { q: '¿El principal producto tradicional de Ubrique es el mármol?', a: false },
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

const REACTION_TEMPLATES = [
  { kind: 'good', title: 'Atajo inesperado', text: 'Una vecina te señala una calle limpia de zombies. Recuperas 1 salud.', effect: s => ({ ...s, health: Math.min(MAX_HEALTH, s.health + 1) }), log: '✨ Reacción buena: recuperas 1 salud.' },
  { kind: 'good', title: 'Bolso abandonado', text: 'Encuentras una pieza con un cargador oculto. Ganas 1 munición.', effect: s => ({ ...s, ammo: Math.min(MAX_AMMO, s.ammo + 1) }), log: '✨ Reacción buena: ganas 1 munición.' },
  { kind: 'good', title: 'Balconazo salvador', text: 'Desde un balcón te avisan de un peligro cercano. Ignoras el próximo peligro.', effect: s => ({ ...s, skipNextDanger: true }), log: '✨ Reacción buena: ignoras el próximo peligro.' },
  { kind: 'bad', title: 'Cristales en el suelo', text: 'Pisoteas sin mirar y te haces daño. Pierdes 1 salud.', effect: s => ({ ...s, health: Math.max(0, s.health - 1) }), log: '💥 Reacción mala: pierdes 1 salud.' },
  { kind: 'bad', title: 'Zarandeo zombie', text: 'Un zombie te agarra al pasar. Pierdes 2 salud.', effect: s => ({ ...s, health: Math.max(0, s.health - 2) }), log: '💥 Reacción mala: pierdes 2 salud.' },
  { kind: 'bad', title: 'Cargador embarrado', text: 'Se te cae parte de la munición entre escombros. Pierdes 1 munición.', effect: s => ({ ...s, ammo: Math.max(0, s.ammo - 1) }), log: '💥 Reacción mala: pierdes 1 munición.' },
  { kind: 'question', title: 'Pregunta de supervivencia local', text: 'Para cruzar sin hacer ruido, responde correctamente una pregunta sobre Ubrique.' },
  { kind: 'question', title: 'Memoria ubriqueña', text: 'Un superviviente no se fía de ti. Demuestra que conoces el pueblo.' },
  { kind: 'question', title: 'Señal pintada en la pared', text: 'Una pista local te indica por dónde seguir. Si aciertas, ganarás ventaja.' },
];

function makeId(prefix = 'id') {
  return crypto.randomUUID ? crypto.randomUUID() : `${prefix}-${Date.now()}-${Math.random()}`;
}

function randomFrom(deck) {
  return deck[Math.floor(Math.random() * deck.length)];
}

function drawHand(extra = 0, ensureMove = false) {
  const count = 3 + extra;
  if (!ensureMove) return Array.from({ length: count }, (_, i) => ({ ...randomFrom(ACTION_DECK), uid: makeId(`card-${i}`) }));
  const moveCards = ACTION_DECK.filter(card => card.type === 'move');
  const nonMoveCards = ACTION_DECK.filter(card => card.type !== 'move');
  const hand = [{ ...randomFrom(moveCards), uid: makeId('initial-move') }];
  while (hand.length < count) hand.push({ ...randomFrom(nonMoveCards), uid: makeId(`card-${hand.length}`) });
  return hand.sort(() => Math.random() - 0.5);
}

function randomEvent() {
  return randomFrom(EVENT_DECK);
}

function createLogEntry(text, fresh = false) {
  return { id: makeId('log'), text, fresh };
}

function createInitialGame() {
  return {
    health: 10,
    ammo: 3,
    current: 'ayuntamiento',
    chosenNext: 'trinidad',
    hand: drawHand(0, true),
    actionsLeft: 2,
    turn: 1,
    poison: 0,
    skipNextDanger: false,
    extraDraw: 0,
    doubleEvent: false,
    status: 'playing',
    needsActionAfterMove: false,
  };
}

function createMovementReaction(destinationName) {
  const template = randomFrom(REACTION_TEMPLATES);
  const base = { id: makeId('reaction'), destinationName, ...template };
  if (template.kind === 'question') {
    return { ...base, question: randomFrom(UBRIQUE_QUESTIONS) };
  }
  return base;
}

function getCurrentTip(game) {
  const node = MAP[game.current];
  const hasMove = game.hand.some(c => c.type === 'move');
  const hasHeal = game.hand.some(c => c.type === 'heal');
  const hasSearch = game.hand.some(c => c.type === 'search');
  const hasAttack = game.hand.some(c => c.type === 'attack');
  if (game.status === 'won') return '🏁 Has llegado a La Frontera. Reinicia si quieres probar otra ruta.';
  if (game.status === 'lost') return '💀 Has caído en Ubricalipsis. Reinicia y prueba a prepararte antes de cruzar zonas abiertas.';
  if (game.needsActionAfterMove) return '⚠️ Te has movido y ahora no tienes cartas de MOVERSE. Juega una carta de acción para prepararte.';
  if (game.health <= 3 && hasHeal) return '❤️ Tu salud está baja. Te conviene jugar una carta de CURAR antes de terminar turno.';
  if (game.ammo <= 1 && hasSearch) return '🔫 Tienes poca munición. Juega BUSCAR o intenta pasar por un Taller.';
  if (node.type === 'Zona abierta' && hasAttack) return '⚡ Estás en Zona abierta: al terminar turno habrá 2 eventos. ATACAR puede evitar el próximo peligro.';
  if (node.type === 'Zona abierta') return '⚡ Estás en Zona abierta. Cuidado: OCULTARSE no funciona aquí y se resolverán 2 eventos.';
  if (game.chosenNext && hasMove) return `👣 Ruta elegida: ${MAP[game.chosenNext].name}. Ahora juega una carta de MOVERSE para avanzar.`;
  if (game.chosenNext && !hasMove) return '⏳ Ya tienes ruta elegida, pero no tienes carta de MOVERSE. Juega una carta de acción o termina turno.';
  return '👉 Elige primero uno de los caminos amarillos del mapa. Después juega una carta 👣 MOVERSE.';
}

function PipBar({ value, max, icon: Icon, label }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-sm font-semibold text-amber-100"><Icon className="h-4 w-4" />{label}: {value}/{max}</div>
      <div className="flex gap-1 flex-wrap">
        {Array.from({ length: max }).map((_, i) => (
          <motion.span key={i} animate={{ scale: i < value ? [1, 1.25, 1] : 1 }} className={`h-3 w-5 rounded-sm border border-amber-900/70 ${i < value ? 'bg-amber-400' : 'bg-stone-900/70'}`} />
        ))}
      </div>
    </div>
  );
}

function applyNodeEffect(node, state) {
  let s = { ...state };
  const logs = [];
  if (node.type === 'Taller') { s.ammo = Math.min(MAX_AMMO, s.ammo + 1); logs.push(`🔧 ${node.name}: encuentras herramientas y piezas. +1 munición.`); }
  if (node.type === 'Clínica') { s.health = Math.min(MAX_HEALTH, s.health + 2); logs.push(`🏥 ${node.name}: improvisas una cura. +2 salud.`); }
  if (node.type === 'Refugio') { s.extraDraw = 1; logs.push(`🏚️ ${node.name}: respiras un segundo. Robarás 1 carta extra.`); }
  if (node.type === 'Barricada') { s.actionsLeft = Math.max(0, s.actionsLeft - 1); logs.push(`🚧 ${node.name}: una barricada te frena. Pierdes 1 acción este turno.`); }
  if (node.type === 'Zona abierta') { s.doubleEvent = true; logs.push(`⚡ ${node.name}: demasiado descubierto. Se resolverán 2 eventos.`); }
  return { state: s, logs };
}

function HelpModal({ onClose }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }} className="max-w-2xl w-full max-h-[90vh] overflow-auto rounded-2xl border border-amber-700 bg-stone-950 text-amber-50 shadow-2xl">
        <div className="sticky top-0 flex items-start justify-between gap-3 border-b border-amber-900/70 bg-stone-950 p-5">
          <div><h2 className="text-2xl font-black text-amber-300">¿Cómo jugar?</h2><p className="mt-1 text-sm text-amber-100/70">Guía rápida para sobrevivir a Ubricalipsis.</p></div>
          <button onClick={onClose} className="rounded-full bg-stone-900 p-2 hover:bg-stone-800"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-5 p-5 text-sm leading-relaxed">
          <div><h3 className="font-black text-amber-300">Objetivo</h3><p>Llega hasta <b>La Frontera</b> antes de quedarte sin salud.</p></div>
          <div><h3 className="font-black text-amber-300">Turno</h3><ol className="list-decimal space-y-1 pl-5"><li>Elige una ruta amarilla en el tablero.</li><li>Juega una carta <b>👣 MOVERSE</b>.</li><li>Cada movimiento lanza una <b>reacción</b>: buena, mala o pregunta.</li><li>Al terminar turno robas cartas, pero pierdes <b>1 salud</b>.</li></ol></div>
          <div><h3 className="font-black text-amber-300">Cartas</h3><div className="grid sm:grid-cols-2 gap-2">{Object.values(ACTION_META).map(m => <div key={m.label} className="rounded-xl border border-amber-900/60 bg-stone-900/80 p-3"><b>{m.icon} {m.label}</b><br /><span className="text-amber-100/75">{m.help}</span></div>)}</div></div>
          <div className="rounded-xl border border-red-800/70 bg-red-950/40 p-3"><b>⚡ Zonas abiertas:</b> al terminar turno se resuelven 2 eventos. Además, <b>OCULTARSE</b> no funciona allí.</div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ReactionModal({ reaction, onClose, onAnswer }) {
  const isQuestion = reaction.kind === 'question';
  const icon = reaction.kind === 'good' ? <Sparkles className="h-8 w-8" /> : reaction.kind === 'bad' ? <AlertTriangle className="h-8 w-8" /> : <HelpCircle className="h-8 w-8" />;
  const color = reaction.kind === 'good' ? 'border-green-500 bg-green-950/90' : reaction.kind === 'bad' ? 'border-red-500 bg-red-950/90' : 'border-yellow-400 bg-stone-950/95';

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div initial={{ scale: 0.72, rotate: -2, y: 40 }} animate={{ scale: 1, rotate: 0, y: 0 }} exit={{ scale: 0.88, opacity: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 18 }} className={`w-full max-w-xl rounded-3xl border-2 ${color} p-6 text-amber-50 shadow-2xl`}>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-black/30 p-3 text-amber-300">{icon}</div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-amber-200/70">Reacción de movimiento</p>
            <h2 className="text-2xl font-black text-amber-300">{reaction.title}</h2>
          </div>
        </div>
        <p className="mt-4 text-sm text-amber-100/85">Al llegar a <b>{reaction.destinationName}</b> ocurre algo...</p>
        <p className="mt-3 rounded-2xl border border-amber-800/50 bg-black/25 p-4 text-base leading-relaxed">{reaction.text}</p>
        {isQuestion ? (
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-yellow-500/50 bg-yellow-950/40 p-4 text-lg font-bold">{reaction.question.q}</div>
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={() => onAnswer(true)} className="bg-green-600 hover:bg-green-500 text-white font-black"><CheckCircle2 className="mr-2 inline h-5 w-5" />Sí</Button>
              <Button onClick={() => onAnswer(false)} className="bg-red-700 hover:bg-red-600 text-white font-black"><XCircle className="mr-2 inline h-5 w-5" />No</Button>
            </div>
          </div>
        ) : (
          <Button onClick={onClose} className="mt-5 w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-black">Continuar</Button>
        )}
      </motion.div>
    </motion.div>
  );
}

function BranchMap({ current, chosenNext, onChoose }) {
  const currentOptions = MAP[current].options;
  const currentNode = MAP[current];
  return (
    <div className="overflow-x-auto rounded-2xl border border-amber-900/70 bg-stone-950/70 p-2 shadow-inner">
      <div className="relative h-[350px] min-w-[980px] overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_center,#3a2818,#120d09_72%)]">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(30deg, rgba(245,158,11,.22) 1px, transparent 1px), linear-gradient(150deg, rgba(245,158,11,.16) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {EDGES.map(e => {
            const a = MAP[e.from]; const b = MAP[e.to];
            const active = e.from === current && e.to === chosenNext;
            const available = e.from === current && currentOptions.includes(e.to);
            return <motion.line key={`${e.from}-${e.to}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={active ? '#facc15' : available ? '#f59e0b' : '#57534e'} strokeWidth={active ? 1.1 : available ? 0.8 : 0.45} strokeDasharray={active ? '2 1' : available ? '1.5 1.5' : '0'} opacity={active ? 1 : available ? 0.9 : 0.4} />;
          })}
        </svg>

        <motion.div className="absolute z-20 -translate-x-1/2 -translate-y-1/2" animate={{ left: `${currentNode.x}%`, top: `${currentNode.y}%` }} transition={{ type: 'spring', stiffness: 70, damping: 14, mass: 0.9 }}>
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-yellow-300 bg-amber-500 text-stone-950 shadow-[0_0_30px_rgba(250,204,21,.8)]"><UserRound className="h-7 w-7" /></div>
        </motion.div>

        {Object.entries(MAP).map(([id, n]) => {
          const Icon = typeIcons[n.type] || MapPin;
          const active = id === current;
          const selectable = currentOptions.includes(id);
          const selected = chosenNext === id;
          return (
            <motion.button key={id} onClick={() => selectable && onChoose(id)} whileHover={{ scale: selectable ? 1.08 : 1.02 }} className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 w-28 rounded-2xl border-2 p-2 text-center shadow-xl backdrop-blur-sm transition ${typeColors[n.type]} ${selectable ? 'cursor-pointer ring-4 ring-amber-400/50' : 'cursor-default opacity-90'} ${selected ? 'ring-4 ring-yellow-300 shadow-yellow-500/40' : ''} ${active ? 'opacity-100' : ''}`} style={{ left: `${n.x}%`, top: `${n.y}%` }}>
              <div className="flex justify-center"><Icon className="h-5 w-5" /></div>
              <div className="mt-1 text-xs font-black leading-tight">{n.short}</div>
              <div className="text-[10px] opacity-80">{n.type}</div>
              {selected && !active && <div className="mt-1 rounded-full bg-yellow-300 px-1 text-[10px] font-black text-stone-950">RUTA</div>}
            </motion.button>
          );
        })}
      </div>
      <p className="px-2 py-2 text-xs text-amber-100/70">Tablero horizontal: en móvil puedes deslizar lateralmente. La ficha marca tu posición y se anima al moverte.</p>
    </div>
  );
}

function GameLog({ log }) {
  return (
    <Card className="bg-stone-950/80 border border-amber-700 rounded-2xl shadow-xl">
      <CardContent className="p-4">
        <div className="mb-3 flex items-center justify-between"><h2 className="text-xl font-bold text-amber-300">Registro</h2><span className="text-xs text-amber-100/50">Últimos acontecimientos</span></div>
        <div className="space-y-2 max-h-[220px] overflow-auto pr-1">
          <AnimatePresence initial={false}>
            {log.map(entry => (
              <motion.div key={entry.id} initial={{ x: 24, opacity: 0, scale: 0.98 }} animate={{ x: 0, opacity: 1, scale: 1, backgroundColor: entry.fresh ? 'rgba(250, 204, 21, 0.22)' : 'rgba(28, 25, 23, 0.82)', borderColor: entry.fresh ? 'rgba(250, 204, 21, 0.95)' : 'rgba(120, 53, 15, 0.50)', boxShadow: entry.fresh ? ['0 0 0 rgba(250,204,21,0)', '0 0 22px rgba(250,204,21,0.55)', '0 0 0 rgba(250,204,21,0)'] : '0 0 0 rgba(0,0,0,0)' }} exit={{ x: -20, opacity: 0 }} transition={{ duration: 0.35, boxShadow: { duration: 1.2 } }} className="rounded-xl border p-2 text-sm text-amber-50">{entry.text}</motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}

function DeckSummary() {
  const actionCounts = ACTION_DECK.reduce((acc, c) => ({ ...acc, [c.type]: (acc[c.type] || 0) + 1 }), {});
  return (
    <Card className="bg-stone-950/70 border border-amber-900 rounded-2xl">
      <CardContent className="p-4">
        <h2 className="text-xl font-bold text-amber-300 mb-3">Equilibrio beta</h2>
        <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
          <div className="rounded-xl bg-stone-900/80 p-2 border border-amber-900/50"><Backpack className="h-4 w-4 inline mr-1" />Acciones: <b>{ACTION_DECK.length}</b></div>
          <div className="rounded-xl bg-stone-900/80 p-2 border border-amber-900/50"><Zap className="h-4 w-4 inline mr-1" />Preguntas: <b>{UBRIQUE_QUESTIONS.length}</b></div>
          <div className="rounded-xl bg-stone-900/80 p-2 border border-amber-900/50">Moverse: <b>{actionCounts.move}</b></div>
          <div className="rounded-xl bg-stone-900/80 p-2 border border-amber-900/50">Robo: <b>-1 salud</b></div>
          <div className="rounded-xl bg-stone-900/80 p-2 border border-amber-900/50">Munición máx: <b>{MAX_AMMO}</b></div>
          <div className="rounded-xl bg-stone-900/80 p-2 border border-amber-900/50">Reacción: <b>al moverse</b></div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Ubricalipsis() {
  const [player, setPlayer] = useState('');
  const [started, setStarted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [game, setGame] = useState(createInitialGame());
  const [pendingReaction, setPendingReaction] = useState(null);
  const [lastEvent, setLastEvent] = useState(null);
  const [log, setLog] = useState([
    createLogEntry('Ubrique tiembla. La bolsa subterránea ha explotado. Toca correr hacia la frontera.', false),
    createLogEntry('👣 Empiezas con una carta de MOVERSE para que puedas avanzar desde el primer turno.', false),
  ]);

  const options = MAP[game.current].options;
  const tip = getCurrentTip(game);

  function addLog(lines) {
    const newEntries = lines.map(line => createLogEntry(line, true));
    setLog(currentLog => [...newEntries, ...currentLog.map(entry => ({ ...entry, fresh: false }))].slice(0, 12));
  }

  function chooseNext(id) {
    if (pendingReaction) return;
    setGame(g => ({ ...g, chosenNext: id }));
    addLog([`🧭 Ruta seleccionada: ${MAP[id].name}. Ahora juega una carta 👣 MOVERSE.`]);
  }

  function applyReaction(reaction, answer = null) {
    const lines = [];
    if (reaction.kind === 'question') {
      const correct = answer === reaction.question.a;
      if (correct) {
        setGame(g => ({ ...g, health: Math.min(MAX_HEALTH, g.health + 1), ammo: Math.min(MAX_AMMO, g.ammo + 1) }));
        lines.push(`✅ Pregunta acertada: ${reaction.question.q} Ganas 1 salud y 1 munición.`);
      } else {
        setGame(g => ({ ...g, health: Math.max(0, g.health - 2), status: g.health - 2 <= 0 ? 'lost' : g.status }));
        lines.push(`❌ Pregunta fallada: ${reaction.question.q} Pierdes 2 salud.`);
      }
    } else {
      setGame(g => {
        const updated = reaction.effect(g);
        return { ...updated, status: updated.health <= 0 ? 'lost' : updated.status };
      });
      lines.push(reaction.log);
    }
    setPendingReaction(null);
    addLog(lines);
  }

  function playCard(card) {
    if (pendingReaction) { addLog(['⏸️ Resuelve primero la reacción del movimiento.']); return; }
    if (game.status !== 'playing') { addLog(['ℹ️ La partida ha terminado. Pulsa Reiniciar para jugar de nuevo.']); return; }
    if (game.actionsLeft <= 0) { addLog(['⏳ No te quedan acciones. Pulsa Terminar turno para robar nuevas cartas.']); return; }

    let g = { ...game, hand: game.hand.filter(c => c.uid !== card.uid), actionsLeft: game.actionsLeft - 1, needsActionAfterMove: false };
    const lines = [];

    if (card.type === 'move') {
      const destination = g.chosenNext || options[0];
      if (!destination) { addLog(['🧭 No tienes ruta disponible. Revisa el mapa.']); return; }
      g.current = destination;
      g.chosenNext = MAP[destination].options[0] || null;
      lines.push(`👣 ${card.name}: ${card.effectText}`);
      lines.push(`📍 Avanzas hasta ${MAP[destination].name}.`);
      if (destination === 'frontera') {
        g.status = 'won';
        lines.push('🏁 Has llegado a La Frontera. ¡Has sobrevivido a Ubricalipsis!');
      } else {
        const applied = applyNodeEffect(MAP[destination], g);
        g = applied.state;
        lines.push(...applied.logs);
        if (g.chosenNext) lines.push(`🧭 Próxima ruta sugerida: ${MAP[g.chosenNext].name}. Puedes cambiarla en el tablero.`);
        if (!g.hand.some(c => c.type === 'move')) {
          g.needsActionAfterMove = true;
          lines.push('⚠️ No te quedan cartas de MOVERSE. Juega una carta de acción para prepararte.');
        }
        setPendingReaction(createMovementReaction(MAP[destination].name));
      }
    }

    if (card.type === 'attack') {
      if (g.ammo < 2) { addLog(['🔫 No tienes munición suficiente para atacar. Usa BUSCAR o visita un Taller.']); return; }
      g.ammo -= 2;
      g.skipNextDanger = true;
      lines.push(`🪓 ${card.name}: ${card.effectText}`);
    }
    if (card.type === 'search') { g.ammo = Math.min(MAX_AMMO, g.ammo + 1); lines.push(`🥜 ${card.name}: ${card.effectText} +1 munición.`); }
    if (card.type === 'hide') {
      if (MAP[g.current].type === 'Zona abierta') lines.push(`🛡️ ${card.name}: intentas esconderte, pero estás en Zona abierta. No sirve de nada.`);
      else { g.skipNextDanger = true; lines.push(`🛡️ ${card.name}: ${card.effectText} Ignoras el próximo peligro.`); }
    }
    if (card.type === 'heal') { g.health = Math.min(MAX_HEALTH, g.health + 1); lines.push(`🍺 ${card.name}: ${card.effectText} +1 salud.`); }
    if (card.type !== 'move') g.needsActionAfterMove = false;
    if (g.health <= 0) g.status = 'lost';

    setGame(g);
    addLog(lines);
  }

  function resolveEvents(base) {
    let g = { ...base };
    const lines = [];
    const count = g.doubleEvent ? 2 : 1;
    for (let i = 0; i < count; i++) {
      const ev = randomEvent();
      setLastEvent(ev);
      if (ev.negative && g.skipNextDanger) { lines.push(`🙈 Evitas ${ev.name} gracias a tu preparación.`); g.skipNextDanger = false; }
      else { g = ev.apply(g); lines.push(`🃏 ${ev.name}: ${ev.text}`); }
    }
    g.doubleEvent = false;
    return { g, lines };
  }

  function endTurn() {
    if (pendingReaction) { addLog(['⏸️ Resuelve primero la reacción antes de terminar turno.']); return; }
    if (game.status !== 'playing') return;
    let g = { ...game, needsActionAfterMove: false };
    const lines = [];

    g.health = Math.max(0, g.health - 1);
    lines.push('🩸 Robar nuevas cartas te cuesta 1 salud.');

    if (g.health <= 0) {
      g.status = 'lost';
      lines.push('💀 Tu salud llega a cero antes de poder reaccionar. Ubrique te reclama.');
    } else {
      if (g.poison > 0) { g.health = Math.max(0, g.health - 1); g.poison -= 1; lines.push('🧟 El efecto gradual sigue dando la lata. -1 salud.'); }
      const ev = resolveEvents(g);
      g = ev.g;
      lines.push(...ev.lines);
      if (g.health <= 0) { g.status = 'lost'; lines.push('💀 Tu salud llega a cero. Ubrique te reclama.'); }
    }

    g.turn += 1;
    g.actionsLeft = 2;
    g.hand = drawHand(g.extraDraw || 0, false);
    g.extraDraw = 0;
    setGame(g);
    addLog(lines);
  }

  function reset() {
    setGame(createInitialGame());
    setPendingReaction(null);
    setLastEvent(null);
    setLog([
      createLogEntry('Nueva partida beta. Empiezas con una carta de MOVERSE para arrancar la huida.', true),
      createLogEntry('🩸 Ahora cada robo de cartas al terminar turno cuesta 1 salud.', true),
      createLogEntry('🎲 Cada movimiento activa una reacción: buena, mala o pregunta de Sí/No.', true),
    ]);
  }

  if (!started) {
    return (
      <div className="relative min-h-screen p-4 text-amber-50 flex items-center justify-center overflow-hidden sm:p-6" style={{ backgroundImage: `linear-gradient(rgba(10, 8, 6, 0.50), rgba(10, 8, 6, 0.82)), url('${import.meta.env.BASE_URL}fondo-inicio.png')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.10),rgba(0,0,0,0.68))]" />
        <AnimatePresence>{showHelp && <HelpModal onClose={() => setShowHelp(false)} />}</AnimatePresence>
        <Card className="relative z-10 max-w-xl w-full bg-stone-950/75 border border-amber-700/80 shadow-2xl rounded-2xl backdrop-blur-md">
          <CardContent className="p-5 space-y-5 sm:p-8">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.25em] text-amber-200/80 sm:tracking-[0.35em]">Supervivencia en Ubrique</p>
              <h1 className="text-4xl font-black tracking-tight text-amber-300 drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] sm:text-6xl">UBRICALIPSIS</h1>
              <p className="mt-4 text-sm text-amber-100/90 leading-relaxed sm:text-base">Una explosión bajo Ubrique ha convertido a medio pueblo en zombies que chupan vitalidad. Tu misión: llegar a La Frontera.</p>
            </div>
            <input value={player} onChange={e => setPlayer(e.target.value)} placeholder="Nombre del superviviente" className="w-full rounded-xl bg-stone-950/80 border border-amber-700 p-3 outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-amber-100/40" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Button onClick={() => setStarted(true)} className="rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black shadow-lg shadow-black/40">Empezar huida</Button>
              <Button onClick={() => setShowHelp(true)} className="rounded-xl bg-stone-950/80 hover:bg-stone-900 border border-amber-700 text-amber-100"><HelpCircle className="h-4 w-4 inline mr-2" />Cómo jugar</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#76552d,#1a130d_60%)] text-amber-50 p-3 sm:p-4 md:p-6">
      <AnimatePresence>{showHelp && <HelpModal onClose={() => setShowHelp(false)} />}</AnimatePresence>
      <AnimatePresence>{pendingReaction && <ReactionModal reaction={pendingReaction} onClose={() => applyReaction(pendingReaction)} onAnswer={answer => applyReaction(pendingReaction, answer)} />}</AnimatePresence>
      <div className="mx-auto max-w-7xl space-y-4">
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

        <GameLog log={log} />

        <Card className="bg-stone-950/70 border border-amber-900 rounded-2xl">
          <CardContent className="p-3 sm:p-4">
            <h2 className="text-xl font-bold text-amber-300 mb-3">Tablero de huida</h2>
            <BranchMap current={game.current} chosenNext={game.chosenNext} onChoose={chooseNext} />
          </CardContent>
        </Card>

        <div className="grid gap-4 xl:grid-cols-[1.05fr_.95fr]">
          <section className="space-y-4">
            <Card className="bg-stone-950/70 border border-amber-900 rounded-2xl shadow-xl">
              <CardContent className="p-4 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2"><PipBar value={game.health} max={MAX_HEALTH} icon={Heart} label="Salud" /><PipBar value={game.ammo} max={MAX_AMMO} icon={Crosshair} label="Munición" /></div>
                <div className={`rounded-2xl border p-3 text-sm ${game.needsActionAfterMove ? 'border-yellow-400 bg-yellow-950/50 text-yellow-50' : 'border-amber-700/70 bg-amber-950/40 text-amber-50'}`}><b className="text-amber-300">💡 Consejo actual:</b> {tip}</div>
                {game.status !== 'playing' && <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`rounded-2xl p-5 text-center font-black text-2xl ${game.status === 'won' ? 'bg-green-900/60 text-green-100' : 'bg-red-950/70 text-red-100'}`}>{game.status === 'won' ? '¡VICTORIA! Has escapado de Ubrique.' : 'DERROTA. Te han absorbido la vitalidad.'}</motion.div>}
              </CardContent>
            </Card>

            <Card className="bg-stone-950/70 border border-amber-900 rounded-2xl">
              <CardContent className="p-4">
                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><h2 className="text-xl font-bold text-amber-300">Mano de cartas</h2><Button onClick={endTurn} className="rounded-xl bg-stone-800 hover:bg-stone-700 border border-amber-800">Terminar turno (-1 salud)</Button></div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <AnimatePresence>
                    {game.hand.map((card, idx) => {
                      const Icon = ACTION_ICONS[card.type];
                      const meta = ACTION_META[card.type];
                      const shouldHighlightMove = card.type === 'move' && !!game.chosenNext && game.status === 'playing';
                      const shouldHighlightAction = game.needsActionAfterMove && card.type !== 'move' && game.status === 'playing';
                      return (
                        <motion.div key={card.uid} initial={{ y: -80, opacity: 0, rotate: -8 }} animate={{ y: 0, opacity: 1, rotate: 0, boxShadow: shouldHighlightMove || shouldHighlightAction ? ['0 0 0 rgba(250,204,21,0)', '0 0 26px rgba(250,204,21,.75)', '0 0 0 rgba(250,204,21,0)'] : '0 12px 24px rgba(0,0,0,.35)' }} exit={{ y: -140, opacity: 0, rotate: 14 }} transition={{ delay: idx * 0.08, boxShadow: { repeat: shouldHighlightMove || shouldHighlightAction ? Infinity : 0, duration: 1.3 } }} whileHover={{ y: -8, rotateX: 6 }} onClick={() => playCard(card)} className={`relative cursor-pointer rounded-2xl bg-gradient-to-br from-amber-200 to-stone-300 text-stone-950 border-4 shadow-xl p-4 min-h-48 flex flex-col ${shouldHighlightMove || shouldHighlightAction ? 'border-yellow-400 ring-4 ring-yellow-300/60' : 'border-stone-800'}`}>
                          {shouldHighlightMove && <div className="absolute -top-3 left-3 rounded-full bg-yellow-300 px-3 py-1 text-[11px] font-black text-stone-950 shadow">ÚSALA PARA AVANZAR</div>}
                          {shouldHighlightAction && <div className="absolute -top-3 left-3 rounded-full bg-yellow-300 px-3 py-1 text-[11px] font-black text-stone-950 shadow">JUEGA UNA ACCIÓN</div>}
                          <div className="flex justify-between items-start"><h3 className="font-black text-lg leading-tight">{card.name}</h3><Icon className="h-6 w-6 shrink-0" /></div>
                          <p className="text-xs font-black mt-1 uppercase">{meta.icon} {meta.label} · Coste: {card.cost}</p>
                          <p className="mt-4 text-sm leading-relaxed">{card.text}</p>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <DeckSummary />
            <Card className="bg-stone-950/70 border border-amber-900 rounded-2xl">
              <CardContent className="p-4">
                <h2 className="text-xl font-bold text-amber-300 mb-3">Último evento</h2>
                <AnimatePresence mode="wait">
                  {lastEvent ? (
                    <motion.div key={lastEvent.id + game.turn} initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} exit={{ rotateY: -90, opacity: 0 }} className="rounded-2xl bg-red-950/60 border border-red-800 p-4">
                      <div className="font-black text-lg">{lastEvent.name}</div>
                      <div className="text-xs text-red-200/70">{lastEvent.type}</div>
                      <p className="mt-3 text-sm">{lastEvent.text}</p>
                    </motion.div>
                  ) : <p className="text-amber-100/60">Aún no ha aparecido ningún evento.</p>}
                </AnimatePresence>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
