"use client";

import { useEffect, useMemo, useState } from "react";
import { getUsers } from "@/lib/users";
import { getCourses, unassignTeacherFromCourse } from "@/lib/courses";
import {
  getCourseEnrollments,
  unenroll,
} from "@/lib/enrollments";
function AdminPageHeader({ onRefresh, onNavigate }) {
  return (
    <div className="page-head">
      <h1 className="h1">Administration des cours</h1>

      <div className="right">
        <button className="btn" onClick={onRefresh}>
          Rafraîchir
        </button>

        <button className="btn" onClick={() => onNavigate("dashboard")}>
          Retour
        </button>
      </div>
    </div>
  );
}

function TeacherCoursesPanel({
  teachers,
  courses,
  selectedCourseId,
  selectedCourse,
  onCourseChange,
  onUnassignTeacher,
}) {
  const assignedTeacher = selectedCourse
    ? teachers.find((teacher) => teacher.id === selectedCourse.teacher_id)
    : null;

  return (
    <div className="card">
      <h2 className="h2">Cours et teacher assigné</h2>

      <label className="label">Cours</label>
      <select
        className="input select"
        value={selectedCourseId}
        onChange={onCourseChange}
      >
        <option value="">Choisir un cours</option>

        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.title} - {course.code}
          </option>
        ))}
      </select>

      {!selectedCourse && (
        <p className="muted" style={{ marginTop: "12px" }}>
          Choisis un cours pour voir le teacher assigné.
        </p>
      )}

      {selectedCourse && (
        <div className="item" style={{ marginTop: "14px" }}>
          <div className="item-title">{selectedCourse.title}</div>

          <div className="item-sub">
            Code: <b>{selectedCourse.code}</b> · Teacher ID:{" "}
            {selectedCourse.teacher_id || "Aucun teacher"}
          </div>

          <p className="muted" style={{ marginTop: "10px" }}>
            {selectedCourse.description}
          </p>

          <div className="divider"></div>

          <h3 className="h3">Teacher assigné</h3>

          {assignedTeacher ? (
            <div className="item" style={{ marginTop: "10px" }}>
              <div className="item-title">{assignedTeacher.full_name}</div>

              <div className="item-sub">
                Email: {assignedTeacher.email} · ID: {assignedTeacher.id}
              </div>

              <button
                className="btn navlink-danger"
                style={{ marginTop: "10px" }}
                onClick={() => onUnassignTeacher(selectedCourse)}
              >
                Retirer ce teacher du cours
              </button>
            </div>
          ) : (
            <p className="muted">Aucun teacher assigné à ce cours.</p>
          )}
        </div>
      )}
    </div>
  );
}

