import { supabase } from "./supabase.js";

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) console.error(error);
  return data?.session ?? null;
}

export async function getUser() {
  const session = await getSession();
  return session?.user ?? null;
}

export async function requireAuth(redirectTo = "/login.html") {
  const user = await getUser();
  if (!user) {
    window.location.href = redirectTo;
    return null;
  }
  return user;
}

export async function logout() {
  await supabase.auth.signOut();
  window.location.href = "/index.html";
}
