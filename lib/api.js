import { getToken } from "./token";

const API_BASE = "http://127.0.0.1:8000";

export async function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set("Accept", "application/json");

  if (options.auth !== false) {
    const token = getToken();

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  let body = options.body;

  if (
    body &&
    typeof body === "object" &&
    !(body instanceof FormData) &&
    !(body instanceof URLSearchParams)
  ) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    body,
  });

  const text = await res.text();

  const data = text
    ? (() => {
        try {
          return JSON.parse(text);
        } catch {
          return text;
        }
      })()
    : null;

  if (!res.ok) {
    const detail = data?.detail || data || res.statusText;

    throw new Error(
      typeof detail === "string" ? detail : JSON.stringify(detail)
    );
  }

  return data;
}