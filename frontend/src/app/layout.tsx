import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";
import { LangProvider } from "../context/LangContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Onboarding from "../components/Onboarding";

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
    <html lang="kk" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-surface text-text-primary font-sans">
        <AuthProvider>
          <LangProvider>
            <ThemeProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <Onboarding />
            </ThemeProvider>
          </LangProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
