import React, { useState } from 'react';
import { motion, pero te recompone el alma.',import { motion, AnimatePresence } from 'framer-motion';
  },
  {
    id: 'heal_03',
    type: 'heal',
    name: 'Botiquín de peña',
    cost: 'Gratis',
    text: 'Entre vendas, tiritas y un bote sin etiqueta encuentras alivio. Recupera 1 de salud.',
    effectText: 'No sabes qué era, pero funciona.',
  },
  {
    id: 'heal_04',
    type: 'heal',
    name: 'Sombra bendita',
    cost: 'Gratis',
    text: 'Te sientas treinta segundos en una sombra y parece que vuelves a ser persona. Recupera 1 de salud.',
    effectText: 'Respiras hondo. Todavía puedes seguir.',
  },
];

const EVENT_DECK = [
  {
    id: 'ev_politico_01',
    name: 'Zombie Político',
    type: 'Binaria mala',
    negative: true,
    text: 'Aparece el Político zombie con un folleto electoral. Solo habla. Pierdes 3 de salud de aburrimiento.',
    apply: s => ({ ...s, health: Math.max(0, s.health - 3) }),
  },
  {
    id: 'ev_politico_02',
    name: 'Promesa electoral zombie',
    type: 'Binaria mala',
    negative: true,
    text: 'Te promete arreglarlo todo en cuanto pase la catástrofe. Pierdes 2 de salud.',
    apply: s => ({ ...s, health: Math.max(0, s.health - 2) }),
  },
  {
    id: 'ev_politico_03',
    name: 'Mitin improvisado',
    type: 'Neutra negativa',
    negative: true,
    text: 'Un corrillo zombie bloquea la calle escuchando un mitin eterno. Pierdes 1 acción.',
    apply: s => ({ ...s, actionsLeft: Math.max(0, s.actionsLeft - 1) }),
  },
  {
    id: 'ev_conocido_01',
    name: 'Zombie Conocido',
    type: 'Gradual negativa',
    negative: true,
    text: 'Un conocido zombie te para a contarte sus cosas. -1 salud por turno durante 2 turnos.',
    apply: s => ({ ...s, poison: s.poison + 2 }),
  },
  {
    id: 'ev_conocido_02',
    name: 'El que te conoce de chico',
    type: 'Gradual negativa',
    negative: true,
    text: 'Te reconoce, te agarra del brazo y empieza: “¿Tú de quién eres?”. -1 salud por turno durante 2 turnos.',
    apply: s => ({ ...s, poison: s.poison + 2 }),
  },
  {
    id: 'ev_conocido_03',
    name: 'Charla en mitad del apocalipsis',
    type: 'Binaria mala',
    negative: true,
    text: 'Te intenta poner al día de toda su familia zombie. Pierdes 2 de salud.',
    apply: s => ({ ...s, health: Math.max(0, s.health - 2) }),
  },
  {
    id: 'ev_empresario_01',
    name: 'Zombie Empresario',
    type: 'Binaria mala',
    negative: true,
    text: 'El Empresario zombie te ofrece un contrato en formación. Pierdes 2 de salud y 2 de munición.',
    apply: s => ({
      ...s,
      health: Math.max(0, s.health - 2),
      ammo: Math.max(0, s.ammo - 2),
    }),
  },
  {
    id: 'ev_empresario_02',
    name: 'Prácticas no remuneradas',
    type: 'Binaria mala',
    negative: true,
    text: 'Te propone sobrevivir “por experiencia”. Pierdes 2 de salud y 1 de munición.',
    apply: s => ({
      ...s,
      health: Math.max(0, s.health - 2),
      ammo: Math.max(0, s.ammo - 1),
    }),
  },
  {
    id: 'ev_empresario_03',
    name: 'Reunión urgente',
    type: 'Neutra negativa',
    negative: true,
    text: 'Un Empresario zombie convoca una reunión de seguimiento. Pierdes 1 acción.',
    apply: s => ({ ...s, actionsLeft: Math.max(0, s.actionsLeft - 1) }),
  },
  {
    id: 'ev_guiso_01',
    name: 'Olor a guiso',
    type: 'Binaria buena',
    negative: false,
    text: 'Alguien dejó un puchero en el fuego. Civilización pura. Recupera 3 de salud.',
    apply: s => ({ ...s, health: Math.min(MAX_HEALTH, s.health + 3) }),
  },
  {
    id: 'ev_guiso_02',
    name: 'Tupper salvador',
    type: 'Binaria buena',
    negative: false,
    text: 'Encuentras un tupper con comida casera y cero preguntas. Recupera 2 de salud.',
    apply: s => ({ ...s, health: Math.min(MAX_HEALTH, s.health + 2) }),
  },
  {
    id: 'ev_guiso_03',
    name: 'Botellín intacto',
    type: 'Binaria buena',
    negative: false,
    text: 'Contra todo pronóstico, aparece un botellín intacto. Recupera 1 salud y 1 munición.',
    apply: s => ({
      ...s,
      health: Math.min(MAX_HEALTH, s.health + 1),
      ammo: Math.min(MAX_AMMO, s.ammo + 1),
    }),
  },
  {
    id: 'ev_calle_01',
    name: 'Calle cortada',
    type: 'Neutra',
    negative: false,
    text: 'La calle está bloqueada con sillas de bar. Pierdes una acción este turno.',
    apply: s => ({ ...s, actionsLeft: Math.max(0, s.actionsLeft - 1) }),
  },
  {
    id: 'ev_calle_02',
    name: 'Escombros traicioneros',
    type: 'Binaria mala',
    negative: true,
    text: 'Pisoteas cascotes y te tuerces el tobillo. Pierdes 1 salud.',
    apply: s => ({ ...s, health: Math.max(0, s.health - 1) }),
  },
  {
    id: 'ev_calle_03',
    name: 'Atasco de zombies',
    type: 'Neutra negativa',
    negative: true,
    text: 'No avanzan, pero tampoco dejan pasar. Pierdes 1 acción.',
    apply: s => ({ ...s, actionsLeft: Math.max(0, s.actionsLeft - 1) }),
  },
  {
    id: 'ev_zona_01',
    name: 'Eco subterráneo',
    type: 'Gradual negativa',
    negative: true,
    text: 'La tierra vibra bajo tus pies. -1 salud por turno durante 2 turnos.',
    apply: s => ({ ...s, poison: s.poison + 2 }),
  },
  {
    id: 'ev_zona_02',
    name: 'Bolsa de gas menor',
    type: 'Binaria mala',
    negative: true,
    text: 'Una pequeña fuga te deja sin aire. Pierdes 2 salud.',
    apply: s => ({ ...s, health: Math.max(0, s.health - 2) }),
  },
  {
    id: 'ev_zona_03',
    name: 'Silencio raro',
    type: 'Buena situacional',
    negative: false,
    text: 'Por primera vez no se oye nada. Robarás 1 carta extra el próximo turno.',
    apply: s => ({ ...s, extraDraw: 1 }),
  },
  {
    id: 'ev_zona_04',
    name: 'Chispa de suerte',
    type: 'Binaria buena',
    negative: false,
    text: 'Encuentras un cargador olvidado. Gana 2 munición.',
    apply: s => ({ ...s, ammo: Math.min(MAX_AMMO, s.ammo + 2) }),
  },
  {
    id: 'ev_zona_05',
    name: 'Vecina parapetada',
    type: 'Binaria buena',
    negative: false,
    text: 'Una vecina desde un balcón te indica un paso seguro. Ignoras el próximo peligro.',
    apply: s => ({ ...s, skipNextDanger: true }),
  },
];

