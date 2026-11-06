# Movie Life

A small, browser-playable story RPG inspired by the Japanese film **Swing Girls** (2004). You play **Tomoko**, a summer-school student who accidentally destroys the school brass band's lunch, accidentally becomes a musician, and eventually has to walk on stage in front of a full concert hall.

The game is a **complete short story in four parts**: talk to people, walk around Yamagata, play five rhythm performances, and reach the winter concert to finish the story. There is **no save system** — one sitting, one story, then the ending.

Everything is built with plain HTML, CSS, HTML5 Canvas, and Web Audio. No framework, no build step, no downloadable assets, no external services.

---

## 1. Quick start

### Option A — open the file directly

Double-click **`index.html`**, or drag it into a modern browser.

The game deliberately uses classic `<script>` tags and code-drawn graphics, so it also works from `file://`. A local server is still recommended because some browsers apply stricter rules to local files.

### Option B — local server (recommended)

From the `movie_life` folder:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

Any static server works (`npx serve`, `php -S`, etc.). There is nothing to install and nothing to compile.

### Supported browsers

Recent Chrome, Edge, Firefox, Safari, and mobile Safari/Chrome. The game needs Canvas 2D and Web Audio. If Web Audio is unavailable, the story still runs; music is simply skipped.

---

## 2. Controls

| Action | Desktop | Mobile |
| --- | --- | --- |
| Start the game | Any key, click, or tap | Tap anywhere |
| Move | `W A S D` or arrow keys | Drag the left joystick |
| Walk to a spot | Click/tap the ground | Tap the ground |
| Talk / inspect / advance dialogue | `E`, `Enter`, or `Space` | Glowing action button, or tap the dialogue box |
| Rhythm notes | `D` `F` `J` `K` (also `1`–`4` or arrow keys) | Tap any of the four lanes |
| Mute / unmute | `M` | Speaker button, top-right |
| How to play | `H` or `?` | `?` button, top-right |
| Close help | `Esc` or `H` | Back to the story button |
| Retry a performance | “Try again” on the result card | Same |
| Finish / restart | “Play again” on the ending screen | Same |

The game is fully keyboard-playable. The title screen intentionally has **no text**: it is an animated sunset with Tomoko and a saxophone. Any input begins.

---

## 3. How to play

1. **Read the objective pill** at the top of the screen. It always tells you the next story beat.
2. **Walk up to a glowing marker** (a dotted ring, a musical note, a letter, or an arrow) and press `E` / tap the action button. The gold sparkle means something can be interacted with.
3. **Talk through dialogue** with `E`, `Enter`, `Space`, or by tapping the dialogue box.
4. During a **music performance**, hit the four lanes as the notes cross the judgment line. Missing notes reduces accuracy, but you can always retry, and every performance has a “Skip for now” fallback. The story never hard-locks.
5. Reach the **winter concert** to see the ending. The ending screen shows total accuracy, perfect hits, best combo, and how many performances you played.

The chapter label changes as the story moves:

- **PART I · SUMMER**
- **PART II · THE SUBSTITUTE BAND**
- **PART III · AUTUMN JAZZ**
- **PART IV · WINTER CONCERT**

---

## 4. Walkthrough (spoilers)

The walkthrough below lists the scene, the objective text, and the performance. You never need to collect items manually; interacting with the highlighted marker advances the story.

### Part I — Summer School

| Scene | Objective | What happens |
| --- | --- | --- |
| Classroom | **Talk to Mr. Ozawa** | Ozawa lectures about trains; Tomoko and her friends are tasked with delivering the band's bento boxes. |
| Classroom | **Take the bento boxes by the door** | Pick up the stack by the classroom door. |
| Station | **Board the train** | Walk to the train door and interact. |
| Train | **Open a bento box** | Interact with the bento on the seat. |
| Train | **Sit down and rest** | Interact with the seat. Tomoko falls asleep. |
| Ricefield | **Run to the baseball field** | Run east across the rice fields. Stepping in the mud puddle triggers the bento disaster. |
| Ricefield | **Reach the baseball field** | Continue to the far-right field gate. The brass band gets food poisoning, and Takuo declares the girls are the new band. |

There is **no rhythm game in Part I** — it establishes the story and controls.

### Part II — The Substitute Band

