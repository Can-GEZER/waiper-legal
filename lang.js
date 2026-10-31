(function () {
  function setLang(lang) {
    document.querySelectorAll(".lang-block").forEach(function (el) {
      // "revert", not "": an empty inline value falls back to style.css, which hides every EN block
      el.style.display = el.getAttribute("data-lang") === lang ? "revert" : "none";
    });
    document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-lang-btn") === lang);
    });
    document.documentElement.setAttribute("lang", lang);
    try {
      localStorage.setItem("waiper-lang", lang);
    } catch (e) {
      /* localStorage unavailable, ignore */
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setLang(btn.getAttribute("data-lang-btn"));
      });
    });

    var saved = null;
    try {
      saved = localStorage.getItem("waiper-lang");
    } catch (e) {
      /* ignore */
    }
    setLang(saved === "en" ? "en" : "tr");
  });
})();
