/*!
 * rct.js — optional interaction enhancer for rct.css.
 *
 * Everything here is progressive enhancement; the pure-CSS components work
 * without it. Zero dependencies; safe to include or omit.
 *
 *  Dropdowns (.rct-dropdown) — adds the niceties a real <select> has: opening
 *    one closes the others, clicking an item writes its label into the value
 *    well and closes, and an outside click closes any open menu.
 *
 *  Tabs (.rct-tabs) — clicking a `.rct-tab[data-tab="id"]` marks it active and
 *    shows the matching `[data-tab-panel="id"]` within the same window, hiding
 *    the others.
 *
 *  Modals (<dialog class="rct-window">) — a `[data-rct-open="id"]` button opens
 *    that dialog with showModal(); a `[data-rct-close]` button (or Escape, or a
 *    click on the backdrop) closes it.
 *
 * Usage:  <script src="rct.js" defer></script>
 * It auto-initializes on DOMContentLoaded. Call RCT.init(root) yourself after
 * injecting markup dynamically (idempotent — already-wired nodes are skipped).
 */
(function (global) {
  "use strict";

  var DD_WIRED = "rctDropdownWired"; // dataset flags guarding against double-init
  var TAB_WIRED = "rctTabsWired";
  var MODAL_WIRED = "rctModalWired";

  // ----------------------------------------------------------------- dropdowns
  function closeOthers(current) {
    document.querySelectorAll(".rct-dropdown[open]").forEach(function (dd) {
      if (dd !== current) dd.open = false;
    });
  }

  function closeAll() {
    document.querySelectorAll(".rct-dropdown[open]").forEach(function (dd) {
      dd.open = false;
    });
  }

  function wireDropdown(dd) {
    if (dd.dataset[DD_WIRED]) return;
    dd.dataset[DD_WIRED] = "1";

    // Only one dropdown open at a time.
    dd.addEventListener("toggle", function () {
      if (dd.open) closeOthers(dd);
    });

    // Selecting an item fills the value well and closes the menu.
    dd.querySelectorAll(".rct-menu .item").forEach(function (item) {
      item.addEventListener("click", function () {
        var value = dd.querySelector(".value");
        if (value) value.textContent = item.textContent;
        dd.open = false;
      });
    });
  }

  // ---------------------------------------------------------------------- tabs
  function wireTabs(group) {
    if (group.dataset[TAB_WIRED]) return;
    group.dataset[TAB_WIRED] = "1";

    var scope = group.closest(".rct-window") || document;
    var tabs = [].slice.call(group.querySelectorAll(".rct-tab"));

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var id = tab.dataset.tab;
        tabs.forEach(function (t) {
          t.classList.toggle("is-active", t === tab);
        });
        // Only switch panels when tabs are wired to content.
        if (id == null) return;
        scope.querySelectorAll("[data-tab-panel]").forEach(function (panel) {
          panel.hidden = panel.dataset.tabPanel !== id;
        });
      });
    });
  }

  // -------------------------------------------------------------------- modals
  function wireModalTrigger(el) {
    if (el.dataset[MODAL_WIRED]) return;
    el.dataset[MODAL_WIRED] = "1";

    if (el.hasAttribute("data-rct-open")) {
      el.addEventListener("click", function () {
        var dlg = document.getElementById(el.getAttribute("data-rct-open"));
        if (dlg && dlg.showModal) dlg.showModal();
      });
    }
    if (el.hasAttribute("data-rct-close")) {
      el.addEventListener("click", function () {
        var dlg = el.closest("dialog");
        if (dlg) dlg.close();
      });
    }
  }

  function wireDialog(dlg) {
    if (dlg.dataset[MODAL_WIRED]) return;
    dlg.dataset[MODAL_WIRED] = "1";
    // A click on the backdrop lands on the dialog element itself.
    dlg.addEventListener("click", function (e) {
      if (e.target === dlg) dlg.close();
    });
  }

  // ------------------------------------------------------------------ bootstrap
  // Wire every enhanceable component under `root` (default: whole document).
  function init(root) {
    var r = root || document;
    r.querySelectorAll(".rct-dropdown").forEach(wireDropdown);
    r.querySelectorAll(".rct-tabs").forEach(wireTabs);
    r.querySelectorAll("[data-rct-open], [data-rct-close]").forEach(wireModalTrigger);
    r.querySelectorAll("dialog.rct-window").forEach(wireDialog);
  }

  // One document-level listener closes menus on an outside click.
  var outsideClickBound = false;
  function bindOutsideClick() {
    if (outsideClickBound) return;
    outsideClickBound = true;
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".rct-dropdown")) closeAll();
    });
  }

  function boot() {
    init();
    bindOutsideClick();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  // Expose a tiny API for dynamically added markup.
  global.RCT = { init: init, closeAll: closeAll };
})(typeof window !== "undefined" ? window : this);