| Scene | Objective | What happens |
| --- | --- | --- |
| Music room | **Talk to Takuo** | Takuo explains that the baseball game is tomorrow and the girls must play. |
| Music room | **Choose an instrument** | Interact with the instrument rack. Tomoko picks the saxophone. |
| Music room | **Practice with the band** | Interact with the practice stand. This starts **FIRST NOTES**. |
| — | Chapter card | The real band returns, takes back the instruments, and the girls are left with nothing. |

**Performance 1 — FIRST NOTES** · 108 BPM · 6 bars · easy · 48% to pass.

### Part III — Autumn Jazz

| Scene | Objective | What happens |
| --- | --- | --- |
| Town | **Visit the music shop** | Look at the saxophone in the window, then talk to the shop owner. Tomoko buys a used sax. |
| Town | **Find Ozawa-sensei** | Ozawa is at the far right of town, near the record shop. He drops a jazz record and runs. |
| Town | **Follow Ozawa-sensei home** | Follow the marker to Ozawa's house and convince him to teach the girls jazz. |
| Town | **Meet everyone at the camp** | Interact with the van at the far right. |
| Camp | **Practice with Ozawa** | Interact with the rehearsal marker in the clearing. This starts **MOUNTAIN SWING**. |
| Town | **Play the supermarket gig** | After practice, interact with the supermarket stage marker. This starts **SUPERMARKET SWING**. |

**Performance 2 — MOUNTAIN SWING** · 126 BPM · 8 bars · normal · 54% to pass.
**Performance 3 — SUPERMARKET SWING** · 136 BPM · 8 bars · normal · 54% to pass.

The supermarket gig is where the group gets invited to the winter festival in the city.

### Part IV — Winter Concert

| Scene | Objective | What happens |
| --- | --- | --- |
| Schoolyard | **Mail the festival entry** | Interact with the mailbox. Tomoko discovers she missed the deadline, but hides it. |
| Schoolyard | **Meet everyone at the station** | Walk to the right edge of the schoolyard and interact with the arrow. |
| Station (winter) | **Board the train** | Interact with the winter train. |
| Train (winter) | **Talk to Takuo** | Tell the band the truth: the entry was never mailed. |
| Train (winter) | **Play something on the train** | Interact with the radio. The train is stopped by snow, so the band plays in the carriage. This starts **SNOWBOUND SWING**. |
| Hall | **Take the stage** | Interact with the microphone. This starts the finale, **MOVIE LIFE SWING** (144 BPM, 12 bars, hardest chart, 54% to pass). |
| Hall | **Ending** | The performance resolves the story and the ending screen appears. |

The ending is reached even if the final performance is skipped or failed: the story is about finishing, not about a game over. A stronger performance changes the closing narration and the ending statistics.

---

## 5. The rhythm performances

All five performances use the same four-lane system:

- Notes fall toward a horizontal judgment line.
- Hit a lane when a note reaches the line: **D F J K** for lanes 1–4.
- On touch screens, tap directly on the lane.
- Timing grades are **PERFECT**, **GOOD**, **OK**, and **MISS**.
- Accuracy is weighted: perfect = 1.0, good = 0.8, ok = 0.55.
- Passing unlocks the normal “Continue” flow. Failing offers **Try again** or **Skip for now**.
- The charts are deterministic for each performance, so retrying is fair.

| # | ID | Title | BPM | Bars | Difficulty |
| --- | --- | --- | --- | --- | --- |
| 1 | `first-notes` | FIRST NOTES | 108 | 6 | 0 (easy) |
| 2 | `mountain-swing` | MOUNTAIN SWING | 126 | 8 | 1 (normal) |
| 3 | `supermarket-swing` | SUPERMARKET SWING | 136 | 8 | 1 (normal) |
| 4 | `snowbound-swing` | SNOWBOUND SWING | 116 | 8 | 1 (normal) |
| 5 | `movie-life-swing` | MOVIE LIFE SWING | 144 | 12 | 2 (finale) |

The difficulty curve is intentionally gentle: the first chart uses only pairs, the middle charts add quarter-beat patterns, and the finale adds eighth-note patterns but keeps a generous pass threshold.

---

## 6. Project structure

