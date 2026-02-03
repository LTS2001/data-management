import { local } from '@/utils/storage';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';
import { Language, resources } from './resources';

i18n
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`@/i18n/${language}/${namespace}.json`),
    ),
  )
  .use(initReactI18next)
  .init({
    resources: resources,
    lng: (local.get('Cartea_admin_language') as Language) || Language.zh,
    compatibilityJSON: 'v4',
    fallbackLng: Language.zh,
    load: 'currentOnly',
    supportedLngs: [Language.en, Language.ar, Language.zh],
    debug: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    }, // 启用按需加载
    partialBundledLanguages: true,
    ns: ['translation', 'api-message'], // 默认命名空间
    defaultNS: 'translation',
    fallbackNS: 'translation',
  });
export const isRTL: boolean =
  i18n.dir() === 'rtl' || window.document.dir === 'rtl';
export default i18n;
