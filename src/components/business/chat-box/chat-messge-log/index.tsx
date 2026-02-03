/**
 * @description 聊天消息列表组件
 */
import { t } from '@/i18n/utils';
import { googleTranslate } from '@/services/translate.service';
import { EMessageContentType } from '@/services/types/evaluate.type';
import { copyToClipboard } from '@/utils/global';
import {
  CopyOutlined,
  EllipsisOutlined,
  TranslationOutlined,
} from '@ant-design/icons';
import type { BubbleItemType, BubbleListProps } from '@ant-design/x';
import { Bubble } from '@ant-design/x';
import '@ant-design/x/';
import { Info } from '@ant-design/x/es/bubble/interface';
import {
  Dropdown,
  Empty,
  Image,
  MenuProps,
  message,
  Spin,
  type GetRef,
} from 'antd';
import dayjs from 'dayjs';
import React, { useCallback, useMemo, useState } from 'react';
import { getRoleConfig } from '../config';

export const ImageRender = ({ imageUrl }: { imageUrl: string }) => (
  <Image
    src={imageUrl}
    width={200}
    height="auto"
    style={{ maxHeight: 300, objectFit: 'contain' }}
  />
);

export const ContentRender = ({
  content,
  info,
}: {
  content: string;
  info: Info;
}) => {
  switch (info.extraInfo?.contentType) {
    case EMessageContentType.IMAGE:
      return (
        <Image
          src={content}
          width={200}
          height="auto"
          style={{ maxHeight: 300, minHeight: 100, objectFit: 'contain' }}
        />
      );
    case EMessageContentType.AUDIO:
      return <audio controls src={content} />;
    case EMessageContentType.VIDEO:
      return (
        <video
          controls
          src={content}
          style={{ maxHeight: 300, minHeight: 100, objectFit: 'contain' }}
        />
      );
    default:
      return (
        <div className="flex flex-col gap-1">
          <div>{content}</div>
          <div className="font-light my-1">
            {info.extraInfo?.translateInfo?.en || ''}
          </div>
          <div className="text-xs text-gray-500 font-light">
            {dayjs(info.extraInfo?.createTime).format('MM-DD HH:mm')}
          </div>
        </div>
      );
  }
};

export const ExtraRender = ({
  content,
  callback,
  info,
}: {
  content: string;
  info: Info;
  callback?: (key: string | number, data: Partial<BubbleItemType>) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const handleMenuClick: MenuProps['onClick'] = async (e) => {
    switch (e.key) {
      case 'copy':
        copyToClipboard(content);
        break;
      case 'translate':
        try {
          setLoading(true);
          const text = await googleTranslate({ query: content, target: 'zh' });
          callback?.(info.key as string | number, {
            extraInfo: {
              translateInfo: {
                en: text,
              },
            },
          });
        } catch (error) {
          message.error(t('translate-failed'));
        } finally {
          setLoading(false);
        }
        break;
    }
  };

  const items: MenuProps['items'] = [
    {
      label: t('copy'),
      key: 'copy',
      icon: <CopyOutlined />,
    },
    {
      label: t('translate'),
      key: 'translate',
      icon: <TranslationOutlined />,
    },
  ];
  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <>
      {info?.extraInfo?.contentType === EMessageContentType.TEXT ? (
        <Dropdown menu={menuProps}>
          {loading ? (
            <Spin size="small" />
          ) : (
            <EllipsisOutlined className="rotate-90 hover:cursor-pointer" />
          )}
        </Dropdown>
      ) : null}
    </>
  );
};

const ChatMessageLog: React.FC<{
  items: BubbleItemType[];
  refresh?: () => void;
  addItem: (item: BubbleItemType) => void;
  updateItem: (key: string | number, data: Partial<BubbleItemType>) => void;
  loading: boolean;
  listRef: React.RefObject<GetRef<typeof Bubble.List>>;
  onScrollToTop?: () => void;
  selfAvatar?: string;
  clientAvatar?: string;
}> = ({
  items,
  loading,
  listRef,
  onScrollToTop,
  updateItem,
  selfAvatar,
  clientAvatar,
}) => {
  const memoRole: BubbleListProps['role'] = useMemo(
    () => getRoleConfig({ clientAvatar, selfAvatar, callback: updateItem }),
    [],
  );

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const scrollTop =
        e.currentTarget.scrollTop - e.currentTarget.clientHeight;
      const listHeight = e.currentTarget.scrollHeight;

      if (listHeight + scrollTop === 0 && onScrollToTop) {
        onScrollToTop();
      }
    },
    [onScrollToTop],
  );

  return (
    <div className="relative flex-1 flex justify-center items-center  overflow-hidden">
      {/* Top loading indicator */}
      {loading && (
        <div className="absolute top-0 left-0 right-0 flex justify-center items-center z-10 h-[40px] bg-[rgba(255, 255, 255, 0.8)] border-b border-[#f0f0f0]">
          <Spin size="small" />
          <span className="ml-2 text-sm">{t('load-more-messages')}</span>
        </div>
      )}
      <Bubble.List
        ref={listRef}
        role={memoRole}
        items={items}
        autoScroll={true}
        style={{
          height: '100%',
          display: items.length > 0 ? 'block' : 'none',
        }}
        onScroll={handleScroll}
      />
      <Empty
        description={t('no-chat-record')}
        style={{ display: loading || items.length > 0 ? 'none' : 'block' }}
      />
    </div>
  );
};

export default ChatMessageLog;
