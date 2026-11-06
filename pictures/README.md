# Art assets

This folder contains **original, hand-authored SVG fan art**. There are no film stills, no downloaded images, and no external image dependencies.

## Files

### `favicon.svg`

A 128×128 golden music note on a deep navy background. It is referenced by `index.html`:

```html
<link rel="icon" href="pictures/favicon.svg" type="image/svg+xml">
```

Browsers that support SVG favicons show it in the tab. If you replace it, keep the filename or update the `<link>` tag.

### `poster.svg`

A 800×1120 poster-style illustration: five students on a sunset railway platform with a saxophone, trumpet, trombone, drum kit, and cymbals. It is a bonus asset; the game itself does **not** load the poster at runtime.

You can open it directly in a browser:

```text
pictures/poster.svg
```

Or render it to PNG with any SVG-capable tool (Inkscape, ImageMagick, a headless browser, etc.). The poster is useful as a README image or a share card if you want one.

## How the in-game art is made

The game does not use raster sprites. The characters, portraits, backgrounds, weather, and effects are drawn at runtime:

- **Characters / portraits:** `js/characters.js`
  - `CHARACTERS` holds shared colors, hairstyles, outfits, and accessories.
  - `draw(...)` draws the top-down world sprite.
  - `drawPortrait(...)` draws the large dialogue portrait.
  - Instruments are separate painters such as `drawSax` and `drawTrumpet`.
- **Backgrounds:** `js/backgrounds.js`
  - Each scene has a builder function (`classroom`, `station`, `train`, `ricefield`, `town`, `camp`, `schoolyard`, `hall`).
  - Backgrounds are rendered once into cached canvases and reused.
- **Title screen and effects:** `js/game.js`
  - The textless animated title, fades, confetti, and weather are Canvas-drawn.

This approach keeps the project self-contained and makes recoloring or restyling a character a matter of editing a few hex values.

## Replacing the art

### Use your own raster images

The current build never fetches images, so any replacement needs a small code change:

1. Put the image under `pictures/` (for example, `pictures/tomoko.png`).
2. Load it as an `Image` in `js/characters.js` or `js/backgrounds.js`.
3. Draw it with `ctx.drawImage(...)` in the relevant painter.

For a drop-in background replacement, the simplest approach is to modify the relevant builder in `js/backgrounds.js` to draw a preloaded image across the scene canvas.

### Keep the original look

If you only want to adjust colors, edit the `CHARACTERS` entries in `js/characters.js`:

```js
tomoko: {
  name: 'Tomoko',
  skin: '#f6c7a6',
  hair: '#5a3928',
  hairStyle: 'bob',
  outfit: 'sailor',
  accent: '#e15b5d'
}
```

The background palettes are local variables inside each builder in `js/backgrounds.js`, so you can tune a scene's sky, walls, and props without touching the game logic.

## Licensing / fan-project note

The art is original work created for this fan project, inspired by the characters and setting of *Swing Girls* (2004). It is not official film art. Do not add copyrighted stills, traced production art, or ripped sprites if you redistribute the project.
