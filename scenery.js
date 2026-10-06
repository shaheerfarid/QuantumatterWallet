/* ==========================================================================
   scenery.js

   Procedurally drawn scenery for the demo artworks. Drawn rather than shipped
   as photographs so there are no licensing questions, no binary assets in the
   repo, and the whole thing still works offline.

   Each painter fills a square canvas. The same canvas is used for the gallery
   thumbnail and as the background behind the address QR, so what a seller sees
   in their collection is exactly what ends up inside the code.
   ========================================================================== */

(function (global) {
  'use strict';

  function makeCanvas(size) {
    var c = document.createElement('canvas');
    c.width = c.height = size;
    return c;
  }

  function sky(ctx, s, stops) {
    var g = ctx.createLinearGradient(0, 0, 0, s);
    stops.forEach(function (st) { g.addColorStop(st[0], st[1]); });
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  }

  /* Deterministic pseudo-random, so a given piece always looks the same. */
  function rng(seed) {
    var v = seed;
    return function () {
      v = (v * 1103515245 + 12345) & 0x7fffffff;
      return v / 0x7fffffff;
    };
  }

  /* --- 1. dawn over water --------------------------------------------- */
  function tidalDrift(s) {
    var c = makeCanvas(s), ctx = c.getContext('2d'), horizon = s * 0.58;
    sky(ctx, s, [[0, '#123b5e'], [0.45, '#2f7fa8'], [0.78, '#e8a362'], [1, '#f2c078']]);

    // sun
    ctx.fillStyle = 'rgba(255,238,200,0.95)';
    ctx.beginPath();
    ctx.arc(s * 0.70, horizon - s * 0.10, s * 0.075, 0, Math.PI * 2);
    ctx.fill();

    // sea
    var sea = ctx.createLinearGradient(0, horizon, 0, s);
    sea.addColorStop(0, '#1d5c80');
    sea.addColorStop(1, '#0d2f47');
    ctx.fillStyle = sea;
    ctx.fillRect(0, horizon, s, s - horizon);

    // sun trail + wave bands
    var r = rng(41);
    for (var y = horizon + 3; y < s; y += s * 0.022) {
      var t = (y - horizon) / (s - horizon);
      var w = s * (0.06 + t * 0.22) * (0.6 + r() * 0.8);
      ctx.fillStyle = 'rgba(255,225,180,' + (0.42 * (1 - t)).toFixed(3) + ')';
      ctx.fillRect(s * 0.70 - w / 2, y, w, Math.max(1.5, s * 0.009));
      ctx.fillStyle = 'rgba(255,255,255,' + (0.10 * (1 - t)).toFixed(3) + ')';
      ctx.fillRect(r() * s * 0.5, y, s * (0.10 + r() * 0.22), Math.max(1, s * 0.005));
    }

    // far headland
    ctx.fillStyle = 'rgba(16,40,60,0.85)';
    ctx.beginPath();
    ctx.moveTo(0, horizon);
    ctx.lineTo(s * 0.10, horizon - s * 0.055);
    ctx.lineTo(s * 0.20, horizon - s * 0.018);
    ctx.lineTo(s * 0.30, horizon);
    ctx.closePath();
    ctx.fill();
    return c;
  }

  /* --- 2. misty city ---------------------------------------------------- */
  function kowloonStatic(s) {
    var c = makeCanvas(s), ctx = c.getContext('2d');
    sky(ctx, s, [[0, '#0f2027'], [0.5, '#2c4a52'], [1, '#d9d9d9']]);

    var r = rng(67);
    // three depth layers, paler as they recede
    [[0.78, 'rgba(18,36,42,0.35)', 0.22],
     [0.86, 'rgba(14,30,36,0.60)', 0.30],
     [0.96, 'rgba(8,20,26,0.92)', 0.38]].forEach(function (layer) {
      var base = s * layer[0];
      ctx.fillStyle = layer[1];
      var x = -s * 0.05;
      while (x < s) {
        var w = s * (0.05 + r() * 0.07);
        var h = s * layer[2] * (0.35 + r() * 0.75);
        ctx.fillRect(x, base - h, w, h + s);
        x += w + s * 0.012;
      }
    });

    // lit windows on the nearest layer
    ctx.fillStyle = 'rgba(255,214,140,0.85)';
    for (var i = 0; i < 90; i++) {
      var wx = r() * s, wy = s * 0.60 + r() * s * 0.34;
      ctx.fillRect(wx, wy, Math.max(1.5, s * 0.008), Math.max(1.5, s * 0.011));
    }
    return c;
  }

  /* --- 3. rolling hills ------------------------------------------------- */
  function monsoonField(s) {
    var c = makeCanvas(s), ctx = c.getContext('2d');
    sky(ctx, s, [[0, '#1b3a2f'], [0.4, '#4f8f6b'], [1, '#c7dfa0']]);

    var r = rng(88);
    // layered hills, front ones darker
    [[0.52, '#5e9b73', 0.055], [0.64, '#4a8460', 0.075], [0.78, '#356247', 0.095]].forEach(function (L, idx) {
      ctx.fillStyle = L[1];
      ctx.beginPath();
      ctx.moveTo(0, s);
      for (var x = 0; x <= s; x += s * 0.02) {
        var y = s * L[0]
          + Math.sin(x / s * Math.PI * (1.4 + idx * 0.7) + idx) * s * L[2]
          + Math.sin(x / s * Math.PI * 5.5) * s * 0.012;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(s, s);
      ctx.closePath();
      ctx.fill();
    });

    // rain
    ctx.strokeStyle = 'rgba(225,240,230,0.30)';
    ctx.lineWidth = Math.max(1, s * 0.0035);
    for (var i = 0; i < 70; i++) {
      var x0 = r() * s, y0 = r() * s * 0.8, len = s * (0.02 + r() * 0.035);
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x0 - len * 0.25, y0 + len);
      ctx.stroke();
    }

    // a couple of trees on the ridge
    ctx.fillStyle = 'rgba(26,56,40,0.9)';
    [[0.18, 0.60], [0.26, 0.615], [0.80, 0.585]].forEach(function (t) {
      ctx.beginPath();
      ctx.arc(s * t[0], s * t[1], s * 0.022, 0, Math.PI * 2);
      ctx.fill();
    });
    return c;
  }

  /* --- 4. night harbour ------------------------------------------------- */
  function neonFerry(s) {
    var c = makeCanvas(s), ctx = c.getContext('2d'), horizon = s * 0.62;
    sky(ctx, s, [[0, '#131a3a'], [0.55, '#3b2a6b'], [1, '#5b3fa8']]);

    var r = rng(95);
    // stars
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    for (var i = 0; i < 70; i++) {
      ctx.fillRect(r() * s, r() * horizon * 0.8, Math.max(1, s * 0.004), Math.max(1, s * 0.004));
    }

    // skyline
    ctx.fillStyle = '#140f2e';
    var x = 0;
    while (x < s) {
      var w = s * (0.04 + r() * 0.06);
      var h = s * (0.08 + r() * 0.20);
      ctx.fillRect(x, horizon - h, w, h);
      x += w + s * 0.008;
    }

    // neon signs
    ['#ff7bb0', '#5ee7ff', '#ffd166'].forEach(function (col, k) {
      ctx.fillStyle = col;
      for (var j = 0; j < 7; j++) {
        var nx = r() * s, ny = horizon - s * (0.03 + r() * 0.16);
        ctx.fillRect(nx, ny, s * (0.012 + r() * 0.03), Math.max(2, s * 0.009));
      }
    });

    // water + neon reflections
    var w8 = ctx.createLinearGradient(0, horizon, 0, s);
    w8.addColorStop(0, '#1a1340');
    w8.addColorStop(1, '#0b0820');
    ctx.fillStyle = w8;
    ctx.fillRect(0, horizon, s, s - horizon);
    ['rgba(255,123,176,0.40)', 'rgba(94,231,255,0.35)', 'rgba(255,209,102,0.30)'].forEach(function (col) {
      ctx.fillStyle = col;
      for (var y = horizon + 4; y < s; y += s * 0.03) {
        var rx = r() * s;
        ctx.fillRect(rx, y, s * (0.03 + r() * 0.09), Math.max(1.5, s * 0.007));
      }
    });
    return c;
  }

  var PAINTERS = {
    tidalDrift: tidalDrift,
    kowloonStatic: kowloonStatic,
    monsoonField: monsoonField,
    neonFerry: neonFerry
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
