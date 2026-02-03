import { COUNTRY_OPTIONS } from '@/config';

export interface IEvaluateParams {
  page: string | number;
  size: string | number;
  start: string;
  end: string;
  rate: string | number;
}

export interface IEvaluateResItem {
  contact_id: number;
  content: string;
  conversation_id: number;
  create_time: string;
  id: number;
  message_type: number;
  rate: number;
  reply_content: null;
  reply_id: number;
  union_id: string;
}

export interface ISavaEvaluateParams {
  message_id: number;
  rate: number;
}

export interface IListEvaluateConversationParams {
  page: string | number;
  size: string | number;
  q: string;
  start: string;
  end: string;
  rate: string | number;
}

export interface IListConversationRes {
  start_time: string;
  id: number;
  last_message_time: string;
  create_time: string;
  contact_id: number;
  union_id: number | null;
  last_message: null;
  evaluate: number;
  update_time: string;
  contact_name: string;
  country: string;
  prompt?: {
    create_time: string;
    current: number;
    id: number;
    model_id: number;
    name: string;
    prompt: string;
    status: number;
    update_time: string;
    tool_names?: string[];
    tool_ids?: number[];
  };
}

export interface IConversationCreateParams {
  /** Contact Id */
  contact_id?: number | null;
  /** Union Id */
  union_id?: string | null;
  /** Evaluate */
  evaluate?: number | null;
  /** Start Time */
  start_time?: string | null;
  /** Last Message Time */
  last_message_time?: string | null;

  country?: (typeof COUNTRY_OPTIONS)[number]['value'];
  tool_ids?: number[];
}

export interface IConversationCreateRes {
  contact_id: number;
  create_time: string;
  evaluate: number;
  id: number;
  last_message: null;
  last_message_time: string;
  start_time: string;
  union_id: string | null;
  update_time: string;
}

export interface IMessageCreateRes {
  message_type: number;
  id: number;
  union_id: number;
  evaluate: number;
  token: string;
  create_time: string;
  contact_id: number;
  content: string;
  conversation_id: number;
  reply_id: number | null;
  content_type: number;
  rate: number;
  reply_message: {
    conversation_id: number;
    contact_id: number;
    message_type: EMessageType;
    content: string;
    content_type: EMessageContentType;
    evaluate: number | null;
    union_id: number;
    reply_id: number;
    token: string;
    rate: number;
  };
  response: string;
  state: {
    token: number;
    category: string;
    brand: string;
    series: string;
    min_price: number;
    max_price: number;
    car_type: string;
    next_action: string;
    year: number;
  };
}

export enum EMessageType {
  USER = 0,
  AI = 1,
}
export interface IListMessageRes {
  contact_id: number;
  conversation_id: 4;
  content: string;
  reply_id: number;
  rate: number;
  id: number;
  message_type: EMessageType;
  union_id: string;
  evaluate: number | null;
  create_time: string;
  content_type: EMessageContentType;
}

export enum EMessageContentType {
  TEXT = 1,
  IMAGE = 2,
  AUDIO,
  VIDEO,
}
export interface IMessageCreateParams {
  conversation_id: number;
  content: string;
  content_type: EMessageContentType;
}
