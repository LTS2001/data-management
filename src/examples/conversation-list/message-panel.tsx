import ChatMessageHeader from '@/components/business/chat-box/chat-messge-header';
import ChatMessageLog from '@/components/business/chat-box/chat-messge-log';
import ChatSender from '@/components/business/chat-box/chat-sender';
import { createMessageFactory } from '@/components/business/chat-box/config';
import { sendMessage } from '@/services/concat.service';
import {
  EMessageContentType,
  EMessageType,
} from '@/services/types/evaluate.type';
import { getLocalUserInfo } from '@/utils/auth';
import { generateAvatar } from '@/utils/generate';
import { Bubble, BubbleItemType } from '@ant-design/x';
import { Flex, GetRef, message } from 'antd';
import React, { useCallback, useRef, useState } from 'react';

const MessagePanel: React.FC<{
  conversationId?: number;
  concatId?: number;
  conversationName?: string;
  throttleTime?: number;
  messageList: BubbleItemType[];
  addMessages: (item: BubbleItemType) => void;
  updateMessages: (key: string | number, data: Partial<BubbleItemType>) => void;
  loadMoreMessages: (conversationId: number, oldestMessageId: number) => void;
  messagesLoading: boolean;
}> = ({
  conversationId,
  concatId,
  conversationName,
  messageList,
  addMessages,
  updateMessages,
  loadMoreMessages,
  messagesLoading,
}) => {
  const listRef = useRef<GetRef<typeof Bubble.List>>(null);
  const [sendLoading, setSendLoading] = useState(false);

  const handleScrollToTop = useCallback(() => {
    if (messageList.length && conversationId) {
      const oldestMessage = messageList[0];
      const messageId = oldestMessage.extraInfo?.id;
      if (messageId) {
        loadMoreMessages(conversationId, messageId);
      }
    }
  }, [messageList, loadMoreMessages, conversationId]);

  const handleSendMessage = async (text: string, type: EMessageContentType) => {
    setSendLoading(true);
    if (!conversationId) {
      message.warning('请先选择对话');
      return;
    }

    try {
      const res = await sendMessage({
        conversation_id: conversationId,
        content: text,
        content_type: type,
        message_type: EMessageType.AI,
        contact_id: concatId,
      });
      if (type === EMessageContentType.IMAGE) {
        addMessages(createMessageFactory.userImage(text, res.data.id));
      } else {
        addMessages(createMessageFactory.userText(text, res.data.id));
      }
    } catch (error) {
      message.error('发送消息出错');
    } finally {
      setSendLoading(false);
    }
  };

  return (
    <Flex gap={10} className="flex-col w-full h-full flex">
      {conversationName ? (
        <ChatMessageHeader concatName={conversationName} />
      ) : null}
      <ChatMessageLog
        items={messageList}
        addItem={addMessages}
        updateItem={updateMessages}
        loading={messagesLoading}
        listRef={listRef}
        onScrollToTop={handleScrollToTop}
        selfAvatar={generateAvatar(getLocalUserInfo()?.name || 'U')}
        clientAvatar={
          conversationName ? generateAvatar(conversationName) : undefined
        }
      />

      <ChatSender
        onSubmit={async (text: string, type: EMessageContentType) =>
          await handleSendMessage(text, type)
        }
        sendLoading={sendLoading}
        disabled={!conversationId}
        canAttachments={false}
      />
    </Flex>
  );
};

export default MessagePanel;
