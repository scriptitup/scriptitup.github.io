const WORKER_URL = "https://scriptitup-contact.roshanmallick2025.workers.dev";

const form = document.getElementById("contact-form");
const submitBtn = document.getElementById("submit-btn");
const statusEl = document.getElementById("status");

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
