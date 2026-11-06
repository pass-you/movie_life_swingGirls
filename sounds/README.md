# Audio assets

This folder is intentionally **empty of audio files**.

All music and sound effects in *Movie Life* are synthesized at runtime with the **Web Audio API** in `js/audio.js`. There are no MP3s, WAVs, OGGs, or copyrighted recordings in the project.

## Why no files?

- The game stays fully self-contained and works from `file://`.
- There are no external asset downloads or licensing questions.
- The music can follow the story's mood and tempo without shipping multiple tracks.
- Rhythm charts use the audio clock directly, so the synthesized song and the notes stay in sync.

## What is synthesized

### Background music

`MOODS` in `js/audio.js` defines five moods:

| Mood | Tempo | Used in |
| --- | --- | --- |
| `summer` | 126 BPM | Classroom, station, train, rice fields |
| `autumn` | 104 BPM | Town, camp |
| `winter` | 88 BPM | Schoolyard, winter station, winter train |
| `stage` | 146 BPM | Concert hall and ending |
| `train` | 112 BPM | Snowbound train performance |

Each mood contains:

- a chord progression (`Dm7`, `G7`, `Cmaj7`, etc.),
- a MIDI-note melody,
- a swing ratio,
- separate volume levels for bass, chords, melody, and hi-hats.

The engine schedules notes ahead of time with a lookahead timer, using oscillators, gain envelopes, and filtered noise. Browsers may suspend audio in background tabs; the story itself keeps its state and continues when you return.

### Performance songs

During a rhythm game, `audio.startSong(...)` creates a dedicated song bus. It plays a count-in, a bass line, chord stabs, a melody, and percussion at the performance's BPM and bar count. `rhythm.js` reads the same audio clock to time notes, so the chart is tied to the music rather than to frame rate.

### Sound effects

`audio.playSfx(name)` synthesizes short one-shots:

`talk`, `confirm`, `click`, `hit`, `miss`, `success`, `fail`, `chapter`, `snow`.

Click-style SFX are used sparingly. Most feedback is musical or visual.

## Audio and browser policy

Browsers block audio until a user gesture. The game creates/resumes the `AudioContext` on the first click, tap, or key press. In environments without an audio device, the engine detects the failure and continues silently; the story never waits on audio.

Mute with **M** or the speaker button. Muting suspends the master gain without stopping the story.

## Adding your own audio (optional)

The project deliberately has no loader for audio files. If you want to add a recorded track:

1. Put the file in this folder, for example `sounds/theme.ogg`.
2. Create an `Audio` element or fetch/decode it with `AudioContext.decodeAudioData`.
3. Route it through `audio.master` (or a dedicated gain node) so mute and volume still work.
4. Start playback from a user gesture, not on page load.

For rhythm games, do **not** rely on `HTMLAudioElement.currentTime` for note timing if you can avoid it. Decode the buffer and schedule it with `AudioBufferSourceNode`; then use `audio.now()` as the clock. If you add a recorded song, update the relevant `startRhythm({...})` call in `js/story.js` and the chart generation in `js/rhythm.js`.

Keep any added audio royalty-free or original. The current soundtrack is entirely synthesized to avoid copyrighted material.
