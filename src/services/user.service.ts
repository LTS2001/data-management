import { request } from './request';
import { ApiResult } from './types/comon';
import {
  ILoginParams,
  ILoginRes,
  IRegisterRes,
  IUserInfo,
} from './types/user.type';

export function login(params: ILoginParams): Promise<ApiResult<ILoginRes>> {
  return request.post(`/labs-api/v1/user/login`, params, {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
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
  return request.get(`/labs-api/v1/user/me`);
}

export function updateUserInfo(
  params: Pick<IUserInfo, 'name' | 'avatar_url'>,
): Promise<ApiResult<IUserInfo>> {
  return request.post(`/labs-api/v1/user/me`, params);
}
