import { EMessageContentType, EMessageType } from './evaluate.type';

export interface IConcatListRes {
  address: string;
  avatar_url: string;
  country: string;
  create_time: string;
  id: number;
  name: string;
  phone_number: string;
  union_id: string | null;
  update_time: string;
  tag_ids: string[];
  tags: string[];
}

export interface IConcatTagRes {
  id: number;
  name: string;
}

export interface IContactAnalysisRes {
  brands: { brand: string; inquiries: number }[];
  end: string;
  generated_at: string;
  intents: { tag: string; percentage: number }[];
  regions: { country: string; events: number }[];
  start: string;
  summary: {
    total_events: number;
    unique_users: number;
    events_change_percent: number;
    users_change_percent: number;
    top_intent: string;
    top_intent_percentage: number;
  };
  trend: {
    labels: string[];
    values: number[];
  };
}

export interface IContactAnalysisParams {
  start?: string;
  end?: string;
}

export interface IListConversationParams {
  max_conversation_id?: number | null;
  max_message_time?: string | null;
  size?: number;
}

export interface IConversationListRes {
  /** Id */
  id: number;
  /** Contact Id */
  contact_id: number;
  /** Union Id */
  union_id?: string | null;
  /** Country */
  country?: string | null;
  /** Start Time */
  start_time: string;
  /** Last Message Time */
  last_message_time?: string | null;
  /** Last Message */
  last_message?: string | null;
  last_message_id: number;
  /** Contact Name */
  contact_name?: string | null;
  /** Seen */
  seen?: number;
  /** Evaluate */
  evaluate?: number | null;
  /** Create Time */
  create_time: string;
  /** Update Time */
  update_time: string;
}

export interface IListMessageParams {
  conversation_id?: number;
  max_id?: number | null;
  size?: number;
}

export interface IMessageListRes {
  /** Conversation Id */
  conversation_id: number;
  /** Contact Id */
  contact_id: number;
  contact_name: string;
  /** Message Type */
  message_type?: EMessageType;
  /** Content */
  content: string;
  /** Content Type */
  content_type: EMessageContentType;
  /** Evaluate */
  evaluate?: number | null;
  /** Union Id */
  union_id?: string | null;
  /** Reply Id */
  reply_id?: number | null;
  /** Token */
  token?: number | null;
  /** Rate */
  rate?: number | null;
  /** Id */
  id: number;
  /** Create Time */
  create_time: string;
}

export interface INewMessageResponseData {
  /** Conversation */
  conversation: IConversationListRes[];
  /** Message */
  message: IMessageListRes[];
}
interface IContact {
  /** Name */
  name: string;
  /** Union Id */
  union_id?: string | null;
  /** Phone Number */
  phone_number?: string | null;
  /** Car Brand */
  car_brand?: string | null;
  /** Create Time */
  create_time: string;
  /** Id */
  id: number;
  /** Avatar Url */
  avatar_url?: string | null;
  /** Country */
  country?: string | null;
  /** Address */
  address?: string | null;
  /** Update Time */
  update_time: string;
  /** Tags */
  tags?: string[];
  conversation: IConversationListRes;
}
export interface ISearchResponseData {
  /** Conversation */
  contact: IContact[];
  /** Message */
  message: IMessageListRes[];
}

export interface IReceiveNewConversationParams {
  min_message_time: string;
  min_conversation_id: number;
  conversation_id?: number | null;
  min_message_id?: number | null;
  size?: number;
}

export interface IMessageCreate {
  /** Conversation Id */
  conversation_id: number;
  /** Contact Id */
  contact_id?: number;
  /** Message Type */
  // 0就是客户的消息，1就是 你发的消息
  message_type?: number | null;
  /** Content */
  content: string;
  /** Content Type */
  content_type: EMessageContentType;
  /** Evaluate */
  evaluate?: number | null;
  /** Union Id */
  union_id?: string | null;
  /** Reply Id */
  reply_id?: number | null;
  /** Token */
  token?: number | null;
  /** Rate */
  rate?: number | null;
}

export interface ISearchConversationParams {
  q: string;
  page?: number;
  size?: number;
}
