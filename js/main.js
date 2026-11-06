/* ============================================================
   Movie Life — entry point
   ============================================================ */
(function () {
  'use strict';

  // Surface unexpected runtime errors instead of leaving a silent black screen.
  window.addEventListener('error', (e) => {
    console.error(e.error || e.message);
    let box = document.getElementById('errorOverlay');
    if (!box) {
      box = document.createElement('pre');
      box.id = 'errorOverlay';
      box.style.cssText = 'position:fixed;z-index:9999;inset:12px;margin:0;padding:16px;overflow:auto;background:#1b0d10;color:#ffb3b0;font:12px/1.5 monospace;border:2px solid #e15b5d;border-radius:10px;white-space:pre-wrap;';
      document.body.appendChild(box);
    }
    box.textContent = 'MOVIE LIFE ERROR\n\n' + (e.error && e.error.stack ? e.error.stack : e.message);
  });

  function boot() {
    const canvas = document.getElementById('game');
    if (!canvas) return;
    const game = new Game(canvas);
    window.movieLife = game;

    // A tiny developer/debug entry point:
    //   index.html?debug=1&scene=town&step=c3_buy_sax
    // It skips the title screen and is handy for checking art or story scenes.
    const params = new URLSearchParams(window.location.search);
    if (params.get('debug')) {
      game.debugStart(
        params.get('scene') || 'classroom',
        params.get('step') || '',
        params.get('season') || undefined
      );
    }

    game.render();
    game.startLoop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