const MAP = {
  ayuntamiento: {
    name: 'Plaza del Ayuntamiento',
    short: 'Ayuntamiento',
    type: 'Inicio',
    x: 50,
    y: 6,
    options: ['trinidad', 'callejones'],
  },
  trinidad: {
    name: 'Plaza de la Trinidad',
    short: 'Trinidad',
    type: 'Zona abierta',
    x: 28,
    y: 21,
    options: ['avenida', 'estrella'],
  },
  callejones: {
    name: 'Los Callejones',
    short: 'Callejones',
    type: 'Taller',
    x: 72,
    y: 21,
    options: ['avenida', 'estrella'],
  },
  avenida: {
    name: 'Avenida de España',
    short: 'Av. España',
    type: 'Refugio',
    x: 28,
    y: 38,
    options: ['ferial', 'vega'],
  },
  estrella: {
    name: 'Plaza de la Estrella',
    short: 'Estrella',
    type: 'Barricada',
    x: 72,
    y: 38,
    options: ['ferial', 'vega'],
  },
  ferial: {
    name: 'Recinto Ferial',
    short: 'Ferial',
    type: 'Taller',
    x: 28,
    y: 55,
    options: ['mision', 'canos'],
  },
  vega: {
    name: 'La Vega',
    short: 'La Vega',
    type: 'Barricada',
    x: 72,
    y: 55,
    options: ['mision', 'canos'],
  },
  mision: {
    name: 'Plaza Misión Rescate',
    short: 'Misión Rescate',
    type: 'Refugio',
    x: 28,
    y: 72,
    options: ['fuente', 'frontera'],
  },
  canos: {
    name: 'Los 9 Caños',
    short: '9 Caños',
    type: 'Clínica',
    x: 72,
    y: 72,
    options: ['fuente', 'frontera'],
  },
  fuente: {
    name: 'Fuente San Francisco',
    short: 'Fuente S. Fco.',
    type: 'Clínica',
    x: 35,
    y: 88,
    options: ['frontera'],
  },
  frontera: {
    name: 'La Frontera',
    short: 'La Frontera',
    type: 'Salida',
    x: 65,
    y: 88,
    options: [],
  },
};

