import { t, TxKeyPath } from '@/i18n/utils';
import { listDepartment } from '@/services/backend-manage.service';
import { useRequest } from '@umijs/max';
import { useMemo } from 'react';

export const useDepartmentOptions = () => {
  const { data: optionDataRes, loading: optionLoading } =
    useRequest(listDepartment);

  const optionData = optionDataRes;

  // 格式化渠道选项
  const departments = useMemo(
    () =>
      optionData?.map((item) => ({
        label: t(item.name as TxKeyPath),
        value: item.departmentId,
      })) || [],
    [optionData],
  );

  return {
    departments,
    optionLoading,
    optionData,
  };
};
