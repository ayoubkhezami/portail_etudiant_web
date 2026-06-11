"use client";

import { useEffect, useState } from "react";
import "./globals.css";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AuthPage from "@/components/auth/AuthPage";
import DashboardPage from "@/components/dashboard/DashboardPage";
import CourseDetailsPage from "@/components/courses/CourseDetailsPage";
import { logout as logoutApi } from "@/lib/auth";
import { getCourses } from "@/lib/courses";
import { getToken } from "@/lib/token";
import { getMe } from "@/lib/users";
import AdminCoursesPage from "@/components/admin/AdminCoursesPage";
import AdminAssignCoursePage from "@/components/admin/AdminAssignCoursePage";
import ChatPage from "@/components/chat/ChatPage";
import CalendarPage from "@/components/calendar/CalendarPage";
export default function HomePage() {
  const [page, setPage] = useState("auth");
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  useEffect(() => {
    const token = getToken();

    if (!token) {
      setPage("auth");
      return;
    }

    loadInitialData();
  }, []);

  async function loadInitialData() {
    try {
      const currentUser = await getMe();
      setUser(currentUser);
      setIsAuthenticated(true);

      const courseList = await getCourses();
      setCourses(courseList);

      setPage("dashboard");
    } catch (error) {
      logoutApi();
      setUser(null);
      setCourses([]);
      setIsAuthenticated(false);
      setPage("auth");
    }
  }

  async function refreshCourses() {
    const courseList = await getCourses();
    setCourses(courseList);
  }

  function handleNavigate(nextPage, payload = null) {
    if (!isAuthenticated && nextPage !== "auth") {
      setPage("auth");
      return;
    }

    if (nextPage === "course") {
      setSelectedCourse(payload);
    }

    if (nextPage === "chat" && payload) {
      setSelectedCourse(payload);
    }

    setPage(nextPage);

    if (nextPage === "dashboard") {
      refreshCourses();
    }
  }

  function handleLogout() {
    logoutApi();
    setUser(null);
    setCourses([]);
    setIsAuthenticated(false);
    setPage("auth");
  }

  return (
    <div className="app-shell">
      <Header
        currentPage={page}
        isAuthenticated={isAuthenticated}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        user={user}
      />

      <main className="content">
        {page === "auth" && <AuthPage onLoginSuccess={loadInitialData} />}

        {page === "dashboard" && (
          <DashboardPage
            user={user}
            courses={courses}
            onRefresh={refreshCourses}
            onNavigate={handleNavigate}
          />
        )}
        {page === "calendar" && <CalendarPage courses={courses} />}

        {page === "admin-courses" && (
          <AdminCoursesPage onNavigate={handleNavigate} />
        )}
        {page === "chat" && <ChatPage courses={courses} />}
        {page === "admin-assign-course" && (
          <AdminAssignCoursePage onNavigate={handleNavigate} />
        )}
        {page === "profile" && (
          <section className="page">
            <div className="card">
              <h1 className="h1">Mon compte</h1>

              {user ? (
                <div className="kv">
                  <div className="kv-row">
                    <div className="k">Email</div>
                    <div className="v">{user.email}</div>
                  </div>

                  <div className="kv-row">
                    <div className="k">Username</div>
                    <div className="v">{user.username}</div>
                  </div>

                  <div className="kv-row">
                    <div className="k">Role</div>
                    <div className="v">{user.role}</div>
                  </div>
                </div>
              ) : (
                <p className="muted">Aucun utilisateur chargé.</p>
              )}
            </div>
          </section>
        )}
        {page === "course" && (
          <CourseDetailsPage
            course={selectedCourse}
            onBack={() => handleNavigate("dashboard")}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
