/* ==========================================================================
   scenery.js

   Demo artworks: public-domain masterworks given a pop screenprint treatment -
   flat colour separations, saturated non-naturalistic palettes, hard edges.

   Why this is clean. The source paintings are long out of copyright: Munch
   died 1944, Van Gogh 1890, Hokusai 1849. Warhol's own screenprints after them
   are NOT - those remain in copyright and are licensed by his foundation - so
   these are drawn from the public-domain originals rather than traced from his
   versions. Taking a public-domain masterwork and recolouring it is exactly
   what he did; the practice is fine, copying his particular prints is not.

   Drawn procedurally so there are no image files, no licensing questions, and
   it works offline. Palettes are deliberately kept bright: large dark areas
   compete with the black modules of the QR these sit behind.

   Each painter fills a square canvas, used for both the gallery thumbnail and
   the QR background.
   ========================================================================== */

(function (global) {
  'use strict';

  function makeCanvas(size) {
    var c = document.createElement('canvas');
    c.width = c.height = size;
    return c;
  }

  /* A band of colour with a wavy lower edge - the basic unit of the Munch sky */
  function wavyBand(ctx, s, yTop, yBot, amp, freq, phase, fill) {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(0, yTop);
    ctx.lineTo(s, yTop);
    for (var x = s; x >= 0; x -= s / 40) {
      ctx.lineTo(x, yBot + Math.sin(x / s * Math.PI * freq + phase) * amp);
    }
    ctx.closePath();
    ctx.fill();
  }

  /* --- 1. The Scream, after Munch --------------------------------------- */
  function screamAfterMunch(s) {
    var c = makeCanvas(s), ctx = c.getContext('2d');

    // sky: stacked wavy bands
    ctx.fillStyle = '#ffd60a';
    ctx.fillRect(0, 0, s, s);
    wavyBand(ctx, s, 0, s * 0.14, s * 0.035, 2.2, 0.4, '#ff5d00');
    wavyBand(ctx, s, 0, s * 0.26, s * 0.030, 2.6, 1.9, '#ff2d55');
    wavyBand(ctx, s, 0, s * 0.10, s * 0.022, 3.0, 0.9, '#ff8c00');

    // fjord
    wavyBand(ctx, s, s * 0.34, s * 0.52, s * 0.030, 2.0, 2.4, '#00b4d8');
    wavyBand(ctx, s, s * 0.34, s * 0.44, s * 0.026, 2.8, 0.2, '#48cae4');

    // land wedge behind the bridge
    ctx.fillStyle = '#7b2ff7';
    ctx.beginPath();
    ctx.moveTo(0, s * 0.56);
    ctx.lineTo(s * 0.62, s * 0.40);
    ctx.lineTo(s, s * 0.47);
    ctx.lineTo(s, s);
    ctx.lineTo(0, s);
    ctx.closePath();
    ctx.fill();

    // bridge: strong diagonal, the picture's spine
    ctx.fillStyle = '#f72585';
    ctx.beginPath();
    ctx.moveTo(0, s * 1.02);
    ctx.lineTo(0, s * 0.78);
    ctx.lineTo(s * 0.98, s * 0.40);
    ctx.lineTo(s, s * 0.52);
    ctx.lineTo(s * 0.30, s);
    ctx.closePath();
    ctx.fill();

    // railing
    ctx.strokeStyle = '#2b1a4a';
    ctx.lineWidth = Math.max(2, s * 0.012);
    ctx.beginPath();
    ctx.moveTo(0, s * 0.70);
    ctx.lineTo(s * 0.97, s * 0.355);
    ctx.stroke();
    ctx.lineWidth = Math.max(1.5, s * 0.008);
    for (var i = 0; i < 7; i++) {
      var t = i / 7, x = t * s * 0.97;
      ctx.beginPath();
      ctx.moveTo(x, s * (0.70 - t * 0.345));
      ctx.lineTo(x, s * (0.70 - t * 0.345) + s * 0.10);
      ctx.stroke();
    }

    // two distant figures
    ctx.fillStyle = '#2b1a4a';
    [[0.74, 0.44], [0.83, 0.40]].forEach(function (f) {
      ctx.beginPath();
      ctx.ellipse(s * f[0], s * f[1], s * 0.022, s * 0.055, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // the figure: wavy robe, bald oval head, hands at the cheeks
    ctx.fillStyle = '#4cc9f0';
    ctx.beginPath();
    ctx.moveTo(s * 0.30, s * 1.02);
    ctx.quadraticCurveTo(s * 0.20, s * 0.74, s * 0.30, s * 0.60);
    ctx.quadraticCurveTo(s * 0.37, s * 0.50, s * 0.41, s * 0.52);
    ctx.quadraticCurveTo(s * 0.50, s * 0.62, s * 0.49, s * 1.02);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffe066';
    ctx.beginPath();
    ctx.ellipse(s * 0.375, s * 0.455, s * 0.072, s * 0.098, 0.06, 0, Math.PI * 2);
    ctx.fill();

    // hands
    ctx.beginPath();
    ctx.ellipse(s * 0.295, s * 0.50, s * 0.030, s * 0.055, -0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(s * 0.455, s * 0.49, s * 0.030, s * 0.055, 0.35, 0, Math.PI * 2);
    ctx.fill();

    // hollow eyes, open mouth
    ctx.fillStyle = '#2b1a4a';
    ctx.beginPath();
    ctx.ellipse(s * 0.352, s * 0.432, s * 0.014, s * 0.021, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(s * 0.400, s * 0.430, s * 0.014, s * 0.021, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(s * 0.376, s * 0.505, s * 0.019, s * 0.034, 0, 0, Math.PI * 2);
    ctx.fill();
    return c;
  }

  /* --- 2. The Great Wave, after Hokusai --------------------------------- */
  function waveAfterHokusai(s) {
    var c = makeCanvas(s), ctx = c.getContext('2d');
    ctx.fillStyle = '#ffd60a';
    ctx.fillRect(0, 0, s, s);

    // Fuji
    ctx.fillStyle = '#7b2ff7';
    ctx.beginPath();
    ctx.moveTo(s * 0.52, s * 0.64);
    ctx.lineTo(s * 0.70, s * 0.40);
    ctx.lineTo(s * 0.88, s * 0.64);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#f1faee';
    ctx.beginPath();
    ctx.moveTo(s * 0.636, s * 0.485);
    ctx.lineTo(s * 0.70, s * 0.40);
    ctx.lineTo(s * 0.764, s * 0.485);
    ctx.closePath();
    ctx.fill();

    // sea
    ctx.fillStyle = '#00b4d8';
    ctx.beginPath();
    ctx.moveTo(0, s * 0.70);
    for (var x = 0; x <= s; x += s / 30) {
      ctx.lineTo(x, s * 0.70 + Math.sin(x / s * Math.PI * 3) * s * 0.03);
    }
    ctx.lineTo(s, s); ctx.lineTo(0, s);
    ctx.closePath();
    ctx.fill();

    // the great wave: body
    ctx.fillStyle = '#0077b6';
    ctx.beginPath();
    ctx.moveTo(-s * 0.05, s * 0.86);
    ctx.quadraticCurveTo(s * 0.02, s * 0.22, s * 0.44, s * 0.20);
    ctx.quadraticCurveTo(s * 0.70, s * 0.20, s * 0.60, s * 0.46);
    ctx.quadraticCurveTo(s * 0.52, s * 0.30, s * 0.30, s * 0.42);
    ctx.quadraticCurveTo(s * 0.16, s * 0.52, s * 0.22, s * 0.88);
    ctx.closePath();
    ctx.fill();

    // foam crest + claw fingers
    ctx.fillStyle = '#f1faee';
    ctx.beginPath();
    ctx.moveTo(s * 0.06, s * 0.40);
    ctx.quadraticCurveTo(s * 0.10, s * 0.24, s * 0.44, s * 0.225);
    ctx.quadraticCurveTo(s * 0.62, s * 0.225, s * 0.585, s * 0.40);
    ctx.quadraticCurveTo(s * 0.55, s * 0.27, s * 0.40, s * 0.285);
    ctx.quadraticCurveTo(s * 0.17, s * 0.30, s * 0.135, s * 0.44);
    ctx.closePath();
    ctx.fill();
    [[0.46, 0.255], [0.53, 0.29], [0.57, 0.35]].forEach(function (f, i) {
      ctx.beginPath();
      ctx.arc(s * f[0], s * f[1], s * (0.040 - i * 0.008), 0, Math.PI * 2);
      ctx.fill();
    });
    return c;
  }

  /* --- 3. Starry Night, after Van Gogh ---------------------------------- */
  function starryAfterVanGogh(s) {
    var c = makeCanvas(s), ctx = c.getContext('2d');
    ctx.fillStyle = '#4cc9f0';
    ctx.fillRect(0, 0, s, s);

    // swirl
    ctx.strokeStyle = '#ffd60a';
    ctx.lineWidth = Math.max(3, s * 0.022);
    ctx.beginPath();
    for (var a = 0; a < Math.PI * 5; a += 0.12) {
      var r = s * 0.02 + a * s * 0.027;
      var x = s * 0.42 + Math.cos(a) * r, y = s * 0.33 + Math.sin(a) * r * 0.72;
      a ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.stroke();

    // stars as flat concentric discs
    [[0.14, 0.18, 0.062], [0.78, 0.17, 0.052], [0.88, 0.40, 0.040], [0.25, 0.47, 0.034]]
      .forEach(function (st) {
        ctx.fillStyle = '#fff3b0';
        ctx.beginPath(); ctx.arc(s * st[0], s * st[1], s * st[2], 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ff8c00';
        ctx.beginPath(); ctx.arc(s * st[0], s * st[1], s * st[2] * 0.52, 0, Math.PI * 2); ctx.fill();
      });

    // cypress, flame-shaped
    ctx.fillStyle = '#7b2ff7';
    ctx.beginPath();
    ctx.moveTo(s * 0.17, s);
    ctx.quadraticCurveTo(s * 0.02, s * 0.58, s * 0.14, s * 0.10);
    ctx.quadraticCurveTo(s * 0.26, s * 0.52, s * 0.29, s);
    ctx.closePath();
    ctx.fill();

    // village
    ctx.fillStyle = '#06d6a0';
    ctx.fillRect(0, s * 0.80, s, s * 0.20);
    ctx.fillStyle = '#f72585';
    for (var i = 0; i < 6; i++) {
      var bx = s * (0.30 + i * 0.115), bh = s * (0.07 + (i % 3) * 0.035);
      ctx.fillRect(bx, s * 0.82 - bh, s * 0.085, bh + s * 0.04);
    }
    // church spire
    ctx.beginPath();
    ctx.moveTo(s * 0.60, s * 0.76);
    ctx.lineTo(s * 0.645, s * 0.60);
    ctx.lineTo(s * 0.69, s * 0.76);
    ctx.closePath();
    ctx.fill();
    return c;
  }

  /* --- 4. Sunflowers, after Van Gogh ------------------------------------ */
  function sunflowersAfterVanGogh(s) {
    var c = makeCanvas(s), ctx = c.getContext('2d');
    ctx.fillStyle = '#00b4d8';
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#ff2d55';
    ctx.fillRect(0, s * 0.70, s, s * 0.30);

    // vase
    ctx.fillStyle = '#ffd60a';
    ctx.beginPath();
    ctx.moveTo(s * 0.34, s * 0.66);
    ctx.lineTo(s * 0.66, s * 0.66);
    ctx.lineTo(s * 0.61, s * 0.95);
    ctx.lineTo(s * 0.39, s * 0.95);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#f1faee';
    ctx.fillRect(s * 0.34, s * 0.745, s * 0.32, s * 0.055);

    // stems
    ctx.strokeStyle = '#06d6a0';
    ctx.lineWidth = Math.max(3, s * 0.018);
    var heads = [[0.28, 0.30, 0.125], [0.50, 0.19, 0.145], [0.72, 0.31, 0.120],
                 [0.38, 0.47, 0.098], [0.63, 0.48, 0.098]];
    heads.forEach(function (h) {
      ctx.beginPath();
      ctx.moveTo(s * 0.50, s * 0.66);
      ctx.quadraticCurveTo(s * ((0.50 + h[0]) / 2), s * 0.52, s * h[0], s * h[1]);
      ctx.stroke();
    });

    // flower heads: ring of flat petals + dark centre
    heads.forEach(function (h) {
      var cx = s * h[0], cy = s * h[1], r = s * h[2];
      ctx.fillStyle = '#ffd60a';
      for (var i = 0; i < 12; i++) {
        var ang = (i / 12) * Math.PI * 2;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(ang);
        ctx.beginPath();
        ctx.ellipse(0, -r * 0.66, r * 0.21, r * 0.46, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.fillStyle = '#ff8c00';
      ctx.beginPath(); ctx.arc(cx, cy, r * 0.52, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#7b2ff7';
      ctx.beginPath(); ctx.arc(cx, cy, r * 0.30, 0, Math.PI * 2); ctx.fill();
    });
    return c;
  }

  var PAINTERS = {
    screamAfterMunch: screamAfterMunch,
    waveAfterHokusai: waveAfterHokusai,
    starryAfterVanGogh: starryAfterVanGogh,
    sunflowersAfterVanGogh: sunflowersAfterVanGogh
  };

  var cache = {};

  /** Painted square canvas for `name`, cached per name+size. */
  function scene(name, size) {
    var key = name + '@' + size;
    if (!cache[key]) {
      var painter = PAINTERS[name];
      if (!painter) throw new Error('Unknown scene: ' + name);
      cache[key] = painter(size);
    }
    return cache[key];
  }

  global.Scenery = { scene: scene, names: Object.keys(PAINTERS) };
})(window);
