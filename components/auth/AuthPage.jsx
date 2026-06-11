"use client";

import { useState } from "react";
import { login, register } from "@/lib/auth";

export default function AuthPage({ onLoginSuccess }) {
  const [mode, setMode] = useState("login");
  const [message, setMessage] = useState("");
  const [kind, setKind] = useState("ok");

  function showToast(text, type = "ok") {
    setMessage(text);
    setKind(type);
    setTimeout(() => setMessage(""), 4000);
  }

  async function handleLogin(e) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email");
    const password = formData.get("password");

    try {
      showToast("Connexion...", "ok");
      await login(email, password);
      await onLoginSuccess();
    } catch (error) {
      showToast(error.message || "Erreur login", "err");
    }
  }

  async function handleRegister(e) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const payload = {
      email: formData.get("email"),
      username: formData.get("username"),
      full_name: formData.get("full_name"),
      password: formData.get("password"),
    };

    try {
      await register(payload);
      showToast("Compte créé. Connecte-toi maintenant.", "ok");
      setMode("login");
    } catch (error) {
      showToast(error.message || "Erreur inscription", "err");
    }
  }

  return (
    <section className="page">
      <div className="grid">
        <div className="card hero-card">
          <h1 className="h1">Connecte-toi</h1>

          <p className="muted">
            Accès sécurisé aux cours, documents, chat IA et calendrier.
          </p>

          <div className="form-row">
            <button
              className="toggle"
              type="button"
              onClick={() => setMode("login")}
            >
              Connexion
            </button>

            <button
              className="toggle"
              type="button"
              onClick={() => setMode("register")}
            >
              Inscription
            </button>
          </div>

          {mode === "login" && (
            <form className="auth-form" onSubmit={handleLogin}>
              <label className="label">Email</label>
              <input
                className="input"
                name="email"
                type="email"
                required
                placeholder="student@portail.edu"
              />

              <label className="label">Mot de passe</label>
              <input
                className="input"
                name="password"
                type="password"
                required
                placeholder="student123"
              />

              <button className="btn btn-primary mt-2" type="submit">
                Se connecter
              </button>
            </form>
          )}

          {mode === "register" && (
            <form className="auth-form" onSubmit={handleRegister}>
              <label className="label">Email</label>
              <input
                className="input"
                name="email"
                type="email"
                required
                placeholder="prenom.nom@etu.com"
              />

              <label className="label">Nom d'utilisateur</label>
              <input
                className="input"
                name="username"
                type="text"
                required
                placeholder="prenom_nom"
              />

              <label className="label">Nom complet</label>
              <input
                className="input"
                name="full_name"
                type="text"
                required
                placeholder="Prénom Nom"
              />

              <label className="label">Mot de passe</label>
              <input
                className="input"
                name="password"
                type="password"
                required
                placeholder="••••••••"
              />

              <div className="hint">Le rôle par défaut est Student.</div>

              <button className="btn btn-primary" type="submit">
                Créer le compte
              </button>
            </form>
          )}

          {message && <div className={`toast ${kind}`}>{message}</div>}
        </div>

        <div className="card stat-card">
          <h2 className="h2">API utilisée</h2>

          <div className="pill">POST /auth/login</div>
          <div className="pill">POST /auth/register</div>
          <div className="pill">GET /courses</div>
          <div className="pill">POST /enrollments</div>
          <div className="pill">Chat IA: POST /ai/chat</div>
          <div className="pill">Calendrier: /calendar</div>
        </div>
      </div>
    </section>
  );
}