```text
movie_life/
├── index.html              Main entry point and all DOM overlays
├── README.md               This file
├── mind.txt                Original design brief (kept for reference)
├── css/
│   └── style.css           Layout, HUD, dialogue, touch controls, modals
├── js/
│   ├── main.js             Boot, global error overlay, debug URL handling
│   ├── game.js             Game state, input, camera, render loop, transitions
│   ├── story.js            Scenes, NPCs, props, dialogue, objectives, progression
│   ├── characters.js       Code-drawn character sprites and portraits
│   ├── backgrounds.js      Code-drawn scene backgrounds
│   ├── rhythm.js           Four-lane rhythm game and chart generation
│   └── audio.js            Web Audio music engine and sound effects
├── pictures/
│   ├── favicon.svg         Hand-authored SVG favicon
│   ├── poster.svg          Hand-authored bonus poster
│   └── README.md           Notes about the art
└── sounds/
    └── README.md           Notes about the synthesized audio
```

### Load order

`index.html` loads the scripts in dependency order:

1. `audio.js` — defines `AudioEngine`
2. `characters.js` — defines `CharacterArt`
3. `backgrounds.js` — defines `Backgrounds`
4. `rhythm.js` — defines `RhythmGame`
5. `story.js` — defines `Story` using the art/audio APIs
6. `game.js` — defines the `Game` class
7. `main.js` — boots the game

All scripts are classic scripts (not ES modules) precisely so the game works from `file://`.

---

## 7. Modifying the game

### 7.1 Change dialogue or story text

Open `js/story.js`. Dialogue is written with two small helpers:

```js
const N = (text) => ({ who: null, text });             // narration
const L = (who, text, expr) => ({ who, text, expr });  // a character line
```

Find the scene and interaction you want, then edit the `game.say([...])` array:

```js
await game.say([
  N('Rain drums on the classroom windows.'),
  L('tomoko', 'I only wanted to deliver lunch.', 'sad'),
  L('ozawa', 'The universe has other plans.', 'happy')
]);
```

Available expressions are `neutral`, `happy`, `sad`, `angry`, `surprised`, `shy`, and `determined`. The speaker key must exist in `CHARACTERS` in `js/characters.js`.

### 7.2 Add an NPC or an interactable prop

Inside a scene's `setup(game)` function, in `js/story.js`:

```js
game.addNPC({
  id: 'classmate',
  char: 'friend',          // key from js/characters.js
  x: 640, y: 620,
  dir: 'down',
  expr: 'happy',
  important: true,         // shows the quest marker
  onInteract: async () => {
    await game.say([L('friend', 'Good luck with the concert!', 'happy')]);
  }
});

game.addProp({
  id: 'poster',
  x: 900, y: 500,
  radius: 80,              // how close the player must be
  important: true,
  draw(ctx, x, y, t) {
    // Custom Canvas drawing at world position (x, y).
  },
  onInteract: async () => {
    await game.say([N('A faded poster for the winter jazz festival.')]);
  }
});
```

`important` props/NPCs can be found by the player and are highlighted with the game's marker helpers. `important` can also be a function, as the shop owner demonstrates:

```js
important: () => game.step === 'c3_buy_sax'
```

### 7.3 Add a story step

Objectives are stored in `OBJECTIVES` at the top of `js/story.js`:

```js
const OBJECTIVES = {
  c1_talk_ozawa: 'Talk to Mr. Ozawa',
  // ...
  c2_find_cymbal: 'Find the missing cymbal'
};
```

Then advance to it from an interaction:

```js
game.setStep('c2_find_cymbal');
game.toast('Find the missing cymbal');
```

`game.setStep()` refreshes the scene and the HUD automatically. Use `game.updateHUD()` if you only need to refresh the text.

To move to another scene:

```js
await game.transitionTo('musicroom', {
  spawn: { x: 800, y: 880 },
  step: 'c2_talk_takuo',
  season: 'summer'         // optional; affects winter/seasonal art
});
```

Scene IDs currently defined: `classroom`, `station`, `train`, `ricefield`, `musicroom`, `town`, `camp`, `schoolyard`, `stationWinter`, `trainWinter`, `hall`.

### 7.4 Add a new scene

A scene lives in `SCENES` in `js/story.js`:

