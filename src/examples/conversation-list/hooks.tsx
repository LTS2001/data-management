import { ImageRender } from '@/components/business/chat-box/chat-messge-log';
import {
  IConversationItem,
  MessageProps,
  MessageRole,
} from '@/components/business/chat-box/types';
import {
  listConversation,
  listConversationMessage,
  receiveNewConversation,
  searchConversation,
} from '@/services/concat.service';
import {
  IConversationListRes,
  IListConversationParams,
  IMessageListRes,
  INewMessageResponseData,
  IReceiveNewConversationParams,
  ISearchConversationParams,
} from '@/services/types/concat.type';
import {
  EMessageContentType,
  EMessageType,
} from '@/services/types/evaluate.type';
import { BubbleItemType } from '@ant-design/x';
import { useRequest } from '@umijs/max';
import { useCallback, useRef, useState } from 'react';

export const formattedData = (data: IConversationListRes[]) => {
  return data.map((item) => ({
    id: item.id,
    concatId: item.contact_id,
    concatName: item.contact_name || 'Unknown User',
    lastMessage: item.last_message || 'No Message',
    lastMessageTime: item.last_message_time || '',
    lastMessageId: item.last_message_id,
    country: item.country || '',
    unreadCount: item.seen,
  }));
};

/**
 * 获取会话列表
 * @param initialParams 初始参数
 * @param options 选项
 * @returns 会话列表
 */
export const useGetConversations = (
  initialParams?: IListConversationParams,
  options?: {
    manual?: boolean;
    onSuccess?: (data: IConversationListRes[]) => void;
    onError?: (error: Error) => void;
  },
) => {
  const conversationsRef = useRef<IConversationItem[]>([]);
  const { data, loading, error, run, refresh, mutate } = useRequest(
    (params?: IListConversationParams) => {
      return listConversation({
        ...initialParams,
        ...params,
      });
    },
    {
      manual: options?.manual ?? false,
      onSuccess: (result) => {
        conversationsRef.current = [
          ...conversationsRef.current,
          ...formattedData(result || []),
        ];
      },
    },
  );

  return {
    conversations: conversationsRef.current,
    loading,
    error,
    run,
    refresh,
    mutate,
    rawData: data,
  };
};

/**
 * 获取会话消息
 * @param conversation_id 会话id
 * @param throttleTime 节流时间
 * @returns 会话消息
 */
