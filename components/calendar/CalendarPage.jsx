"use client";

import { useEffect, useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";

import { getEvents, createEvent, deleteEvent } from "@/lib/calendar";
import { getUsers } from "@/lib/users";

function extractProfessorName(description = "") {
  const match = description?.match(/^Professeur:\s*(.+)$/m);
  return match ? match[1] : "";
}

function cleanDescription(description = "") {
  return description?.replace(/^Professeur:\s*.+$/m, "")?.trim();
}

function buildDescription(professorName, description) {
  const parts = [];

  if (professorName?.trim()) {
    parts.push(`Professeur: ${professorName.trim()}`);
  }

  if (description?.trim()) {
    parts.push(description.trim());
  }

  return parts.length > 0 ? parts.join("\n\n") : null;
}

function CalendarEventContent({ event }) {
  const professorName = event.extendedProps.professor_name;
  const eventType = event.extendedProps.event_type;
  const description = event.extendedProps.description;

  return (
    <div className="relative group w-full overflow-visible">
      <div className="truncate px-1 py-0.5 text-xs font-semibold text-white">
        {event.title}
      </div>

      <div
        className="
          pointer-events-none
          absolute bottom-full left-1/2 z-[99999]
          mb-3 hidden w-72 -translate-x-1/2
          rounded-xl border border-white/15
          bg-white p-3 text-left text-sm text-slate-900
          shadow-2xl group-hover:block
        "
      >
        <div className="font-bold text-slate-950">
          {event.title}
        </div>

        {professorName && (
          <div className="mt-1 text-slate-700">
            <b>Professeur :</b> {professorName}
          </div>
        )}

        <div className="mt-1 text-slate-700">
          <b>Type :</b> {eventType}
        </div>

        {description && (
          <div className="mt-2 leading-snug text-slate-600">
            {description}
          </div>
        )}

        <div
          className="
            absolute left-1/2 top-full h-3 w-3
            -translate-x-1/2 -translate-y-1/2 rotate-45
            border-b border-r border-white/30
            bg-white
          "
        />
      </div>
    </div>
  );
}

export default function CalendarPage({ courses = [] }) {
  const [events, setEvents] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [message, setMessage] = useState("");
  const [kind, setKind] = useState("ok");
  const [loading, setLoading] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showTeacherSuggestions, setShowTeacherSuggestions] = useState(false);

  const [form, setForm] = useState({
    title: "",
    professor_name: "",
    description: "",
    event_type: "lecture",
    start_datetime: "",
    end_datetime: "",
    course_id: "",
  });

  const calendarEvents = useMemo(() => {
    return events.map((event) => {
      const professorName =
        event.professor_name || extractProfessorName(event.description || "");

      return {
        id: String(event.id),
        title: event.title,
        start: event.start_datetime,
        end: event.end_datetime || undefined,
        extendedProps: {
          description: cleanDescription(event.description || ""),
          professor_name: professorName,
          event_type: event.event_type,
          course_id: event.course_id,
        },
      };
    });
  }, [events]);

  const filteredTeachers = useMemo(() => {
    const query = form.professor_name.trim().toLowerCase();

    if (!query) return teachers;

    return teachers.filter((teacher) => {
      const fullName = teacher.full_name?.toLowerCase() || "";
      const email = teacher.email?.toLowerCase() || "";
      const username = teacher.username?.toLowerCase() || "";

      return (
        fullName.includes(query) ||
        email.includes(query) ||
        username.includes(query)
      );
    });
  }, [teachers, form.professor_name]);

  function showMessage(text, type = "ok") {
    setKind(type);
    setMessage(text);
  }

  function resetForm() {
    setForm({
      title: "",
      professor_name: "",
      description: "",
      event_type: "lecture",
      start_datetime: "",
      end_datetime: "",
      course_id: "",
    });

    setShowTeacherSuggestions(false);
  }

  function openCreateModal(initialDate = null) {
    if (initialDate) {
      setForm((prev) => ({
        ...prev,
        start_datetime: `${initialDate}T09:00`,
        end_datetime: `${initialDate}T10:00`,
      }));
    }

    setShowCreateModal(true);
  }

  function closeCreateModal() {
    setShowCreateModal(false);
    resetForm();
  }

  async function loadEvents() {
    try {
      setLoading(true);
      setMessage("");

      const data = await getEvents();
      setEvents(data);
    } catch (error) {
      showMessage(error.message || "Erreur chargement calendrier.", "err");
    } finally {
      setLoading(false);
    }
  }

  async function loadTeachers() {
    try {
      const data = await getUsers();
      const onlyTeachers = data.filter((user) => user.role === "teacher");
      setTeachers(onlyTeachers);
    } catch (error) {
      showMessage(
        error.message || "Erreur chargement des professeurs.",
        "err"
      );
    }
  }

  useEffect(() => {
    loadEvents();
    loadTeachers();
  }, []);

  async function handleCreateEvent(e) {
    e.preventDefault();

    if (!form.title || !form.start_datetime) {
      showMessage("Titre et date de début obligatoires.", "err");
      return;
    }

    try {
      const payload = {
        title: form.title,
        description: buildDescription(form.professor_name, form.description),
        event_type: form.event_type,
        start_datetime: new Date(form.start_datetime).toISOString(),
        end_datetime: form.end_datetime
          ? new Date(form.end_datetime).toISOString()
          : null,
        course_id: form.course_id ? Number(form.course_id) : null,
      };

      await createEvent(payload);

      showMessage("Événement créé avec succès.", "ok");
      closeCreateModal();
      await loadEvents();
    } catch (error) {
      showMessage(error.message || "Erreur création événement.", "err");
    }
  }

  function handleEventClick(info) {
    info.jsEvent.preventDefault();

    setDeleteTarget({
      id: info.event.id,
      title: info.event.title,
      start: info.event.startStr,
      end: info.event.endStr,
      professor_name: info.event.extendedProps.professor_name,
      event_type: info.event.extendedProps.event_type,
      description: info.event.extendedProps.description,
    });
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;

    try {
      await deleteEvent(deleteTarget.id);

      showMessage("Événement supprimé.", "ok");
      setDeleteTarget(null);
      await loadEvents();
    } catch (error) {
      showMessage(error.message || "Erreur suppression événement.", "err");
    }
  }

  function selectTeacher(teacher) {
    setForm({
      ...form,
      professor_name: teacher.full_name,
    });

    setShowTeacherSuggestions(false);
  }

  return (
    <section className="page">
      <div className="page-head">
        <h1 className="h1">Calendrier</h1>

        <div className="right">
          <button className="btn" onClick={loadEvents}>
            Rafraîchir
          </button>

          <button className="btn btn-primary" onClick={() => openCreateModal()}>
            Nouvel événement
          </button>
        </div>
      </div>

      {message && <div className={`toast ${kind}`}>{message}</div>}
      {loading && <p className="muted">Chargement...</p>}

      <div className="card calendar-card">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale={frLocale}
          height="auto"
          events={calendarEvents}
          dateClick={(info) => openCreateModal(info.dateStr)}
          eventClick={handleEventClick}
          eventContent={(info) => <CalendarEventContent event={info.event} />}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth",
          }}
          buttonText={{
            today: "Aujourd'hui",
            month: "Mois",
          }}
        />
      </div>

      {showCreateModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-head">
              <h2 className="h2">Créer un événement</h2>

              <button className="btn" onClick={closeCreateModal}>
                Annuler
              </button>
            </div>

            <form className="form-stack" onSubmit={handleCreateEvent}>
              <label className="label">Titre</label>
              <input
                className="input"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Examen, devoir, séance..."
                required
              />

              <label className="label">Nom du professeur</label>

              <div className="relative">
                <input
                  className="input"
                  value={form.professor_name}
                  onFocus={() => setShowTeacherSuggestions(true)}
                  onChange={(e) => {
                    setForm({ ...form, professor_name: e.target.value });
                    setShowTeacherSuggestions(true);
                  }}
                  placeholder="Rechercher un professeur..."
                />

                {showTeacherSuggestions && filteredTeachers.length > 0 && (
                  <div
                    className="
                      absolute left-0 right-0 top-full z-[1400]
                      mt-2 max-h-56 overflow-auto rounded-xl
                      border border-white/15 bg-slate-950/95
                      p-2 shadow-2xl
                    "
                  >
                    {filteredTeachers.map((teacher) => (
                      <button
                        key={teacher.id}
                        type="button"
                        className="
                          block w-full rounded-lg px-3 py-2 text-left
                          text-white hover:bg-white/10
                        "
                        onClick={() => selectTeacher(teacher)}
                      >
                        <div className="font-semibold">
                          {teacher.full_name}
                        </div>
                        <div className="text-xs text-white/60">
                          {teacher.email}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {showTeacherSuggestions &&
                  form.professor_name &&
                  filteredTeachers.length === 0 && (
                    <div
                      className="
                        absolute left-0 right-0 top-full z-[1400]
                        mt-2 rounded-xl border border-white/15
                        bg-slate-950/95 p-3 text-sm text-white/70
                        shadow-2xl
                      "
                    >
                      Aucun professeur trouvé.
                    </div>
                  )}
              </div>

              <label className="label">Type</label>
              <select
                className="input select"
                value={form.event_type}
                onChange={(e) =>
                  setForm({ ...form, event_type: e.target.value })
                }
              >
                <option value="lecture">Séance</option>
                <option value="assignment">Devoir</option>
                <option value="exam">Examen</option>
                <option value="meeting">Réunion</option>
              </select>

              <label className="label">Cours</label>
              <select
                className="input select"
                value={form.course_id}
                onChange={(e) =>
                  setForm({ ...form, course_id: e.target.value })
                }
              >
                <option value="">Sans cours</option>

                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title} - {course.code}
                  </option>
                ))}
              </select>

              <label className="label">Début</label>
              <input
                className="input"
                type="datetime-local"
                value={form.start_datetime}
                onChange={(e) =>
                  setForm({ ...form, start_datetime: e.target.value })
                }
                required
              />

              <label className="label">Fin</label>
              <input
                className="input"
                type="datetime-local"
                value={form.end_datetime}
                onChange={(e) =>
                  setForm({ ...form, end_datetime: e.target.value })
                }
              />

              <label className="label">Description</label>
              <textarea
                className="input textarea"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Détails de l'événement..."
              />

              <div className="modal-actions">
                <button
                  className="btn"
                  type="button"
                  onClick={closeCreateModal}
                >
                  Cancel
                </button>

                <button className="btn btn-primary" type="submit">
                  Créer événement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="modal-backdrop">
          <div className="modal-card small-modal">
            <h2 className="h2">Supprimer l’événement ?</h2>

            <div className="item" style={{ marginTop: "12px" }}>
              <div className="item-title">{deleteTarget.title}</div>

              {deleteTarget.professor_name && (
                <div className="item-sub">
                  Professeur : {deleteTarget.professor_name}
                </div>
              )}

              <div className="item-sub">Type : {deleteTarget.event_type}</div>

              {deleteTarget.description && (
                <p className="muted" style={{ marginTop: "10px" }}>
                  {deleteTarget.description}
                </p>
              )}
            </div>

            <div className="modal-actions">
              <button className="btn" onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>

              <button
                className="btn navlink-danger"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}