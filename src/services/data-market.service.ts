import dayjs from 'dayjs';
import request from './request';
import { ApiResult } from './types/comon';
import {
  IDateParams,
  IGetGrowthAnalysis,
  IGetInteractionAnalysis,
  IGetLossAnalysis,
  IGetTransitionAnalysis,
  IGetUserAssets,
} from './types/data-market';

/**
 * 默认7天数据
 */
const getDefaultDate = (s?: string, e?: string) => {
  const date = dayjs();
  const startDate = date.subtract(7, 'day').format('YYYY-MM-DD');
  const endDate = date.format('YYYY-MM-DD');
  return {
    startDate: s ? s : startDate,
    endDate: e ? e : endDate,
  };
};

export const getUserAssets = ({
  startDate,
  endDate,
  ...params
}: IDateParams = {}): Promise<ApiResult<IGetUserAssets>> => {
  return request.get(`/cartea-clickhouse-api/data/user/assets`, {
    params: {
      ...getDefaultDate(startDate, endDate),
      ...params,
    },
  });
};

export const getGrowthAnalysis = ({
  startDate,
  endDate,
  ...params
}: IDateParams = {}): Promise<ApiResult<IGetGrowthAnalysis>> => {
  return request.get(`/cartea-clickhouse-api/data/growth/analysis`, {
    params: {
      ...getDefaultDate(startDate, endDate),
      ...params,
    },
  });
};

export const getLossAnalysis = ({
  startDate,
  endDate,
  ...params
}: IDateParams = {}): Promise<ApiResult<IGetLossAnalysis>> => {
  return request.get(`/cartea-clickhouse-api/data/loss/analysis`, {
    params: {
      ...getDefaultDate(startDate, endDate),
      ...params,
    },
  });
};

export const getInteractionAnalysis = ({
  startDate,
  endDate,
  ...params
}: IDateParams = {}): Promise<ApiResult<IGetInteractionAnalysis>> => {
  return request.get(`/cartea-clickhouse-api/data/interaction/analysis`, {
    params: {
      ...getDefaultDate(startDate, endDate),
      ...params,
    },
  });
};

// export const getConversionAnalysis = ({
//   startDate,
//   endDate,
//   ...params
// }: IDateParams = {}): Promise<ApiResult<IGetConversionAnalysis>> => {
//   return request.get(`/cartea-clickhouse-api/data/conversion/analysis`, {
//     params: {
//       ...getDefaultDate(startDate, endDate),
//       ...params,
//     },
//   });
// };

export const getAiAnalysis = (
  type: string,
  data: any,
): Promise<ApiResult<any>> => {
  return request.post(`/cartea-clickhouse-api/data/ai/analysis`, {
    type,
    ...data,
  });
};

export const getTransitionAnalysis = ({
  startDate,
  endDate,
  ...params
}: IDateParams = {}): Promise<ApiResult<IGetTransitionAnalysis>> => {
  return request.get(`/cartea-clickhouse-api/data/transition/analysis`, {
    params: {
      ...getDefaultDate(startDate, endDate),
      ...params,
    },
  });
};
