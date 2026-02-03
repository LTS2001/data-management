/**
 * @description 聊天框组件
 * 这里用于ai对话，可以作为提供参考组合组件
 */
import { t } from '@/i18n/utils';
import { customXRequest } from '@/services/request';
import { EMessageContentType } from '@/services/types/evaluate.type';
import { generateRandomId } from '@/utils/generate';
import { ReloadOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import { SSEFields } from '@ant-design/x-sdk';
import { Badge, Button, Flex, GetRef, message, Modal } from 'antd';
import React, { useCallback, useRef } from 'react';
import ChatMessageLog from './chat-messge-log';
import ChatSender from './chat-sender';
import { createMessageFactory } from './config';
import { useContentBubbleList, useGetChatList } from './hooks';
import { EAiResponseType, IMessageData } from './types';

const ChatBox: React.FC<{
  conversationId?: number;
  country?: string;
  promptId?: number;
  throttleTime?: number;
}> = ({ conversationId, throttleTime = 800, promptId, country }) => {
  const { chatList, chatListLoading, loadMoreMessages } = useGetChatList(
    conversationId,
    throttleTime,
  );

  const {
    messageList,
    addMessages,
    setMessages,
    updateMessages,
    getMessageById,
  } = useContentBubbleList(chatList);

  const listRef = useRef<GetRef<typeof Bubble.List>>(null);
  const curThinkingFinishRef = useRef<boolean>(false);
  const handleScrollToTop = useCallback(() => {
    if (messageList.length && conversationId) {
      const oldestMessage = messageList[0];
      const messageId = oldestMessage.extraInfo?.id;
      if (messageId) {
        loadMoreMessages(messageId);
      }
    }
  }, [messageList, loadMoreMessages, conversationId]);

  const handleUpdateMessage = (
    msg: Partial<Record<SSEFields, any>>,
    contentKey: string,
    thinkingKey: string,
  ) => {
    const data: IMessageData = JSON.parse(msg.data);

    if (data.type === EAiResponseType.THINKING) {
      addMessages(
        createMessageFactory.aiThinking({
          key: thinkingKey,
          title: data.title,
          content: data.content,
        }),
      );
    }

    if (data.type === EAiResponseType.CONTENT) {
      if (!curThinkingFinishRef.current) {
        curThinkingFinishRef.current = true;
        addMessages(
          createMessageFactory.aiThinking({
            key: thinkingKey,
            finish: true,
          }),
        );
      }
      updateMessages(
        contentKey,
        createMessageFactory.aiResponse(contentKey, data.content),
      );
    }
  };

  const handleSendMessage = async (text: string, type: EMessageContentType) => {
    if (!conversationId) {
      message.warning('请先创建对话');
      return;
    }

    if (type === EMessageContentType.IMAGE) {
      addMessages(createMessageFactory.userImage(text));
    } else {
      addMessages(createMessageFactory.userText(text));
    }

    const contentKey = generateRandomId();
    const thinkingKey = generateRandomId();
    curThinkingFinishRef.current = false;
    const params = {
      conversation_id: conversationId,
      content: text,
      content_type: type,
      country,
      prompt_id: promptId,
    };

    try {
      customXRequest('/labs-api/v1/evaluate/message_stream', params, {
        onUpdate: (msg) => handleUpdateMessage(msg, contentKey, thinkingKey),
      });
    } catch (error) {
      message.error('发送消息出错');
    }
  };

  const handleResetConversation = () => {
    Modal.confirm({
      title: '重置对话',
      content: '确定要重置对话吗？',
      onOk: () => {
        setMessages([]);
        customXRequest(
          '/labs-api/v1/evaluate/reply_stream',
          { conversation_id: conversationId!, prompt_id: promptId! },
          {
            onUpdate: (msg) => {
              const data: IMessageData = JSON.parse(msg.data);

              if (data.type === EAiResponseType.CONTENT) {
                const message = getMessageById(Number(data.id) - 1);
                if (message?.extraInfo?.finish === false) {
                  addMessages(
                    createMessageFactory.aiThinking({
                      key: Number(data.id) - 1,
                      finish: true,
                    }),
                  );
                }
                updateMessages(
                  data.id!,
                  createMessageFactory.aiResponse(data.id!, data.content),
                );

                return;
              }
              if (data.type === EAiResponseType.THINKING) {
                addMessages(
                  createMessageFactory.aiThinking({
                    key: data.id!,
                    title: data.title,
                    content: data.content,
                  }),
                );
                return;
              }
              if (data.type === EAiResponseType.USER) {
                addMessages(
                  createMessageFactory.userText(data.content, Number(data.id!)),
                );
              }
            },
          },
        );
      },
    });
  };

  return (
    <Flex gap={10} className="flex-col w-full h-full flex">
      <div className="w-full h-[30px] border-b border-gray-100 flex justify-between items-center pb-[10px]">
        <div>
          <Badge status="success" /> {t('online-testing')}
        </div>
        <Button
          icon={<ReloadOutlined />}
          size="small"
          type="link"
          onClick={handleResetConversation}
        >
          {t('reset-conversation')}
        </Button>
      </div>

      <ChatMessageLog
        items={messageList}
        addItem={addMessages}
        updateItem={updateMessages}
        loading={chatListLoading}
        listRef={listRef}
        onScrollToTop={handleScrollToTop}
      />
      <ChatSender
        onSubmit={(text: string, type: EMessageContentType) =>
          handleSendMessage(text, type)
        }
        disabled={!conversationId}
      />
    </Flex>
  );
};

export default ChatBox;
