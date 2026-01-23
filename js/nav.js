import { supabase } from "./supabase.js";
import { getUser, logout } from "./auth.js";

function setVisible(el, visible) {
  if (!el) return;
  el.style.display = visible ? "inline-flex" : "none";
}

function displayNameFromEmail(email) {
  if (!email) return "User";
  const local = email.split("@")[0] || "user";
  const lettersOnly = (local.match(/^[a-zA-Z]+/) || [local])[0];
  return (
    lettersOnly.charAt(0).toUpperCase() + lettersOnly.slice(1).toLowerCase()
  );
}

export async function initNav() {
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const toggleBtn = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".nav-menu");

  if (toggleBtn && menu) {
    const icon = toggleBtn.querySelector("i");

    toggleBtn.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("open");
      toggleBtn.setAttribute("aria-expanded", String(isOpen));
      if (icon)
        icon.className = isOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars";
    });

    menu.addEventListener("click", (e) => {
      if (e.target.closest("a") && menu.classList.contains("open")) {
        menu.classList.remove("open");
        toggleBtn.setAttribute("aria-expanded", "false");
        if (icon) icon.className = "fa-solid fa-bars";
      }
    });
  }

  const navLogin = document.querySelector("[data-nav-login]");
  const navRegister = document.querySelector("[data-nav-register]");
  const navCreate = document.querySelector("[data-nav-create]");
  const navLogout = document.querySelector("[data-nav-logout]");
  const navUser = document.querySelector("[data-nav-user]");

  async function render() {
    const user = await getUser();
    const loggedIn = !!user;

    setVisible(navLogin, !loggedIn);
    setVisible(navRegister, !loggedIn);
    setVisible(navCreate, loggedIn);
    setVisible(navLogout, loggedIn);

    setVisible(navUser, loggedIn);
    if (navUser && loggedIn) {
      navUser.textContent = displayNameFromEmail(user.email);
    }
  }

  if (navLogout) {
    navLogout.addEventListener("click", async (e) => {
      e.preventDefault();
      await logout();

      if (menu?.classList.contains("open")) {
        menu.classList.remove("open");
        toggleBtn?.setAttribute("aria-expanded", "false");
        const icon = toggleBtn?.querySelector("i");
        if (icon) icon.className = "fa-solid fa-bars";
      }
    });
  }

  await render();

  supabase.auth.onAuthStateChange(() => {
    render();
  });
}