function StudentEnrollmentsPanel({
  selectedCourseId,
  enrollments,
  getStudentName,
  onUnenroll,
}) {
  return (
    <div className="card">
      <h2 className="h2">Students inscrits au cours</h2>

      {!selectedCourseId && (
        <p className="muted">Choisis un cours pour voir ses étudiants.</p>
      )}

      {selectedCourseId && enrollments.length === 0 && (
        <p className="muted">Aucun étudiant inscrit à ce cours.</p>
      )}

      <div className="listbox">
        {enrollments.map((enrollment) => (
          <div className="item" key={enrollment.id}>
            <div className="item-title">
              {getStudentName(enrollment.student_id)}
            </div>

            <div className="item-sub">
              Enrollment ID: <b>{enrollment.id}</b> · Course ID:{" "}
              {enrollment.course_id} · Status: {enrollment.status}
            </div>

            <button
              className="btn navlink-danger"
              style={{ marginTop: "10px" }}
              onClick={() => onUnenroll(enrollment)}
            >
              Supprimer ce cours pour cet étudiant
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminCoursesPage({ onNavigate }) {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [enrollments, setEnrollments] = useState([]);
  const [message, setMessage] = useState("");
  const [kind, setKind] = useState("ok");
  const [loading, setLoading] = useState(false);

  const teachers = useMemo(() => {
    return users.filter((user) => user.role === "teacher");
  }, [users]);

  const students = useMemo(() => {
    return users.filter((user) => user.role === "student");
  }, [users]);

  const filteredCourses = useMemo(() => {
    if (!selectedTeacherId) return courses;

    return courses.filter(
      (course) => String(course.teacher_id) === String(selectedTeacherId),
    );
  }, [courses, selectedTeacherId]);

  const selectedCourse = useMemo(() => {
    return courses.find(
      (course) => String(course.id) === String(selectedCourseId),
    );
  }, [courses, selectedCourseId]);

  function showMessage(text, type = "ok") {
    setKind(type);
    setMessage(text);
  }

  function getStudentName(studentId) {
    const student = students.find((user) => user.id === studentId);

    if (!student) {
      return `Student ID: ${studentId}`;
    }

    return `${student.full_name} (${student.email})`;
  }

  async function loadInitialData() {
    try {
      setLoading(true);
      setMessage("");

      const [usersData, coursesData] = await Promise.all([
        getUsers(),
        getCourses(),
      ]);

      setUsers(usersData);
      setCourses(coursesData);
    } catch (error) {
      showMessage(
        error.message || "Erreur chargement des données admin.",
        "err",
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadEnrollments(courseId) {
    if (!courseId) {
      setEnrollments([]);
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const data = await getCourseEnrollments(courseId);
      setEnrollments(data);
    } catch (error) {
      showMessage(
        error.message || "Erreur chargement des inscriptions.",
        "err",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleTeacherChange(e) {
    const teacherId = e.target.value;

    setSelectedTeacherId(teacherId);
    setSelectedCourseId("");
    setEnrollments([]);
  }

  async function handleCourseChange(e) {
    const courseId = e.target.value;

    setSelectedCourseId(courseId);
    await loadEnrollments(courseId);
  }

  async function handleUnenroll(enrollment) {
    const ok = confirm(
      `Supprimer l'inscription de l'étudiant ${enrollment.student_id} au cours ${enrollment.course_id} ?`,
    );

    if (!ok) return;

    try {
      await unenroll(enrollment.id);

      showMessage("Étudiant désinscrit du cours avec succès.", "ok");

      await loadEnrollments(selectedCourseId);
    } catch (error) {
      showMessage(error.message || "Erreur lors de la désinscription.", "err");
    }
  }

  async function handleUnassignTeacher(course) {
    const ok = confirm(
      `Retirer le cours "${course.title}" de ce teacher ? Le cours restera dans la base.`,
    );

    if (!ok) return;

    try {
      await unassignTeacherFromCourse(course.id);

      showMessage("Cours retiré du teacher avec succès.", "ok");

      setSelectedCourseId("");
      setEnrollments([]);

      const coursesData = await getCourses();
      setCourses(coursesData);
    } catch (error) {
      showMessage(
        error.message || "Erreur lors du retrait du cours du teacher.",
        "err",
      );
    }
  }

  useEffect(() => {
    loadInitialData();
  }, []);

  return (
    <section className="page">
      <AdminPageHeader onRefresh={loadInitialData} onNavigate={onNavigate} />

      {message && <div className={`toast ${kind}`}>{message}</div>}

      {loading && <p className="muted">Chargement...</p>}

      <div className="grid two">
        <TeacherCoursesPanel
          teachers={teachers}
          courses={courses}
          selectedCourseId={selectedCourseId}
          selectedCourse={selectedCourse}
          onCourseChange={handleCourseChange}
          onUnassignTeacher={handleUnassignTeacher}
        />
        <StudentEnrollmentsPanel
          selectedCourseId={selectedCourseId}
          enrollments={enrollments}
          getStudentName={getStudentName}
          onUnenroll={handleUnenroll}
        />
      
      </div>
    </section>
  );
}
