# Portail Étudiant Intelligent — Frontend Web

Frontend web du projet **Portail Étudiant Intelligent**, développé avec **Next.js**, **React**, **TailwindCSS** et connecté à un backend **FastAPI**.

L’objectif de cette application est de fournir une plateforme web moderne pour les étudiants, enseignants et administrateurs, avec gestion des cours, inscriptions, documents, calendrier et assistant IA pédagogique.

---

## Fonctionnalités principales

### Authentification

* Connexion utilisateur
* Gestion du token JWT
* Rôles utilisateurs :

  * Admin
  * Teacher
  * Student
* Protection des pages selon le rôle

### Dashboard

* Affichage des cours accessibles
* Navigation rapide vers :

  * Chat IA
  * Calendrier
  * Profil
  * Administration

### Gestion des cours

* Affichage des cours
* Consultation des détails d’un cours
* Gestion des cours par l’admin
* Retrait d’un teacher d’un cours sans supprimer le cours
* Suppression d’un cours pour un étudiant via les inscriptions

### Gestion des inscriptions

* Inscription d’un étudiant à un cours
* Désinscription d’un étudiant
* Affectation d’un cours à un étudiant par l’admin
* Affichage des étudiants inscrits à un cours

### Gestion des documents

* Upload de documents liés à un cours
* Liste des documents d’un cours
* Suppression de documents
* Les documents sont stockés côté backend dans le dossier `uploads`
* Les métadonnées et le texte extrait sont stockés dans PostgreSQL

### Chat IA

Interface de chat pédagogique inspirée de NotebookLM :

* Sélection d’un cours
* Sélection des documents sources
* Création de sessions de chat
* Conversation avec l’assistant IA
* Génération de :

  * Résumés
  * Points clés
  * Flashcards
  * Quiz

### Calendrier

Calendrier interactif basé sur FullCalendar :

* Vue mensuelle
* Création d’événements via modal
* Suppression d’événements via modal
* Affichage des informations au hover
* Association d’un événement à un cours
* Sélection d’un professeur depuis les utilisateurs existants

---

## Technologies utilisées

* Next.js
* React
* JavaScript
* TailwindCSS
* FullCalendar
* FastAPI backend
* JWT Authentication
* PostgreSQL côté backend

---

## Structure du projet

```txt
portail-etudiant-web/
│
├── app/
│   ├── layout.jsx
│   ├── page.jsx
│   └── globals.css
│
├── components/
│   ├── admin/
│   │   ├── AdminCoursesPage.jsx
│   │   └── AdminAssignCoursePage.jsx
│   │
│   ├── auth/
│   │   └── AuthPage.jsx
│   │
│   ├── calendar/
│   │   └── CalendarPage.jsx
│   │
│   ├── chat/
│   │   └── ChatPage.jsx
│   │
│   ├── courses/
│   │   └── CourseDetailsPage.jsx
│   │
│   ├── dashboard/
│   │   └── DashboardPage.jsx
│   │
│   └── layout/
│       └── Header.jsx
│
├── lib/
│   ├── api.js
│   ├── auth.js
│   ├── calendar.js
│   ├── chat.js
│   ├── courses.js
│   ├── documents.js
│   ├── enrollments.js
│   ├── token.js
│   └── users.js
│
├── public/
├── package.json
└── README.md
```

---

## Prérequis

Avant de lancer le frontend, il faut avoir :

* Node.js installé
* npm installé
* Backend FastAPI lancé
* PostgreSQL lancé côté backend

Backend attendu :

```txt
http://127.0.0.1:8000
```

Frontend Next.js :

```txt
http://localhost:3000
```

---

## Installation

Cloner le projet :

```bash
git clone git@github.com:ayoubkhezami/portail_etudiant_web.git
cd portail_etudiant_web
```

Installer les dépendances :

```bash
npm install
```

---

## Configuration

Créer un fichier `.env.local` à la racine du projet :

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Exemple de fichier `lib/api.js` attendu :

```js
import { getToken } from "./token";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function apiFetch(path, options = {}) {
  const token = getToken();

  const headers = {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    body:
      options.body instanceof FormData
        ? options.body
        : options.body
        ? JSON.stringify(options.body)
        : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail || "Erreur API");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
```

