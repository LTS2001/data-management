module.exports = {
  input: 'src',
  output: '',
  exclude: ['**/node_modules/**/*'],
  rules: {
    js: {
      caller: '',
      functionName: 't',
      customizeKey: function getCustomizeKey(key, path) {
        return key;
      },
      customSlot: function getCustomSlot(slotValue) {
        return `{{${slotValue}}}`;
      },
      importDeclaration: 'import { t } from "@/i18n/utils"',
    },
    ts: {
      caller: '',
      functionName: 't',
      customizeKey: function getCustomizeKey(key, path) {
        return key;
      },
      customSlot: function getCustomSlot(slotValue) {
        return `{{${slotValue}}}`;
      },
      importDeclaration: 'import { t } from "@/i18n/utils"',
    },
    cjs: {
      caller: '',
      functionName: 't',
      customizeKey: function getCustomizeKey(key, path) {
        return key;
      },
      customSlot: function getCustomSlot(slotValue) {
        return `{{${slotValue}}}`;
      },
      importDeclaration: 'import { t } from "@/i18n/utils"',
    },
    mjs: {
      caller: '',
      functionName: 't',
      customizeKey: function getCustomizeKey(key, path) {
        return key;
      },
      customSlot: function getCustomSlot(slotValue) {
        return `{{${slotValue}}}`;
      },
      importDeclaration: 'import { t } from "@/i18n/utils"',
    },
    jsx: {
      caller: '',
      functionName: 't',
      customizeKey: function getCustomizeKey(key, path) {
        return key;
      },
      customSlot: function getCustomSlot(slotValue) {
        return `{{${slotValue}}}`;
      },
      importDeclaration: 'import { t } from "@/i18n/utils"',
      functionSnippets: '',
    },
    tsx: {
      caller: '',
      functionName: 't',
      customizeKey: function getCustomizeKey(key, path) {
        return key;
      },
      customSlot: function getCustomSlot(slotValue) {
        return `{{${slotValue}}}`;
      },
      importDeclaration: 'import { t } from "@/i18n/utils"',
      functionSnippets: '',
    },
    vue: {
      caller: 'this',
      functionNameInTemplate: '$t',
      functionNameInScript: '$t',
      customizeKey: function getCustomizeKey(key, path) {
        return key;
      },
      customSlot: function getCustomSlot(slotValue) {
        return `{${slotValue}}`;
      },
      importDeclaration: '',
      tagOrder: ['template', 'script', 'style'],
    },
  },
  prettier: { semi: false, singleQuote: true },
  incremental: true,
  skipExtract: false,
  localePath: './i18n/zh/translation.json',
  localTransPath: {
    en: './i18n/en/translation.json',
    ar: './i18n/ar/translation.json',
    zh: './i18n/zh/translation.json',
  },
  localeFileType: 'json',
  excelPath: './locales.xlsx',
  exportExcel: false,
  skipTranslate: false,
  locales: ['en-US', 'ar-EG', 'zh-CN'],
  globalRule: { ignoreMethods: [] },
  adjustKeyMap: function (allKeyValue, currentFileKeyMap, currentFilePath) {
    return allKeyValue;
  },
};
