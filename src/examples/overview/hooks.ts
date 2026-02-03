import { getHomeData } from '@/services/home.service';
import { HomeDataRes } from '@/services/types/home.type';
import { useRequest } from '@umijs/max';
import dayjs from 'dayjs';
import { useRef } from 'react';

export interface IOverViewData {
  data1d: HomeDataRes;
  data7d: HomeDataRes;
  data15d: HomeDataRes;
}
export const defaultData: IOverViewData = {
  data1d: [],
  data7d: [],
  data15d: [],
};

export const useGetOverViewData = () => {
  const overViewRef = useRef<IOverViewData>(defaultData);

  useRequest(
    async () => {
      const timezoneOffset = new Date().getTimezoneOffset();

      return getHomeData({
        start: dayjs()
          .add(-14, 'day')
          .startOf('day')
          .subtract(timezoneOffset, 'minute')
          .toISOString(),
        end: dayjs()
          .endOf('day')
          .subtract(timezoneOffset, 'minute')
          .toISOString(),
      });
    },
    {
      onSuccess: (result) => {
        const temp = (result || []).toSorted((a, b) => {
          return dayjs(a.day).valueOf() - dayjs(b.day).valueOf();
        });
        overViewRef.current = {
          data15d: temp,
          data7d: temp.slice(-7),
          data1d: temp.slice(-1),
        };
      },
      refreshDeps: [],
    },
  );

  return overViewRef.current;
};
