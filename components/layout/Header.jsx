export default function Header({
  currentPage,
  isAuthenticated,
  onNavigate,
  onLogout,
  user
}) {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="logo" aria-hidden="true"></div>

        <div className="brand-text">
          <div className="brand-title">Portail Étudiant Intelligent</div>
          <div className="brand-sub">Backend: FastAPI · Frontend: Next.js</div>
        </div>
      </div>

      <nav className="nav">
        <button
          className={`navlink ${currentPage === "dashboard" ? "active" : ""}`}
          onClick={() => onNavigate("dashboard")}
        >
          Dashboard
        </button>

        <button
          className={`navlink ${currentPage === "chat" ? "active" : ""}`}
          onClick={() => onNavigate("chat")}
        >
          Chat IA
        </button>
        <button
          className={`navlink ${currentPage === "admin-courses" ? "active" : ""}`}
          onClick={() => onNavigate("admin-courses")}
        >
          Admin cours
        </button>
        {isAuthenticated && user?.role === "admin" && (
          <button
            className={`navlink ${
              currentPage === "admin-assign-course" ? "active" : ""
            }`}
            onClick={() => onNavigate("admin-assign-course")}
          >
            Affecter cours
          </button>
        )}
        <button
          className={`navlink ${currentPage === "calendar" ? "active" : ""}`}
          onClick={() => onNavigate("calendar")}
        >
          Calendrier
        </button>

        <button
          className={`navlink ${currentPage === "profile" ? "active" : ""}`}
          onClick={() => onNavigate("profile")}
        >
          Mon compte
        </button>

        {isAuthenticated && (
          <button className="navlink navlink-danger" onClick={onLogout}>
            Déconnexion
          </button>
        )}
      </nav>
    </header>
  );
}
