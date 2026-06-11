"use client";

import { useEffect, useMemo, useState } from "react";
import { getUsers } from "@/lib/users";
import { getCourses } from "@/lib/courses";
import {
  getCourseEnrollments,
  assignStudentToCourse,
} from "@/lib/enrollments";

export default function AdminAssignCoursePage({ onNavigate }) {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [courseEnrollments, setCourseEnrollments] = useState([]);

  const [message, setMessage] = useState("");
  const [kind, setKind] = useState("ok");
  const [loading, setLoading] = useState(false);

  const students = useMemo(() => {
    return users.filter((user) => user.role === "student");
  }, [users]);

  const selectedCourse = useMemo(() => {
    return courses.find(
      (course) => String(course.id) === String(selectedCourseId)
    );
  }, [courses, selectedCourseId]);

  const enrolledStudentIds = useMemo(() => {
    return courseEnrollments.map((enrollment) =>
      Number(enrollment.student_id)
    );
  }, [courseEnrollments]);

  const availableStudents = useMemo(() => {
    return students.filter(
      (student) => !enrolledStudentIds.includes(Number(student.id))
    );
  }, [students, enrolledStudentIds]);

  function showMessage(text, type = "ok") {
    setKind(type);
    setMessage(text);
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
        error.message || "Erreur chargement des données.",
        "err"
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadCourseEnrollments(courseId) {
    if (!courseId) {
      setCourseEnrollments([]);
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const data = await getCourseEnrollments(courseId);
      setCourseEnrollments(data);
    } catch (error) {
      showMessage(
        error.message || "Erreur chargement des inscriptions.",
        "err"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCourseChange(e) {
    const courseId = e.target.value;

    setSelectedCourseId(courseId);
    await loadCourseEnrollments(courseId);
  }

  async function handleAssignStudent(student) {
    if (!selectedCourseId) {
      showMessage("Choisis d'abord un cours.", "err");
      return;
    }

    const ok = confirm(
      `Affecter le cours "${selectedCourse?.title}" à ${student.full_name} ?`
    );

    if (!ok) return;

    try {
      await assignStudentToCourse(student.id, Number(selectedCourseId));

      showMessage("Cours affecté à l'étudiant avec succès.", "ok");

      await loadCourseEnrollments(selectedCourseId);
    } catch (error) {
      showMessage(
        error.message || "Erreur lors de l'affectation.",
        "err"
      );
    }
  }

  useEffect(() => {
    loadInitialData();
  }, []);

  return (
    <section className="page">
      <div className="page-head">
        <h1 className="h1">Affecter un cours à un étudiant</h1>

        <div className="right">
          <button className="btn" onClick={loadInitialData}>
            Rafraîchir
          </button>

          <button className="btn" onClick={() => onNavigate("dashboard")}>
            Retour
          </button>
        </div>
      </div>

      {message && <div className={`toast ${kind}`}>{message}</div>}

      {loading && <p className="muted">Chargement...</p>}

      <div className="grid two">
        <div className="card">
          <h2 className="h2">Choisir un cours</h2>

          <label className="label">Cours</label>
          <select
            className="input select"
            value={selectedCourseId}
            onChange={handleCourseChange}
          >
            <option value="">Choisir un cours</option>

            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title} - {course.code}
              </option>
            ))}
          </select>

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

              <p className="muted">
                Étudiants déjà inscrits : {courseEnrollments.length}
              </p>
              <p className="muted">
                Étudiants disponibles : {availableStudents.length}
              </p>
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="h2">Étudiants sans ce cours</h2>

          {!selectedCourseId && (
            <p className="muted">
              Choisis un cours pour afficher les étudiants non inscrits.
            </p>
          )}

          {selectedCourseId && availableStudents.length === 0 && (
            <p className="muted">
              Tous les étudiants sont déjà inscrits à ce cours.
            </p>
          )}

          <div className="listbox">
            {availableStudents.map((student) => (
              <div className="item" key={student.id}>
                <div className="item-title">{student.full_name}</div>

                <div className="item-sub">
                  Email: {student.email} · ID: {student.id}
                </div>

                <button
                  className="btn btn-primary"
                  style={{ marginTop: "10px" }}
                  onClick={() => handleAssignStudent(student)}
                >
                  Affecter ce cours
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
