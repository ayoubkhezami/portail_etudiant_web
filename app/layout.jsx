import "./globals.css";

export const metadata = {
  title: "Portail Étudiant Intelligent",
  description: "Frontend Next.js pour portail étudiant",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}