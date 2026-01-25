import { supabase } from "./supabase.js";

export function initRegister() {
  const form = document.querySelector("#registerForm");
  const msg = document.querySelector("#formMessage");
  const btn = document.querySelector("#registerBtn");

  if (!form) return;

  let msgTimer = null;

  function setMsg(text = "", type = "error", autoHideMs = 0) {
    if (!msg) return;

    if (msgTimer) {
      clearTimeout(msgTimer);
      msgTimer = null;
    }

    msg.textContent = text;
    msg.classList.toggle("ok", type === "ok");

    if (autoHideMs > 0 && text) {
      msgTimer = setTimeout(() => {
        msg.textContent = "";
        msg.classList.remove("ok");
        msgTimer = null;
      }, autoHideMs);
    }
  }

  setMsg("");

  const emailInput = form.querySelector('input[name="email"]');
  const passInput = form.querySelector('input[name="password"]');

  [emailInput, passInput].forEach((el) => {
    if (!el) return;
    el.addEventListener("input", () => setMsg(""));
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setMsg("");

    const email = form.email.value.trim();
    const password = form.password.value;

    if (!email || !password) {
      setMsg("Enter email + password.", "error", 2500);
      return;
    }

    if (password.length < 6) {
      setMsg("Password must be 6+ characters.", "error", 2500);
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.textContent = "Creating account...";
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (btn) {
      btn.disabled = false;
      btn.textContent = "Register";
    }

    if (error) {
      setMsg(error.message, "error", 3000);
      return;
    }

    const alreadyRegistered = data?.user?.identities?.length === 0;

    if (alreadyRegistered) {
      setMsg("Email already registered. Try login.", "error", 3000);
      return;
    }

    setMsg("Success! Check your email to confirm.", "ok", 4000);
    form.reset();
  });
}
