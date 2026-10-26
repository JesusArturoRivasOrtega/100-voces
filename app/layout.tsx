import type { Metadata } from "next";
export const metadata: Metadata = { title: "100 VOCES · Así participa México", description: "Explora, contrasta y aprende en comunidad con datos del INE." };
export default function RootLayout({children}: {children: React.ReactNode}) { return <html lang="es-MX"><body>{children}</body></html>; }