---

## Lancer le projet

Lancer le serveur de développement :

```bash
npm run dev
```

Ouvrir dans le navigateur :

```txt
http://localhost:3000
```

---

## Scripts disponibles

```bash
npm run dev
```

Lance le serveur de développement.

```bash
npm run build
```

Génère la version de production.

```bash
npm run start
```

Lance l’application en mode production après build.

```bash
npm run lint
```

Lance ESLint.

---

## Packages importants

Installer FullCalendar :

```bash
npm install @fullcalendar/core @fullcalendar/react @fullcalendar/daygrid @fullcalendar/interaction
```

Dépendances principales :

```json
{
  "next": "16.2.9",
  "react": "19.2.4",
  "react-dom": "19.2.4",
  "tailwindcss": "^4",
  "@tailwindcss/postcss": "^4",
  "@fullcalendar/core": "^6",
  "@fullcalendar/react": "^6",
  "@fullcalendar/daygrid": "^6",
  "@fullcalendar/interaction": "^6"
}
```

---

## Rôles utilisateurs

### Admin

L’admin peut :

* Voir tous les utilisateurs
* Voir tous les cours
* Affecter un cours à un étudiant
* Retirer un cours d’un étudiant
* Retirer un teacher d’un cours
* Gérer les événements du calendrier

### Teacher

Le teacher peut :

* Voir ses propres cours
* Gérer les documents de ses cours
* Consulter les étudiants inscrits à ses cours
* Utiliser le chat IA sur ses cours

### Student

L’étudiant peut :

* Voir ses cours inscrits
* Consulter les documents des cours
* Utiliser le chat IA
* Voir les événements du calendrier
* S’inscrire à un cours selon la logique backend

---

## Connexion avec le backend

Le frontend consomme les routes principales suivantes :

### Auth

```txt
POST /auth/login
POST /auth/register
```

### Users

```txt
GET /users/me
GET /users/
GET /users/{user_id}
```

### Courses

```txt
GET /courses/
POST /courses/
GET /courses/{course_id}
PUT /courses/{course_id}
DELETE /courses/{course_id}
DELETE /courses/{course_id}/teacher
```

### Enrollments

```txt
POST /enrollments/
POST /enrollments/assign
GET /enrollments/my
GET /enrollments/course/{course_id}
DELETE /enrollments/{enrollment_id}
```

### Documents

```txt
POST /documents/course/{course_id}
GET /documents/course/{course_id}
GET /documents/{document_id}
DELETE /documents/{document_id}
```

### Calendar

```txt
GET /calendar/
POST /calendar/
PUT /calendar/{event_id}
DELETE /calendar/{event_id}
```

### AI

```txt
POST /ai/chat
POST /ai/summarize
POST /ai/keypoints
POST /ai/flashcards
POST /ai/quiz
```

---

## Comptes de test

Exemple de comptes créés côté backend avec le seed :

```txt
Admin:
email: admin@portail.edu
password: admin123

Teacher:
email: teacher@portail.edu
password: teacher123

Teacher 2:
email: teacher2@portail.edu
password: teacher123

Student:
email: student@portail.edu
password: student123
```

---

## Notes importantes

### Hydration warning

Si une erreur de type hydration mismatch apparaît avec des attributs comme :

```txt
bis_register
__processed_...
```

elle peut venir d’une extension navigateur comme Bitwarden ou un password manager.

Solution possible dans `app/layout.jsx` :

```jsx
export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
```

### Variables sensibles

Ne pas versionner :

```txt
.env
.env.local
node_modules
.next
```

Vérifier que `.gitignore` contient :

```txt
node_modules
.next
.env
.env.local
```

---

## Déploiement

Le projet peut être déployé sur Vercel ou toute plateforme compatible Next.js.

Avant déploiement, configurer la variable :

```env
NEXT_PUBLIC_API_URL=https://votre-backend-api.com
```

Puis générer le build :

```bash
npm run build
```

---

## Auteur

Projet développé par **Ayoub Khezami** **Rayen Zaalouni** **Akrout Mohamed.

Sujet : **Portail Étudiant Intelligent avec IA, gestion des cours, documents, calendrier et assistant pédagogique.**
