'use client';

import { useLang } from '../context/LangContext';
import LangSwitcher from './LangSwitcher';

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="py-8 flex flex-col items-center gap-3">
      <LangSwitcher />
      <span className="text-sm text-text-muted">
        BirgeBolis — {t('footer.text')} ❤
      </span>
    </footer>
  );
}
