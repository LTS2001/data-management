const env = process.env;

export const UMI_APP_ENV = env?.UMI_APP_ENV || 'development';

export const isProduction = UMI_APP_ENV === 'production';

export const IS_MICRO_APP = window.__POWERED_BY_QIANKUN__;
export const APP_API_URL = isProduction
  ? 'https://management.icartea.com'
  : 'https://cartea-dev.xiaofeilun.cn';
