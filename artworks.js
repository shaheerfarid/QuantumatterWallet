/* ==========================================================================
   artworks.js

   Demo artworks: public-domain paintings served from images/art/.
   See images/art/SOURCES.md for provenance and why they are free to use.

   Images are preloaded because the QR overlay draws synchronously - it needs a
   decoded HTMLImageElement in hand, not a pending request.
   ========================================================================== */

(function (global) {
  'use strict';

  var ART = {
    scream:     'images/art/scream.jpg',
    greatWave:  'images/art/great-wave.jpg',
    starryNight:'images/art/starry-night.jpg',
    sunflowers: 'images/art/sunflowers.jpg'
  };

  var loaded = {};

  function url(name) {
    return ART[name] || null;
  }

  /** CSS background shorthand, for thumbnails. */
  function background(name) {
    var u = url(name);
    return u ? 'url(' + u + ') center/cover' : 'none';
  }

  /** Decoded image, or null if it has not loaded (yet, or at all). */
  function image(name) {
    return loaded[name] || null;
  }

  /** Resolves once every image has either loaded or failed. Never rejects:
      a missing picture should degrade to a plain white code, not a dead page. */
  function preload() {
    return Promise.all(Object.keys(ART).map(function (name) {
      return new Promise(function (resolve) {
        var img = new Image();
        img.onload = function () { loaded[name] = img; resolve(name); };
        img.onerror = function () { resolve(null); };
        img.src = ART[name];
      });
    }));
  }

  global.Artworks = {
    url: url,
    background: background,
    image: image,
    preload: preload,
    names: Object.keys(ART)
  };
})(window);
