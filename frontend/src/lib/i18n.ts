export type Locale = 'kz' | 'ru' | 'en';

export const LOCALE_LABELS: Record<Locale, string> = {
  kz: 'Қаз',
  ru: 'Рус',
  en: 'Eng',
};

const translations = {
  // Navbar
  'nav.write': { kz: 'Жазу', ru: 'Написать', en: 'Write' },
  'nav.stats': { kz: 'Статистика', ru: 'Статистика', en: 'Stats' },
  'nav.signIn': { kz: 'Кіру', ru: 'Войти', en: 'Sign In' },
  'nav.myProfile': { kz: 'Менің профилім', ru: 'Мой профиль', en: 'My Profile' },
  'nav.settings': { kz: 'Баптаулар', ru: 'Настройки', en: 'Settings' },
  'nav.signOut': { kz: 'Шығу', ru: 'Выйти', en: 'Sign Out' },

  // Home hero
  'hero.tagline': { kz: 'Қазақша блог платформасы', ru: 'Казахская блог-платформа', en: 'Kazakh Blog Platform' },
  'hero.subtitle': { kz: 'Ойларыңмен бөліс. Оқы. Біріг.', ru: 'Делись мыслями. Читай. Объединяйся.', en: 'Share your thoughts. Read. Unite.' },
  'hero.signUp': { kz: 'Тіркелу', ru: 'Регистрация', en: 'Sign Up' },
  'hero.signIn': { kz: 'Кіру', ru: 'Войти', en: 'Sign In' },
  'home.writeCta': { kz: 'Не ойлап жүрсің? Жаз...', ru: 'О чём думаешь? Напиши...', en: "What's on your mind? Start writing..." },
  'home.search': { kz: 'Іздеу...', ru: 'Поиск...', en: 'Search...' },
  'home.all': { kz: 'Барлығы', ru: 'Все', en: 'All' },
  'home.loading': { kz: 'Жүктелуде...', ru: 'Загрузка...', en: 'Loading...' },
  'home.noPosts': { kz: 'Жазбалар табылмады', ru: 'Записи не найдены', en: 'No stories found' },
  'home.prev': { kz: '← Алдыңғы', ru: '← Назад', en: '← Previous' },
  'home.next': { kz: 'Келесі →', ru: 'Далее →', en: 'Next →' },

  // Login
  'login.title': { kz: 'Қайта қош келдіңіз', ru: 'С возвращением', en: 'Welcome back' },
  'login.email': { kz: 'Email', ru: 'Email', en: 'Email' },
  'login.password': { kz: 'Құпия сөз', ru: 'Пароль', en: 'Password' },
  'login.submit': { kz: 'Кіру', ru: 'Войти', en: 'Sign In' },
  'login.submitting': { kz: 'Кіруде...', ru: 'Вход...', en: 'Signing in...' },
  'login.noAccount': { kz: 'Аккаунтыңыз жоқ па?', ru: 'Нет аккаунта?', en: "Don't have an account?" },
  'login.signUp': { kz: 'Тіркелу', ru: 'Регистрация', en: 'Sign up' },

  // Register
  'register.title': { kz: 'Аккаунт құру', ru: 'Создать аккаунт', en: 'Create account' },
  'register.username': { kz: 'Пайдаланушы аты', ru: 'Имя пользователя', en: 'Username' },
  'register.password': { kz: 'Құпия сөз (мин. 6)', ru: 'Пароль (мин. 6)', en: 'Password (min 6)' },
  'register.bio': { kz: 'Өзіңіз туралы (міндетті емес)', ru: 'О себе (необязательно)', en: 'Bio (optional)' },
  'register.submit': { kz: 'Тіркелу', ru: 'Зарегистрироваться', en: 'Sign Up' },
  'register.submitting': { kz: 'Тіркелуде...', ru: 'Регистрация...', en: 'Creating account...' },
  'register.hasAccount': { kz: 'Аккаунтыңыз бар ма?', ru: 'Уже есть аккаунт?', en: 'Already have an account?' },
  'register.signIn': { kz: 'Кіру', ru: 'Войти', en: 'Sign in' },

  // Write
  'write.back': { kz: '← Басты бетке', ru: '← На главную', en: '← Back to stories' },
  'write.draft': { kz: 'Жоба', ru: 'Черновик', en: 'Draft' },
  'write.publish': { kz: 'Жариялау', ru: 'Опубликовать', en: 'Publish' },
  'write.publishing': { kz: 'Жариялануда...', ru: 'Публикация...', en: 'Publishing...' },
  'write.titlePlaceholder': { kz: 'Тақырыбыңыз...', ru: 'Ваш заголовок...', en: 'Your title...' },
  'write.addTags': { kz: 'Тег қосу (Enter)...', ru: 'Добавить тег (Enter)...', en: 'Add tags (Enter)...' },
  'write.addMore': { kz: 'Тағы қосу...', ru: 'Ещё...', en: 'Add another...' },
  'write.editorPlaceholder': { kz: 'Өз тарихыңызды жазыңыз...', ru: 'Расскажите свою историю...', en: 'Tell your story...' },

  // Post page
  'post.views': { kz: 'қаралым', ru: 'просм.', en: 'views' },
  'post.by': { kz: '', ru: '', en: 'By' },

  // Comments
  'comments.title': { kz: 'Пікірлер', ru: 'Комментарии', en: 'Comments' },
  'comments.placeholder': { kz: 'Ойыңызды бөлісіңіз...', ru: 'Поделитесь мнением...', en: 'Share your thoughts...' },
  'comments.submit': { kz: 'Жіберу', ru: 'Отправить', en: 'Comment' },
  'comments.submitting': { kz: 'Жіберілуде...', ru: 'Отправка...', en: 'Posting...' },
  'comments.empty': { kz: 'Пікір жоқ. Бірінші болыңыз.', ru: 'Комментариев нет. Будьте первым.', en: 'No comments yet. Be the first.' },

  // AI Analysis
  'ai.button': { kz: 'AI талдау', ru: 'AI анализ', en: 'AI Analysis' },
  'ai.buttonOther': { kz: 'AI қысқаша', ru: 'AI сводка', en: 'AI Summary' },
  'ai.close': { kz: 'Жабу', ru: 'Закрыть', en: 'Close' },
  'ai.analyze': { kz: 'Талдау', ru: 'Анализировать', en: 'Analyze' },
  'ai.analyzing': { kz: 'Талдануда...', ru: 'Анализ...', en: 'Analyzing...' },
  'ai.thinking': { kz: 'Ойлануда...', ru: 'Думаю...', en: 'Thinking...' },
  'ai.emotionalSupport': { kz: 'Эмоциялық қолдау', ru: 'Эмоц. поддержка', en: 'Emotional Support' },
  'ai.refine': { kz: 'Мәтінді жақсарту', ru: 'Улучшить текст', en: 'Refine My Text' },
  'ai.insights': { kz: 'Тақырып талдау', ru: 'Анализ темы', en: 'Topic Insights' },
  'ai.summary': { kz: 'Қысқаша', ru: 'Сводка', en: 'Summary' },
  'ai.takeaways': { kz: 'Негізгі ойлар', ru: 'Ключевые идеи', en: 'Key Takeaways' },
  'ai.words': { kz: 'сөз', ru: 'слов', en: 'words' },
  'ai.minRead': { kz: 'мин оқу', ru: 'мин чтения', en: 'min read' },

  // Stats
  'stats.title': { kz: 'Сіздің статистикаңыз', ru: 'Ваша статистика', en: 'Your Stats' },
  'stats.totalPosts': { kz: 'Барлық жазбалар', ru: 'Всего записей', en: 'Total Posts' },
  'stats.totalViews': { kz: 'Барлық қаралымдар', ru: 'Всего просмотров', en: 'Total Views' },
  'stats.totalLikes': { kz: 'Барлық ұнатулар', ru: 'Всего лайков', en: 'Total Likes' },
  'stats.totalComments': { kz: 'Барлық пікірлер', ru: 'Всего комментариев', en: 'Total Comments' },
  'stats.published': { kz: 'жарияланған', ru: 'опубл.', en: 'published' },
  'stats.drafts': { kz: 'жоба', ru: 'черн.', en: 'drafts' },
  'stats.noPosts': { kz: 'Жазбалар жоқ.', ru: 'Записей нет.', en: 'No posts yet.' },
  'stats.writeFirst': { kz: 'Бірінші жазбаңызды жазыңыз', ru: 'Напишите первую запись', en: 'Write your first story' },
  'stats.colTitle': { kz: 'Тақырып', ru: 'Заголовок', en: 'Title' },
  'stats.colStatus': { kz: 'Күйі', ru: 'Статус', en: 'Status' },
  'stats.colViews': { kz: 'Қаралым', ru: 'Просм.', en: 'Views' },
  'stats.colLikes': { kz: 'Ұнату', ru: 'Лайки', en: 'Likes' },
  'stats.colComments': { kz: 'Пікір', ru: 'Комм.', en: 'Comments' },
  'stats.colDate': { kz: 'Күні', ru: 'Дата', en: 'Date' },
  'stats.edit': { kz: 'Өңдеу', ru: 'Редакт.', en: 'Edit' },

  // Settings
  'settings.title': { kz: 'Баптаулар', ru: 'Настройки', en: 'Settings' },
  'settings.profile': { kz: 'Профиль', ru: 'Профиль', en: 'Profile' },
  'settings.appearance': { kz: 'Көрініс', ru: 'Внешний вид', en: 'Appearance' },
  'settings.security': { kz: 'Қауіпсіздік', ru: 'Безопасность', en: 'Security' },
  'settings.account': { kz: 'Аккаунт', ru: 'Аккаунт', en: 'Account' },
  'settings.displayName': { kz: 'Көрсетілетін ат', ru: 'Отображаемое имя', en: 'Display Name' },
  'settings.bio': { kz: 'Өзіңіз туралы', ru: 'О себе', en: 'Bio' },
  'settings.bioPlaceholder': { kz: 'Өзіңіз туралы айтыңыз...', ru: 'Расскажите о себе...', en: 'Tell people about yourself...' },
  'settings.avatarHint': { kz: 'Аватарды басыңыз (макс. 200KB)', ru: 'Нажмите на аватар (макс. 200KB)', en: 'Click avatar to upload (max 200KB)' },
  'settings.saveProfile': { kz: 'Сақтау', ru: 'Сохранить', en: 'Save Profile' },
  'settings.saving': { kz: 'Сақталуда...', ru: 'Сохранение...', en: 'Saving...' },
  'settings.profileUpdated': { kz: 'Профиль жаңартылды', ru: 'Профиль обновлён', en: 'Profile updated' },
  'settings.darkMode': { kz: 'Қараңғы режим', ru: 'Тёмная тема', en: 'Dark Mode' },
  'settings.darkOn': { kz: 'Қараңғы тема белсенді', ru: 'Тёмная тема активна', en: 'Dark theme active' },
  'settings.darkOff': { kz: 'Жарық тема белсенді', ru: 'Светлая тема активна', en: 'Light theme active' },
  'settings.accentColor': { kz: 'Акцент түсі', ru: 'Цвет акцента', en: 'Accent Color' },
  'settings.currentPassword': { kz: 'Ағымдағы құпия сөз', ru: 'Текущий пароль', en: 'Current Password' },
  'settings.newPassword': { kz: 'Жаңа құпия сөз', ru: 'Новый пароль', en: 'New Password' },
  'settings.confirmPassword': { kz: 'Құпия сөзді растаңыз', ru: 'Подтвердите пароль', en: 'Confirm Password' },
  'settings.changePassword': { kz: 'Құпия сөзді өзгерту', ru: 'Сменить пароль', en: 'Change Password' },
  'settings.changing': { kz: 'Өзгертілуде...', ru: 'Смена...', en: 'Changing...' },
  'settings.passwordChanged': { kz: 'Құпия сөз өзгертілді', ru: 'Пароль изменён', en: 'Password changed successfully' },
  'settings.passwordMismatch': { kz: 'Құпия сөздер сәйкес емес', ru: 'Пароли не совпадают', en: 'Passwords do not match' },
  'settings.passwordTooShort': { kz: 'Кемінде 6 таңба', ru: 'Минимум 6 символов', en: 'At least 6 characters' },
  'settings.colorRose': { kz: 'Раушан', ru: 'Роза', en: 'Rose' },
  'settings.colorSky': { kz: 'Аспан', ru: 'Небо', en: 'Sky' },
  'settings.colorLavender': { kz: 'Лаванда', ru: 'Лаванда', en: 'Lavender' },
  'settings.colorMint': { kz: 'Жалбыз', ru: 'Мята', en: 'Mint' },

  // Profile
  'profile.stories': { kz: 'Жазбалары', ru: 'Записи', en: 'Stories by' },
  'profile.noStories': { kz: 'Жарияланған жазбалар жоқ.', ru: 'Нет опубликованных записей.', en: 'No published stories yet.' },
  'profile.joined': { kz: 'Тіркелген', ru: 'Присоединился', en: 'Joined' },

  // 404
  '404.title': { kz: 'Бұл бет табылмады', ru: 'Страница не найдена', en: "This page doesn't exist" },
  '404.home': { kz: 'Басты бетке оралу', ru: 'На главную', en: 'Go Home' },

  // Footer
  'footer.text': { kz: 'Бірге боліс', ru: 'Делись вместе', en: 'Share together' },

  // Edit page
  'edit.publish': { kz: 'Жариялау', ru: 'Опубликовать', en: 'Publish' },
  'edit.unpublish': { kz: 'Жариялаудан алу', ru: 'Снять с публ.', en: 'Unpublish' },
  'edit.save': { kz: 'Сақтау', ru: 'Сохранить', en: 'Save Changes' },
  'edit.saving': { kz: 'Сақталуда...', ru: 'Сохранение...', en: 'Saving...' },
  'edit.delete': { kz: 'Жазбаны жою', ru: 'Удалить запись', en: 'Delete post' },
  'edit.confirmDelete': { kz: 'Бұл жазбаны жоюға сенімдісіз бе?', ru: 'Удалить эту запись?', en: 'Are you sure you want to delete this post?' },

  // Follow
  'follow.follow': { kz: 'Жазылу', ru: 'Подписаться', en: 'Follow' },
  'follow.unfollow': { kz: 'Бас тарту', ru: 'Отписаться', en: 'Unfollow' },
  'follow.followers': { kz: 'жазылушы', ru: 'подписчик.', en: 'followers' },
  'follow.following': { kz: 'жазылым', ru: 'подписок', en: 'following' },

  // Bookmarks
  'bookmark.save': { kz: 'Сақтау', ru: 'Сохранить', en: 'Save' },
  'bookmark.saved': { kz: 'Сақталған', ru: 'Сохранено', en: 'Saved' },
  'bookmark.title': { kz: 'Сақталған жазбалар', ru: 'Сохранённые', en: 'Saved Posts' },
  'bookmark.empty': { kz: 'Сақталған жазбалар жоқ', ru: 'Нет сохранённых записей', en: 'No saved posts yet' },

  // Notifications
  'notif.title': { kz: 'Хабарламалар', ru: 'Уведомления', en: 'Notifications' },
  'notif.empty': { kz: 'Хабарлама жоқ', ru: 'Нет уведомлений', en: 'No notifications' },
  'notif.markAllRead': { kz: 'Барлығын оқылды деп белгілеу', ru: 'Отметить всё прочитанным', en: 'Mark all read' },
  'notif.liked': { kz: 'жазбаңызды ұнатты', ru: 'понравилась ваша запись', en: 'liked your post' },
  'notif.commented': { kz: 'жазбаңызға пікір қалдырды', ru: 'прокомментировал вашу запись', en: 'commented on your post' },
  'notif.followed': { kz: 'сізге жазылды', ru: 'подписался на вас', en: 'started following you' },

  // Common
  'common.loading': { kz: 'Жүктелуде...', ru: 'Загрузка...', en: 'Loading...' },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, locale: Locale): string {
  const entry = translations[key];
  if (!entry) return key;
  return entry[locale] || entry.en;
}

export default translations;
