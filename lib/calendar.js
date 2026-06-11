import { apiFetch } from "./api";

export async function getEvents() {
  return apiFetch("/calendar/");
}

export async function getEventById(eventId) {
  return apiFetch(`/calendar/${eventId}`);
}

export async function createEvent(payload) {
  return apiFetch("/calendar/", {
    method: "POST",
    body: payload,
  });
}

export async function updateEvent(eventId, payload) {
  return apiFetch(`/calendar/${eventId}`, {
    method: "PUT",
    body: payload,
  });
}

export async function deleteEvent(eventId) {
  return apiFetch(`/calendar/${eventId}`, {
    method: "DELETE",
  });
}