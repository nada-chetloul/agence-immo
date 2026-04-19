import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Contactez l'Agence",
  description: "Formulaire de contact - Agence Immobilière",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
