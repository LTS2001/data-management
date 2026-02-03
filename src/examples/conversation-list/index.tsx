import ChatUserList from '@/components/business/chat-box/chat-user-list';
import { createMessageFactory } from '@/components/business/chat-box/config';
import { useContentBubbleList } from '@/components/business/chat-box/hooks';
import { IConversationItem } from '@/components/business/chat-box/types';
import { readConversation } from '@/services/concat.service';
import { EMessageType } from '@/services/types/evaluate.type';
import { Splitter } from 'antd';
import { useEffect, useState } from 'react';
import {
  formattedData,
  useConversationList,
  useGetConversationMessages,
  useGetConversations,
  useReceiveNewConversation,
} from './hooks';
import MessagePanel from './message-panel';

export default function ConversationList() {
  const [searchText, setSearchText] = useState('');

  const { conversations, loading, run } = useGetConversations({ size: 20 });
  const [selectedConversation, setSelectedConversation] =
    useState<IConversationItem | null>(conversations?.[0] || null);

  const { conversationList, addConversation, updateConversation } =
    useConversationList(conversations);

  const {
    messages,
    messagesLoading,
    loadMoreMessages,
    run: getMessageList,
  } = useGetConversationMessages();

  useEffect(() => {
    if (!selectedConversation?.id && !conversationList?.[0]?.id) return;
    getMessageList(
      selectedConversation?.id || conversationList?.[0]?.id,
      undefined,
    );
  }, [selectedConversation, conversationList]);

  const { messageList, addMessages, updateMessages } =
    useContentBubbleList(messages);

  const { newData } = useReceiveNewConversation({
    min_message_time: conversationList[0]?.lastMessageTime || '',
    min_conversation_id: conversationList[0]?.id || 0,
    conversation_id: selectedConversation?.id || 0,
    min_message_id: messageList[messageList.length - 1]?.extraInfo?.id || 0,
  });

  useEffect(() => {
    if (newData?.conversation.length) {
      addConversation(formattedData(newData.conversation || []));
    }
    if (newData?.message.length) {
      newData.message.reverse().forEach((item) => {
        // 这里的ai是最开始组件是服务于ai对话的 消息类型1的固定在右边
        if (item.message_type === EMessageType.AI) {
          addMessages(createMessageFactory.userText(item.content));
        } else {
          addMessages(
            createMessageFactory.aiResponse(item.id.toString(), item.content),
          );
        }
      });
    }
  }, [newData]);

  useEffect(() => {
    if (selectedConversation && selectedConversation.unreadCount) {
      updateConversation({
        id: selectedConversation.id,
        unreadCount: 0,
      });
      readConversation({
        message_id: selectedConversation.lastMessageId,
      });
    }
  }, [selectedConversation]);

  const handleLoadMore = () => {
    if (conversationList.length) {
      const lastConversation = conversationList[conversationList.length - 1];
      run({
        max_conversation_id: lastConversation.id,
        max_message_time: lastConversation.lastMessageTime || undefined,
        size: 20,
      });
    }
  };

  useEffect(() => {
    if (!selectedConversation) {
      setSelectedConversation(conversationList?.[0] || null);
    }
  }, [conversationList]);

  return (
    <div className="h-[calc(100vh-32px)] bg-white flex flex-row gap-4">
      <Splitter>
        <Splitter.Panel
          defaultSize="30%"
          min="30%"
          max="50%"
          collapsible
          // className="!pr-[15px]"
        >
          <ChatUserList
            setSearchText={setSearchText}
            searchText={searchText}
            conversationList={conversationList}
            loading={loading}
            onLoadMore={handleLoadMore}
            onSelectConversation={setSelectedConversation}
            selectedConversationId={
              selectedConversation?.id || conversationList?.[0]?.id
            }
          />
        </Splitter.Panel>
        <Splitter.Panel className="!pl-[20px]" collapsible>
          <MessagePanel
            key={selectedConversation?.id || conversationList?.[0]?.id}
            conversationId={
              selectedConversation?.id || conversationList?.[0]?.id
            }
            conversationName={
              selectedConversation?.concatName ||
              conversationList?.[0]?.concatName
            }
            concatId={
              selectedConversation?.concatId || conversationList?.[0]?.concatId
            }
            messageList={messageList}
            addMessages={addMessages}
            updateMessages={updateMessages}
            loadMoreMessages={loadMoreMessages}
            messagesLoading={messagesLoading}
          />
        </Splitter.Panel>
      </Splitter>
    </div>
  );
}
