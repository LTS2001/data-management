/**
 * @description 聊天用户列表组件
 */
import { useSearchConversation } from '@/examples/conversation-list/hooks';
import { RedoOutlined } from '@ant-design/icons';
import { Divider, Empty, Spin, theme } from 'antd';
import React, { Dispatch, useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import ChatSearch from '../chat-search';
import { IConversationItem } from '../types';
import ChatUserCard from './chat-user-card';
import './index.css';

interface ChatUserListProps {
  searchText: string;
  setSearchText: Dispatch<React.SetStateAction<string>>;
  conversationList?: IConversationItem[];
  loading?: boolean;
  onLoadMore?: () => void;
  onSelectConversation?: (conversation: IConversationItem) => void;
  selectedConversationId?: number;
}

const ChatUserList: React.FC<ChatUserListProps> = ({
  conversationList = [],
  loading = false,
  onLoadMore,
  onSelectConversation,
  selectedConversationId,
  searchText,
  setSearchText,
}) => {
  const { token } = theme.useToken();
  const [curIndex, setCurIndex] = useState<number>(0);
  const { searchResult, executeSearch, searchLoading } = useSearchConversation({
    q: '',
  });

  const filteredConversations = useMemo(
    () => (searchText ? searchResult : conversationList),
    [searchText, conversationList, searchResult],
  );

  const handleSearch = (text?: string) => {
    setSearchText(text ? text : '');
    if (!text) return;
    executeSearch({ q: text });
  };

  return (
    <div className="flex flex-col min-w-[380px]  h-full">
      <ChatSearch searchText={searchText} handleSearch={handleSearch} />
      <div
        id="scrollable-div"
        className="w-full h-full overflow-y-auto flex-1"
        style={{
          background: token.colorBgContainer,
          borderRadius: token.borderRadius,
        }}
      >
        <InfiniteScroll
          dataLength={filteredConversations.length}
          next={onLoadMore || (() => {})}
          hasMore={!!onLoadMore}
          loader={
            (loading || searchLoading) && (
              <div className="text-center px-[12px] py-0">
                <Spin indicator={<RedoOutlined spin />} size="small" />
              </div>
            )
          }
          endMessage={
            filteredConversations.length > 0 && (
              <Divider plain>没有更多对话了</Divider>
            )
          }
          scrollableTarget="scrollable-div"
          className="overflow-hidden w-full"
        >
          {filteredConversations.length ? (
            filteredConversations.map((conversation, index) => (
              <ChatUserCard
                key={`${conversation.id}-${index}`}
                conversation={conversation}
                isSelected={
                  `${selectedConversationId}-${curIndex}` ===
                  `${conversation.id}-${index}`
                }
                onClick={() => {
                  setCurIndex(index);
                  onSelectConversation?.(conversation);
                }}
              />
            ))
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={searchText ? '没有找到匹配的对话' : '暂无对话'}
              className="mx-[40px] my-0"
            />
          )}
        </InfiniteScroll>
      </div>
    </div>
  );
};
export default ChatUserList;
