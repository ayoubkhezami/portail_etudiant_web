import { apiFetch } from "./api";

export async function getCourses() {
  return apiFetch("/courses/");
}

export async function getCourseById(courseId) {
  return apiFetch(`/courses/${courseId}`);
}

export async function createCourse(payload) {
  return apiFetch("/courses/", {
    method: "POST",
    body: payload,
  });
}

export async function updateCourse(courseId, payload) {
  return apiFetch(`/courses/${courseId}`, {
    method: "PUT",
    body: payload,
  });
}

export async function deleteCourse(courseId) {
  return apiFetch(`/courses/${courseId}`, {
    method: "DELETE",
  });
}

export async function unassignTeacherFromCourse(courseId) {
  return apiFetch(`/courses/${courseId}/teacher`, {
    method: "DELETE",
  });
}