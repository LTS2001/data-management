// @ts-expect-error Vite 特有的环境变量注入，TypeScript 默认不识别
const env = import.meta.env;

export const UMI_APP_ENV = env?.UMI_APP_ENV || 'development';

export const isProduction = UMI_APP_ENV === 'production';

export const IS_MICRO_APP = window.__POWERED_BY_QIANKUN__;
export const APP_API_URL = isProduction
  ? 'https://cartea.icartea.com'
  : 'https://cartea-dev.xiaofeilun.cn';
