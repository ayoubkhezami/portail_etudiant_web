import { apiFetch } from "./api";

export async function getMe() {
  return apiFetch("/users/me");
}

export async function updateMe(payload) {
  return apiFetch("/users/me", {
    method: "PUT",
    body: payload,
  });
}

export async function getUsers() {
  return apiFetch("/users/");
}

export async function getUserById(userId) {
  return apiFetch(`/users/${userId}`);
}