// Top bar menu: close on outside click, Escape, or after picking a link.
(function () {
  var menu = document.querySelector("details.menu");
  if (!menu) return;

  document.addEventListener("click", function (e) {
    if (menu.open && !menu.contains(e.target)) menu.open = false;
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu.open) {
      menu.open = false;
      menu.querySelector("summary").focus();
    }
  });
  menu.querySelector(".menu-panel").addEventListener("click", function (e) {
    if (e.target.closest("a")) menu.open = false;
  });
})();
