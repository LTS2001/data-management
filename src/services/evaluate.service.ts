import { request } from './request';
import { ApiResult, PagedResult } from './types/comon';
import {
  IConversationCreateParams,
  IConversationCreateRes,
  IEvaluateParams,
  IEvaluateResItem,
  IListConversationRes,
  IListEvaluateConversationParams,
  IListMessageRes,
  IMessageCreateParams,
  IMessageCreateRes,
  ISavaEvaluateParams,
} from './types/evaluate.type';

export function getEvaluateData(
  params?: Partial<IEvaluateParams>,
): Promise<PagedResult<IEvaluateResItem>> {
  return request.get(`/labs-api/v1/evaluate`, {
    params,
  });
}

export function saveEvaluation(params?: ISavaEvaluateParams): Promise<any> {
  return request.post(`/labs-api/v1/evaluate/rate`, params);
}

export async function listEvaluateConversations(
  params: IListEvaluateConversationParams,
) {
  return request<PagedResult<IListConversationRes>>(
    '/labs-api/v1/evaluate/conversation',
    {
      method: 'GET',
      params: {
        ...params,
      },
    },
  );
}

export async function createConversation(
  body: IConversationCreateParams,
): Promise<ApiResult<IConversationCreateRes>> {
  return request('/labs-api/v1/evaluate/conversation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}

export async function listEvaluateMessages(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: { conversation_id: number; max_id?: number },
): Promise<ApiResult<IListMessageRes[]>> {
  return request('/labs-api/v1/evaluate/message', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function createMessage(
  body: IMessageCreateParams,
): Promise<ApiResult<IMessageCreateRes>> {
  return request('/labs-api/v1/evaluate/message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      ...body,
    },
    // responseType: 'stream',
  });
}

export async function createMessageStream(body: IMessageCreateParams) {
  return request('/labs-api/v1/evaluate/message_stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      ...body,
    },
    responseType: 'stream',
  });
}
