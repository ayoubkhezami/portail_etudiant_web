import { apiFetch } from "./api";

export async function sendAIChatMessage(sessionId, message) {
  return apiFetch("/ai/chat", {
    method: "POST",
    body: {
      session_id: sessionId,
      message,
    },
  });
}

export async function summarizeCourse(courseId, documentId = null) {
  return apiFetch("/ai/summarize", {
    method: "POST",
    body: {
      course_id: courseId,
      document_id: documentId,
    },
  });
}

export async function generateFlashcards(courseId, documentId = null, count = 10) {
  return apiFetch("/ai/flashcards", {
    method: "POST",
    body: {
      course_id: courseId,
      document_id: documentId,
      count,
    },
  });
}

export async function generateQuiz(courseId, documentId = null, count = 5) {
  return apiFetch("/ai/quiz", {
    method: "POST",
    body: {
      course_id: courseId,
      document_id: documentId,
      count,
    },
  });
}

export async function generateMindmap(courseId, documentId = null) {
  return apiFetch("/ai/mindmap", {
    method: "POST",
    body: {
      course_id: courseId,
      document_id: documentId,
    },
  });
}

export async function getKeypoints(courseId, documentId = null) {
  return apiFetch("/ai/keypoints", {
    method: "POST",
    body: {
      course_id: courseId,
      document_id: documentId,
    },
  });
}

export async function getAIUsage(courseId) {
  return apiFetch(`/ai/usage/${courseId}`);
}