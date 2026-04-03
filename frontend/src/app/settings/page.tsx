'use client';

import { useState, useRef } from 'react';
import { Check, Moon, Sun, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { updateUserProfile, changePassword } from '../../lib/api';
import AuthGuard from '../../components/AuthGuard';

const ACCENT_OPTIONS = [
  { id: 'pink', label: 'Rose', color: '#FFE4E6', ring: '#FBC4C8' },
  { id: 'blue', label: 'Sky', color: '#DBEAFE', ring: '#BFDBFE' },
  { id: 'lavender', label: 'Lavender', color: '#EDE9FE', ring: '#DDD6FE' },
  { id: 'mint', label: 'Mint', color: '#D1FAE5', ring: '#A7F3D0' },
];

function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const { darkMode, accentColor, toggleDarkMode, setAccentColor } = useTheme();

  // Profile state
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 200 * 1024) {
      setProfileMsg('Image must be under 200KB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleProfileSave = async () => {
    setProfileSaving(true);
    setProfileMsg('');
    try {
      await updateUserProfile({
        displayName: displayName || undefined,
        bio: bio || undefined,
        avatarUrl: avatarPreview || undefined,
      });
      await refreshUser();
      setProfileMsg('Profile updated');
    } catch (err: any) {
      setProfileMsg(err.message || 'Failed to save');
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError('');
    setPasswordMsg('');
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    setPasswordSaving(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setPasswordMsg('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password');
    } finally {
      setPasswordSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-light text-text-primary mb-10">Settings</h1>

      {/* ── Profile Section ── */}
      <section className="mb-12">
        <h2 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-6">Profile</h2>

        {/* Avatar */}
        <div className="flex items-center gap-5 mb-6">
          <div
            className="relative w-20 h-20 rounded-full overflow-hidden bg-accent flex items-center justify-center cursor-pointer group"
            onClick={() => fileRef.current?.click()}
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-semibold text-text-primary">
                {(displayName || user.username)[0].toUpperCase()}
              </span>
            )}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <Camera size={20} className="text-white" />
            </div>
          </div>
          <div>
            <p className="text-sm text-text-primary">{user.username}</p>
            <p className="text-xs text-text-muted">Click the avatar to upload a photo (max 200KB)</p>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
        </div>

        {/* Display Name */}
        <div className="mb-4">
          <label className="block text-sm text-text-secondary mb-1.5">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder={user.username}
            maxLength={50}
            className="w-full px-4 py-2.5 rounded-xl bg-surface-secondary border-none outline-none text-sm text-text-primary placeholder:text-text-muted focus:ring-2 focus:ring-accent transition"
          />
        </div>

        {/* Bio */}
        <div className="mb-4">
          <label className="block text-sm text-text-secondary mb-1.5">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell people about yourself..."
            maxLength={300}
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl bg-surface-secondary border-none outline-none text-sm text-text-primary placeholder:text-text-muted focus:ring-2 focus:ring-accent transition resize-none"
          />
          <p className="text-xs text-text-muted mt-1 text-right">{bio.length}/300</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleProfileSave}
            disabled={profileSaving}
            className="px-5 py-2 rounded-xl bg-accent hover:bg-accent-dark text-sm text-text-primary transition disabled:opacity-50"
          >
            {profileSaving ? 'Saving...' : 'Save Profile'}
          </button>
          {profileMsg && <span className="text-xs text-text-muted">{profileMsg}</span>}
        </div>
      </section>

      {/* ── Appearance Section ── */}
      <section className="mb-12">
        <h2 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-6">Appearance</h2>

        {/* Dark Mode */}
        <div className="flex items-center justify-between mb-6 p-4 rounded-xl bg-surface-secondary">
          <div className="flex items-center gap-3">
            {darkMode ? <Moon size={18} className="text-text-secondary" /> : <Sun size={18} className="text-text-secondary" />}
            <div>
              <p className="text-sm text-text-primary">Dark Mode</p>
              <p className="text-xs text-text-muted">{darkMode ? 'Dark theme active' : 'Light theme active'}</p>
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`w-12 h-7 rounded-full transition-colors relative ${darkMode ? 'bg-accent' : 'bg-surface-tertiary'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow absolute top-1 transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        {/* Accent Color */}
        <div>
          <p className="text-sm text-text-primary mb-3">Accent Color</p>
          <div className="flex gap-3">
            {ACCENT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setAccentColor(opt.id)}
                className="flex flex-col items-center gap-1.5"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                  style={{
                    backgroundColor: opt.color,
                    boxShadow: accentColor === opt.id ? `0 0 0 3px ${opt.ring}` : 'none',
                  }}
                >
                  {accentColor === opt.id && <Check size={16} className="text-text-primary" />}
                </div>
                <span className="text-xs text-text-muted">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Security Section ── */}
      <section className="mb-12">
        <h2 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-6">Security</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-secondary border-none outline-none text-sm text-text-primary focus:ring-2 focus:ring-accent transition"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-4 py-2.5 rounded-xl bg-surface-secondary border-none outline-none text-sm text-text-primary placeholder:text-text-muted focus:ring-2 focus:ring-accent transition"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-secondary border-none outline-none text-sm text-text-primary focus:ring-2 focus:ring-accent transition"
            />
          </div>

          {passwordError && <p className="text-xs text-red-400">{passwordError}</p>}

          <div className="flex items-center gap-3">
            <button
              onClick={handlePasswordChange}
              disabled={passwordSaving || !currentPassword || !newPassword}
              className="px-5 py-2 rounded-xl bg-accent hover:bg-accent-dark text-sm text-text-primary transition disabled:opacity-50"
            >
              {passwordSaving ? 'Changing...' : 'Change Password'}
            </button>
            {passwordMsg && <span className="text-xs text-pastel-mint">{passwordMsg}</span>}
          </div>
        </div>
      </section>

      {/* Account info */}
      <section>
        <h2 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-4">Account</h2>
        <div className="p-4 rounded-xl bg-surface-secondary">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-muted">Email</span>
            <span className="text-text-primary">{user.email}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-text-muted">Username</span>
            <span className="text-text-primary">{user.username}</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function SettingsPageWrapper() {
  return (
    <AuthGuard>
      <SettingsPage />
    </AuthGuard>
  );
}