```js
rooftop: {
  world: { w: 1400, h: 900 },       // world bounds in pixels
  spawn: { x: 700, y: 800 },        // starting position
  bg: 'rooftop',                     // background builder key
  music: 'winter',                   // 'summer' | 'autumn' | 'winter' | 'stage' | 'train'
  effects: 'snow',                   // 'summer' | 'autumn' | 'snow' | 'stage' | 'trainWinter'
  setup(game) {
    // Add NPCs, props, zones, and step-specific interactions here.
  }
}
```

Then add a background builder in `js/backgrounds.js`:

```js
function rooftop(ctx, w, h) {
  // draw the scene once; it is cached per size/season
}

const builders = {
  // ...
  rooftop: (ctx, w, h) => rooftop(ctx, w, h)
};
```

Backgrounds are cached canvases, so expensive drawing only happens when the scene or viewport size changes.

### 7.5 Change character art

`js/characters.js` keeps character configuration and drawing in one place.

- `CHARACTERS` contains colors, hair style, outfit, and accessories.
- `draw(ctx, key, x, y, t, opts)` draws a world sprite.
- `drawPortrait(canvas, speaker, expr)` draws the dialogue portrait.
- Instrument painters (`drawSax`, `drawTrumpet`, `drawTrombone`, `drawDrumsticks`, `drawCymbal`) are separate functions.

To recolor an existing character:

```js
tomoko: {
  name: 'Tomoko',
  skin: '#f6c7a6', hair: '#5a3928',
  hairStyle: 'bob', outfit: 'sailor', accent: '#e15b5d'
}
```

To add a character key, add an entry to `CHARACTERS` and reference that key in `addNPC({ char: '...' })` or `L('...', ...)`.

### 7.6 Change or add music

`js/audio.js` synthesizes all music with oscillators, filtered noise, and gain envelopes. The `MOODS` object at the top holds the chord progression, melody, tempo, swing amount, and mix levels:

```js
summer: {
  bpm: 126,
  progression: ['Dm7', 'G7', 'Cmaj7', 'A7'],
  melody: [72, 76, 79, 77, 74, 72, 71, 69, 72, 76, 74, 72, 69, 67, 69, 72],
  swing: 0.66
}
```

- `progression` uses chord names from the `CHORDS` table.
- `melody` uses MIDI note numbers.
- `swing` controls the ratio of the off-beat eighth notes.
- Add a new mood key and use it in a scene's `music` field.

One-shot sound effects are in `playSfx(name)`: `talk`, `confirm`, `click`, `hit`, `miss`, `success`, `fail`, `chapter`, `snow`. Keep click SFX sparse; the game currently uses them only for meaningful confirmations.

### 7.7 Tune the rhythm difficulty

In `js/rhythm.js`:

```js
const PATTERNS = {
  0: [ ... ],   // easy: pairs
  1: [ ... ],   // normal: quarter/eighth mixtures
  2: [ ... ]    // finale: denser syncopation
};
```

Each pattern is a list of note offsets inside a bar, where `0.5` means an eighth note after the beat. Lane assignment is deterministic from the performance ID, so a chart stays stable between retries.

A performance is configured at its call site in `js/story.js`:

```js
const result = await game.startRhythm({
  id: 'movie-life-swing',
  title: 'MOVIE LIFE SWING',
  bpm: 144,
  bars: 12,
  difficulty: 2,     // 0, 1, or 2
  pass: 0.54,        // 0.54 = 54% accuracy needed
  mood: 'stage',     // music mood
  intro: 'Keep going, even when your hands shake.'
});
```

The function resolves with:

```js
{
  passed: true,
  skipped: false,
  stats: { perfect, good, ok, miss, maxCombo, total }
}
```

Use `result` to branch the following dialogue (the ending does this).

### 7.8 Change the layout and UI

`css/style.css` contains the whole interface. Useful areas:

- `#hud` and `.objective-pill` — chapter/objective display.
- `#dialogue` — dialogue card and portrait.
- `#touchControls` — joystick and action button.
- `#chapterCard` — chapter transition card.
- `.modal` — result and help modals.
- `#ending` — ending screen.
- Responsive rules at the bottom handle narrow phones and landscape.

The title screen is drawn on the Canvas by `Game.drawTitle()` in `js/game.js`. It is intentionally textless.

### 7.9 Debug entry point

Skip the title screen and jump straight to a story beat:

```text
index.html?debug=1&scene=town&step=c3_find_ozawa
index.html?debug=1&scene=hall&step=c4_hall
index.html?debug=1&scene=classroom&step=c1_talk_ozawa
```

