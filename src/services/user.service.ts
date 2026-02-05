import { request } from './request';
import { ApiResult } from './types/comon';
import {
  ILoginParams,
  ILoginRes,
  IRegisterRes,
  IUserInfo,
} from './types/user.type';

export function login(params: ILoginParams): Promise<ApiResult<ILoginRes>> {
  return request.post(`/cartea-api/admin/pro/login`, params, {
    headers: {
      Accept: 'application/json',
      // 'content-type': 'application/x-www-form-urlencoded',
      // 'sec-fetch-mode': 'cors',
    },
  });
}

export function register(
  params: ILoginParams,
): Promise<ApiResult<IRegisterRes>> {
  return request.post(`/labs-api/v1/user/register`, params, {});
}

export function getUserInfo(): Promise<ApiResult<IUserInfo>> {
  return request.get(`/cartea-api/admin/pro/admin/info`, {
    headers: {
      Accept: 'application/json',
      'content-type': 'application/x-www-form-urlencoded',
      // 'sec-fetch-mode': 'cors',
    },
  });
}

// export function updateUserInfo(
//   params: Partial<IUserInfo>,
// ): Promise<ApiResult<IUserInfo>> {
//   return request.post(`/labs-api/v1/user/me`, params);
// }
