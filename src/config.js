/**
 * Configuración central del juego. Cambiar sprites y valores aquí.
 */

export const GAME = {
  width: 400,
  height: 224,
  pixelScale: 4,
  itemScale: 0.35,
  backgroundColor: '#1a1a2e',
};

export const PLAYER = {
  spriteKey: 'player',
  startX: 80,
  startY: 0,
  jumpForce: -380,
  gravity: 1200,
  spriteSheet: {
    path: 'sprites/player.png',
    frameWidth: 190,
    frameHeight: 278,
    cols: 6,
    rows: 6,
    totalFrames: 36,
    runAnimKey: 'player-run',
    runFrameRate: 10,
  },
};

export const HEALTH = {
  initial: 100,
  decayPerSec: 8,
  invulnerabilityMs: 1500,
};

export const ITEMS = {
  beer: {
    spriteKey: 'beer',
    scale: 0.14,
    healAmount: 10,
    spawnIntervalMin: 3000,
    spawnIntervalMax: 6000,
  },
  musicKey: {
    spriteKey: 'musicKey',
    buffDurationMs: 5000,
    spawnIntervalMin: 8000,
    spawnIntervalMax: 15000,
  },
};

export const OBSTACLES = {
  damage: 15,
  npc: {
    spriteKey: 'npc',
    spawnIntervalMin: 2000,
    spawnIntervalMax: 4500,
    speedMin: 40,
    speedMax: 90,
  },
  static: {
    cables: { spriteKey: 'cables', spawnWeight: 1 },
    speakers: { spriteKey: 'speakers', spawnWeight: 1 },
    tables: { spriteKey: 'tables', spawnWeight: 1 },
    fridges: { spriteKey: 'fridges', spawnWeight: 1 },
  },
  staticSpawnIntervalMin: 2500,
  staticSpawnIntervalMax: 5000,
};

export const SCROLL = {
  speed: 280,
};

export const ASSETS = {
  sprites: {
    player: { key: 'player', path: 'sprites/player.png' },
    beer: { key: 'beer', path: 'sprites/beer.png' },
    musicKey: { key: 'musicKey', path: 'sprites/musicKey.png' },
    npc: { key: 'npc', path: 'sprites/npc.png' },
    cables: { key: 'cables', path: 'sprites/cables.png' },
    speakers: { key: 'speakers', path: 'sprites/speakers.png' },
    tables: { key: 'tables', path: 'sprites/tables.png' },
    fridges: { key: 'fridges', path: 'sprites/fridges.png' },
  },
  backgrounds: [
    { key: 'bg0', path: 'backgrounds/bg0.png', parallaxFactor: 0.2 },
    { key: 'bg1', path: 'backgrounds/bg1.png', parallaxFactor: 0.4 },
    { key: 'bg2', path: 'backgrounds/bg2.png', parallaxFactor: 0.7 },
  ],
  audio: {
    section0: { key: 'music0', path: 'audio/section0.mp3' },
    section1: { key: 'music1', path: 'audio/section1.mp3' },
    section2: { key: 'music2', path: 'audio/section2.mp3' },
  },
};

export const LEVEL_SECTIONS = [
  { distance: 0, musicKey: 'music0', backgroundKeys: ['bg0', 'bg1', 'bg2'], spawnRateMultiplier: 1 },
  { distance: 1500, musicKey: 'music1', backgroundKeys: ['bg0', 'bg1', 'bg2'], spawnRateMultiplier: 1.2 },
  { distance: 3500, musicKey: 'music2', backgroundKeys: ['bg0', 'bg1', 'bg2'], spawnRateMultiplier: 1.4 },
];

export const EVENTS = {
  HEALTH_CHANGED: 'health_changed',
  GAME_OVER: 'game_over',
  BUFF_START: 'buff_start',
  BUFF_END: 'buff_end',
  SECTION_CHANGED: 'section_changed',
};
