# Runner 2D

Juego runner auto-scrolling con Phaser 3 (ES Modules). El personaje corre hacia la derecha, el mundo hace scroll y solo puedes saltar. La vida baja con el tiempo; recoge cerveza (+10 HP) y la clave musical (congela el decay 5 s). Evita obstáculos y NPCs.

## Cómo correr

```bash
npm install
npm run dev
```

Abre http://localhost:5173

## Controles

- **Espacio** o **clic** o **↑**: saltar

## Estructura

- `src/config.js` — Configuración central (vida, spawn, scroll, assets, secciones).
- `src/scenes/` — Boot, Preload, Game, UI.
- `src/systems/` — Health, Spawn, Parallax, Level, Audio.
- `assets/` — sprites, backgrounds, audio (el juego usa placeholders si no hay archivos).

## Cambiar assets

Edita las rutas en `src/config.js` (ASSETS) y carga las texturas en `BootScene.js` o Preload según necesites.
