/* ==========================================================================
   scenery.js

   Demo artworks, painted procedurally.

   Pop-art idiom: four-panel grids, flat screenprinted colour, hard edges. A
   style, not a copy - these are original compositions. Warhol's own works are
   still in copyright and actively licensed, which is not something to drop into
   an art marketplace's repo; and no real person's likeness or live trademark
   appears here either.

   Drawn rather than shipped as files so there are no licensing questions, no
   binary assets, and it works offline. Flat colour also happens to be the
   kindest possible background for a QR overlay - far better than photographs.

   Each painter fills a square canvas, used both for the gallery thumbnail and
   as the background behind the address QR.
   ========================================================================== */

(function (global) {
  'use strict';

  function makeCanvas(size) {
    var c = document.createElement('canvas');
    c.width = c.height = size;
    return c;
  }

  /* Run a painter once per quadrant of a 2x2 grid, each with its own palette -
     the repetition-with-recolouring that defines the look. */
  function quadrants(s, palettes, paint) {
    var c = makeCanvas(s), ctx = c.getContext('2d'), h = s / 2;
    palettes.forEach(function (pal, i) {
      var x = (i % 2) * h, y = Math.floor(i / 2) * h;
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, h, h);
      ctx.clip();
      ctx.translate(x, y);
      paint(ctx, h, pal);
      ctx.restore();
    });
    // screenprint registration gap between panels
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = Math.max(2, s * 0.008);
    ctx.beginPath();
    ctx.moveTo(h, 0); ctx.lineTo(h, s);
    ctx.moveTo(0, h); ctx.lineTo(s, h);
    ctx.stroke();
    return c;
  }

  function petal(ctx, cx, cy, r, rot) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.62, r * 0.42, r * 0.62, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  /* --- 1. Flowers, four ways ------------------------------------------- */
  function popBloom(s) {
    return quadrants(s, [
      { bg: '#f72585', flower: '#ffd60a', core: '#003049', leaf: '#06d6a0' },
      { bg: '#06d6a0', flower: '#f72585', core: '#1d3557', leaf: '#ffd60a' },
      { bg: '#ffd60a', flower: '#7b2ff7', core: '#f72585', leaf: '#06d6a0' },
      { bg: '#4cc9f0', flower: '#ffd60a', core: '#f72585', leaf: '#06d6a0' }
    ], function (ctx, h, pal) {
      ctx.fillStyle = pal.bg;
      ctx.fillRect(0, 0, h, h);

      // leaves
      ctx.fillStyle = pal.leaf;
      ctx.beginPath();
      ctx.ellipse(h * 0.30, h * 0.82, h * 0.26, h * 0.10, -0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(h * 0.72, h * 0.86, h * 0.20, h * 0.08, 0.4, 0, Math.PI * 2);
      ctx.fill();

      // five petals
      ctx.fillStyle = pal.flower;
      for (var i = 0; i < 5; i++) {
        petal(ctx, h * 0.5, h * 0.44, h * 0.40, (i / 5) * Math.PI * 2);
      }

      // core
      ctx.fillStyle = pal.core;
      ctx.beginPath();
      ctx.arc(h * 0.5, h * 0.44, h * 0.115, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  /* --- 2. Anonymous portrait, repeated ---------------------------------- */
  function popPortrait(s) {
    return quadrants(s, [
      { bg: '#4cc9f0', skin: '#ffd60a', hair: '#7b2ff7', body: '#f72585', ink: '#2b1a4a' },
      { bg: '#f72585', skin: '#4cc9f0', hair: '#ffd60a', body: '#06d6a0', ink: '#2b1a4a' },
      { bg: '#ffd60a', skin: '#f9a8d4', hair: '#7b2ff7', body: '#4cc9f0', ink: '#2b1a4a' },
      { bg: '#06d6a0', skin: '#ffd60a', hair: '#f72585', body: '#4cc9f0', ink: '#2b1a4a' }
    ], function (ctx, h, pal) {
      ctx.fillStyle = pal.bg;
      ctx.fillRect(0, 0, h, h);

      // shoulders - a large mass, so a mid-tone rather than the feature ink
      ctx.fillStyle = pal.body;
      ctx.beginPath();
      ctx.ellipse(h * 0.5, h * 1.08, h * 0.42, h * 0.30, 0, 0, Math.PI * 2);
      ctx.fill();

      // hair mass behind the face
      ctx.fillStyle = pal.hair;
      ctx.beginPath();
      ctx.ellipse(h * 0.5, h * 0.44, h * 0.33, h * 0.36, 0, 0, Math.PI * 2);
      ctx.fill();

      // face
      ctx.fillStyle = pal.skin;
      ctx.beginPath();
      ctx.ellipse(h * 0.5, h * 0.47, h * 0.235, h * 0.285, 0, 0, Math.PI * 2);
      ctx.fill();

      // features, blocked in flat
      ctx.fillStyle = pal.ink;
      ctx.beginPath();
      ctx.ellipse(h * 0.41, h * 0.45, h * 0.045, h * 0.026, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(h * 0.59, h * 0.45, h * 0.045, h * 0.026, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(h * 0.5, h * 0.62, h * 0.085, h * 0.042, 0, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  /* --- 3. Bottles on a shelf -------------------------------------------- */
  function popBottles(s) {
    var c = makeCanvas(s), ctx = c.getContext('2d');
    var cols = 4, rows = 4, cw = s / cols, ch = s / rows;
    var grounds = ['#ff5d73', '#4cc9f0', '#ffd60a', '#06d6a0'];
    var glass   = ['#ffd60a', '#f1faee', '#ff5d73', '#7b2ff7'];

    for (var r = 0; r < rows; r++) {
      for (var k = 0; k < cols; k++) {
        var x = k * cw, y = r * ch, i = (r + k) % 4;
        ctx.fillStyle = grounds[i];
        ctx.fillRect(x, y, cw, ch);

        // bottle silhouette: body, shoulder, neck, cap
        ctx.fillStyle = glass[(i + r) % 4];
        var bw = cw * 0.40, bx = x + cw / 2 - bw / 2;
        ctx.fillRect(bx, y + ch * 0.42, bw, ch * 0.42);
        ctx.beginPath();
        ctx.moveTo(bx, y + ch * 0.42);
        ctx.lineTo(x + cw / 2 - bw * 0.17, y + ch * 0.24);
        ctx.lineTo(x + cw / 2 + bw * 0.17, y + ch * 0.24);
        ctx.lineTo(bx + bw, y + ch * 0.42);
        ctx.closePath();
        ctx.fill();
        ctx.fillRect(x + cw / 2 - bw * 0.17, y + ch * 0.16, bw * 0.34, ch * 0.10);

        ctx.fillStyle = '#2b1a4a';
        ctx.fillRect(x + cw / 2 - bw * 0.22, y + ch * 0.12, bw * 0.44, ch * 0.055);
        // label band, kept light so it does not read as a QR module
        ctx.fillStyle = '#f1faee';
        ctx.fillRect(bx, y + ch * 0.56, bw, ch * 0.11);
      }
    }
    return c;
  }

  /* --- 4. Benday starburst ---------------------------------------------- */
  function popBurst(s) {
    var c = makeCanvas(s), ctx = c.getContext('2d');
    ctx.fillStyle = '#ffd60a';
    ctx.fillRect(0, 0, s, s);

    // halftone field
    ctx.fillStyle = '#e63946';
    var step = s / 26, rad = step * 0.26;
    for (var y = step / 2; y < s; y += step) {
      for (var x = step / 2; x < s; x += step) {
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // rays
    ctx.fillStyle = '#4cc9f0';
    var cx = s * 0.5, cy = s * 0.5, spikes = 14;
    ctx.beginPath();
    for (var i = 0; i < spikes * 2; i++) {
      var ang = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
      var rr = i % 2 ? s * 0.20 : s * 0.52;
      ctx[i ? 'lineTo' : 'moveTo'](cx + Math.cos(ang) * rr, cy + Math.sin(ang) * rr);
    }
    ctx.closePath();
    ctx.fill();

    // centre
    ctx.fillStyle = '#f1faee';
    ctx.beginPath();
    ctx.arc(cx, cy, s * 0.145, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#2b1a4a';
    ctx.beginPath();
    ctx.arc(cx, cy, s * 0.072, 0, Math.PI * 2);
    ctx.fill();
    return c;
  }

  var PAINTERS = {
    popBloom: popBloom,
    popPortrait: popPortrait,
    popBottles: popBottles,
    popBurst: popBurst
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
