import { supabase } from "./supabase.js";
import { getUser } from "./auth.js";

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function displayNameFromEmail(email) {
  if (!email) return "User";
  const local = email.split("@")[0] || "user";
  const lettersOnly = (local.match(/^[a-zA-Z]+/) || [local])[0];
  return (
    lettersOnly.charAt(0).toUpperCase() + lettersOnly.slice(1).toLowerCase()
  );
}

export async function loadArticles() {
  const list = document.querySelector("#articlesList");
  const message = document.querySelector("#pageMessage");

  if (!list) return;

  if (!list.dataset.deleteBound) {
    list.dataset.deleteBound = "true";

    list.addEventListener("click", async (e) => {
      const btn = e.target.closest("[data-delete-id]");
      if (!btn) return;

      const articleId = btn.getAttribute("data-delete-id");
      if (!articleId) return;

      const ok = confirm("Delete this article? This cannot be undone.");
      if (!ok) return;

      btn.disabled = true;
      btn.textContent = "Deleting...";

      const { error } = await supabase
        .from("articles")
        .delete()
        .eq("id", articleId);

      if (error) {
        console.error(error);
        btn.disabled = false;
        btn.textContent = "Delete";
        if (message) message.textContent = `Delete failed: ${error.message}`;
        return;
      }

      if (message) message.textContent = "Article deleted.";
      await loadArticles();
    });
  }

  list.innerHTML = `<div class="card">Loading articles…</div>`;
  if (message) message.textContent = "";

  const user = await getUser();
  const loggedIn = !!user;
  const myId = user?.id ?? null;
  const myName = loggedIn ? displayNameFromEmail(user.email) : null;

  const { data, error } = await supabase
    .from("articles")
    .select("id,title,body,category,created_at,submitted_by")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    list.innerHTML = "";
    if (message)
      message.textContent = `Error loading articles: ${error.message}`;
    return;
  }

  if (!data || data.length === 0) {
    list.innerHTML = loggedIn
      ? `<div class="card">No articles yet.</div>`
      : `<div class="card">No articles yet. Log in to create the first one.</div>`;
    return;
  }

  list.innerHTML = data
    .map((a) => {
      const isMine = loggedIn && myId && a.submitted_by === myId;
      const submittedLabel = isMine ? myName || "You" : "Member";

      return `
        <article class="card">
          <h3 class="card-title">${escapeHtml(a.title)}</h3>

          <p class="small">
            <strong>${escapeHtml(a.category)}</strong>
            • ${escapeHtml(formatDate(a.created_at))}
            • Submitted by: ${escapeHtml(submittedLabel)}
          </p>

          <p class="card-body">${escapeHtml(a.body)}</p>

          ${
            isMine
              ? `<div class="card-actions">
                   <button class="btn btn-danger" type="button" data-delete-id="${escapeHtml(a.id)}">Delete</button>
                 </div>`
              : ``
          }
        </article>
      `;
    })
    .join("");
}
