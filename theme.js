(function yellowWaveTheme() {
  try {
    console.log("YellowWave loaded");

    function markReady() {
      if (document.body) {
        document.body.classList.add("yellowwave-ready");
      }
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", markReady, { once: true });
    } else {
      markReady();
    }
  } catch (error) {
    console.error("YellowWave failed to initialize safely", error);
  }
})();
