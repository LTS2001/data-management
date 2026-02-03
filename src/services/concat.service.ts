import { request } from './request';
import { ApiResult, PagedResult } from './types/comon';
import {
  IConcatListRes,
  IConcatTagRes,
  IContactAnalysisParams,
  IContactAnalysisRes,
  IConversationListRes,
  IListConversationParams,
  IListMessageParams,
  IMessageCreate,
  IMessageListRes,
  INewMessageResponseData,
  IReceiveNewConversationParams,
  ISearchConversationParams,
  ISearchResponseData,
} from './types/concat.type';

export const getConcatList = async (params: {
  page: number;
  size: number;
  tag_ids: string;
  start_time?: string;
  end_time?: string;
}): Promise<PagedResult<IConcatListRes>> => {
  return request.get(`/labs-api/v1/contact`, { params });
};

export const getConcatTags = async (): Promise<ApiResult<IConcatTagRes[]>> => {
  return request.get(`/labs-api/v1/contact/tags`);
};

//用户分析接口
export function getContactAnalysis(
  params?: IContactAnalysisParams,
): Promise<ApiResult<IContactAnalysisRes>> {
  return request.get(`/labs-api/v1/contact/analytics`, {
    params,
  });
}

export async function listConversation(
  params: IListConversationParams,
  options?: { [key: string]: any },
): Promise<ApiResult<IConversationListRes[]>> {
  return request('/labs-api/v1/conversation/list', {
    method: 'GET',
    params: {
      // size has a default value: 10
      size: '20',
      ...params,
    },
    ...(options || {}),
  });
}

export async function listConversationMessage(
  params: IListMessageParams,
  options?: { [key: string]: any },
): Promise<ApiResult<IMessageListRes[]>> {
  return request('/labs-api/v1/conversation/message', {
    method: 'GET',
    params: {
      size: '50',
      ...params,
    },
    ...(options || {}),
  });
}

/** Receive New Message GET /labs-api/v1/conversation/new */
export async function receiveNewConversation(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: IReceiveNewConversationParams,
  options?: { [key: string]: any },
): Promise<ApiResult<INewMessageResponseData>> {
  return request('/labs-api/v1/conversation/new', {
    method: 'GET',
    params: {
      // size has a default value: 10
      size: '50',
      ...params,
    },
    ...(options || {}),
  });
}

/** Read POST /labs-api/v1/conversation/read */
export async function readConversation(
  body: { message_id: number },
  options?: { [key: string]: any },
): Promise<ApiResult<any>> {
  return request('/labs-api/v1/conversation/read', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Create Message POST /labs-api/v1/conversation/message */
export async function sendMessage(
  body: IMessageCreate,
  options?: { [key: string]: any },
): Promise<ApiResult<{ id: number }>> {
  return request('/labs-api/v1/conversation/message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Search Onversation GET /labs-api/v1/conversation/search */
export async function searchConversation(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: ISearchConversationParams,
  options?: { [key: string]: any },
): Promise<ApiResult<ISearchResponseData>> {
  return request('/labs-api/v1/conversation/search', {
    method: 'GET',
    params: { page: '1', size: '10', ...params },
    ...(options || {}),
  });
}
