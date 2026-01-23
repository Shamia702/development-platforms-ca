import { supabase } from "./supabase.js";

export function initRegister() {
  const form = document.querySelector("#registerForm");
  const msg = document.querySelector("#formMessage");
  const btn = document.querySelector("#registerBtn");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (msg) {
      msg.textContent = "";
      msg.classList.remove("ok");
    }

    const email = form.email.value.trim();
    const password = form.password.value;

    if (!email || !password) {
      if (msg) msg.textContent = "Please enter email and password.";
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.textContent = "Creating account...";
    }

    const emailRedirectTo = `${window.location.origin}/index.html`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo },
    });

    if (btn) {
      btn.disabled = false;
      btn.textContent = "Register";
    }

    if (error) {
      if (msg) msg.textContent = error.message;
      return;
    }

    const alreadyRegistered = data?.user?.identities?.length === 0;

    if (msg) {
      msg.textContent = alreadyRegistered
        ? "This email is already registered. Try logging in instead."
        : "Success! If an account exists for this email, you’ll receive a confirmation email.";
      msg.classList.add("ok");
    }

    form.reset();
  });
}
