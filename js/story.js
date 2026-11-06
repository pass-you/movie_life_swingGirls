/* ============================================================
   Movie Life — Story
   A playable, original adaptation of the main beats of
   Swing Girls (2004). All dialogue is newly written.
   ============================================================ */
(function () {
  'use strict';

  const OBJECTIVES = {
    c1_talk_ozawa: 'Talk to Mr. Ozawa',
    c1_get_bentos: 'Take the bento boxes by the door',
    c1_board_train: 'Board the train',
    c1_eat_bento: 'Open a bento box',
    c1_sleep: 'Sit down and rest',
    c1_run_field: 'Run to the baseball field',
    c1_reach_field: 'Reach the baseball field',
    c2_talk_takuo: 'Talk to Takuo',
    c2_pick_instrument: 'Choose an instrument',
    c2_practice: 'Practice with the band',
    c3_buy_sax: 'Visit the music shop',
    c3_find_ozawa: 'Find Ozawa-sensei',
    c3_ask_ozawa: 'Follow Ozawa-sensei home',
    c3_camp: 'Meet everyone at the camp',
    c3_practice: 'Practice with Ozawa',
    c3_gig: 'Play the supermarket gig',
    c3_done: 'Mail the festival entry',
    c4_station: 'Meet everyone at the station',
    c4_board_train: 'Board the train',
    c4_talk_takuo: 'Talk to Takuo',
    c4_play_train: 'Play something on the train',
    c4_hall: 'Take the stage'
  };

  const CHAPTER_LABELS = {
    1: 'PART I · SUMMER',
    2: 'PART II · THE SUBSTITUTE BAND',
    3: 'PART III · AUTUMN JAZZ',
    4: 'PART IV · WINTER CONCERT'
  };

  /* ---------------- dialogue helpers ---------------- */
  const N = (text, fx) => ({ who: null, text, fx });
  const L = (who, text, expr, fx) => ({ who, text, expr: expr || 'neutral', fx });

  function marker(ctx, x, y, t, color, big) {
    const r = (big ? 34 : 26) + Math.sin(t * 3.2) * 3;
    ctx.save();
    ctx.strokeStyle = color || 'rgba(243,184,75,.78)';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 8]);
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * 0.45, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = color || '#f3b84b';
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function iconBubble(ctx, x, y, text, color) {
    const pulse = 1 + Math.sin(performance.now() / 260) * 0.06;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(pulse, pulse);
    ctx.fillStyle = color || '#f3b84b';
    ctx.strokeStyle = '#5b3a0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#4a2b08';
    ctx.font = '900 16px "Trebuchet MS", "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 0, 1);
    ctx.restore();
  }

  /* ---------------- scene definitions ---------------- */
  const SCENES = {
    classroom: {
      world: { w: 1600, h: 1000 },
      spawn: { x: 800, y: 880 },
      bg: 'classroom',
      music: 'summer',
      setup(game) {
        game.addNPC({
          id: 'ozawa', char: 'ozawa', x: 805, y: 470, dir: 'down', expr: 'neutral',
          important: () => game.step === 'c1_talk_ozawa',
          onInteract: async () => {
            if (game.step === 'c1_talk_ozawa') {
              await game.say([
                N('Yamagata, summer 2004. The cicadas are loud. Summer school is louder.'),
                L('ozawa', 'Page forty-two. If a train leaves Yamagata at noon and travels east at sixty kilometers per hour...', 'neutral'),
                L('tomoko', '...I am going to melt.', 'sad'),
                L('yoshie', 'Tomoko. The brass band left for the baseball game. Without their bento boxes.', 'surprised'),
                L('naomi', 'If somebody delivers them, that somebody gets out of math.', 'happy'),
                L('tomoko', 'Mr. Ozawa! Someone has to take the lunches to the ballpark!', 'determined'),
                L('ozawa', '...Fine. Take the boxes. Go straight there. No detours.', 'neutral')
              ]);
              game.setStep('c1_get_bentos');
              game.toast('New objective: take the bento boxes');
            } else {
              await game.say([
                L('ozawa', 'The door is that way. The bento boxes are that way. Math is everywhere.', 'neutral')
              ]);
            }
          }
        });

        game.addNPC({
          id: 'yoshie', char: 'yoshie', x: 520, y: 690, dir: 'down', expr: 'happy',
          instrument: 'trumpet',
          onInteract: async () => {
            if (game.step === 'c1_get_bentos') {
              await game.say([
                L('yoshie', 'Forty lunches. Forty chances to escape quadratic equations.', 'happy'),
                L('tomoko', 'You are a genius.', 'happy')
              ]);
            } else {
              await game.say([
                L('yoshie', 'Do you understand any of this?', 'sad'),
                L('tomoko', 'I understand that the window is open.', 'neutral')
              ]);
            }
          }
        });

        game.addNPC({
          id: 'naomi', char: 'naomi', x: 1110, y: 690, dir: 'left', expr: 'happy',
          instrument: 'drumsticks',
          onInteract: async () => {
            await game.say([
              L('naomi', 'I can hear the baseball game from here. Or maybe that is my stomach.', 'neutral'),
              L('tomoko', 'Both. Definitely both.', 'happy')
            ]);
          }
        });

        game.addNPC({
          id: 'kaori', char: 'kaori', x: 920, y: 820, dir: 'left', expr: 'shy',
          onInteract: async () => {
            await game.say([
              L('kaori', 'I... I brought an extra pencil. In case the first one gets tired.', 'shy'),
              L('tomoko', 'Kaori, that is the most prepared anyone has ever been for summer school.', 'happy')
            ]);
          }
        });

        if (game.step === 'c1_get_bentos') {
          game.addProp({
            id: 'bentos', x: 1450, y: 790, radius: 85, important: true,
            draw(ctx, x, y, t) {
              marker(ctx, x, y, t, 'rgba(243,184,75,.82)', true);
              // stack of bento boxes
              ctx.save();
              ctx.translate(x, y);
              for (let i = 0; i < 4; i++) {
                ctx.fillStyle = i % 2 ? '#8e5734' : '#a36b40';
                ctx.strokeStyle = '#5a341e';
                ctx.lineWidth = 2;
                ctx.fillRect(-25 + i * 2, -8 - i * 12, 50 - i * 4, 9);
                ctx.strokeRect(-25 + i * 2, -8 - i * 12, 50 - i * 4, 9);
              }
              ctx.fillStyle = '#f8ecd2';
              ctx.fillRect(-19, -48, 43, 6);
              ctx.restore();
              iconBubble(ctx, x, y - 83, '!', '#ffd36a');
            },
            onInteract: async () => {
              await game.say([
                L('tomoko', 'Forty bento boxes. Warm. Heavy. Ours.', 'happy'),
                L('naomi', 'Last one to the station buys melon soda!', 'happy'),
                N('The girls carry the lunches out into the blinding summer sun.')
              ]);
              await game.transitionTo('station', { spawn: { x: 390, y: 790 }, step: 'c1_board_train' });
              await game.say([
                N('The station clock says 11:48. The train leaves in two minutes.'),
                L('yoshie', 'We have plenty of time.', 'happy'),
                L('tomoko', 'That is exactly what people say right before they do not have plenty of time.', 'neutral')
              ]);
            }
          });
        }
      }
    },

    station: {
      world: { w: 1800, h: 1000 },
      spawn: { x: 390, y: 790 },
      bg: 'station',
      season: 'summer',
      music: 'summer',
      setup(game) {
        game.addNPC({
          id: 'yoshie', char: 'yoshie', x: 600, y: 760, dir: 'right', expr: 'happy',
          instrument: 'trumpet',
          onInteract: async () => {
            await game.say([
              L('yoshie', 'I have never delivered anything in my life. I feel extremely responsible.', 'happy')
            ]);
          }
        });
        game.addNPC({
          id: 'naomi', char: 'naomi', x: 1280, y: 760, dir: 'left', expr: 'happy',
          instrument: 'drumsticks',
          onInteract: async () => {
            await game.say([
              L('naomi', 'Do you think the baseball players will share their victory snacks?', 'happy'),
              L('tomoko', 'We are delivering their lunch, Naomi.', 'neutral')
            ]);
          }
        });
        if (game.step === 'c1_board_train') {
          game.addProp({
            id: 'trainDoor', x: 900, y: 545, radius: 100, important: true,
            draw(ctx, x, y, t) {
              marker(ctx, x, y, t, 'rgba(243,184,75,.9)', true);
              iconBubble(ctx, x, y - 62, '→', '#ffd36a');
            },
            onInteract: async () => {
              await game.say([
                N('The doors close with a friendly hiss. The girls slide into the last empty seats.'),
                L('yoshie', 'Ballpark, here we come.', 'happy'),
                L('naomi', 'Wake me when we get there.', 'neutral'),
                N('The train pulls out of Yamagata Station.')
              ]);
              await game.transitionTo('train', { spawn: { x: 800, y: 610 }, step: 'c1_eat_bento' });
              await game.say([
                N('The carriage sways. Rice fields scroll past the windows. The bento boxes sit on the seat, warm and deeply tempting.'),
                L('tomoko', 'We should not eat the band\'s lunch.', 'neutral'),
                L('naomi', 'We should absolutely not eat the band\'s lunch.', 'happy'),
                L('yoshie', 'One box. Just to check the quality.', 'happy')
              ]);
            }
          });
        }
      }
    },

    train: {
      world: { w: 1600, h: 800 },
      spawn: { x: 800, y: 610 },
      bg: 'train',
      season: 'summer',
      music: 'train',
      effects: 'train',
      setup(game) {
        game.addNPC({ id: 'yoshie', char: 'yoshie', x: 1120, y: 610, dir: 'left', expr: 'neutral', instrument: 'trumpet' });
        game.addNPC({ id: 'naomi', char: 'naomi', x: 1280, y: 610, dir: 'left', expr: 'neutral', instrument: 'drumsticks' });
        game.addProp({
          id: 'bentoSeat', x: 520, y: 520, radius: 80, important: () => game.step === 'c1_eat_bento',
          draw(ctx, x, y, t) {
            if (game.step === 'c1_eat_bento') {
              marker(ctx, x, y, t, 'rgba(243,184,75,.85)', true);
              iconBubble(ctx, x, y - 58, '!', '#ffd36a');
            }
            ctx.save();
            ctx.translate(x, y);
            ctx.fillStyle = '#7d4a2c';
            ctx.strokeStyle = '#4a2a17';
            ctx.lineWidth = 2;
            ctx.fillRect(-22, -13, 44, 26);
            ctx.strokeRect(-22, -13, 44, 26);
            ctx.fillStyle = '#f2d49a';
            ctx.fillRect(-17, -9, 34, 17);
            ctx.fillStyle = '#d9534f';
            ctx.beginPath();
            ctx.arc(0, 0, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          },
          onInteract: async () => {
            if (game.step !== 'c1_eat_bento') return;
            await game.say([
              L('tomoko', 'The lid is already open. That is practically an invitation.', 'shy'),
              L('yoshie', 'It is not extra. It is destiny.', 'happy'),
              N('The girls share one bento. It tastes like freedom, pickled plum, and slightly warm rice.'),
              L('naomi', 'Okay. We should probably check the station map now.', 'neutral'),
              L('tomoko', 'Probably.', 'neutral'),
              N('Nobody checks the station map.')
            ]);
            game.setStep('c1_sleep');
          }
        });
        game.addProp({
          id: 'seat', x: 1050, y: 585, radius: 80, important: () => game.step === 'c1_sleep',
          draw(ctx, x, y, t) {
            if (game.step === 'c1_sleep') {
              marker(ctx, x, y, t, 'rgba(243,184,75,.85)', true);
              iconBubble(ctx, x, y - 58, 'z', '#ffd36a');
            }
          },
          onInteract: async () => {
            if (game.step !== 'c1_sleep') return;
            await game.say([
              L('naomi', 'Five more minutes...', 'neutral'),
              N('The train rocks. One minute becomes twenty. The station sign blurs past the window.'),
              L('tomoko', 'Wait. Was that our stop?', 'surprised'),
              L('yoshie', 'Was that our stop?', 'surprised'),
              L('naomi', 'Was that our stop?!', 'surprised'),
              N('It was their stop.')
            ]);
            game.fx.shake = 0.5;
            await game.wait(500);
            await game.transitionTo('ricefield', { spawn: { x: 170, y: 790 }, step: 'c1_run_field' });
            await game.say([
              N('Two kilometres back, the road runs between rice paddies. The bento boxes are not getting any cooler.'),
              L('tomoko', 'If we run, we can still make it before the game ends.', 'determined'),
              L('yoshie', 'If we run, I will require a second lunch.', 'sad')
            ]);
          }
        });
      }
    },

    ricefield: {
      world: { w: 2200, h: 1100 },
      spawn: { x: 170, y: 790 },
      bg: 'ricefield',
      music: 'summer',
      effects: 'summer',
      setup(game) {
        if (game.step === 'c1_run_field' || game.step === 'c1_reach_field') {
          game.addZone({
            id: 'paddy',
            x: 880, y: 720, w: 250, h: 210, once: true,
            onEnter: async () => {
              if (game.flags.slipped) return;
              game.flags.slipped = true;
              game.fx.shake = 0.7;
              await game.say([
                N('The path is slick. Tomoko\'s shoe finds the mud.'),
                L('tomoko', 'The bentos!', 'surprised'),
                N('The boxes tumble into the paddy. The paddy does not care.'),
                L('yoshie', 'They are... muddy. And warm. And muddy.', 'sad'),
                L('naomi', 'Maybe nobody will notice?', 'shy'),
                L('tomoko', 'Let us run before we think about it.', 'determined')
              ]);
              game.setStep('c1_reach_field');
            }
          });
          game.addZone({
            id: 'fieldGate',
            x: 1990, y: 470, w: 220, h: 400, once: true,
            onEnter: async () => {
              await game.say([
                N('At the ballpark, the brass band opens the bento boxes. Ten minutes later, the dugout is empty.'),
                N('An ambulance arrives. Then another. The baseball team wins the game. The band loses everything else.'),
                L('itami', 'Food poisoning. The entire band. I have never seen anything like it.', 'sad'),
                L('takuo', 'You did this.', 'angry'),
                L('tomoko', 'We can explain—', 'surprised'),
                L('takuo', 'The game is tomorrow. Someone has to play. You are the band now.', 'angry'),
                L('yoshie', 'We do not play anything!', 'surprised'),
                L('takuo', 'Perfect. You will fit right in.', 'neutral')
              ]);
              game.setChapter(2);
              await game.showChapterCard('II', 'The Substitute Band', 'Two weeks until the baseball game');
              await game.transitionTo('musicroom', { spawn: { x: 800, y: 880 }, step: 'c2_talk_takuo', season: 'summer' });
              await game.say([
                N('The music room smells like brass polish and panic. Takuo stands beside a cymbal, holding a list of names.'),
                L('takuo', 'You owe me a band. I found six of you. That is enough for a big band. Barely.', 'neutral'),
                L('tomoko', 'We do not even know which end of a saxophone is which.', 'sad')
              ]);
            }
          });
        }
      }
    },

    musicroom: {
      world: { w: 1600, h: 1000 },
      spawn: { x: 800, y: 880 },
      bg: 'musicroom',
      season: 'summer',
      music: 'summer',
      setup(game) {
        game.addNPC({
          id: 'takuo', char: 'takuo', x: 800, y: 405, dir: 'down', expr: game.step === 'c2_talk_takuo' ? 'angry' : 'neutral',
          instrument: 'cymbal', important: () => game.step === 'c2_talk_takuo',
          onInteract: async () => {
            if (game.step === 'c2_talk_takuo') {
              await game.say([
                L('takuo', 'Listen. The real band is in the hospital. The baseball team still needs an anthem.', 'neutral'),
                L('tomoko', 'We are not a band.', 'sad'),
                L('takuo', 'Then become one. You, Yoshie, Naomi, Kaori, and two more. Big band jazz.', 'determined'),
                L('kaori', 'I... I can try the trombone.', 'shy'),
                L('naomi', 'Drums! I hit things when I am nervous.', 'happy'),
                L('yoshie', 'Trumpet. It looks shiny.', 'happy'),
                L('takuo', 'Tomoko, what about you?', 'neutral'),
                L('tomoko', 'The saxophone. It looks like it knows a secret.', 'determined'),
                L('takuo', 'Fine. Grab one. Do not drop it.', 'neutral')
              ]);
              game.setStep('c2_pick_instrument');
            } else {
              await game.say([
                L('takuo', 'In jazz, the rest is not silence. It is suspense.', 'neutral')
              ]);
            }
          }
        });

        game.addNPC({ id: 'yoshie', char: 'yoshie', x: 470, y: 690, dir: 'right', expr: 'happy', instrument: 'trumpet' });
        game.addNPC({ id: 'naomi', char: 'naomi', x: 1090, y: 700, dir: 'left', expr: 'happy', instrument: 'drumsticks' });
        game.addNPC({ id: 'kaori', char: 'kaori', x: 720, y: 790, dir: 'right', expr: 'shy', instrument: 'trombone' });

        if (game.step === 'c2_pick_instrument') {
          game.addProp({
            id: 'instrumentRack', x: 1380, y: 640, radius: 100, important: true,
            draw(ctx, x, y, t) {
              marker(ctx, x, y, t, 'rgba(243,184,75,.88)', true);
              // sax silhouette leaning on a stand
              ctx.save();
              ctx.translate(x, y);
              ctx.strokeStyle = '#f0b64c';
              ctx.lineWidth = 9;
              ctx.lineCap = 'round';
              ctx.beginPath();
              ctx.moveTo(-12, -90);
              ctx.bezierCurveTo(-20, -45, 6, -20, 24, -5);
              ctx.stroke();
              ctx.fillStyle = '#f0b64c';
              ctx.beginPath();
              ctx.ellipse(27, -3, 19, 10, 0.35, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
              iconBubble(ctx, x, y - 118, '♪', '#ffd36a');
            },
            onInteract: async () => {
              await game.say([
                L('tomoko', 'The saxophone is heavier than it looks. Cool metal, warm in her hands.', 'neutral'),
                L('takuo', 'That one has character. And a dent. Mostly character.', 'neutral'),
                L('tomoko', 'Okay. First note. How hard can it be?', 'determined')
              ]);
              game.player.hasSax = true;
              game.setStep('c2_practice');
              game.toast('You got a saxophone');
            }
          });
        }

        if (game.step === 'c2_practice') {
          game.addProp({
            id: 'practiceStand', x: 430, y: 650, radius: 100, important: true,
            draw(ctx, x, y, t) {
              marker(ctx, x, y, t, 'rgba(243,184,75,.9)', true);
              ctx.strokeStyle = '#3c3c47';
              ctx.lineWidth = 4;
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(x, y - 72);
              ctx.moveTo(x - 25, y);
              ctx.lineTo(x + 25, y);
              ctx.stroke();
              ctx.fillStyle = '#f7eed9';
              ctx.strokeStyle = '#3c3c47';
              ctx.lineWidth = 3;
              ctx.fillRect(x - 27, y - 98, 54, 30);
              ctx.strokeRect(x - 27, y - 98, 54, 30);
              ctx.fillStyle = '#7a6a55';
              for (let i = 0; i < 3; i++) {
                ctx.fillRect(x - 19, y - 90 + i * 8, 38, 2);
              }
              iconBubble(ctx, x, y - 140, '♪', '#ffd36a');
            },
            onInteract: async () => {
              await game.say([
                L('takuo', 'Breathe from your stomach. Press the keys. Blow.', 'neutral'),
                L('tomoko', 'That is three things. I can do one thing.', 'sad'),
                N('The first sound is somewhere between a goose and a bicycle pump.')
              ]);
              const result = await game.startRhythm({
                id: 'first-notes', title: 'FIRST NOTES', bpm: 108, bars: 6,
                difficulty: 0, pass: 0.48, mood: 'summer',
                intro: 'Press D F J K (or tap the lanes) when the notes reach the line.'
              });
              if (result.skipped) {
                await game.say([
                  L('takuo', 'That was not music. But it was a sound. We can work with a sound.', 'neutral')
                ]);
              } else {
                await game.say([
                  L('takuo', 'That was almost a note. Do it again, together.', 'happy'),
                  N('They practise until the sun goes down. It is awful. It is also theirs.')
                ]);
              }
              await game.say([
                N('Day after day, the same four notes. Then one afternoon, the door opens.'),
                L('itami', 'Thank you for covering. The band is back on its feet. We can take it from here.', 'happy'),
                N('The girls return their instruments. Takuo takes back his cymbal. Nobody says much.'),
                L('yoshie', 'So that is it?', 'sad'),
                L('tomoko', 'That is it.', 'sad'),
                N('Outside the school gate, Tomoko cries. Then Yoshie. Then Naomi. Then Kaori. The autumn wind carries the sound away.')
              ]);
              game.setChapter(3);
              await game.showChapterCard('III', 'Autumn Jazz', 'The band is gone. The sound is not.');
              await game.transitionTo('town', { spawn: { x: 260, y: 860 }, step: 'c3_buy_sax' });
              await game.say([
                N('Autumn. The music room is quiet. Tomoko\'s fingers still remember the keys.'),
                L('tomoko', 'One saxophone. Just one. Then I will stop thinking about it.', 'determined')
              ]);
            }
          });
        }
      }
    },

    town: {
      world: { w: 2300, h: 1100 },
      spawn: { x: 260, y: 860 },
      bg: 'town',
      music: 'autumn',
      effects: 'autumn',
      setup(game) {
        game.addNPC({
          id: 'shopkeep', char: 'shopkeep', x: 415, y: 690, dir: 'down', expr: 'happy',
          important: () => game.step === 'c3_buy_sax',
          onInteract: async () => {
            if (game.step === 'c3_buy_sax') {
              await game.say([
                L('shopkeep', 'That sax? Used. It has character. And a dent.', 'happy'),
                L('tomoko', 'I will take it. I will pay you back. Somehow.', 'determined'),
                L('shopkeep', 'Practice here anytime. Just do not play before nine.', 'happy')
              ]);
              game.player.hasSax = true;
              game.flags.ownsSax = true;
              game.setStep('c3_find_ozawa');
              game.toast('You bought a saxophone');
            } else {
              await game.say([
                L('shopkeep', 'You are back. The sax is yours. The neighbours are not so sure.', 'happy')
              ]);
            }
          }
        });

        game.addNPC({ id: 'yoshie', char: 'yoshie', x: 700, y: 820, dir: 'right', expr: 'happy', instrument: 'trumpet' });
        game.addNPC({ id: 'naomi', char: 'naomi', x: 850, y: 850, dir: 'left', expr: 'happy', instrument: 'drumsticks' });
        game.addNPC({ id: 'kaori', char: 'kaori', x: 980, y: 820, dir: 'left', expr: 'shy', instrument: 'trombone' });

        if (game.step === 'c3_buy_sax') {
          game.addProp({
            id: 'musicShop', x: 430, y: 670, radius: 100, important: true,
            draw(ctx, x, y, t) {
              marker(ctx, x, y, t, 'rgba(243,184,75,.85)', true);
              iconBubble(ctx, x, y - 86, '♪', '#ffd36a');
            },
            onInteract: async () => {
              await game.say([
                L('tomoko', 'A saxophone in the window. Real. Expensive. Looking directly at me.', 'surprised')
              ]);
              game.toast('Talk to the shop owner');
            }
          });
        }

        if (game.step === 'c3_find_ozawa') {
          game.addNPC({
            id: 'ozawaSpot', char: 'ozawa', x: 1570, y: 760, dir: 'down', expr: 'surprised',
            instrument: 'record', important: true, note: true,
            onInteract: async () => {
              await game.say([
                L('tomoko', 'Mr. Ozawa? You are the man from the record shop! You know jazz!', 'surprised'),
                L('ozawa', 'I do not know what you are talking about.', 'surprised'),
                N('He hurries away, dropping a jazz record. It rolls to Tomoko\'s feet.'),
                L('tomoko', 'He is running home! Follow him!', 'determined')
              ]);
              game.setStep('c3_ask_ozawa');
              game.toast('Follow Ozawa-sensei home');
            }
          });
        }

        if (game.step === 'c3_ask_ozawa') {
          game.addProp({
            id: 'ozawaHouse', x: 1950, y: 680, radius: 110, important: true,
            draw(ctx, x, y, t) {
              marker(ctx, x, y, t, 'rgba(243,184,75,.9)', true);
              iconBubble(ctx, x, y - 92, '!', '#ffd36a');
            },
            onInteract: async () => {
              await game.say([
                L('ozawa', 'You followed me home.', 'surprised'),
                L('tomoko', 'Teach us jazz. Please.', 'determined'),
                L('ozawa', 'I am a math teacher.', 'neutral'),
                L('yoshie', 'But your house is full of records!', 'happy'),
                L('ozawa', 'That is... arithmetic.', 'shy'),
                L('tomoko', 'We want to play. We just do not know how.', 'sad'),
                L('ozawa', 'Mountain lodge. Saturday. Bring your instruments. And your lungs.', 'determined')
              ]);
              game.setStep('c3_camp');
              game.toast('Meet everyone at the camp');
            }
          });
        }

        if (game.step === 'c3_camp') {
          game.addProp({
            id: 'campBus', x: 2225, y: 780, radius: 100, important: true,
            draw(ctx, x, y, t) {
              marker(ctx, x, y, t, 'rgba(243,184,75,.85)', true);
              iconBubble(ctx, x, y - 84, '→', '#ffd36a');
            },
            onInteract: async () => {
              await game.say([
                N('The battered van climbs into the mountains. Everyone is packed in with instruments and rice crackers.'),
                L('naomi', 'Is this seat belt supposed to make that noise?', 'surprised'),
                L('ozawa', 'It is jazz. Everything makes a noise.', 'neutral')
              ]);
              await game.transitionTo('camp', { spawn: { x: 300, y: 860 }, step: 'c3_practice', season: 'autumn' });
              await game.say([
                N('The lodge smells of wood smoke and beginner\'s ambition.'),
                L('ozawa', 'Jazz is not loud. Jazz is a conversation. Now make a very bad noise together.', 'determined')
              ]);
            }
          });
        }

        if (game.step === 'c3_gig') {
          game.addProp({
            id: 'gigStage', x: 1390, y: 760, radius: 120, important: true,
            draw(ctx, x, y, t) {
              marker(ctx, x, y, t, 'rgba(243,184,75,.95)', true);
              iconBubble(ctx, x, y - 96, '♪', '#ffd36a');
            },
            onInteract: async () => {
              await game.say([
                L('announcer', 'Ladies and gentlemen, please welcome... the Swing Girls!', 'happy'),
                L('tomoko', 'We are on.', 'determined'),
                N('The supermarket crowd stops shopping. A few people even put down their baskets.')
              ]);
              const result = await game.startRhythm({
                id: 'supermarket-swing', title: 'SUPERMARKET SWING', bpm: 136, bars: 8,
                difficulty: 1, pass: 0.54, mood: 'stage',
                intro: 'Keep the beat. The crowd is listening.'
              });
              if (result.skipped) {
                await game.say([
                  N('The performance wobbles. The crowd claps anyway, mostly out of surprise.')
                ]);
              } else {
                await game.say([
                  N('The crowd claps. A woman drops her shopping list. A child dances near the turnips.'),
                  L('yoshie', 'They liked us!', 'happy'),
                  L('naomi', 'We are famous in this supermarket!', 'happy')
                ]);
              }
              await game.say([
                N('Three girls from the old brass band push through the crowd, carrying shiny new instruments.'),
                L('itami', 'There is a winter music festival in the city. You should enter.', 'happy'),
                L('takuo', 'The Swing Girls and a Boy.', 'happy'),
                L('tomoko', 'We will need an entry form.', 'determined')
              ]);
              game.setChapter(4);
              await game.showChapterCard('IV', 'Winter Concert', 'Snow falls on Yamagata. The festival is one week away.');
              await game.transitionTo('schoolyard', { spawn: { x: 310, y: 850 }, step: 'c3_done', season: 'winter' });
              await game.say([
                N('The entry form sits in Tomoko\'s bag for three weeks. It is still there.'),
                L('tomoko', 'I will mail it. Today. Definitely today.', 'shy')
              ]);
            }
          });
        }
      }
    },

    camp: {
      world: { w: 1800, h: 1100 },
      spawn: { x: 300, y: 860 },
      bg: 'camp',
      music: 'autumn',
      effects: 'autumn',
      setup(game) {
        game.addNPC({ id: 'ozawa', char: 'ozawa', x: 870, y: 570, dir: 'down', expr: 'determined', note: true });
        game.addNPC({ id: 'yoshie', char: 'yoshie', x: 600, y: 790, dir: 'right', expr: 'happy', instrument: 'trumpet' });
        game.addNPC({ id: 'naomi', char: 'naomi', x: 1030, y: 790, dir: 'left', expr: 'happy', instrument: 'drumsticks' });
        game.addNPC({ id: 'kaori', char: 'kaori', x: 780, y: 840, dir: 'right', expr: 'shy', instrument: 'trombone' });
        if (game.step === 'c3_practice') {
          game.addProp({
            id: 'campPractice', x: 900, y: 720, radius: 110, important: true,
            draw(ctx, x, y, t) {
              marker(ctx, x, y, t, 'rgba(243,184,75,.9)', true);
              iconBubble(ctx, x, y - 104, '♪', '#ffd36a');
            },
            onInteract: async () => {
              await game.say([
                L('ozawa', 'One, two, three, four. Not louder. Better.', 'determined'),
                L('tomoko', 'What is the difference?', 'neutral'),
                L('ozawa', 'You will know it when the audience stops checking their phones.', 'happy')
              ]);
              const result = await game.startRhythm({
                id: 'mountain-swing', title: 'MOUNTAIN SWING', bpm: 126, bars: 8,
                difficulty: 1, pass: 0.54, mood: 'autumn',
                intro: 'Stay with the band. Feel the swing.'
              });
              if (result.skipped) {
                await game.say([N('The notes stumble through the trees, but they keep going.')]);
              } else {
                await game.say([
                  N('The clearing fills with sound. A wild boar crashes out of the bushes.'),
                  L('naomi', 'A boar!', 'surprised'),
                  L('ozawa', 'Keep playing! Jazz does not stop for boars!', 'angry'),
                  N('The boar listens for a moment, then leaves. It has taste.')
                ]);
              }
              await game.say([
                L('ozawa', 'On Saturday, the supermarket is letting us play in the plaza. Do not embarrass the vegetables.', 'neutral')
              ]);
              game.setStep('c3_gig');
              await game.transitionTo('town', { spawn: { x: 1150, y: 900 }, step: 'c3_gig' });
              await game.say([
                N('Saturday. Autumn sun. A small stage between the supermarket and the music shop.'),
                L('takuo', 'The Swing Girls and a Boy. I am the boy.', 'happy'),
                L('tomoko', 'We know, Takuo.', 'happy')
              ]);
            }
          });
        }
      }
    },

    schoolyard: {
      world: { w: 1800, h: 1000 },
      spawn: { x: 310, y: 850 },
      bg: 'schoolyard',
      season: 'winter',
      music: 'winter',
      effects: 'snow',
      setup(game) {
        game.addNPC({ id: 'yoshie', char: 'yoshie', x: 620, y: 760, dir: 'down', expr: 'happy', instrument: 'trumpet' });
        game.addNPC({ id: 'naomi', char: 'naomi', x: 820, y: 800, dir: 'left', expr: 'happy', instrument: 'drumsticks' });
        game.addNPC({ id: 'kaori', char: 'kaori', x: 960, y: 770, dir: 'left', expr: 'shy', instrument: 'trombone' });
        if (game.step === 'c3_done') {
          game.addProp({
            id: 'mailbox', x: 1110, y: 730, radius: 95, important: true,
            draw(ctx, x, y, t) {
              marker(ctx, x, y, t, 'rgba(243,184,75,.9)', true);
              iconBubble(ctx, x, y - 96, '✉', '#ffd36a');
            },
            onInteract: async () => {
              await game.say([
                N('Tomoko holds the envelope over the slot. The cold makes her fingers slow.'),
                L('tomoko', 'If I mail it now, we make it. Probably.', 'determined'),
                N('The letter slides into the box. Across town, a festival desk stamps it: APPLICATIONS CLOSED YESTERDAY.'),
                L('tomoko', '...I forgot.', 'sad'),
                L('tomoko', 'I will tell them. After the train. Maybe after the festival. Maybe never.', 'sad')
              ]);
              game.setStep('c4_station');
              game.toast('Meet everyone at the station');
            }
          });
        }
        if (game.step === 'c4_station') {
          game.addProp({
            id: 'toStation', x: 1635, y: 760, radius: 100, important: true,
            draw(ctx, x, y, t) {
              marker(ctx, x, y, t, 'rgba(243,184,75,.85)', true);
              iconBubble(ctx, x, y - 88, '→', '#ffd36a');
            },
            onInteract: async () => {
              await game.say([
                L('yoshie', 'Ready for the big day?', 'happy'),
                L('tomoko', 'Y-yeah. Totally.', 'shy'),
                L('naomi', 'You look like you swallowed a metronome.', 'neutral')
              ]);
              await game.transitionTo('stationWinter', { spawn: { x: 390, y: 790 }, step: 'c4_board_train' });
              await game.say([
                N('Snow falls over Yamagata Station. The train is late, then on time, then late again.'),
                L('kaori', 'The festival is going to be wonderful.', 'happy'),
                L('tomoko', '...Yes.', 'sad')
              ]);
            }
          });
        }
      }
    },

    stationWinter: {
      world: { w: 1800, h: 1000 },
      spawn: { x: 390, y: 790 },
      bg: 'station',
      season: 'winter',
      music: 'winter',
      effects: 'snow',
      setup(game) {
        game.addNPC({ id: 'itami', char: 'itami', x: 640, y: 780, dir: 'right', expr: 'happy', instrument: 'record' });
        if (game.step === 'c4_board_train') {
          game.addProp({
            id: 'winterTrain', x: 900, y: 545, radius: 100, important: true,
            draw(ctx, x, y, t) {
              marker(ctx, x, y, t, 'rgba(243,184,75,.9)', true);
              iconBubble(ctx, x, y - 62, '→', '#ffd36a');
            },
            onInteract: async () => {
              await game.say([
                N('The train pushes through the snow. Inside, the windows fog with breath and nerves.'),
                L('takuo', 'Everyone has their part?', 'neutral'),
                L('yoshie', 'Yes.', 'happy'),
                L('kaori', 'Yes.', 'shy'),
                L('naomi', 'Yes!', 'happy'),
                L('tomoko', '...Yes.', 'sad')
              ]);
              await game.transitionTo('trainWinter', { spawn: { x: 800, y: 610 }, step: 'c4_talk_takuo' });
            }
          });
        }
      }
    },

    trainWinter: {
      world: { w: 1600, h: 800 },
      spawn: { x: 800, y: 610 },
      bg: 'train',
      season: 'winter',
      music: 'winter',
      effects: 'trainWinter',
      setup(game) {
        game.addNPC({ id: 'yoshie', char: 'yoshie', x: 1120, y: 610, dir: 'left', expr: 'happy', instrument: 'trumpet' });
        game.addNPC({ id: 'naomi', char: 'naomi', x: 1280, y: 610, dir: 'left', expr: 'happy', instrument: 'drumsticks' });
        if (game.step === 'c4_talk_takuo') {
          game.addNPC({
            id: 'takuo', char: 'takuo', x: 1010, y: 610, dir: 'left', expr: 'neutral',
            important: true,
            onInteract: async () => {
              await game.say([
                L('takuo', 'You have the confirmation letter, right?', 'neutral'),
                L('tomoko', '...', 'shy'),
                L('takuo', 'Tomoko.', 'surprised'),
                L('tomoko', 'I forgot to send it. We are not in the festival.', 'sad'),
                N('The carriage goes very quiet. The snow outside seems louder.'),
                L('yoshie', 'You forgot?', 'angry'),
                L('naomi', 'We practised all autumn!', 'angry'),
                L('kaori', 'I bought new reeds...', 'sad'),
                L('takuo', 'Then what are we doing on this train?', 'sad'),
                N('Somewhere in the car, a passenger\'s radio clicks on. A jazz tune drifts through the snow.'),
                L('yoshie', 'We came this far. Let us play.', 'determined')
              ]);
              game.setStep('c4_play_train');
              game.toast('Play something on the train');
            }
          });
        }
        if (game.step === 'c4_play_train') {
          game.addProp({
            id: 'radio', x: 700, y: 560, radius: 90, important: true,
            draw(ctx, x, y, t) {
              marker(ctx, x, y, t, 'rgba(243,184,75,.9)', true);
              ctx.save();
              ctx.translate(x, y - 30);
              ctx.fillStyle = '#6b4a33';
              ctx.strokeStyle = '#3e2b1d';
              ctx.lineWidth = 3;
              ctx.fillRect(-26, -18, 52, 36);
              ctx.strokeRect(-26, -18, 52, 36);
              ctx.fillStyle = '#f2e4c4';
              ctx.fillRect(-18, -11, 22, 14);
              ctx.fillStyle = '#c9913e';
              ctx.beginPath();
              ctx.arc(15, -4, 6, 0, Math.PI * 2);
              ctx.fill();
              ctx.strokeStyle = '#3e2b1d';
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(16, -18);
              ctx.lineTo(30, -34);
              ctx.stroke();
              ctx.restore();
              iconBubble(ctx, x, y - 82, '♪', '#ffd36a');
            },
            onInteract: async () => {
              await game.say([
                L('tomoko', 'If we cannot play in the hall, we can play here.', 'determined'),
                L('takuo', 'The conductor will throw us off the train.', 'neutral'),
                L('naomi', 'Then we will play fast.', 'happy')
              ]);
              const result = await game.startRhythm({
                id: 'snowbound-swing', title: 'SNOWBOUND SWING', bpm: 116, bars: 8,
                difficulty: 1, pass: 0.52, mood: 'train',
                intro: 'The carriage is your stage. Keep the beat.'
              });
              if (result.skipped) {
                await game.say([N('The song limps along, but the carriage starts to sway with it.')]);
              } else {
                await game.say([
                  N('The passengers look up. Someone taps a foot. Someone else hums. The train is still stuck, but nobody minds.'),
                  L('itami', 'That was you! I could hear it from the bus!', 'surprised')
                ]);
              }
              await game.say([
                N('A large coach pulls up beside the stopped train. Ms. Itami leans out of the door.'),
                L('itami', 'The East School cancelled because of the snow. There is an open slot. Get in!', 'determined'),
                L('takuo', 'We forgot our uniforms.', 'surprised'),
                L('tomoko', 'Who cares. Grab the instruments.', 'determined')
              ]);
              game.setStep('c4_hall');
              await game.transitionTo('hall', { spawn: { x: 800, y: 900 }, step: 'c4_hall', season: 'winter' });
              await game.say([
                N('The hall is full. The stage is bright. Somewhere in the audience, Ozawa is pretending not to cry.'),
                L('takuo', 'This is it.', 'determined'),
                L('tomoko', 'One song. Our song.', 'determined')
              ]);
            }
          });
        }
      }
    },

    hall: {
      world: { w: 1600, h: 1000 },
      spawn: { x: 800, y: 900 },
      bg: 'hall',
      music: 'stage',
      effects: 'stage',
      setup(game) {
        game.addNPC({ id: 'takuo', char: 'takuo', x: 560, y: 790, dir: 'right', expr: 'determined', instrument: 'cymbal' });
        game.addNPC({ id: 'yoshie', char: 'yoshie', x: 1040, y: 780, dir: 'left', expr: 'happy', instrument: 'trumpet' });
        game.addNPC({ id: 'naomi', char: 'naomi', x: 1220, y: 810, dir: 'left', expr: 'happy', instrument: 'drumsticks' });
        game.addNPC({ id: 'kaori', char: 'kaori', x: 880, y: 810, dir: 'right', expr: 'shy', instrument: 'trombone' });
        if (game.step === 'c4_hall') {
          game.addProp({
            id: 'mic', x: 790, y: 760, radius: 100, important: true,
            draw(ctx, x, y, t) {
              marker(ctx, x, y, t, 'rgba(243,184,75,.95)', true);
              ctx.strokeStyle = '#2f2a2a';
              ctx.lineWidth = 5;
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(x, y - 72);
              ctx.stroke();
              ctx.fillStyle = '#d7d2ca';
              ctx.strokeStyle = '#3b3540';
              ctx.lineWidth = 3;
              ctx.beginPath();
              ctx.ellipse(x, y - 82, 10, 14, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.stroke();
              iconBubble(ctx, x, y - 120, '♪', '#ffd36a');
            },
            onInteract: async () => {
              await game.say([
                L('takuo', 'Count us in.', 'determined'),
                L('tomoko', 'One, two... one, two, three, four!', 'determined')
              ]);
              const result = await game.startRhythm({
                id: 'movie-life-swing', title: 'MOVIE LIFE SWING', bpm: 144, bars: 12,
                difficulty: 2, pass: 0.54, mood: 'stage',
                intro: 'This is the one. Keep going, even when your hands shake.'
              });
              await game.say([
                N(result.passed
                  ? 'The first note is shaky. The second is sure. By the third, the whole hall is moving.'
                  : 'The last note wobbles. There is a terrible silence. Then the hall cheers anyway.'),
                L('ozawa', 'That is my class! I taught them that!', 'happy'),
                N('The lights go warm. The audience stands. Somewhere in the snow, a train is still waiting.'),
                N('Nobody is thinking about the timetable now.')
              ]);
              await game.finishStory(result);
            }
          });
        }
        // After the story is complete the scene remains for the ending backdrop.
      }
    }
  };

  const Story = {
    OBJECTIVES,
    CHAPTER_LABELS,
    scenes: SCENES,
    async begin(game) {
      game.setChapter(1);
      // Put the classroom on screen before the chapter card fades in, so the
      // card sits over the world instead of an empty black canvas.
      game.loadScene('classroom', { spawn: { x: 800, y: 880 } });
      game.setStep('c1_talk_ozawa');
      await game.showChapterCard('I', 'Summer School', 'Yamagata · 2004');
      await game.say([
        N('Yamagata, summer 2004. The cicadas are loud. Summer school is louder.'),
        L('tomoko', 'I am Tomoko. I have no special talents. I can sleep with my eyes open.', 'neutral'),
        L('yoshie', 'Tomoko. The brass band left without its lunch.', 'surprised'),
        L('naomi', 'This is our chance to escape math.', 'happy'),
        N('A saxophone is waiting somewhere in the future. Nobody knows it yet.')
      ]);
    }
  };

  window.Story = Story;
})();
