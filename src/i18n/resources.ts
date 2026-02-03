import arEG from 'antd/locale/ar_EG';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import ar from './ar/translation.json';
import en from './en/translation.json';
import zh from './zh/translation.json';

export const resources = {
  en: {
    translation: en,
  },
  ar: {
    translation: ar,
  },
  zh: {
    translation: zh,
  },
};

export enum Language {
  en = 'en',
  ar = 'ar',
  zh = 'zh',
}

export const languageMap = {
  [Language.en]: 'English',
  [Language.ar]: 'Arabic',
  [Language.zh]: 'Chinese',
};

export const ConfigProviderLanguageLocale = {
  [Language.ar]: arEG,
  [Language.en]: enUS,
  [Language.zh]: zhCN,
};
export const CustomProLayoutLocale = {
  [Language.ar]: 'en-US',
  [Language.en]: 'en-US',
  [Language.zh]: 'zh-CN',
};
