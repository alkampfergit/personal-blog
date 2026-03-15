(function () {
  var siteConfig = window.siteConfig || {};

  window.CookieConsent = {
    COOKIE_NAME: "cookie_consent",
    CONSENT_ACCEPTED: "accepted",
    CONSENT_DECLINED: "declined",

    getConsent: function () {
      var match = document.cookie.match(
        new RegExp("(^| )" + this.COOKIE_NAME + "=([^;]+)")
      );
      return match ? match[2] : null;
    },

    setConsent: function (value) {
      var expiresAt = new Date();
      expiresAt.setTime(expiresAt.getTime() + 365 * 24 * 60 * 60 * 1000);
      document.cookie =
        this.COOKIE_NAME +
        "=" +
        value +
        ";expires=" +
        expiresAt.toUTCString() +
        ";path=/;SameSite=Lax";
    },

    hasConsented: function () {
      return this.getConsent() === this.CONSENT_ACCEPTED;
    },

    hasDeclined: function () {
      return this.getConsent() === this.CONSENT_DECLINED;
    },

    needsConsent: function () {
      return this.getConsent() === null;
    },

    accept: function () {
      this.setConsent(this.CONSENT_ACCEPTED);
      this.loadTrackingScripts();
      this.hideBanner();
      document.dispatchEvent(
        new CustomEvent("cookie_consent_changed", {
          detail: { consent: this.CONSENT_ACCEPTED },
        })
      );
    },

    decline: function () {
      this.setConsent(this.CONSENT_DECLINED);
      this.hideBanner();
      document.dispatchEvent(
        new CustomEvent("cookie_consent_changed", {
          detail: { consent: this.CONSENT_DECLINED },
        })
      );
    },

    hideBanner: function () {
      var banner = document.getElementById("cookie-consent-banner");
      if (!banner) {
        return;
      }

      document.body.classList.remove("cookie-banner-visible");
      document.body.style.removeProperty("--cookie-banner-height");
      banner.style.opacity = "0";
      banner.style.transform = "translate3d(-50%, -120%, 0)";
      setTimeout(function () {
        banner.remove();
      }, 300);
    },

    loadTrackingScripts: function () {
      if (siteConfig.gaId && !document.getElementById("gtag-script")) {
        var gaScript = document.createElement("script");
        gaScript.id = "gtag-script";
        gaScript.async = true;
        gaScript.src =
          "https://www.googletagmanager.com/gtag/js?id=" + siteConfig.gaId;
        document.head.appendChild(gaScript);

        window.dataLayer = window.dataLayer || [];
        window.gtag = function () {
          dataLayer.push(arguments);
        };
        window.gtag("js", new Date());
        window.gtag("config", siteConfig.gaId);
      }

      if (
        siteConfig.adsenseClient &&
        !document.getElementById("adsense-script")
      ) {
        var adsenseScript = document.createElement("script");
        adsenseScript.id = "adsense-script";
        adsenseScript.async = true;
        adsenseScript.src =
          "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" +
          siteConfig.adsenseClient;
        adsenseScript.setAttribute("crossorigin", "anonymous");
        document.head.appendChild(adsenseScript);
      }
    },

    showBanner: function () {
      var banner = document.getElementById("cookie-consent-banner");
      if (banner) {
        banner.style.display = "flex";
        document.body.style.setProperty(
          "--cookie-banner-height",
          banner.offsetHeight + "px"
        );
        document.body.classList.add("cookie-banner-visible");
      }
    },

    init: function () {
      if (this.hasConsented()) {
        this.loadTrackingScripts();
        return;
      }

      if (!this.needsConsent()) {
        return;
      }

      var self = this;
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
          self.showBanner();
        });
      } else {
        self.showBanner();
      }
    },
  };

  window.CookieConsent.init();
})();