const EDGES = Object.entries(MAP).flatMap(([from, n]) =>
  n.options.map(to => ({ from, to }))
);

const typeIcons = {
  Inicio: MapPin,
  'Zona abierta': Siren,
  Taller: Wrench,
  Refugio: Home,
  Barricada: Skull,
  Clínica: Heart,
  Salida: Flag,
};

const typeColors = {
  Inicio: 'bg-amber-500 text-stone-950 border-amber-200',
  'Zona abierta': 'bg-red-950 text-red-100 border-red-700',
  Taller: 'bg-orange-900 text-orange-100 border-orange-600',
  Refugio: 'bg-emerald-950 text-emerald-100 border-emerald-700',
  Barricada: 'bg-stone-800 text-stone-100 border-stone-500',
  Clínica: 'bg-sky-950 text-sky-100 border-sky-700',
  Salida: 'bg-green-800 text-green-50 border-green-400',
};

function makeId(prefix = 'id') {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : `${prefix}-${Date.now()}-${Math.random()}`;
}

function randomFrom(deck) {
  return deck[Math.floor(Math.random() * deck.length)];
}

function drawHand(extra = 0, ensureMove = false) {
  const count = 3 + extra;

  if (!ensureMove) {
    return Array.from({ length: count }, (_, i) => ({
      ...randomFrom(ACTION_DECK),
      uid: makeId(`card-${i}`),
    }));
  }

  const moveCards = ACTION_DECK.filter(card => card.type === 'move');
  const nonMoveCards = ACTION_DECK.filter(card => card.type !== 'move');

  const hand = [
    {
      ...randomFrom(moveCards),
      uid: makeId('initial-move'),
    },
  ];

  while (hand.length < count) {
    hand.push({
      ...randomFrom(nonMoveCards),
      uid: makeId(`card-${hand.length}`),
    });
  }

  return hand.sort(() => Math.random() - 0.5);
}

function randomEvent() {
  return randomFrom(EVENT_DECK);
}

