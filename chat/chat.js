/* ============================================================
   Script It Up — Chat Widget (UI only)
   Toggle + focus handling. No backend / AI logic yet.
   ============================================================ */

(() => {
    const widget = document.getElementById("chat-widget");
    const launcher = document.getElementById("chat-launcher");
    const closeBtn = document.getElementById("chat-close");
    const panel = document.getElementById("chat-panel");
    const input = document.getElementById("chat-input");
    const form = document.getElementById("chat-form");

    if (!widget || !launcher || !panel) return;

    const setOpen = (open) => {
        widget.classList.toggle("open", open);
        launcher.setAttribute("aria-expanded", String(open));
        panel.setAttribute("aria-hidden", String(!open));
        if (open && input) input.focus();
    };

    launcher.addEventListener("click", () => {
        setOpen(!widget.classList.contains("open"));
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", () => setOpen(false));
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && widget.classList.contains("open")) {
            setOpen(false);
            launcher.focus();
        }
    });

    if (form) {
        form.addEventListener("submit", (e) => e.preventDefault());
    }
})();
