import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ar' | 'hi' | 'mr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'app.name': 'SecureChat',
    'app.tagline': 'Anonymous, End-to-End Encrypted Messaging',
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.start_chat': 'Start Chat',
    'chat.typing': 'is typing...',
    'chat.online': 'Online',
    'chat.offline': 'Offline',
    'chat.send': 'Send',
    'chat.placeholder': 'Type a message...',
    'settings.theme': 'Theme',
    'settings.language': 'Language',
    'settings.notifications': 'Notifications',
  },
  es: {
    'app.name': 'SecureChat',
    'app.tagline': 'Mensajería Anónima con Cifrado de Extremo a Extremo',
    'nav.home': 'Inicio',
    'nav.about': 'Acerca de',
    'nav.blog': 'Blog',
    'nav.contact': 'Contacto',
    'nav.start_chat': 'Iniciar Chat',
    'chat.typing': 'está escribiendo...',
    'chat.online': 'En línea',
    'chat.offline': 'Desconectado',
    'chat.send': 'Enviar',
    'chat.placeholder': 'Escribe un mensaje...',
    'settings.theme': 'Tema',
    'settings.language': 'Idioma',
    'settings.notifications': 'Notificaciones',
  },
  fr: {
    'app.name': 'SecureChat',
    'app.tagline': 'Messagerie Anonyme Chiffrée de Bout en Bout',
    'nav.home': 'Accueil',
    'nav.about': 'À propos',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.start_chat': 'Démarrer Chat',
    'chat.typing': 'est en train d\'écrire...',
    'chat.online': 'En ligne',
    'chat.offline': 'Hors ligne',
    'chat.send': 'Envoyer',
    'chat.placeholder': 'Tapez un message...',
    'settings.theme': 'Thème',
    'settings.language': 'Langue',
    'settings.notifications': 'Notifications',
  },
  de: {
    'app.name': 'SecureChat',
    'app.tagline': 'Anonyme End-to-End verschlüsselte Nachrichten',
    'nav.home': 'Startseite',
    'nav.about': 'Über',
    'nav.blog': 'Blog',
    'nav.contact': 'Kontakt',
    'nav.start_chat': 'Chat Starten',
    'chat.typing': 'tippt...',
    'chat.online': 'Online',
    'chat.offline': 'Offline',
    'chat.send': 'Senden',
    'chat.placeholder': 'Nachricht eingeben...',
    'settings.theme': 'Design',
    'settings.language': 'Sprache',
    'settings.notifications': 'Benachrichtigungen',
  },
  zh: {
    'app.name': 'SecureChat',
    'app.tagline': '匿名端到端加密消息',
    'nav.home': '首页',
    'nav.about': '关于',
    'nav.blog': '博客',
    'nav.contact': '联系',
    'nav.start_chat': '开始聊天',
    'chat.typing': '正在输入...',
    'chat.online': '在线',
    'chat.offline': '离线',
    'chat.send': '发送',
    'chat.placeholder': '输入消息...',
    'settings.theme': '主题',
    'settings.language': '语言',
    'settings.notifications': '通知',
  },
  ar: {
    'app.name': 'SecureChat',
    'app.tagline': 'مراسلة مشفرة من طرف إلى طرف ومجهولة',
    'nav.home': 'الرئيسية',
    'nav.about': 'حول',
    'nav.blog': 'المدونة',
    'nav.contact': 'اتصل',
    'nav.start_chat': 'ابدأ الدردشة',
    'chat.typing': 'يكتب...',
    'chat.online': 'متصل',
    'chat.offline': 'غير متصل',
    'chat.send': 'إرسال',
    'chat.placeholder': 'اكتب رسالة...',
    'settings.theme': 'المظهر',
    'settings.language': 'اللغة',
    'settings.notifications': 'الإشعارات',
  },
  hi: {
    'app.name': 'SecureChat',
    'app.tagline': 'गुमनाम, एंड-टू-एंड एन्क्रिप्टेड मैसेजिंग',
    'nav.home': 'होम',
    'nav.about': 'के बारे में',
    'nav.blog': 'ब्लॉग',
    'nav.contact': 'संपर्क करें',
    'nav.start_chat': 'चैट शुरू करें',
    'chat.typing': 'टाइप कर रहा है...',
    'chat.online': 'ऑनलाइन',
    'chat.offline': 'ऑफलाइन',
    'chat.send': 'भेजें',
    'chat.placeholder': 'एक संदेश टाइप करें...',
    'settings.theme': 'थीम',
    'settings.language': 'भाषा',
    'settings.notifications': 'सूचनाएं',
  },
  mr: {
    'app.name': 'SecureChat',
    'app.tagline': 'निनावी, एंड-टू-एंड एन्क्रिप्टेड मेसेजिंग',
    'nav.home': 'मुख्यपृष्ठ',
    'nav.about': 'बद्दल',
    'nav.blog': 'ब्लॉग',
    'nav.contact': 'संपर्क',
    'nav.start_chat': 'चॅट सुरू करा',
    'chat.typing': 'टाइप करत आहे...',
    'chat.online': 'ऑनलाइन',
    'chat.offline': 'ऑफलाइन',
    'chat.send': 'पाठवा',
    'chat.placeholder': 'संदेश टाइप करा...',
    'settings.theme': 'थीम',
    'settings.language': 'भाषा',
    'settings.notifications': 'सूचना',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    if (saved && translations[saved as Language]) {
      return saved as Language;
    }
    // Auto-detect
    const browserLang = navigator.language.split('-')[0];
    return (translations[browserLang as Language] ? browserLang : 'en') as Language;
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
