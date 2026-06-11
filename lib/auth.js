import { apiFetch } from "./api";
import { setToken, removeToken } from "./token";

export async function register(payload) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: payload,
    auth: false,
  });
}

export async function login(email, password) {
  const form = new URLSearchParams();
  form.set("username", email);
  form.set("password", password);

  const data = await apiFetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form,
    auth: false,
  });

  setToken(data.access_token);
  return data;
}

export function logout() {
  removeToken();
}