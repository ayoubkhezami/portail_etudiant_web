"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getChatSessions,
  createChatSession,
  getChatSessionHistory,
  deleteChatSession,
} from "@/lib/chat";
import {
  sendAIChatMessage,
  summarizeCourse,
  getKeypoints,
  generateFlashcards,
  generateQuiz,
} from "@/lib/ai";
import {
  getCourseDocuments,
  uploadDocument,
  deleteDocument,
} from "@/lib/documents";

function SourcesPanel({
  courses,
  selectedCourseId,
  documents,
  selectedDocumentId,
  onCourseChange,
  onDocumentChange,
  onUpload,
  onDeleteDocument,
}) {
  return (
    <aside className="nlm-panel">
      <h2 className="h2">Sources</h2>

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

      <div className="divider"></div>

      <label className="label">Ajouter document</label>
      <input
        className="input"
        type="file"
        onChange={onUpload}
        disabled={!selectedCourseId}
      />

      <div className="divider"></div>

      <h3 className="h3">Documents du cours</h3>

      {!selectedCourseId && (
        <p className="muted">Choisis un cours pour afficher ses documents.</p>
      )}

      {selectedCourseId && documents.length === 0 && (
        <p className="muted">Aucun document pour ce cours.</p>
      )}

      <div className="listbox">
        <button
          className={`item ${selectedDocumentId === "" ? "active" : ""}`}
          onClick={() => onDocumentChange("")}
          type="button"
        >
          <div className="item-title">Tous les documents</div>
          <div className="item-sub">Utiliser toutes les sources du cours</div>
        </button>

        {documents.map((doc) => (
          <div
            className={`item ${
              String(selectedDocumentId) === String(doc.id) ? "active" : ""
            }`}
            key={doc.id}
          >
            <button
              className="source-button"
              type="button"
              onClick={() => onDocumentChange(doc.id)}
            >
              <div className="item-title">{doc.original_filename}</div>
              <div className="item-sub">
                Type: {doc.file_type} · ID: {doc.id}
              </div>
            </button>

            <button
              className="btn navlink-danger"
              style={{ marginTop: "8px" }}
              onClick={() => onDeleteDocument(doc.id)}
              type="button"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}

function ChatCenter({
  selectedCourse,
  sessions,
  activeSessionId,
  messages,
  question,
  loading,
  onCreateSession,
  onSelectSession,
  onDeleteSession,
  onQuestionChange,
  onSend,
}) {
  return (
    <main className="nlm-chat">
      <div className="chat-head">
        <div>
          <div className="chat-title">
            {selectedCourse ? selectedCourse.title : "Chat IA"}
          </div>
          <div className="chat-meta">
            {selectedCourse
              ? `Cours: ${selectedCourse.code}`
              : "Choisis un cours pour commencer"}
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={onCreateSession}
          disabled={!selectedCourse}
          type="button"
        >
          Nouvelle session
        </button>
      </div>

      <div className="nlm-sessions">
        {sessions.map((session) => (
          <button
            key={session.id}
            type="button"
            className={`session-chip ${
              activeSessionId === session.id ? "active" : ""
            }`}
            onClick={() => onSelectSession(session.id)}
          >
            {session.title || `Session ${session.id}`}
          </button>
        ))}

        {activeSessionId && (
          <button
            className="session-chip danger"
            type="button"
            onClick={() => onDeleteSession(activeSessionId)}
          >
            Supprimer session
          </button>
        )}
      </div>

      <div className="chat-messages nlm-messages">
        {messages.length === 0 && (
          <div className="empty-chat">
            <h2 className="h2">Pose une question sur tes documents</h2>
            <p className="muted">
              Exemple : “Résume ce cours”, “Quels sont les points importants ?”,
              “Prépare-moi un quiz”.
            </p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`bubble ${msg.role === "user" ? "user" : "assistant"}`}
          >
            <div>{msg.content}</div>

            {msg.sources && (
              <div className="sources">
                Sources :{" "}
                {Array.isArray(msg.sources)
                  ? msg.sources.join(", ")
                  : msg.sources}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="bubble assistant">
            <div className="sk-line"></div>
            <div className="sk-line short"></div>
          </div>
        )}
      </div>

      <form className="chat-input" onSubmit={onSend}>
      <textarea
  className="input textarea"
  placeholder="Pose une question sur le cours..."
  value={question}
  onChange={(e) => onQuestionChange(e.target.value)}
  disabled={!selectedCourse || loading}
  rows={2}
/>

       <button
  className="btn btn-primary"
  type="submit"
  disabled={!selectedCourse || loading || !question.trim()}
>
  Envoyer
</button>
      </form>
    </main>
  );
}

function StudioPanel({
  selectedCourseId,
  selectedDocumentId,
  result,
  loading,
  onSummarize,
  onKeypoints,
  onFlashcards,
  onQuiz,
}) {
  return (
    <aside className="nlm-panel">
      <h2 className="h2">Studio IA</h2>

      <p className="muted">
        Génère des contenus d’étude à partir du cours ou d’un document précis.
      </p>

      <div className="quick">
        <button
          className="quickbtn"
          onClick={onSummarize}
          disabled={!selectedCourseId || loading}
          type="button"
        >
          Résumé
        </button>

        <button
          className="quickbtn"
          onClick={onKeypoints}
          disabled={!selectedCourseId || loading}
          type="button"
        >
          Points clés
        </button>

        <button
          className="quickbtn"
          onClick={onFlashcards}
          disabled={!selectedCourseId || loading}
          type="button"
        >
          Flashcards
        </button>

        <button
          className="quickbtn"
          onClick={onQuiz}
          disabled={!selectedCourseId || loading}
          type="button"
        >
          Quiz
        </button>
      </div>

      <div className="divider"></div>

      <h3 className="h3">Résultat</h3>

      {!result && (
        <p className="muted">
          Le résultat des actions IA apparaîtra ici.
        </p>
      )}

      {result && (
        <div className="studio-result">
          {typeof result === "string" ? (
            <p>{result}</p>
          ) : (
            <pre>{JSON.stringify(result, null, 2)}</pre>
          )}
        </div>
      )}
    </aside>
  );
}

export default function ChatPage({ courses = [] }) {
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedDocumentId, setSelectedDocumentId] = useState("");

  const [documents, setDocuments] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);

  const [question, setQuestion] = useState("");
  const [studioResult, setStudioResult] = useState(null);

  const [message, setMessage] = useState("");
  const [kind, setKind] = useState("ok");
  const [loading, setLoading] = useState(false);

  const selectedCourse = useMemo(() => {
    return courses.find(
      (course) => String(course.id) === String(selectedCourseId)
    );
  }, [courses, selectedCourseId]);

  const aiDocumentId = selectedDocumentId ? Number(selectedDocumentId) : null;

  function showMessage(text, type = "ok") {
    setKind(type);
    setMessage(text);
  }

  async function loadDocuments(courseId) {
    if (!courseId) {
      setDocuments([]);
      return;
    }

    try {
      const data = await getCourseDocuments(courseId);
      setDocuments(data);
    } catch (error) {
      showMessage(error.message || "Erreur chargement documents.", "err");
    }
  }

  async function loadSessions(courseId = selectedCourseId) {
    try {
      const data = await getChatSessions();

      const filtered = courseId
        ? data.filter((session) => String(session.course_id) === String(courseId))
        : data;

      setSessions(filtered);
    } catch (error) {
      showMessage(error.message || "Erreur chargement sessions.", "err");
    }
  }

  async function loadSessionHistory(sessionId) {
    if (!sessionId) return;

    try {
      const data = await getChatSessionHistory(sessionId);
      setMessages(data.messages || []);
      setActiveSessionId(sessionId);
    } catch (error) {
      showMessage(error.message || "Erreur chargement historique.", "err");
    }
  }

  async function handleCourseChange(e) {
    const courseId = e.target.value;

    setSelectedCourseId(courseId);
    setSelectedDocumentId("");
    setDocuments([]);
    setSessions([]);
    setMessages([]);
    setActiveSessionId(null);
    setStudioResult(null);

    if (courseId) {
      await loadDocuments(courseId);
      await loadSessions(courseId);
    }
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0];

    if (!file || !selectedCourseId) return;

    try {
      setLoading(true);
      await uploadDocument(Number(selectedCourseId), file);
      showMessage("Document ajouté avec succès.", "ok");
      await loadDocuments(selectedCourseId);
      e.target.value = "";
    } catch (error) {
      showMessage(error.message || "Erreur upload document.", "err");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteDocument(documentId) {
    const ok = confirm("Supprimer ce document ?");

    if (!ok) return;

    try {
      await deleteDocument(documentId);
      showMessage("Document supprimé.", "ok");

      if (String(selectedDocumentId) === String(documentId)) {
        setSelectedDocumentId("");
      }

      await loadDocuments(selectedCourseId);
    } catch (error) {
      showMessage(error.message || "Erreur suppression document.", "err");
    }
  }

  async function handleCreateSession() {
    if (!selectedCourseId) {
      showMessage("Choisis un cours d'abord.", "err");
      return;
    }

    try {
      const session = await createChatSession(
        Number(selectedCourseId),
        `Chat - ${selectedCourse?.code || selectedCourseId}`
      );

      await loadSessions(selectedCourseId);
      await loadSessionHistory(session.id);
    } catch (error) {
      showMessage(error.message || "Erreur création session.", "err");
    }
  }

  async function handleDeleteSession(sessionId) {
    const ok = confirm("Supprimer cette session de chat ?");

    if (!ok) return;

    try {
      await deleteChatSession(sessionId);
      setActiveSessionId(null);
      setMessages([]);
      await loadSessions(selectedCourseId);
    } catch (error) {
      showMessage(error.message || "Erreur suppression session.", "err");
    }
  }

async function handleSend(e) {
  e.preventDefault();

  const text = question.trim();

  if (!text) return;

  if (!selectedCourseId) {
    showMessage("Choisis un cours d'abord.", "err");
    return;
  }

  try {
    setLoading(true);
    setQuestion("");

    let sessionId = activeSessionId;

    if (!sessionId) {
      const session = await createChatSession(
        Number(selectedCourseId),
        `Chat - ${selectedCourse?.code || selectedCourseId}`
      );

      sessionId = session.id;
      setActiveSessionId(session.id);
      await loadSessions(selectedCourseId);
    }

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: text,
      },
    ]);

    const response = await sendAIChatMessage(sessionId, text);

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: response.message,
        sources: response.sources || [],
      },
    ]);
  } catch (error) {
    showMessage(error.message || "Erreur chat IA.", "err");
  } finally {
    setLoading(false);
  }
}

  async function runStudioAction(action) {
    if (!selectedCourseId) {
      showMessage("Choisis un cours d'abord.", "err");
      return;
    }

    try {
      setLoading(true);
      setStudioResult(null);

      const courseId = Number(selectedCourseId);
      let data;

      if (action === "summary") {
        data = await summarizeCourse(courseId, aiDocumentId);
        setStudioResult(data.summary);
      }

      if (action === "keypoints") {
        data = await getKeypoints(courseId, aiDocumentId);
        setStudioResult(data.keypoints);
      }

      if (action === "flashcards") {
        data = await generateFlashcards(courseId, aiDocumentId, 10);
        setStudioResult(data.flashcards);
      }

      if (action === "quiz") {
        data = await generateQuiz(courseId, aiDocumentId, 5);
        setStudioResult(data.questions);
      }
    } catch (error) {
      showMessage(error.message || "Erreur action IA.", "err");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (courses.length > 0 && !selectedCourseId) {
      const firstCourse = courses[0];
      setSelectedCourseId(String(firstCourse.id));
      loadDocuments(firstCourse.id);
      loadSessions(firstCourse.id);
    }
  }, [courses]);

  return (
    <section className="page">
      <div className="page-head">
        <h1 className="h1">Notebook IA</h1>
      </div>

      {message && <div className={`toast ${kind}`}>{message}</div>}

      <div className="notebook-layout">
        <SourcesPanel
          courses={courses}
          selectedCourseId={selectedCourseId}
          documents={documents}
          selectedDocumentId={selectedDocumentId}
          onCourseChange={handleCourseChange}
          onDocumentChange={(id) => setSelectedDocumentId(String(id))}
          onUpload={handleUpload}
          onDeleteDocument={handleDeleteDocument}
        />

        <ChatCenter
          selectedCourse={selectedCourse}
          sessions={sessions}
          activeSessionId={activeSessionId}
          messages={messages}
          question={question}
          loading={loading}
          onCreateSession={handleCreateSession}
          onSelectSession={loadSessionHistory}
          onDeleteSession={handleDeleteSession}
          onQuestionChange={setQuestion}
          onSend={handleSend}
        />

        <StudioPanel
          selectedCourseId={selectedCourseId}
          selectedDocumentId={selectedDocumentId}
          result={studioResult}
          loading={loading}
          onSummarize={() => runStudioAction("summary")}
          onKeypoints={() => runStudioAction("keypoints")}
          onFlashcards={() => runStudioAction("flashcards")}
          onQuiz={() => runStudioAction("quiz")}
        />
      </div>
    </section>
  );
}
