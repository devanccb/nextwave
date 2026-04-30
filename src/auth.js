import { useEffect, useState } from "react";

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

export function loginUrl(returnTo = "/") {
  return `/.auth/login/aad?post_login_redirect_uri=${encodeURIComponent(returnTo)}`;
}

export function logoutUrl(returnTo = "/") {
  return `/.auth/logout?post_logout_redirect_uri=${encodeURIComponent(returnTo)}`;
}
