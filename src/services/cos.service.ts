import { request } from '@/services/request';
import { ApiResult } from './types/comon';

export async function cosSession(): Promise<
  ApiResult<{
    credentials: {
      sessionToken: string;
      tmpSecretId: string;
      tmpSecretKey: string;
      token: string;
    };
    expiration: string;
    expiredTime: number;
    requestId: string;
    startTime: number;
  }>
> {
  return request(
    'https://cartea-dev.xiaofeilun.cn/cartea-api/cos/getTempSecret',
    {
      method: 'GET',
      headers: {
        'cartea-admin-token':
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI0In0.u3Uw3dlIxirjSHZsp7uuApaGg9kRTT_ezH8wzfJRpFFQfRVrOUw5LmotdC5g2cvl4GjFyt9ApxvPAY0iOOHoWg',
      },
    },
  );
}

export async function ossSession(): Promise<
  ApiResult<{
    access_key_id: string;
    access_key_secret: string;
    security_token: string;
    expiration: string;
    bucket: string;
    endpoint: string;
    region: string;
  }>
> {
  return request('/labs-api/v1/user/oss/key', {
    method: 'get',
  });
}
