(function yellowWaveTheme() {
  try {
    console.log("YellowWave loaded");

    var bgLayer = null;
    var currentImage = "";

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
      bindPlayerEvents();
      window.setTimeout(updateBackground, 1000);
      window.setTimeout(updateBackground, 3000);
    });
  } catch (error) {
    console.error("YellowWave failed to initialize safely", error);
  }
})();
