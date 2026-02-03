import { EMessageContentType } from '@/services/types/evaluate.type';
import { BubbleItemType } from '@ant-design/x';
import React from 'react';

export enum EAiResponseType {
  THINKING = 'thinking',
  CONTENT = 'content',
  USER = 'user',
}

export enum MessageRole {
  USER = 'user',
  AI = 'ai',
}

export type MessageVariant =
  | 'borderless'
  | 'filled'
  | 'outlined'
  | 'shadow'
  | undefined;

export interface MessageProps extends BubbleItemType {
  key: string | number;
  role: MessageRole;
  content: string;
  contentRender?: () => React.ReactNode;
  variant?: MessageVariant;
  style?: React.CSSProperties;
  loading?: boolean;
  extraInfo?: {
    id: string | number;
    createTime: string;
    contentType: EMessageContentType;
    finish?: boolean;
    translateInfo?: {
      zh?: string;
      ar?: string;
      en?: string;
    };
  };
}

export interface IConversationItem {
  id: number;
  concatId: number;
  concatName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount?: number;
  lastMessageId: number;
}
export interface IMessageData {
  type: EAiResponseType;
  step?: number;
  total_tokens?: number;
  content: string;
  title?: string;
  id?: string;
}
