import { supabase } from "./supabase.js";

function showMessage(el, text, type = "error") {
  if (!el) return;
  el.textContent = text;
  el.classList.toggle("ok", type === "success");
  el.classList.toggle("message", true);
}

function friendlyAuthError(error) {
  const msg = (error?.message || "").toLowerCase();

  if (msg.includes("invalid login credentials")) {
    return "Incorrect email or password. Please try again.";
  }
  if (msg.includes("email not confirmed")) {
    return "Please confirm your email first. Check your inbox for the confirmation link.";
  }
  if (msg.includes("user not found")) {
    return "No account found with that email. Please register first.";
  }
  if (msg.includes("password")) {
    return "Incorrect email or password. Please try again.";
  }
  return error?.message || "Login failed. Please try again.";
}

export function initLogin() {
  const form = document.querySelector("#loginForm");
  const msg = document.querySelector("#formMessage");
  const btn = document.querySelector("#loginBtn");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    showMessage(msg, "", "error");

    const email = form.email.value.trim();
    const password = form.password.value;

    if (!email) {
      showMessage(msg, "Please enter your email address.");
      return;
    }
    if (!password) {
      showMessage(msg, "Please enter your password.");
      return;
    }
    if (password.length < 6) {
      showMessage(msg, "Password must be at least 6 characters.");
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.textContent = "Logging in...";
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (btn) {
      btn.disabled = false;
      btn.textContent = "Login";
    }

    if (error) {
      showMessage(msg, friendlyAuthError(error), "error");
      return;
    }

    showMessage(msg, "Login successful! Redirecting…", "success");

    setTimeout(() => {
      window.location.href = "/index.html";
    }, 700);
  });
}
