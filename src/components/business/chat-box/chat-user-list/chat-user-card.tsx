/**
 * @description 聊天用户卡片组件
 */
import { formatTime } from '@/utils/format';
import { Avatar, Badge } from 'antd';
import { useTranslation } from 'react-i18next';
import { IConversationItem } from '../types';

export interface ChatUserCardProps {
  conversation: IConversationItem;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function ChatUserCard({
  conversation,
  isSelected = false,
  onClick,
}: ChatUserCardProps) {
  const { t } = useTranslation();
  const { concatName, lastMessage, lastMessageTime, unreadCount } =
    conversation;

  return (
    <div
      className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 rounded-lg mx-2 my-1 ${
        isSelected ? 'bg-blue-50' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center ">
        <div className="relative">
          <Avatar size={36} className="bg-[#E6F4FF] text-[#1677FF]">
            {concatName?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
        </div>

        <div className="ml-3">
          <div className="flex flex-col gap-1">
            <div className="text-base font-semibold">
              {concatName || t('unknow-user')}
            </div>
            <div className="text-gray-600 text-sm truncate max-w-[200px]">
              {lastMessage || t('no-message')}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <div className="text-gray-500 text-xs mb-1">
          {formatTime(lastMessageTime)}
        </div>
        <Badge count={unreadCount} style={{ backgroundColor: 'red' }} />
      </div>
    </div>
  );
}