function createLogEntry(text, fresh = false) {
  return {
    id: makeId('log'),
    text,
    fresh,
  };
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

function getCurrentTip(game) {
  const node = MAP[game.current];
  const hasMove = game.hand.some(c => c.type === 'move');
  const hasHeal = game.hand.some(c => c.type === 'heal');
  const hasSearch = game.hand.some(c => c.type === 'search');
  const hasAttack = game.hand.some(c => c.type === 'attack');

  if (game.status === 'won') {
    return '🏁 Has llegado a La Frontera. Reinicia si quieres probar otra ruta.';
  }

  if (game.status === 'lost') {
    return '💀 Has caído en Ubricalipsis. Reinicia y prueba a prepararte antes de cruzar zonas abiertas.';
  }

  if (game.needsActionAfterMove) {
    return '⚠️ Te has movido y ahora no tienes cartas de MOVERSE. Juega una carta de acción para prepararte: BUSCAR, CURAR, ATACAR u OCULTARSE.';
  }

  if (game.health <= 3 && hasHeal) {
    return '❤️ Tu salud está baja. Te conviene jugar una carta de CURAR antes de terminar turno.';
  }

  if (game.ammo <= 1 && hasSearch) {
    return '🔫 Tienes poca munición. Juega una carta de BUSCAR o intenta pasar por un Taller.';
  }

  if (node.type === 'Zona abierta' && hasAttack) {
    return '⚡ Estás en Zona abierta: al terminar turno habrá 2 eventos. ATACAR puede evitar el próximo peligro.';
  }

  if (node.type === 'Zona abierta') {
    return '⚡ Estás en Zona abierta. Cuidado: OCULTARSE no funciona aquí y se resolverán 2 eventos.';
  }

  if (game.chosenNext && hasMove) {
    return `👣 Ruta elegida: ${MAP[game.chosenNext].name}. Ahora juega una carta de MOVERSE para avanzar.`;
  }

  if (game.chosenNext && !hasMove) {
    return '⏳ Ya tienes ruta elegida, pero no tienes carta de MOVERSE. Juega una carta de acción o termina turno para robar nuevas cartas.';
  }

  return '👉 Elige primero uno de los caminos amarillos del mapa. Después juega una carta 👣 MOVERSE.';
}

function PipBar({ value, max, icon: Icon, label }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-sm font-semibold text-amber-100">
        <Icon className="h-4 w-4" />
        {label}: {value}/{max}
      </div>

      <div className="flex gap-1">
        {Array.from({ length: max }).map((_, i) => (
          <motion.span
            key={i}
            animate={{ scale: i < value ? [1, 1.25, 1] : 1 }}
            className={`h-3 w-5 rounded-sm border border-amber-900/70 ${
              i < value ? 'bg-amber-400' : 'bg-stone-900/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function applyNodeEffect(node, state) {
  let s = { ...state };
  const logs = [];

  if (node.type === 'Taller') {
    s.ammo = Math.min(MAX_AMMO, s.ammo + 1);
    logs.push(`🔧 ${node.name}: encuentras herramientas y piezas. +1 munición.`);
  }

  if (node.type === 'Clínica') {
    s.health = Math.min(MAX_HEALTH, s.health + 2);
    logs.push(`🏥 ${node.name}: improvisas una cura. +2 salud.`);
  }

  if (node.type === 'Refugio') {
    s.extraDraw = 1;
    logs.push(`🏚️ ${node.name}: respiras un segundo. Robarás 1 carta extra.`);
  }

  if (node.type === 'Barricada') {
    s.actionsLeft = Math.max(0, s.actionsLeft - 1);
    logs.push(`🚧 ${node.name}: una barricada te frena. Pierdes 1 acción este turno.`);
  }

  if (node.type === 'Zona abierta') {
    s.doubleEvent = true;
    logs.push(`⚡ ${node.name}: demasiado descubierto. Se resolverán 2 eventos.`);
  }

  return { state: s, logs };
}

function HelpModal({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 20 }}
        className="max-w-2xl w-full rounded-2xl border border-amber-700 bg-stone-950 text-amber-50 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-amber-900/70 p-5">
          <div>
            <h2 className="text-2xl font-black text-amber-300">¿Cómo jugar?</h2>
            <p className="mt-1 text-sm text-amber-100/70">
              Guía rápida para sobrevivir a Ubricalipsis.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full bg-stone-900 p-2 hover:bg-stone-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-5 text-sm leading-relaxed">
          <div>
            <h3 className="font-black text-amber-300">Objetivo</h3>
            <p>
              Llega hasta <b>La Frontera</b> antes de quedarte sin salud.
            </p>
          </div>

          <div>
            <h3 className="font-black text-amber-300">Tu turno</h3>
            <ol className="list-decimal space-y-1 pl-5">
              <li>Elige una ruta amarilla en el mapa.</li>
              <li>
                Juega una carta <b>👣 MOVERSE</b> para avanzar.
              </li>
              <li>
                Si no tienes carta de MOVERSE, juega una carta de acción para
                prepararte.
              </li>
              <li>
                Pulsa <b>Terminar turno</b> para resolver eventos y robar nuevas
                cartas.
              </li>
            </ol>
          </div>

          <div>
            <h3 className="font-black text-amber-300">Cartas</h3>

            <div className="grid sm:grid-cols-2 gap-2">
              {Object.values(ACTION_META).map(m => (
                <div
                  key={m.label}
                  className="rounded-xl border border-amber-900/60 bg-stone-900/80 p-3"
                >
                  <b>
                    {m.icon} {m.label}
                  </b>
                  <br />
                  <span className="text-amber-100/75">{m.help}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-red-800/70 bg-red-950/40 p-3">
            <b>⚡ Zonas abiertas:</b> al terminar turno se resuelven 2 eventos.
            Además, <b>OCULTARSE</b> no funciona allí.
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function BranchMap({ current, chosenNext, onChoose }) {
  const currentOptions = MAP[current].options;
  const visitedLayer = MAP[current].y;

  return (
    <div className="relative h-[620px] overflow-hidden rounded-2xl border border-amber-900/70 bg-[radial-gradient(circle_at_center,#3a2818,#120d09_72%)] shadow-inner">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(30deg, rgba(245,158,11,.2) 1px, transparent 1px), linear-gradient(150deg, rgba(245,158,11,.16) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {EDGES.map(e => {
          const a = MAP[e.from];
          const b = MAP[e.to];

          const active = e.from === current && e.to === chosenNext;
          const available = e.from === current && currentOptions.includes(e.to);
          const passed = a.y < visitedLayer && b.y <= visitedLayer;

          return (
            <motion.line
              key={`${e.from}-${e.to}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7 }}
              stroke={
                active
                  ? '#facc15'
                  : available
                    ? '#f59e0b'
                    : passed
                      ? '#a16207'
                      : '#57534e'
              }
              strokeWidth={active ? 1.1 : available ? 0.75 : 0.45}
              strokeDasharray={active ? '2 1' : available ? '1.5 1.5' : '0'}
              opacity={active ? 1 : available ? 0.85 : passed ? 0.5 : 0.35}
            />
          );
        })}
      </svg>

      {Object.entries(MAP).map(([id, n]) => {
        const Icon = typeIcons[n.type] || MapPin;
        const active = id === current;
        const selectable = currentOptions.includes(id);
        const selected = chosenNext === id;
        const future = n.y > visitedLayer && !selectable;

        return (
          <motion.button
            key={id}
            onClick={() => selectable && onChoose(id)}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: active ? [1, 1.08, 1] : 1,
              opacity: future ? 0.55 : 1,
            }}
            whileHover={{ scale: selectable ? 1.08 : 1.02 }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 w-28 md:w-32 rounded-2xl border-2 p-2 text-center shadow-xl backdrop-blur-sm transition ${
              typeColors[n.type]
            } ${selectable ? 'cursor-pointer ring-4 ring-amber-400/50' : 'cursor-default'} ${
              selected ? 'ring-4 ring-yellow-300 shadow-yellow-500/40' : ''
            } ${active ? 'shadow-amber-300/40' : ''}`}
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
          >
            <div className="flex justify-center">
              <Icon className="h-5 w-5" />
            </div>

            <div className="mt-1 text-xs font-black leading-tight">
              {n.short}
            </div>

            <div className="text-[10px] opacity-80">{n.type}</div>

            {active && (
              <div className="mt-1 rounded-full bg-amber-200 px-1 text-[10px] font-black text-stone-950">
                ESTÁS AQUÍ
              </div>
            )}

            {selected && !active && (
              <div className="mt-1 rounded-full bg-yellow-300 px-1 text-[10px] font-black text-stone-950">
                RUTA
              </div>
            )}
          </motion.button>
        );
      })}

      <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-amber-900/70 bg-stone-950/70 p-3 text-xs text-amber-100/80">
        <b className="text-amber-300">Cómo leer el mapa:</b> los caminos amarillos
        son tus opciones inmediatas. Pulsa un nodo disponible para marcar la ruta y
        juega <b>Moverse</b> para avanzar.
      </div>
    </div>
  );
}

function GameLog({ log }) {
  return (
    <Card className="bg-stone-950/80 border border-amber-700 rounded-2xl shadow-xl">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-amber-300">Registro</h2>
          <span className="text-xs text-amber-100/50">
            Últimos acontecimientos
          </span>
        </div>

        <div className="space-y-2 max-h-[220px] overflow-auto pr-1">
          <AnimatePresence initial={false}>
            {log.map(entry => (
              <motion.div
                key={entry.id}
                initial={{ x: 24, opacity: 0, scale: 0.98 }}
                animate={{
                  x: 0,
                  opacity: 1,
                  scale: 1,
                  backgroundColor: entry.fresh
                    ? 'rgba(250, 204, 21, 0.22)'
                    : 'rgba(28, 25, 23, 0.82)',
                  borderColor: entry.fresh
                    ? 'rgba(250, 204, 21, 0.95)'
                    : 'rgba(120, 53, 15, 0.50)',
                  boxShadow: entry.fresh
                    ? [
                        '0 0 0 rgba(250,204,21,0)',
                        '0 0 22px rgba(250,204,21,0.55)',
                        '0 0 0 rgba(250,204,21,0)',
                      ]
                    : '0 0 0 rgba(0,0,0,0)',
                }}
                exit={{ x: -20, opacity: 0 }}
                transition={{
                  duration: 0.35,
                  boxShadow: {
                    duration: 1.2,
                  },
                }}
                className="rounded-xl border p-2 text-sm text-amber-50"
              >
                {entry.text}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}

function DeckSummary() {
  const actionCounts = ACTION_DECK.reduce(
    (acc, c) => ({ ...acc, [c.type]: (acc[c.type] || 0) + 1 }),
    {}
  );

  const badEvents = EVENT_DECK.filter(e => e.negative).length;

  return (
    <Card className="bg-stone-950/70 border border-amber-900 rounded-2xl">
      <CardContent className="p-4">
        <h2 className="text-xl font-bold text-amber-300 mb-3">Equilibrio beta</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          <div className="rounded-xl bg-stone-900/80 p-2 border border-amber-900/50">
            <Backpack className="h-4 w-4 inline mr-1" />
            Acciones: <b>{ACTION_DECK.length}</b>
          </div>

          <div className="rounded-xl bg-stone-900/80 p-2 border border-amber-900/50">
            <Zap className="h-4 w-4 inline mr-1" />
            Eventos: <b>{EVENT_DECK.length}</b>
          </div>

          <div className="rounded-xl bg-stone-900/80 p-2 border border-amber-900/50">
            Peligros: <b>{badEvents}</b>
          </div>

          <div className="rounded-xl bg-stone-900/80 p-2 border border-amber-900/50">
            Moverse: <b>{actionCounts.move}</b>
          </div>

          <div className="rounded-xl bg-stone-900/80 p-2 border border-amber-900/50">
            Munición máx: <b>{MAX_AMMO}</b>
          </div>

          <div className="rounded-xl bg-stone-900/80 p-2 border border-amber-900/50">
            Curar: <b>+1 salud</b>
          </div>
        </div>

        <p className="mt-3 text-xs text-amber-100/70">
          Ajuste aplicado: partida media, dificultad media, menos cartas de
          movimiento, munición más escasa, curación contenida y ayuda contextual.
        </p>
      </CardContent>
    </Card>
  );
}

export default function Ubricalipsis() {
  const [player, setPlayer] = useState('');
  const [started, setStarted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [game, setGame] = useState(createInitialGame());
  const [lastEvent, setLastEvent] = useState(null);

  const [log, setLog] = useState([
    createLogEntry(
      'Ubrique tiembla. La bolsa subterránea ha explotado. Toca correr hacia la frontera.',
      false
    ),
    createLogEntry(
      '👣 Empiezas con una carta de MOVERSE para que puedas avanzar desde el primer turno.',
      false
    ),
  ]);

  const options = MAP[game.current].options;
  const tip = getCurrentTip(game);

  function addLog(lines) {
    const newEntries = lines.map(line => createLogEntry(line, true));

    setLog(currentLog => {
      const oldEntries = currentLog.map(entry => ({
        ...entry,
        fresh: false,
      }));

      return [...newEntries, ...oldEntries].slice(0, 10);
    });
  }

  function chooseNext(id) {
    setGame(g => ({ ...g, chosenNext: id }));
    addLog([`🧭 Ruta seleccionada: ${MAP[id].name}. Ahora juega una carta 👣 MOVERSE.`]);
  }

  function playCard(card) {
    if (game.status !== 'playing') {
      addLog(['ℹ️ La partida ha terminado. Pulsa Reiniciar para jugar de nuevo.']);
      return;
    }

    if (game.actionsLeft <= 0) {
      addLog(['⏳ No te quedan acciones. Pulsa Terminar turno para robar nuevas cartas.']);
      return;
    }

    let g = {
      ...game,
      hand: game.hand.filter(c => c.uid !== card.uid),
      actionsLeft: game.actionsLeft - 1,
      needsActionAfterMove: false,
    };

    const lines = [];

    if (card.type === 'move') {
      const destination = g.chosenNext || options[0];

      if (!destination) {
        addLog(['🧭 No tienes ruta disponible. Revisa el mapa.']);
        return;
      }

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

        if (g.chosenNext) {
          lines.push(`🧭 Próxima ruta sugerida: ${MAP[g.chosenNext].name}. Puedes cambiarla en el mapa.`);
        }

        const hasMoveAfterMoving = g.hand.some(c => c.type === 'move');

        if (!hasMoveAfterMoving) {
          g.needsActionAfterMove = true;
          lines.push(
            '⚠️ No te quedan cartas de MOVERSE. Juega una carta de acción para prepararte: BUSCAR, CURAR, ATACAR u OCULTARSE.'
          );
        }
      }
    }

    if (card.type === 'attack') {
      if (g.ammo < 2) {
        addLog(['🔫 No tienes munición suficiente para atacar. Usa BUSCAR o visita un Taller.']);
        return;
      }

      g.ammo -= 2;
      g.skipNextDanger = true;
      lines.push(`🪓 ${card.name}: ${card.effectText}`);
    }

    if (card.type === 'search') {
      g.ammo = Math.min(MAX_AMMO, g.ammo + 1);
      lines.push(`🥜 ${card.name}: ${card.effectText} +1 munición.`);
    }

    if (card.type === 'hide') {
      if (MAP[g.current].type === 'Zona abierta') {
        lines.push(
          `🛡️ ${card.name}: intentas esconderte, pero estás en Zona abierta. No sirve de nada.`
        );
      } else {
        g.skipNextDanger = true;
        lines.push(`🛡️ ${card.name}: ${card.effectText} Ignoras el próximo peligro.`);
      }
    }

    if (card.type === 'heal') {
      g.health = Math.min(MAX_HEALTH, g.health + 1);
      lines.push(`🍺 ${card.name}: ${card.effectText} +1 salud.`);
    }

    if (card.type !== 'move') {
      g.needsActionAfterMove = false;
    }

    if (g.health <= 0) {
      g.status = 'lost';
    }

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

      if (ev.negative && g.skipNextDanger) {
        lines.push(`🙈 Evitas ${ev.name} gracias a tu preparación.`);
        g.skipNextDanger = false;
      } else {
        g = ev.apply(g);
        lines.push(`🃏 ${ev.name}: ${ev.text}`);
      }
    }

    g.doubleEvent = false;
    return { g, lines };
  }

  function endTurn() {
    if (game.status !== 'playing') return;

    let g = { ...game, needsActionAfterMove: false };
    const lines = [];

    if (g.poison > 0) {
      g.health = Math.max(0, g.health - 1);
      g.poison -= 1;
      lines.push('🧟 El efecto gradual sigue dando la lata. -1 salud.');
    }

    const ev = resolveEvents(g);
    g = ev.g;
    lines.push(...ev.lines);

    if (g.health <= 0) {
      g.status = 'lost';
      lines.push('💀 Tu salud llega a cero. Ubrique te reclama.');
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
    setLastEvent(null);
    setLog([
      createLogEntry(
        'Nueva partida beta. Empiezas con una carta de MOVERSE para arrancar la huida.',
        true
      ),
      createLogEntry(
        '👣 Elige una ruta en el mapa y juega la carta de MOVERSE.',
        true
      ),
    ]);
  }

  if (!started) {
    return (
      <div
        className="relative min-h-screen p-6 text-amber-50 flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(10, 8, 6, 0.50), rgba(10, 8, 6, 0.82)), url('${import.meta.env.BASE_URL}fondo-inicio.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.10),rgba(0,0,0,0.68))]" />

        <AnimatePresence>
          {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
        </AnimatePresence>

        <Card className="relative z-10 max-w-xl w-full bg-stone-950/75 border border-amber-700/80 shadow-2xl rounded-2xl backdrop-blur-md">
          <CardContent className="p-8 space-y-5">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.35em] text-amber-200/80">
                Supervivencia en Ubrique
              </p>

              <h1 className="text-5xl md:text-6xl font-black tracking-tight text-amber-300 drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]">
                UBRICALIPSIS
              </h1>

              <p className="mt-4 text-amber-100/90 leading-relaxed">
                Una explosión bajo Ubrique ha convertido a medio pueblo en zombies
                que chupan vitalidad. Tu misión: llegar a La Frontera.
              </p>
            </div>

            <input
              value={player}
              onChange={e => setPlayer(e.target.value)}
              placeholder="Nombre del superviviente"
              className="w-full rounded-xl bg-stone-950/80 border border-amber-700 p-3 outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-amber-100/40"
            />

            <div className="grid sm:grid-cols-2 gap-3">
              <Button
                onClick={() => setStarted(true)}
                className="rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black shadow-lg shadow-black/40"
              >
                Empezar huida
              </Button>

              <Button
                onClick={() => setShowHelp(true)}
                className="rounded-xl bg-stone-950/80 hover:bg-stone-900 border border-amber-700 text-amber-100"
              >
                <HelpCircle className="h-4 w-4 inline mr-2" />
                Cómo jugar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#76552d,#1a130d_60%)] text-amber-50 p-4 md:p-6">
      <AnimatePresence>
        {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto space-y-4">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <h1 className="text-4xl font-black text-amber-300 drop-shadow">
              UBRICALIPSIS
            </h1>

            <p className="text-amber-100/75">
              Superviviente: <b>{player || 'Anónimo/a'}</b> · Turno {game.turn} ·
              Acciones: {game.actionsLeft}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setShowHelp(true)}
              className="rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black"
            >
              <HelpCircle className="h-4 w-4 mr-2 inline" />
              Cómo jugar
            </Button>

            <Button
              onClick={reset}
              className="rounded-xl border border-amber-700 text-amber-100 bg-stone-950/40 hover:bg-stone-900"
            >
              <RotateCcw className="h-4 w-4 mr-2 inline" />
              Reiniciar
            </Button>
          </div>
        </header>

        <GameLog log={log} />

        <div className="grid xl:grid-cols-[1.05fr_.95fr] gap-4">
          <section className="space-y-4">
            <Card className="bg-stone-950/70 border border-amber-900 rounded-2xl shadow-xl">
              <CardContent className="p-4 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <PipBar value={game.health} max={MAX_HEALTH} icon={Heart} label="Salud" />
                  <PipBar value={game.ammo} max={MAX_AMMO} icon={Crosshair} label="Munición" />
                </div>

                <div
                  className={`rounded-2xl border p-3 text-sm ${
                    game.needsActionAfterMove
                      ? 'border-yellow-400 bg-yellow-950/50 text-yellow-50'
                      : 'border-amber-700/70 bg-amber-950/40 text-amber-50'
                  }`}
                >
                  <b className="text-amber-300">💡 Consejo actual:</b> {tip}
                </div>

                {game.status !== 'playing' && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`rounded-2xl p-5 text-center font-black text-2xl ${
                      game.status === 'won'
                        ? 'bg-green-900/60 text-green-100'
                        : 'bg-red-950/70 text-red-100'
                    }`}
                  >
                    {game.status === 'won'
                      ? '¡VICTORIA! Has escapado de Ubrique.'
                      : 'DERROTA. Te han absorbido la vitalidad.'}
                  </motion.div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-stone-950/70 border border-amber-900 rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-bold text-amber-300">
                    Mano de cartas
                  </h2>

                  <Button
                    onClick={endTurn}
                    className="rounded-xl bg-stone-800 hover:bg-stone-700 border border-amber-800"
                  >
                    Terminar turno
                  </Button>
                </div>

                <div className="grid md:grid-cols-3 gap-3">
                  <AnimatePresence>
                    {game.hand.map((card, idx) => {
                      const Icon = ACTION_ICONS[card.type];
                      const meta = ACTION_META[card.type];

                      const shouldHighlightMove =
                        card.type === 'move' &&
                        !!game.chosenNext &&
                        game.status === 'playing';

                      const shouldHighlightAction =
                        game.needsActionAfterMove &&
                        card.type !== 'move' &&
                        game.status === 'playing';

                      return (
                        <motion.div
                          key={card.uid}
                          initial={{ y: -80, opacity: 0, rotate: -8 }}
                          animate={{
                            y: 0,
                            opacity: 1,
                            rotate: 0,
                            boxShadow:
                              shouldHighlightMove || shouldHighlightAction
                                ? [
                                    '0 0 0 rgba(250,204,21,0)',
                                    '0 0 26px rgba(250,204,21,.75)',
                                    '0 0 0 rgba(250,204,21,0)',
                                  ]
                                : '0 12px 24px rgba(0,0,0,.35)',
                          }}
                          exit={{ y: -140, opacity: 0, rotate: 14 }}
                          transition={{
                            delay: idx * 0.08,
                            boxShadow: {
                              repeat:
                                shouldHighlightMove || shouldHighlightAction
                                  ? Infinity
                                  : 0,
                              duration: 1.3,
                            },
                          }}
                          whileHover={{ y: -10, rotateX: 8 }}
                          onClick={() => playCard(card)}
                          className={`relative cursor-pointer rounded-2xl bg-gradient-to-br from-amber-200 to-stone-300 text-stone-950 border-4 shadow-xl p-4 min-h-52 flex flex-col ${
                            shouldHighlightMove || shouldHighlightAction
                              ? 'border-yellow-400 ring-4 ring-yellow-300/60'
                              : 'border-stone-800'
                          }`}
                        >
                          {shouldHighlightMove && (
                            <div className="absolute -top-3 left-3 rounded-full bg-yellow-300 px-3 py-1 text-[11px] font-black text-stone-950 shadow">
                              ÚSALA PARA AVANZAR
                            </div>
                          )}

                          {shouldHighlightAction && (
                            <div className="absolute -top-3 left-3 rounded-full bg-yellow-300 px-3 py-1 text-[11px] font-black text-stone-950 shadow">
                              JUEGA UNA ACCIÓN
                            </div>
                          )}

                          <div className="flex justify-between items-start">
                            <h3 className="font-black text-lg leading-tight">
                              {card.name}
                            </h3>

                            <Icon className="h-6 w-6 shrink-0" />
                          </div>

                          <p className="text-xs font-black mt-1 uppercase">
                            {meta.icon} {meta.label} · Coste: {card.cost}
                          </p>

                          <p className="mt-4 text-sm leading-relaxed">
                            {card.text}
                          </p>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>

            <DeckSummary />
          </section>

          <section className="space-y-4">
            <Card className="bg-stone-950/70 border border-amber-900 rounded-2xl">
              <CardContent className="p-4">
                <h2 className="text-xl font-bold text-amber-300 mb-3">
                  Mapa ramificado
                </h2>

                <BranchMap
                  current={game.current}
                  chosenNext={game.chosenNext}
                  onChoose={chooseNext}
                />
              </CardContent>
            </Card>
          </section>
        </div>

       <Card className="bg-stone-950/70 border border-amber-900 rounded-2xl">
          <CardContent className="p-4">
            <h2 className="text-xl font-bold text-amber-300 mb-3">
              Último evento
            </h2>

            <AnimatePresence mode="wait">
              {lastEvent ? (
                <motion.div
                  key={lastEvent.id + game.turn}
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: -90, opacity: 0 }}
                  className="rounded-2xl bg-red-950/60 border border-red-800 p-4"
                >
                  <div className="font-black text-lg">
                    {lastEvent.name}
                  </div>

                  <div className="text-xs text-red-200/70">
                    {lastEvent.type}
                  </div>

                  <p className="mt-3 text-sm">
                    {lastEvent.text}
                  </p>
                </motion.div>
              ) : (
                <p className="text-amber-100/60">
                  Aún no ha aparecido ningún evento.
                </p>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
