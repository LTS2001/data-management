import { createConversation } from '@/services/evaluate.service';
import { getModelList } from '@/services/prompt-lab.service';
import { updatePrompt } from '@/services/prompt.service';
import { defaultCatchApiError } from '@/services/request';
import { getToolsList } from '@/services/tools.service';
import { IConversationCreateParams } from '@/services/types/evaluate.type';
import { IPromptUpdateParams } from '@/services/types/prompt.type';
import { useRequest } from '@umijs/max';
import { message } from 'antd';
import { useRef } from 'react';

export const useCreateExperiment = (
  initialParams: IConversationCreateParams,
) => {
  const conversationRef = useRef<number>();
  const { loading, run } = useRequest(
    (params?: IConversationCreateParams) => {
      return createConversation({
        ...initialParams,
        ...params,
      });
    },
    {
      manual: true,
      onSuccess: (result) => {
        conversationRef.current = result.id;
      },
    },
  );
  return {
    conversationId: conversationRef.current,
    createLoading: loading,
    runCreateExperiment: run,
    setConversationId: (id?: number) => {
      conversationRef.current = id;
    },
  };
};

export const useUpdatePrompt = (
  initialParams: Partial<IPromptUpdateParams>,
) => {
  const { loading, run } = useRequest(
    (params?: Partial<IPromptUpdateParams>) => {
      return updatePrompt({
        ...initialParams,
        ...params,
      });
    },
    {
      debounceInterval: 1000,
      throttleInterval: 1000,
      manual: true,
      onSuccess: () => {
        message.success('save success');
      },
      onError: (error) => {
        defaultCatchApiError(error);
      },
    },
  );
  return {
    createLoading: loading,
    updatePrompt: run,
  };
};

export const useGetModelList = () => {
  const { loading, run, data } = useRequest(
    () => {
      return getModelList({ params: { page: 1, size: 100 } });
    },
    {
      manual: false,
    },
  );
  return {
    modelList:
      data?.items.map((item) => ({
        label: item.name,
        value: item.id,
      })) || [],
    modelListLoading: loading,
    getModelList: run,
  };
};
export const useGetToolsList = () => {
  const { loading, run, data } = useRequest(
    () => {
      return getToolsList({ params: { page: 1, size: 100 } });
    },
    {
      manual: false,
    },
  );
  return {
    toolsList:
      data?.items.map((item) => ({
        label: item.name,
        value: item.id,
      })) || [],
    toolsListLoading: loading,
    getToolsList: run,
  };
};
