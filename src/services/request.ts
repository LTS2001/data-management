import { message } from 'antd';
import axios, { AxiosError } from 'axios';
console.log('🚀 axios初始化:', axios.defaults.adapter);
// import { loginOut } from './user/user.service';
import { APP_API_URL, DATA_MANAGE_TOKEN_KEY } from '@/config';
import {
  apiTranslation,
  t as defaultTranslation,
  TxKeyPath,
} from '@/i18n/utils';
import { getToken, toLogin } from '@/utils/auth';
import { local } from '@/utils/storage';
import { SSEFields, XRequest } from '@ant-design/x-sdk';
import Cookies from 'js-cookie';

// 标准后端响应数据格式
export interface STD_RESPONSE_FORMAT {
  code: BUSINESS_CODE;
  data: any;
  msg: string;
  repCode?: string;
  repData?: any;
  repMsg?: string;
  success?: boolean;
}

// 业务code
export enum BUSINESS_CODE {
  SUCCESS_CODE = 200, // 请求成功
  SUCCESS_CODE0 = 0, // 请求成功
  TOKEN_FORMAT_ERROR = 9009, // token格式错误，不是有效token
  TOKEN_INVALID = 9010, // token过期
  TOKEN_CRYPT_ERROR = 9011, // token加解密异常
  PEOJECT_ACCESS_ERROR = 9040, // 用户没有该项目的权限
  NOT_LOGIN = 401,
  //token 过期
}

/**
 * @description: 默认处理后端返回的错误信息 要把报错的key写到api-message文件
 * @param error 错误信息
 * @param t 翻译函数映射文件
 * @returns
 */
export const defaultCatchApiError = (error: unknown) => {
  if (error instanceof AxiosError) {
    const { response } = error;

    message.warning(apiTranslation(response?.data?.message || 'service-error'));
  } else if (
    typeof error === 'object' &&
    error &&
    'msg' in error &&
    typeof error.msg === 'string'
  ) {
    message.error(apiTranslation((error.msg as TxKeyPath) || 'service-error'));
  } else {
    message.warning(defaultTranslation('service-error'));
  }
};

const checkBusinessCode = (response: any) => {
  if (typeof response === 'object' && response.code !== undefined) {
    const stdResponse = response as STD_RESPONSE_FORMAT;
    const { code } = stdResponse;
    const { msg } = stdResponse;

    switch (code) {
      case BUSINESS_CODE.SUCCESS_CODE:
      case BUSINESS_CODE.SUCCESS_CODE0:
        return stdResponse.data;
      case BUSINESS_CODE.TOKEN_INVALID:
      case BUSINESS_CODE.TOKEN_FORMAT_ERROR:
      case BUSINESS_CODE.TOKEN_CRYPT_ERROR:
      case BUSINESS_CODE.NOT_LOGIN:
        // toLogin();
        break;
      case BUSINESS_CODE.PEOJECT_ACCESS_ERROR:
      default:
        break;
    }
    message.error(msg);
    return Promise.reject(response);
  }

  return response;
};

const request = axios.create({
  baseURL: APP_API_URL || '/',
  timeout: 300000,
  responseType: 'json',
  // withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
request.interceptors.request.use((config) => {
  const token = local.get<string>(DATA_MANAGE_TOKEN_KEY);

  if (token) {
    config.headers[DATA_MANAGE_TOKEN_KEY] = token;
    // config.headers['Authorization'] = token;
    Cookies.set(DATA_MANAGE_TOKEN_KEY, token, {
      domain: location.origin,
      path: '/',
    });
  }

  return config;
});

request.interceptors.response.use(
  async (response) => {
    const errCodes = [1001, 400, 500, 405, 429, 1];
    const res = response.data;
    if (res.code === BUSINESS_CODE.SUCCESS_CODE0) {
      checkBusinessCode(res);
      return Promise.resolve(res);
    } else if (errCodes.includes(res.code)) {
      // 这里做错误提示
      // message.error(res.msg || t('服务开小差了，请稍后再试'));
      return Promise.reject(res);
    } else if (res.code === 401) {
      // message.warning(t('登录过期，请重新登录'));
      toLogin();
      return Promise.reject(res);
    }
    return Promise.resolve(res);
  },
  (error) => {
    if (error?.status === BUSINESS_CODE.NOT_LOGIN) {
      message.warning(apiTranslation('login-expired' as TxKeyPath));
      toLogin();
      return;
    }
    // message.error(t('服务开小差了，请稍后再试'));

    return Promise.reject(error);
  },
);

function customXRequest(
  path: string,
  params?: any,
  callbacks?: {
    onSuccess?: (messages: Partial<Record<SSEFields, any>>[]) => void;
    onError?: (error: Error) => void;
    onUpdate?: (msg: Partial<Record<SSEFields, any>>) => void;
  },
) {
  XRequest(`${APP_API_URL}${path}`, {
    callbacks: {
      onSuccess: (messages) => callbacks?.onSuccess?.(messages),
      onError: (error) => callbacks?.onError?.(error),
      onUpdate: (msg) => callbacks?.onUpdate?.(msg),
    },
    headers: {
      Authorization: getToken()!,
    },
    method: 'POST',
    params,
  });
}

export { customXRequest, request };

export default request;