export const useGetConversationMessages = (
  // conversation_id?: number,
  throttleTime: number = 1000,
) => {
  const chatListRef = useRef<BubbleItemType[]>([]);
  const maxIdRef = useRef<number | undefined>(undefined);
  const lastCallTimeRef = useRef<number>(0);
  const isLoadingRef = useRef<boolean>(false);
  const throttleTimeRef = useRef<number>(throttleTime);
  // const preConversationIdRef = useRef<number>();
  // const ready = !!conversation_id;
  const { loading: messageLoading, run } = useRequest(
    (conversation_id?: number, max_id?: number) => {
      // if (
      //   preConversationIdRef?.current !== conversation_id &&
      //   maxIdRef?.current === max_id
      // ) {
      //   console.log('🚀 ~ hooks.tsx:105 ~ conversation_id:', conversation_id);
      //   console.log(11111, preConversationIdRef?.current);
      //   max_id = undefined;
      // }

      // preConversationIdRef.current = conversation_id;
      isLoadingRef.current = true;
      return listConversationMessage({ conversation_id, max_id });
    },
    {
      manual: true,
      // ready,
      onSuccess: (result) => {
        const newMessages: MessageProps[] =
          result
            ?.map((msg: IMessageListRes) => ({
              typing: msg.id === 99999 ? true : false,
              key: msg.id,
              role:
                msg.message_type === EMessageType.AI
                  ? MessageRole.USER
                  : MessageRole.AI,
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
          maxIdRef.current = undefined;
        } else {
          chatListRef.current = newMessages;
        }
        isLoadingRef.current = false;
        lastCallTimeRef.current = Date.now();
      },
      refreshDeps: [],
    },
  );

  const loadMoreMessages = useCallback(
    (conversationId: number, oldestMessageId: number) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCallTimeRef.current;

      if (isLoadingRef.current || timeSinceLastCall < throttleTimeRef.current) {
        return;
      }
      maxIdRef.current = oldestMessageId;
      run(conversationId, oldestMessageId);
    },
    [run],
  );

  const setThrottleTime = useCallback((newThrottleTime: number) => {
    throttleTimeRef.current = newThrottleTime;
  }, []);

  return {
    messages: chatListRef.current,
    messagesLoading: messageLoading,
    loadMoreMessages,
    setThrottleTime,
    isLoading: isLoadingRef.current,
    run,
  };
};

/**
 * 获取新会话
 * @param initialParams 初始参数
 * @param options 选项
 * @returns 新会话
 */
export const useReceiveNewConversation = (
  initialParams: IReceiveNewConversationParams,
  options?: {
    manual?: boolean;
    onSuccess?: (data: INewMessageResponseData) => void;
    onError?: (error: Error) => void;
  },
) => {
  const ready = !!initialParams.min_conversation_id;
  const {
    data: newData,
    loading,
    error,
    run,
    refresh,
    mutate,
  } = useRequest(
    (params?: Partial<IReceiveNewConversationParams>) => {
      return receiveNewConversation({
        ...initialParams,
        ...params,
      });
    },
    {
      manual: options?.manual ?? false,
      pollingInterval: 3000,
      ready,
    },
  );

  return {
    newData,
    loading,
    error,
    run,
    refresh,
    mutate,
  };
};

/**
 * 会话列表处理
 * @param initialItems 初始列表
 * @returns 会话列表
 */
export function useConversationList(initialItems: IConversationItem[] = []) {
  const [items, setItems] = useState<IConversationItem[]>(initialItems);
  const initialItemsRef = useRef(initialItems);

  useCallback(() => {
    if (
      JSON.stringify(initialItemsRef.current) !== JSON.stringify(initialItems)
    ) {
      initialItemsRef.current = initialItems;
      setItems(initialItems);
    }
  }, [initialItems])();

  const add = useCallback((item: IConversationItem[]) => {
    setItems((prev) => {
      const merged = [...item, ...prev];
      const sorted = merged.slice().sort((a, b) => {
        const timeA = new Date(a.lastMessageTime || '').getTime();
        const timeB = new Date(b.lastMessageTime || '').getTime();
        return timeB - timeA;
      });

      const seen = new Set<number>();
      const deduped: IConversationItem[] = [];

      for (const conv of sorted) {
        if (seen.has(conv.id)) continue;
        seen.add(conv.id);
        deduped.push(conv);
      }

      return deduped;
    });
  }, []);

  const update = useCallback((item: Partial<IConversationItem>) => {
    setItems((prev) => {
      return prev.map((conv) => {
        if (conv.id === item.id) {
          return {
            ...conv,
            ...item,
          };
        }
        return conv;
      });
    });
  }, []);
  return {
    updateConversation: update,
    conversationList: items,
    setConversations: setItems,
    addConversation: add,
  };
}

/**
 * 查找消息&联系人
 * @param initialParams 初始参数
 * @param options 选项
 * @returns 会话列表
 */
export const useSearchConversation = (
  initialParams: ISearchConversationParams,
) => {
  const searchResultRef = useRef<IConversationItem[]>([]);
  const { data, loading, error, run, refresh, mutate } = useRequest(
    (params?: ISearchConversationParams) => {
      return searchConversation({
        ...initialParams,
        ...params,
      });
    },
    {
      manual: true,
      debounceInterval: 500,
      throttleInterval: 500,
      onSuccess: (result) => {
        const searchConversation: IConversationItem[] = formattedData(
          result?.contact?.map((item) => item.conversation) || [],
        );
        const messageConversation: IConversationItem[] = result.message.map(
          (item) => ({
            id: item.conversation_id,
            concatId: item.contact_id,
            concatName: item.contact_name,
            lastMessage: item.content,
            lastMessageTime: item.create_time,
            unreadCount: 0,
            lastMessageId: Math.random(),
          }),
        );
        searchResultRef.current = [
          ...searchConversation,
          ...messageConversation,
        ];
      },
    },
  );

  return {
    searchResult: searchResultRef.current,
    searchLoading: loading,
    error,
    executeSearch: run,
    refresh,
    mutate,
    rawData: data,
  };
};
