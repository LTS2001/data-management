import { getEvaluateData } from '@/services/evaluate.service';
import { defaultCatchApiError } from '@/services/request';
import { IEvaluateParams } from '@/services/types/evaluate.type';
import dayjs from 'dayjs';
import { ISearchValue } from '../message';

export async function getEvaluateListByFormData(
  adaptParams: IEvaluateParams & ISearchValue,
) {
  const { time_range, ...otherParams } = adaptParams;
  let start: string | undefined, end: string | undefined;
  const timezoneOffset = new Date().getTimezoneOffset();
  // time_range: 0 今天（当前天），1 近 7 天
  if (typeof time_range === 'number') {
    end = dayjs().endOf('day').subtract(timezoneOffset, 'minute').toISOString();
    start = dayjs()
      .startOf('day')
      .add(time_range === 1 ? -7 : 0, 'day')
      .subtract(timezoneOffset, 'minute')
      .toISOString();
  }
  try {
    return await getEvaluateData({
      ...otherParams,
      ...(typeof time_range === 'number' ? { start, end } : {}),
    });
  } catch (error) {
    return defaultCatchApiError(error);
  }
}