Query parameters:

- `debug=1` — enable debug start (required).
- `scene` — one of the scene IDs listed above; defaults to `classroom`.
- `step` — a step key from `OBJECTIVES`; defaults to an empty step.
- `season` — optional override: `summer`, `autumn`, or `winter`.

The debug start also starts muted, so screenshots and automated tests do not depend on audio. In the browser console, `window.movieLife` is the live game instance:

```js
movieLife.player.x = 800; movieLife.player.y = 800;
movieLife.setStep('c3_buy_sax');
movieLife.finishStory({ passed: true });
```

This is useful for testing art, skip logic, or the ending. It is not intended as a cheat menu for normal play.

---

## 8. How it works (short version)

- **Game loop:** `game.js` runs a `requestAnimationFrame` loop. It updates input, player movement, camera, weather, entities, and animations, then draws the world and UI.
- **World:** top-down 2D. Each scene has a world size, a spawn point, a background canvas, NPCs, props, and optional trigger zones.
- **Progression:** `story.js` is a small step machine. Each step defines which props/NPCs are `important`; interacting with them runs dialogue, rhythm performances, and transitions. `game.setStep()` rebuilds the scene so the next objectives appear.
- **Dialogue:** the game pauses movement while a dialogue array is open. Typewriter text, portraits, and speaker names are rendered by the DOM overlay.
- **Rhythm:** `rhythm.js` asks the audio engine for a scheduled song bus, builds a deterministic chart, compares note times to the audio clock, and judges hit windows. The result modal is DOM-based.
- **Audio:** `audio.js` creates a single `AudioContext` after the first input, schedules background music with lookahead, and keeps music, rhythm songs, and SFX on separate gain buses so songs can duck the BGM.
- **Mobile:** touch mode is detected from pointer/touch support. It shows a joystick and action button, supports tap-to-move, and lets the rhythm lanes be tapped directly.

---

## 9. Accessibility and compatibility notes

- The canvas has an ARIA label and the objective text is mirrored into a screen-reader live region.
- All story actions are available from the keyboard; pointer input is additive.
- Dialogue can be advanced with `E`, `Enter`, `Space`, or a tap.
- The help modal is reachable with `H` / `?` and closes with `Esc`.
- Very narrow screens (≤ 500 px) use a compact HUD and larger touch targets.
- `prefers-reduced-motion` is respected in CSS for UI animations where possible. Canvas weather still animates because it is part of the scene art.
- Audio starts only after the first user gesture, as required by browser autoplay policies. If the browser blocks audio, the game continues silently.

### Troubleshooting

- **No sound:** click or press a key once, check the speaker icon, and make sure the browser tab is not muted. Some headless/remote environments have no audio device; the game intentionally continues without blocking.
- **Keyboard does nothing:** click the game canvas once to give it focus.
- **Scene looks empty:** make sure you are on the expected step; use the objective pill or the debug URL above.
- **Stuck after a performance:** the result card should offer “Continue”, “Try again”, or “Skip for now”. If a button seems unresponsive, click the card first, then the button.
- **Opening from `file://`:** supported, but if a browser blocks SVG favicons or audio, use the local server command in section 1.

---

## 10. Design notes and credits

- **Game name:** *Movie Life*.
- **Source inspiration:** *Swing Girls* (スウィングガールズ, 2004), directed by Shinobu Yaguchi.
- **Story adaptation:** the game follows the film's major beats (summer school, the bento disaster, the substitute band, Ozawa's jazz lessons, the supermarket gig, the missed entry, the snowbound train, and the winter concert), but the dialogue is newly written and simplified for a short game.
- **Art:** all characters, backgrounds, the favicon, and the poster are original code-drawn Canvas/SVG fan art. No film stills, no external sprites, no copyrighted images.
- **Audio:** all background music and sound effects are synthesized live with the Web Audio API. No audio files and no copyrighted recordings are included.
- **Engine:** plain JavaScript, Canvas 2D, DOM overlays, CSS. No dependencies.
- **Save system:** intentionally absent, per the design brief. Reloading starts a fresh story.

This is a small fan tribute, not an official adaptation. If you share or modify it, keep the fan-project spirit and do not add copyrighted film or music assets.
