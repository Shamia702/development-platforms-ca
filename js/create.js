import { supabase } from "./supabase.js";
import { requireAuth } from "./auth.js";

export async function initCreate() {
  const user = await requireAuth("/login.html");
  if (!user) return;

  const form = document.querySelector("#createForm");
  const msg = document.querySelector("#formMessage");
  const btn = document.querySelector("#createBtn");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (msg) {
      msg.textContent = "";
      msg.classList.remove("ok");
    }

    const title = form.title.value.trim();
    const body = form.body.value.trim();
    const category = form.category.value.trim();

    if (!title || !body || !category) {
      if (msg) msg.textContent = "Please fill in title, category, and body.";
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.textContent = "Submitting...";
    }

    const { error } = await supabase.from("articles").insert({
      title,
      body,
      category,
      submitted_by: user.id,
    });
    if (btn) {
      btn.disabled = false;
      btn.textContent = "Submit Article";
    }

    if (error) {
      if (msg) msg.textContent = error.message;
      return;
    }

    if (msg) {
      msg.textContent =
        "Article submitted successfully! Redirecting to home...";
      msg.classList.add("ok");
    }

    form.reset();

    setTimeout(() => {
      window.location.href = "/index.html";
    }, 900);
  });
}
