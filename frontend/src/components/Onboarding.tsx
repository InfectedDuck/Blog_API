'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PenTool, User, Palette } from 'lucide-react';
import { useLang } from '../context/LangContext';
import Logo from './Logo';

const STEPS: Record<string, { kz: string; ru: string; en: string }> = {
  welcome: { kz: 'BirgeBolis-ке қош келдіңіз!', ru: 'Добро пожаловать в BirgeBolis!', en: 'Welcome to BirgeBolis!' },
  step1: { kz: 'Профиліңізді баптаңыз', ru: 'Настройте профиль', en: 'Set up your profile' },
  step1desc: { kz: 'Аватар, ат және био қосыңыз', ru: 'Добавьте аватар, имя и био', en: 'Add avatar, name and bio' },
  step2: { kz: 'Бірінші жазбаңызды жазыңыз', ru: 'Напишите первую запись', en: 'Write your first post' },
  step2desc: { kz: 'Ойыңызды бөлісіңіз', ru: 'Поделитесь мыслями', en: 'Share your thoughts' },
  step3: { kz: 'Көріністі таңдаңыз', ru: 'Выберите тему', en: 'Pick your look' },
  step3desc: { kz: 'Қараңғы режим мен акцент түсі', ru: 'Тёмная тема и цвет акцента', en: 'Dark mode and accent color' },
  start: { kz: 'Бастау', ru: 'Начать', en: 'Get Started' },
};

export default function Onboarding() {
  const [show, setShow] = useState(false);
  const { locale } = useLang();

  useEffect(() => {
    const dismissed = localStorage.getItem('onboarding_done');
    const justRegistered = localStorage.getItem('just_registered');
    if (justRegistered && !dismissed) {
      setShow(true);
      localStorage.removeItem('just_registered');
    }
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem('onboarding_done', 'true');
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-surface rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
        <Logo size="md" className="justify-center mb-4" />
        <h2 className="text-xl font-semibold text-text-primary mb-6">{STEPS.welcome[locale]}</h2>

        <div className="space-y-4 text-left mb-8">
          <Link href="/settings" onClick={dismiss} className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-secondary transition">
            <div className="w-10 h-10 rounded-full bg-pastel-lavender flex items-center justify-center flex-shrink-0">
              <User size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">{STEPS.step1[locale]}</p>
              <p className="text-xs text-text-muted">{STEPS.step1desc[locale]}</p>
            </div>
          </Link>

          <Link href="/write" onClick={dismiss} className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-secondary transition">
            <div className="w-10 h-10 rounded-full bg-pastel-pink flex items-center justify-center flex-shrink-0">
              <PenTool size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">{STEPS.step2[locale]}</p>
              <p className="text-xs text-text-muted">{STEPS.step2desc[locale]}</p>
            </div>
          </Link>

          <Link href="/settings" onClick={dismiss} className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-secondary transition">
            <div className="w-10 h-10 rounded-full bg-pastel-mint flex items-center justify-center flex-shrink-0">
              <Palette size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">{STEPS.step3[locale]}</p>
              <p className="text-xs text-text-muted">{STEPS.step3desc[locale]}</p>
            </div>
          </Link>
        </div>

        <button onClick={dismiss} className="w-full py-3 rounded-xl bg-accent hover:bg-accent-dark text-sm font-medium text-text-primary transition">
          {STEPS.start[locale]}
        </button>
      </div>
    </div>
  );
}
