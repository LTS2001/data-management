// src/pages/prompt-laboratory/prompt-polit/hooks.ts
import { getModelList } from '@/services/prompt-lab.service';
import {
  deletePrompt,
  savePrompt,
  updatePrompt,
} from '@/services/prompt.service';
import { getToolsList } from '@/services/tools.service';
import { IPromptParams } from '@/services/types/prompt.type';
import { useRequest } from '@umijs/max';
import { message } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// 获取模型列表
export const useGetModelList = () => {
  const { loading, data, run } = useRequest(
    () => getModelList({ params: { page: 1, size: 100 } }),
    {
      manual: false,
    },
  );

  const modelOptions = useMemo(() => {
    if (!data?.items) return [];

    const grouped = data.items.reduce((acc, item) => {
      const type = item.type || '其他';
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push({
        value: item.id,
        label: item.name,
      });
      return acc;
    }, {} as Record<string, Array<{ value: number; label: string }>>);

    return Object.entries(grouped).map(([type, options]) => ({
      label: type,
      options: options,
    }));
  }, [data]);

  return {
    modelOptions,
    modelLoading: loading,
    getModelList: run,
  };
};

// 获取工具列表
export const useGetToolsList = () => {
  const { loading, data, run } = useRequest(
    () => getToolsList({ params: { page: 1, size: 100 } }),
    {
      manual: false,
    },
  );

  const toolOptions = useMemo(() => {
    if (!data?.items) return [];
    return data.items.map((item) => ({
      value: item.id,
      label: item.name,
    }));
  }, [data]);

  return {
    toolOptions,
    toolsLoading: loading,
    getToolsList: run,
  };
};

// 保存/更新 Prompt
export const useSavePrompt = () => {
  const { t } = useTranslation('evaluate');
  const { loading, run } = useRequest(
    (params: IPromptParams, isEdit: boolean) => {
      return isEdit && params.id
        ? updatePrompt(params as any)
        : savePrompt(params);
    },
    {
      manual: true,
      onSuccess: (isEdit: boolean) => {
        message.success(isEdit ? t('update-success') : t('create-success'));
      },
      onError: (error: any) => {
        message.error(error?.message || t('save-failure-message'));
      },
    },
  );

  return {
    saveLoading: loading,
    savePrompt: run,
  };
};

// 删除 Prompt
export const useDeletePrompt = () => {
  const { t } = useTranslation('evaluate');
  const { loading, run } = useRequest(deletePrompt, {
    manual: true,
    onSuccess: (result) => {
      if (result?.code === 0) {
        message.success(t('delete-success'));
      }
    },
  });

  return {
    deleteLoading: loading,
    deletePrompt: run,
  };
};

// 设置为当前使用
export const useUpdatePromptCurrent = () => {
  const { t } = useTranslation('evaluate');
  const { loading, run } = useRequest(
    (params: { id: number; name: string; prompt: string }) => {
      return updatePrompt({
        ...params,
        current: 1,
      });
    },
    {
      manual: true,
      onSuccess: (result) => {
        if (result?.code === 0) {
          message.success(t('switch-to-production-success'));
        }
      },
    },
  );

  return {
    updateCurrentLoading: loading,
    updatePromptCurrent: run,
  };
};
