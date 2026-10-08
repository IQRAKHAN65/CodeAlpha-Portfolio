// theme.js - put in <head> (no defer) so the theme is set before the page paints
(function () {
    var root = document.documentElement;
    var saved = null;
    try { saved = localStorage.getItem("theme"); } catch (e) {}

    var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.setAttribute("data-theme", saved || (prefersDark ? "dark" : "light"));

    document.addEventListener("DOMContentLoaded", function () {
        var btn = document.getElementById("themeBtn");
        if (!btn) return;

        function sync() {
            var dark = root.getAttribute("data-theme") === "dark";
            btn.textContent = dark ? "☀️" : "🌙";
            btn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
        }

        btn.addEventListener("click", function () {
            var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
            root.setAttribute("data-theme", next);
            try { localStorage.setItem("theme", next); } catch (e) {}
            sync();
        });

        sync();
    });
})();


// ---------- Floating water bubbles + on/off button ----------
(function () {
    var root = document.documentElement;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // restore the visitor's choice right away (no flash)
    var saved = null;
    try { saved = localStorage.getItem("bubbles"); } catch (e) {}
    root.setAttribute("data-bubbles", saved === "off" ? "off" : "on");

    document.addEventListener("DOMContentLoaded", function () {
        var count = window.innerWidth <= 600 ? 6 : 10;   // fewer on phones
        var wrap = document.createElement("div");
        wrap.className = "bubbles";
        wrap.setAttribute("aria-hidden", "true");

        function rand(min, max) { return Math.random() * (max - min) + min; }

        for (var i = 0; i < count; i++) {
            var b = document.createElement("span");
            b.className = "bubble";
            b.style.setProperty("--s", rand(50, 150).toFixed(0) + "px");
            b.style.setProperty("--l", rand(2, 96).toFixed(0) + "%");
            b.style.setProperty("--d", rand(26, 44).toFixed(0) + "s");
            b.style.setProperty("--delay", "-" + rand(0, 40).toFixed(0) + "s");
            b.style.setProperty("--x", rand(-40, 40).toFixed(0) + "px");
            b.style.setProperty("--o", rand(0.55, 0.9).toFixed(2));
            wrap.appendChild(b);
        }
        document.body.insertBefore(wrap, document.body.firstChild);

        // on/off button
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "bubble-toggle";
        btn.textContent = "\uD83D\uDCA7";

        function sync() {
            var on = root.getAttribute("data-bubbles") !== "off";
            btn.setAttribute("aria-pressed", on ? "true" : "false");
            btn.setAttribute("aria-label", on ? "Turn bubbles off" : "Turn bubbles on");
            btn.title = on ? "Turn bubbles off" : "Turn bubbles on";
        }

        btn.addEventListener("click", function () {
            var next = root.getAttribute("data-bubbles") === "off" ? "on" : "off";
            root.setAttribute("data-bubbles", next);
            try { localStorage.setItem("bubbles", next); } catch (e) {}
            sync();
        });

        sync();
        // place it next to the theme button in the navbar
        var themeBtn = document.getElementById("themeBtn");
        if (themeBtn && themeBtn.parentNode) {
            var actions = themeBtn.parentNode.querySelector(".nav-actions");
            if (!actions) {
                actions = document.createElement("div");
                actions.className = "nav-actions";
                themeBtn.parentNode.insertBefore(actions, themeBtn);
                actions.appendChild(themeBtn);
            }
            actions.insertBefore(btn, themeBtn);
        } else {
            btn.classList.add("floating");   // fallback: corner button
            document.body.appendChild(btn);
        }
    });
})();