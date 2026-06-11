"use client";

export default function DashboardPage({
  user,
  courses,
  onRefresh,
  onNavigate,
}) {
  return (
    <section className="page">
      <div className="page-head">
        <h1 className="h1">Dashboard</h1>

        <div className="right">
          <button className="btn" onClick={onRefresh}>
            Rafraîchir
          </button>
        </div>
      </div>

      <div className="grid two">
        <div className="card">
          <div className="card-head">
            <h2 className="h2">Mes cours</h2>
            <div className="submuted muted">Total: {courses.length}</div>
          </div>

          <div className="listbox">
            {courses.length === 0 && (
              <div className="muted">Aucun cours accessible.</div>
            )}

            {courses.map((course) => (
              <div className="item" key={course.id}>
                <div className="item-title">{course.title}</div>

                <div className="item-sub">
                  Code: <b>{course.code}</b> · Actif:{" "}
                  {course.is_active ? "oui" : "non"} · Teacher ID:{" "}
                  {course.teacher_id}
                </div>

                <p className="muted" style={{ marginTop: "10px" }}>
                  {course.description}
                </p>

                <button
                  className="btn btn-primary"
                  style={{ marginTop: "10px" }}
                  onClick={() => onNavigate("course", course)}
                >
                  Consulter le cours
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="h2">Actions rapides</h2>

          <div className="quick">
            <button className="quickbtn" onClick={() => onNavigate("chat")}>
              Ouvrir le chat IA
            </button>

            <button className="quickbtn" onClick={() => onNavigate("calendar")}>
              Voir mon calendrier
            </button>

            <button className="quickbtn" onClick={() => onNavigate("profile")}>
              Gérer mon compte
            </button>
          </div>

          <div className="divider"></div>

          <h3 className="h3">Indice</h3>
          <p className="muted">
            Choisis un cours pour consulter son contenu ou démarrer une session de chat IA.
          </p>
        </div>
      </div>
    </section>
  );
}