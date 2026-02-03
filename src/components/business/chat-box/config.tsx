import { EMessageContentType } from '@/services/types/evaluate.type';
import { generateRandomId } from '@/utils/generate';
import { BubbleItemType, BubbleListProps } from '@ant-design/x';
import { Avatar } from 'antd';
import dayjs from 'dayjs';
import { ContentRender, ExtraRender } from './chat-messge-log';
import ChatThinking from './chat-thinking';
import { MessageProps, MessageRole } from './types';

/**
 * 获取对话自定义配置
 * @returns 对话基础配置
 */
export const createMessageFactory = {
  aiThinking: ({
    key,
    title = 'Analyzed',
    content = '',
    finish = false,
  }: {
    key: string | number;
    title?: string;
    content?: string;
    finish?: boolean;
  }): MessageProps => ({
    key,
    role: MessageRole.AI,
    content: '',
    contentRender: () => (
      <ChatThinking
        title={title}
        content={content}
        thinkingKey={key}
        finish={finish}
      />
    ),
    variant: 'borderless',
    style: {
      marginBottom: '0px',
      padding: '0px',
      marginTop: '8px',
    },
    footer: null,
    extra: null,
    loading: false,
    extraInfo: {
      id: key,
      createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      contentType: EMessageContentType.TEXT,
      finish,
    },
  }),
  aiResponse: (key: string, content: string): MessageProps => ({
    key,
    role: MessageRole.AI,
    content,
    loading: false,
    extraInfo: {
      id: key,
      createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      contentType: EMessageContentType.TEXT,
    },
  }),
  userText: (text: string, id?: number): MessageProps => ({
    key: id || generateRandomId(),
    role: MessageRole.USER,
    content: text,
    extraInfo: {
      id: id || generateRandomId(),
      createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      contentType: EMessageContentType.TEXT,
    },
  }),

  userImage: (imageUrl: string, id?: number): MessageProps => ({
    key: id || generateRandomId(),
    role: MessageRole.USER,
    content: imageUrl,
    extraInfo: {
      id: generateRandomId(),
      createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      contentType: EMessageContentType.IMAGE,
    },
  }),
};

/**
 * 获取对话气泡基础配置
 * @param selfAvatar 自己的头像
 * @param clientAvatar 客户头像
 * @returns 对话基础配置
 */
export const getRoleConfig = ({
  selfAvatar,
  clientAvatar,
  callback,
}: {
  selfAvatar?: string;
  clientAvatar?: string;
  callback?: (key: string | number, data: Partial<BubbleItemType>) => void;
}): BubbleListProps['role'] => {
  return {
    ai: {
      typing: false,
      placement: 'start',
      extra: (content, info) => (
        <div className="flex h-full items-center ">
          <ExtraRender content={content} info={info} callback={callback} />
        </div>
      ),
      contentRender: (content, info) => (
        <ContentRender content={content} info={info} />
      ),
      avatar: clientAvatar ? (
        <Avatar src={clientAvatar} size={32} />
      ) : undefined,
    },
    user: () => ({
      placement: 'end',
      typing: false,
      contentRender: (content, info) => {
        return <ContentRender content={content} info={info} />;
      },
      avatar: selfAvatar ? <Avatar src={selfAvatar} size={32} /> : undefined,
      extra: (content, info) => (
        <div className="flex h-full items-center ">
          <ExtraRender content={content} info={info} callback={callback} />
        </div>
      ),
    }),
    system: {
      variant: 'filled' as const,
      styles: { root: { textAlign: 'center' } },
    },
    // divider: {
    //   content: t('time-divider'),
    // },
  };
};
