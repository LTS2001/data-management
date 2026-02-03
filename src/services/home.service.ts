import { request } from './request';
import { ApiResult } from './types/comon';
import { HomeDataRes, IHomeDataParams } from './types/home.type';

export function getHomeData(
  params?: IHomeDataParams,
): Promise<ApiResult<HomeDataRes>> {
  return request.get(`/labs-api/v1/home`, {
    params,
  });
}
