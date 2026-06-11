import { apiFetch } from "./api";

export async function enrollCourse(courseId) {
  return apiFetch("/enrollments/", {
    method: "POST",
    body: {
      course_id: courseId,
    },
  });
}

export async function getMyEnrollments() {
  return apiFetch("/enrollments/my");
}

export async function getCourseEnrollments(courseId) {
  return apiFetch(`/enrollments/course/${courseId}`);
}

export async function unenroll(enrollmentId) {
  return apiFetch(`/enrollments/${enrollmentId}`, {
    method: "DELETE",
  });
}

export async function assignStudentToCourse(studentId, courseId) {
  return apiFetch("/enrollments/assign", {
    method: "POST",
    body: {
      student_id: studentId,
      course_id: courseId,
    },
  });
}