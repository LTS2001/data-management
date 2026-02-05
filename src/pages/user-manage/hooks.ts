import { listCUserOption } from '@/services/user-manage.serivce';
import { useRequest } from '@umijs/max';
import { useMemo } from 'react';

/**
 * 获取C端用户选项数据（渠道、国家等）
 * @returns 选项数据和加载状态
 */
export const useGetCUserOptions = () => {
  const { data: optionDataRes, loading: optionLoading } =
    useRequest(listCUserOption);

  const optionData = optionDataRes;

  // 格式化渠道选项
  const channels = useMemo(
    () =>
      optionData?.channels?.map((item) => ({ label: item, value: item })) || [],
    [optionData?.channels],
  );

  // 格式化国家选项
  const countries = useMemo(
    () =>
      optionData?.countries?.map((item) => ({ label: item, value: item })) ||
      [],
    [optionData?.countries],
  );

  return {
    channels,
    countries,
    optionLoading,
    optionData,
  };
};
