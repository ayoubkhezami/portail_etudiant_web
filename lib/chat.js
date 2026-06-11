import { apiFetch } from "./api";

export async function getChatSessions() {
  return apiFetch("/chat/sessions");
}

export async function createChatSession(courseId, title = "New Chat") {
  return apiFetch("/chat/sessions", {
    method: "POST",
    body: {
      course_id: courseId,
      title,
    },
  });
}

export async function getChatSessionHistory(sessionId) {
  return apiFetch(`/chat/sessions/${sessionId}`);
}

export async function getSessionMessages(sessionId) {
  return apiFetch(`/chat/sessions/${sessionId}/messages`);
}

export async function deleteChatSession(sessionId) {
  return apiFetch(`/chat/sessions/${sessionId}`, {
    method: "DELETE",
  });
}