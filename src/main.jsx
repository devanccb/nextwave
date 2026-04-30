import React from "react";
import ReactDOM from "react-dom/client";
import NextWavePlatform from "./App.jsx";
import { useAuth, logoutUrl } from "./auth.js";

function UserBadge() {
  const user = useAuth();
  if (user === undefined) return null;
  if (!user) return null;
  const name = user.userDetails || "Signed in";
  return (
    <div
      style={{
        position: "fixed",
        top: 8,
        right: 12,
        zIndex: 9999,
        background: "rgba(255,255,255,0.92)",
        border: "1px solid #E4E2DE",
        borderRadius: 8,
        padding: "6px 10px",
        fontSize: 12,
        color: "#1A1917",
        fontFamily: "system-ui, -apple-system, sans-serif",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        display: "flex",
        gap: 10,
        alignItems: "center",
      }}
    >
      <span title={user.userId}>{name}</span>
      <a
        href={logoutUrl("/")}
        style={{ color: "#7D7B76", textDecoration: "none", fontWeight: 500 }}
      >
        Sign out
      </a>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NextWavePlatform />
    <UserBadge />
  </React.StrictMode>
);
