'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, isLoading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const isWriter = user && (user.role === 'author' || user.role === 'admin');

  return (
    <nav className="border-b border-surface-tertiary bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-light tracking-wide text-text-primary hover:text-text-secondary transition">
          bloom
        </Link>

        {!isLoading && (
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {isWriter && (
                  <>
                    <Link
                      href="/write"
                      className="px-4 py-1.5 text-sm rounded-full bg-pastel-lavender hover:bg-pastel-lavender-dark text-text-primary transition"
                    >
                      Write
                    </Link>
                    <Link href="/stats" className="text-sm text-text-secondary hover:text-text-primary transition">
                      Stats
                    </Link>
                  </>
                )}
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="text-sm text-text-secondary hover:text-text-primary transition"
                  >
                    {user.username}
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-surface-tertiary py-2">
                      <Link
                        href={`/profile/${user.username}`}
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-text-secondary hover:bg-surface-secondary transition"
                      >
                        My Profile
                      </Link>
                      <button
                        onClick={() => { logout(); setMenuOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-surface-secondary transition"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link href="/login" className="text-sm text-text-secondary hover:text-text-primary transition">
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
