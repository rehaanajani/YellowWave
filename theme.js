(function yellowWaveTheme() {
  try {
    console.log("YellowWave loaded");

    var bgLayer = null;
    var currentImage = "";
    var glassSvg = null;
    var glassDefs = null;
    var glassObserver = null;
    var mutationObserver = null;
    var scanQueued = false;
    var glassTargets = [
      ".Root__now-playing-bar",
      ".Root__nav-bar",
      ".main-yourLibraryX-libraryContainer",
      ".main-globalNav-searchInputContainer .main-topBar-searchBar",
      ".main-nowPlayingView-nowPlayingWidget",
      ".main-card-card",
      ".main-entityHeader-container"
    ];

    function ensureBodyReady(callback) {
      if (document.body) {
        callback();
        return;
      }

      document.addEventListener("DOMContentLoaded", callback, { once: true });
    }

    function ensureBackgroundLayer() {
      if (bgLayer && document.body.contains(bgLayer)) {
        return bgLayer;
      }

      bgLayer = document.querySelector(".yellowwave-bg-layer");
      if (!bgLayer) {
        bgLayer = document.createElement("div");
        bgLayer.className = "yellowwave-bg-layer";
        bgLayer.setAttribute("aria-hidden", "true");
        document.body.prepend(bgLayer);
      }

      return bgLayer;
    }

    function ensureGlassRegistry() {
      if (glassSvg && document.body.contains(glassSvg)) {
        return;
      }

      glassSvg = document.getElementById("yellowwave-glass-registry");
      if (!glassSvg) {
        glassSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        glassSvg.id = "yellowwave-glass-registry";
        glassSvg.setAttribute("aria-hidden", "true");
        glassSvg.setAttribute("focusable", "false");
        glassSvg.setAttribute("width", "0");
        glassSvg.setAttribute("height", "0");
        glassSvg.style.position = "fixed";
        glassSvg.style.width = "0";
        glassSvg.style.height = "0";
        glassSvg.style.overflow = "hidden";
        glassSvg.style.pointerEvents = "none";

        glassDefs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        glassSvg.appendChild(glassDefs);
        document.body.prepend(glassSvg);
      } else {
        glassDefs = glassSvg.querySelector("defs");
        if (!glassDefs) {
          glassDefs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
          glassSvg.appendChild(glassDefs);
        }
      }
    }

    function createGlassFilter(id) {
      ensureGlassRegistry();

      var existing = document.getElementById(id);
      if (existing) {
        return existing;
      }

      var filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
      filter.id = id;
      filter.setAttribute("x", "0");
      filter.setAttribute("y", "0");
      filter.setAttribute("width", "160");
      filter.setAttribute("height", "90");
      filter.setAttribute("filterUnits", "userSpaceOnUse");
      filter.setAttribute("color-interpolation-filters", "sRGB");

      var turbulence = document.createElementNS("http://www.w3.org/2000/svg", "feTurbulence");
      turbulence.setAttribute("type", "fractalNoise");
      turbulence.setAttribute("baseFrequency", "0.018 0.028");
      turbulence.setAttribute("numOctaves", "2");
      turbulence.setAttribute("seed", "49");
      turbulence.setAttribute("result", "yellowwaveNoise");

      var displacement = document.createElementNS("http://www.w3.org/2000/svg", "feDisplacementMap");
      displacement.setAttribute("in", "SourceGraphic");
      displacement.setAttribute("in2", "yellowwaveNoise");
      displacement.setAttribute("scale", "9");
      displacement.setAttribute("xChannelSelector", "R");
      displacement.setAttribute("yChannelSelector", "G");

      filter.appendChild(turbulence);
      filter.appendChild(displacement);
      glassDefs.appendChild(filter);

      return filter;
    }

    function updateGlassSize(element) {
      try {
        var id = element.getAttribute("data-yellowwave-glass-id");
        if (!id) {
          return;
        }

        var filter = document.getElementById(id);
        if (!filter) {
          return;
        }

        var rect = element.getBoundingClientRect();
        filter.setAttribute("width", String(Math.max(1, Math.ceil(rect.width))));
        filter.setAttribute("height", String(Math.max(1, Math.ceil(rect.height))));
      } catch (error) {
        console.error("YellowWave glass sizing failed safely", error);
      }
    }

    function markGlassTarget(element, index) {
      if (!element || element.nodeType !== 1) {
        return;
      }

      if (!element.hasAttribute("data-yellowwave-glass-id")) {
        var id = "yellowwave-glass-filter-" + index + "-" + Math.random().toString(36).slice(2, 8);
        element.setAttribute("data-yellowwave-glass-id", id);
        createGlassFilter(id);
        element.style.setProperty("--yw-glass-filter", 'url("#' + id + '") blur(18px)');
      }

      element.classList.add("yellowwave-glass-target");
      updateGlassSize(element);

      if (glassObserver) {
        glassObserver.observe(element);
      }
    }

    function applyGlassTargets() {
      try {
        ensureGlassRegistry();

        if (!glassObserver && typeof ResizeObserver === "function") {
          glassObserver = new ResizeObserver(function resizeGlassTargets(entries) {
            entries.forEach(function resizeEntry(entry) {
              updateGlassSize(entry.target);
            });
          });
        }

        glassTargets.forEach(function applySelector(selector, index) {
          document.querySelectorAll(selector).forEach(function applyElement(element) {
            markGlassTarget(element, index);
          });
        });
      } catch (error) {
        console.error("YellowWave glass target scan failed safely", error);
      }
    }

    function queueGlassScan() {
      if (scanQueued) {
        return;
      }

      scanQueued = true;
      window.requestAnimationFrame(function runGlassScan() {
        scanQueued = false;
        applyGlassTargets();
      });
    }

    function bindGlassObserver() {
      applyGlassTargets();

      if (mutationObserver || typeof MutationObserver !== "function") {
        return;
      }

      mutationObserver = new MutationObserver(queueGlassScan);
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    }

    function normalizeArtworkUrl(url) {
      if (!url || typeof url !== "string") {
        return "";
      }

      if (url.indexOf("spotify:image:") === 0) {
        return "https://i.scdn.co/image/" + url.replace("spotify:image:", "");
      }

      return url;
    }

    function getCurrentArtworkUrl() {
      var spicetify = window.Spicetify;
      var metadata =
        spicetify &&
        spicetify.Player &&
        spicetify.Player.data &&
        spicetify.Player.data.item &&
        spicetify.Player.data.item.metadata;

      if (!metadata) {
        return "";
      }

      return normalizeArtworkUrl(metadata.image_url || metadata.image_xlarge_url || metadata.image_large_url);
    }

    function updateBackground() {
      try {
        var layer = ensureBackgroundLayer();
        var artwork = getCurrentArtworkUrl();

        if (!artwork || artwork === currentImage) {
          return;
        }

        currentImage = artwork;
        layer.style.backgroundImage = 'url("' + artwork.replace(/"/g, '\\"') + '")';
        layer.style.opacity = "0.42";
      } catch (error) {
        console.error("YellowWave background update failed safely", error);
      }
    }

    function bindPlayerEvents() {
      var spicetify = window.Spicetify;

      if (!spicetify || !spicetify.Player || typeof spicetify.Player.addEventListener !== "function") {
        updateBackground();
        return;
      }

      spicetify.Player.addEventListener("songchange", updateBackground);
      updateBackground();
    }

    ensureBodyReady(function initializeYellowWave() {
      document.body.classList.add("yellowwave-ready");
      ensureBackgroundLayer();
      ensureGlassRegistry();
      bindGlassObserver();
      bindPlayerEvents();
      window.setTimeout(updateBackground, 1000);
      window.setTimeout(updateBackground, 3000);
      window.setTimeout(queueGlassScan, 1000);
    });
  } catch (error) {
    console.error("YellowWave failed to initialize safely", error);
  }
})();
