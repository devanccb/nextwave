import { useEffect, useState } from "react";

export const API_BASE = "https://nextwave-api.azurewebsites.net";

export function useAuth() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    let cancelled = false;
    fetch("/.auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        const principal = data && data.clientPrincipal;
        setUser(principal || null);
      })
      .catch(() => !cancelled && setUser(null));
    return () => {
      cancelled = true;
    };
  }, []);

  return user;
}

let apiSessionPromise = null;

async function ensureApiSession() {
  if (apiSessionPromise) return apiSessionPromise;
  apiSessionPromise = (async () => {
    const r = await fetch(`${API_BASE}/.auth/me`, { credentials: "include" });
    if (r.ok) {
      const data = await r.json();
      const arr = Array.isArray(data) ? data : data.clientPrincipal ? [data] : [];
      if (arr.length > 0) return true;
    }
    const back = window.location.href;
    window.location.href =
      `${API_BASE}/.auth/login/aad?post_login_redirect_uri=${encodeURIComponent(back)}`;
    return new Promise(() => {});
  })();
  return apiSessionPromise;
}

export async function apiFetch(path, init = {}) {
  await ensureApiSession();
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const res = await fetch(url, { ...init, credentials: "include" });
  if (res.status === 401) {
    apiSessionPromise = null;
    await ensureApiSession();
    return fetch(url, { ...init, credentials: "include" });
  }
  return res;
}

export function loginUrl(returnTo = "/") {
  return `/.auth/login/aad?post_login_redirect_uri=${encodeURIComponent(returnTo)}`;
}

export function logoutUrl(returnTo = "/") {
  return `/.auth/logout?post_logout_redirect_uri=${encodeURIComponent(returnTo)}`;
}
