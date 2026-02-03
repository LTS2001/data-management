import { local } from '@/utils/storage';
import { TOptions } from 'i18next';
import { memoize } from 'lodash';
import { useCallback, useState } from 'react';
import i18n from './index';
import { Language, resources } from './resources';
import type { RecursiveKeyOf } from './types';
type DefaultLocale = typeof resources.en.translation;
export type TxKeyPath = RecursiveKeyOf<DefaultLocale>;
export const defaultLanguage = 'ar';
export const LOCAL_LANGUAGE = 'Cartea_admin_language';
export type Lang = 'en' | 'ar' | 'zh';
class LanguageStorage {
  getLanguage() {
    return local.get(LOCAL_LANGUAGE) as Language;
  }
  setLanguage(lang: Language) {
    return local.set(LOCAL_LANGUAGE, lang);
  }
}
export const languageStorage = new LanguageStorage();

export const t = memoize(
  (key: TxKeyPath, options = undefined) => {
    if (!key) {
      return '';
    }
    return i18n.t(key, { ns: 'translation', ...options }) as unknown as string;
  },
  (key: TxKeyPath, options: TOptions) =>
    options ? key + JSON.stringify(options) : key,
);

export const apiTranslation = memoize(
  (key: TxKeyPath, options = undefined) => {
    if (!key) {
      return '';
    }
    return i18n.t(key, { ns: 'api-message', ...options }) as unknown as string;
  },
  (key: TxKeyPath, options: TOptions) =>
    options ? key + JSON.stringify(options) : key,
);

export const changeLanguage = (lang: Language) => {
  i18n.changeLanguage(lang, () => {
    i18n.reloadResources();
    languageStorage.setLanguage(lang);
    window.location.reload();
  });
  // languageStorage.setLanguage(lang);
  // languageStorage.setLanguage(lang);
  // window.location.reload();
  // if (lang === 'ar') {
  //   I18nManager.forceRTL(true);
  // } else {
  //   I18nManager.forceRTL(false);
  // }
};

export const useSelectedLanguage = () => {
  const [language, setLang] = useState<Language>(
    (local.get(LOCAL_LANGUAGE) as Language) || Language.zh,
  );
  const setLanguage = useCallback((lang: Language) => {
    setLang(lang);
    if (lang) {
      changeLanguage(lang as Language);
    }
  }, []);

  return {
    language,
    setLanguage,
  };
};
