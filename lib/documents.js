import { apiFetch } from "./api";

export async function getCourseDocuments(courseId) {
  return apiFetch(`/documents/course/${courseId}`);
}

export async function getDocumentById(documentId) {
  return apiFetch(`/documents/${documentId}`);
}

export async function uploadDocument(courseId, file) {
  const formData = new FormData();
  formData.append("file", file);

  return apiFetch(`/documents/course/${courseId}`, {
    method: "POST",
    body: formData,
  });
}

export async function deleteDocument(documentId) {
  return apiFetch(`/documents/${documentId}`, {
    method: "DELETE",
  });
}