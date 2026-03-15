(function () {
  var storageKey = "itablog-theme";
  var allowedThemes = { gunmetal: true, bronze: true };
  var defaultTheme = window.ITABLOG_DEFAULT_THEME || "gunmetal";
  var root = document.documentElement;

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
  }

  function getStoredTheme() {
    var storedTheme = window.localStorage.getItem(storageKey);
    return storedTheme && allowedThemes[storedTheme] ? storedTheme : null;
  }

  function updateResetLink(activeTheme) {
    var resetLink = document.getElementById("theme-reset-link");
    if (!resetLink) {
      return;
    }

    var hasOverride = activeTheme !== defaultTheme && !!getStoredTheme();
    resetLink.hidden = !hasOverride;
  }

  function resetTheme(event) {
    if (event) {
      event.preventDefault();
    }

    window.localStorage.removeItem(storageKey);
    applyTheme(defaultTheme);
    updateResetLink(defaultTheme);

    var url = new URL(window.location.href);
    url.searchParams.delete("theme");
    window.history.replaceState({}, "", url.toString());
  }

  function getRequestedTheme() {
    var params = new URLSearchParams(window.location.search);
    var requestedTheme = params.get("theme");

    if (requestedTheme === "reset") {
      window.localStorage.removeItem(storageKey);
      return defaultTheme;
    }

    if (requestedTheme && allowedThemes[requestedTheme]) {
      window.localStorage.setItem(storageKey, requestedTheme);
      return requestedTheme;
    }

    var storedTheme = getStoredTheme();
    if (storedTheme) {
      return storedTheme;
    }

    return defaultTheme;
  }

  var activeTheme = getRequestedTheme();
  applyTheme(activeTheme);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      var resetLink = document.getElementById("theme-reset-link");
      if (resetLink) {
        resetLink.addEventListener("click", resetTheme);
      }
      updateResetLink(activeTheme);
    });
  } else {
    var resetLink = document.getElementById("theme-reset-link");
    if (resetLink) {
      resetLink.addEventListener("click", resetTheme);
    }
    updateResetLink(activeTheme);
  }
})();
