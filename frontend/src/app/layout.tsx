import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "BirgeBolis — Қазақша блог платформасы",
  description: "Ойларыңмен бөліс, оқы, біріг. Казахстанская блог-платформа для вдохновенного письма.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-surface text-text-primary font-sans">
        <AuthProvider>
          <ThemeProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="py-8 text-center text-sm text-text-muted">
              BirgeBolis — Бірге боліс ❤
            </footer>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
