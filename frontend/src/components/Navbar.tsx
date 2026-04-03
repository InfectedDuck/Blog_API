'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import Logo from './Logo';

export default function Navbar() {
  const { user, isLoading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="border-b border-surface-tertiary bg-surface/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="hover:opacity-80 transition">
          <Logo size="sm" />
        </Link>

        {!isLoading && (
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href="/write"
                  className="px-4 py-1.5 text-sm rounded-full bg-accent hover:bg-accent-dark text-text-primary transition"
                >
                  Write
                </Link>
                <Link href="/stats" className="text-sm text-text-secondary hover:text-text-primary transition">
                  Stats
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition"
                  >
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-xs font-medium text-text-primary">
                        {(user.displayName || user.username)[0].toUpperCase()}
                      </div>
                    )}
                    {user.displayName || user.username}
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-surface-secondary rounded-xl shadow-lg border border-surface-tertiary py-2">
                      <Link
                        href={`/profile/${user.username}`}
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-text-secondary hover:bg-surface-tertiary transition"
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-text-secondary hover:bg-surface-tertiary transition"
                      >
                        Settings
                      </Link>
                      <hr className="my-1 border-surface-tertiary" />
                      <button
                        onClick={() => { logout(); setMenuOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-surface-tertiary transition"
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
