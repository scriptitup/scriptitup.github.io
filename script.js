const WORKER_URL = "https://scriptitup-contact.roshanmallick2025.workers.dev";

const form = document.getElementById("contact-form");
const submitBtn = document.getElementById("submit-btn");
const statusEl = document.getElementById("status");

if (form && submitBtn && statusEl) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const service = document.getElementById("service").value.trim();
        const budget = document.getElementById("budget").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!name || !email || !message) {
            showStatus("Please fill in all required fields.", "error");
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
        showStatus("", "");

        try {
            const res = await fetch(WORKER_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, phone, service, budget, message }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Request failed");
            }

            form.reset();
            showStatus(data.message || "Message sent successfully.", "success");
        } catch (err) {
            showStatus("Something went wrong. Please try again.", "error");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Send";
        }
    });

    function showStatus(text, type) {
        statusEl.textContent = text;
        statusEl.className = "status" + (type ? " " + type : "");
    }
}

/* ============================================================
   UI Enhancements
   ============================================================ */

/* Sticky header state */
const header = document.getElementById("site-header");

function updateHeader() {
    header.classList.toggle("scrolled", window.scrollY > 10);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

/* Mobile navigation */
const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");

function closeMenu() {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
}

navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
});

navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeMenu();
    }
});

/* Scroll reveal animations */
const revealEls = document.querySelectorAll(".reveal");

function revealAll() {
    revealEls.forEach((el) => el.classList.add("in-view"));
}

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
} else {
    revealAll();
}

/* Scrollspy — highlight active nav link */
const sectionEls = document.querySelectorAll("main section[id]");
const navLinkEls = document.querySelectorAll(".nav-link");

const spyObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                navLinkEls.forEach((link) => {
                    link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
                });
            }
        });
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
);

sectionEls.forEach((section) => spyObserver.observe(section));

/* Footer year */
const yearEl = document.getElementById("year");
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}
