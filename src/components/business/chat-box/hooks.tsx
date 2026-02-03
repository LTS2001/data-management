import { t } from '@/i18n/utils';
import { listEvaluateMessages } from '@/services/evaluate.service';
import {
  EMessageContentType,
  EMessageType,
  IListMessageRes,
} from '@/services/types/evaluate.type';
import { BubbleItemType } from '@ant-design/x';
import { useRequest } from '@umijs/max';
import { useCallback, useRef, useState } from 'react';
import { ImageRender } from './chat-messge-log';
import { MessageProps, MessageRole } from './types';

export const DEFAULT_MESSAGE: IListMessageRes = {
  contact_id: 99999,
  conversation_id: 4,
  content: t('welcome-message'),
  reply_id: 99999,
  rate: 99999,
  id: 99999,
  message_type: EMessageType.AI,
  union_id: 'welcome',
  evaluate: 99999,
  create_time: '2025-01-01 00:00:00',
  content_type: EMessageContentType.TEXT,
};

/**
 * 获取聊天记录
 * @param conversation_id 会话id
 * @param throttleTime 节流时间
 * @returns 聊天列表
 */
export const useGetChatList = (
  conversation_id?: number,
  throttleTime: number = 1000,
) => {
  const chatListRef = useRef<BubbleItemType[]>([]);
  const maxIdRef = useRef<number | undefined>(undefined);
  const lastCallTimeRef = useRef<number>(0);
  const isLoadingRef = useRef<boolean>(false);
  const throttleTimeRef = useRef<number>(throttleTime);

  const { loading: chatListLoading, run } = useRequest(
    (max_id?: number) => {
      if (!conversation_id) {
        return Promise.resolve({
          data: [DEFAULT_MESSAGE],
        });
      }
      isLoadingRef.current = true;
      return listEvaluateMessages({ conversation_id, max_id });
    },
    {
      manual: false,
      onSuccess: (result) => {
        const newMessages: MessageProps[] =
          result
            ?.map((msg: IListMessageRes) => ({
              typing: msg.id === 99999 ? true : false,
              key: msg.id,
              role:
                msg.message_type === EMessageType.AI
                  ? MessageRole.AI
                  : MessageRole.USER,
              content: msg.content,

              extraInfo: {
                id: msg.id,
                createTime: msg.create_time,
                rate: msg.rate,
                contentType: msg.content_type,
              },
              ...(({ content_type, content }) =>
                content_type === EMessageContentType.IMAGE
                  ? { contentRender: () => <ImageRender imageUrl={content} /> }
                  : {})(msg),
            }))
            .reverse() || [];

        if (maxIdRef.current) {
          chatListRef.current = [...newMessages, ...chatListRef.current];
        } else {
          chatListRef.current = newMessages;
        }

        isLoadingRef.current = false;
        lastCallTimeRef.current = Date.now();
      },
      refreshDeps: [conversation_id],
    },
  );

  const loadMoreMessages = useCallback(
    (oldestMessageId: number) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCallTimeRef.current;

      if (isLoadingRef.current || timeSinceLastCall < throttleTimeRef.current) {
        return;
      }

      // Proceed with the API call
      maxIdRef.current = oldestMessageId;
      run(oldestMessageId);
    },
    [run],
  );

  const setThrottleTime = useCallback((newThrottleTime: number) => {
    throttleTimeRef.current = newThrottleTime;
  }, []);

  return {
    chatList: chatListRef.current,
    chatListLoading,
    loadMoreMessages,
    setThrottleTime,
    isLoading: isLoadingRef.current,
  };
};

/**
 * 聊天记录处理
 * @param initialItems 初始列表
 * @returns 聊天列表
 */
export function useContentBubbleList(initialItems: BubbleItemType[] = []) {
  const [messageList, setMessages] = useState<BubbleItemType[]>(initialItems);
  const initialItemsRef = useRef(initialItems);

  useCallback(() => {
    if (
      JSON.stringify(initialItemsRef.current) !== JSON.stringify(initialItems)
    ) {
      initialItemsRef.current = initialItems;
      setMessages(initialItems);
    }
  }, [initialItems])();

  const addMessages = useCallback((item: BubbleItemType) => {
    // 过滤id相同的项目 保留最新的
    setMessages((prev) => {
      // 过滤掉 key 相同的项，然后添加新项（保留最新的）
      const filtered = prev.filter((msg) => msg.key !== item.key);
      return [...filtered, item];
    });
  }, []);

  const updateMessages = useCallback(
    (key: string | number, data: Partial<BubbleItemType>) => {
      setMessages((prev) => {
        const newItems = [...prev];
        const targetItemIndex = newItems.findIndex((item) => item.key === key);
        if (targetItemIndex !== -1) {
          newItems[targetItemIndex] = {
            ...newItems[targetItemIndex],
            content: `${newItems[targetItemIndex].content ?? ''}${
              data.content ?? ''
            }`,
            loading: data.loading ?? false,
            extraInfo: {
              ...newItems[targetItemIndex].extraInfo,
              ...data.extraInfo,
            },
          };
        } else {
          newItems.push({ ...data, key } as BubbleItemType);
        }
        return newItems;
      });
    },
    [],
  );

  const getMessageById = useCallback(
    (id: string | number) => {
      let target: BubbleItemType | undefined;
      setMessages((prev) => {
        target = prev.find((item) => item.key === id);
        return prev;
      });
      return target;
    },
    [messageList],
  );

  return {
    messageList,
    setMessages,
    addMessages,
    getMessageById,
    updateMessages,
  };
}
