"use client";

export default function CourseDetailsPage({ course, onBack, onNavigate }) {
  if (!course) {
    return (
      <section className="page">
        <div className="card">
          <h1 className="h1">Cours introuvable</h1>
          <button className="btn" onClick={onBack}>
            Retour
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="page-head">
        <h1 className="h1">{course.title}</h1>

        <div className="right">
          <button className="btn" onClick={onBack}>
            Retour
          </button>

          <button
            className="btn btn-primary"
            onClick={() => onNavigate("chat", course)}
          >
            Ouvrir le chat IA
          </button>
        </div>
      </div>

      <div className="grid two">
        <div className="card">
          <h2 className="h2">Contenu du cours</h2>

          <div className="pill">Code : {course.code}</div>
          <div className="pill">Teacher ID : {course.teacher_id}</div>
          <div className="pill">
            Statut : {course.is_active ? "Actif" : "Inactif"}
          </div>

          <div className="divider"></div>

          <p className="muted">{course.description}</p>
        </div>

        <div className="card">
          <h2 className="h2">Actions IA</h2>

          <div className="quick">
            <button className="quickbtn">Résumé du cours</button>
            <button className="quickbtn">Points clés</button>
            <button className="quickbtn">Flashcards</button>
            <button className="quickbtn">Quiz</button>
            <button className="quickbtn">Mindmap</button>
          </div>

          <div className="divider"></div>

          <p className="muted">
            Ces actions seront connectées aux routes IA après.
          </p>
        </div>
      </div>
    </section>
  );
}

