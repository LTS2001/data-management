/**
 * @description 聊天消息发送组件
 */
import { EMessageContentType } from '@/services/types/evaluate.type';
import { uploadFile } from '@/utils/oss';
import { CloudUploadOutlined, LinkOutlined } from '@ant-design/icons';
import { Attachments, AttachmentsProps, Sender } from '@ant-design/x';
import { Badge, Button, message, type GetProp, type GetRef } from 'antd';
import { useEffect, useRef, useState } from 'react';

const ChatSender = ({
  onSubmit,
  disabled,
  canAttachments = true,
  sendLoading,
}: {
  onSubmit: (text: string, type: EMessageContentType) => Promise<void>;
  disabled: boolean;
  canAttachments?: boolean;
  sendLoading?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<GetProp<AttachmentsProps, 'items'>>([]);
  const [text, setText] = useState('');

  const senderRef = useRef<GetRef<typeof Sender>>(null);

  useEffect(() => {
    return () => {
      items.forEach((item) => {
        if (item.url?.startsWith('blob:')) {
          URL.revokeObjectURL(item.url);
        }
      });
    };
  }, []);

  const senderHeader = (
    <Sender.Header
      title="Attachments"
      open={open}
      onOpenChange={setOpen}
      styles={{
        content: {
          padding: 0,
        },
      }}
    >
      <Attachments
        maxCount={1}
        multiple={false}
        accept="image/*"
        customRequest={async ({ file, onProgress, onSuccess, onError }) => {
          try {
            const uid = Date.now().toString();
            const result = await uploadFile({
              uid,
              file: file as File,
              dir: '/chat-files',
              onProgress,
              onSuccess: async (res) => {
                onSuccess?.(res);
                await onSubmit(res.url, EMessageContentType.IMAGE);
                setItems([]);
              },
              onError,
            });
            return result;
          } catch (err) {
            message.error('File upload failed');
            onError?.(err as Error);
          }
        }}
        items={items}
        onChange={({ file, fileList }) => {
          const updatedFileList = fileList.map((item) => {
            if (
              item.uid === file.uid &&
              file.status !== 'removed' &&
              item.originFileObj
            ) {
              if (!item.url || (item.url && item.url.startsWith('blob:'))) {
                if (item.url?.startsWith('blob:')) {
                  URL.revokeObjectURL(item.url);
                }
                return {
                  ...item,
                  url: URL.createObjectURL(item.originFileObj),
                };
              }
            }
            return item;
          });
          setItems(updatedFileList);
        }}
        placeholder={(type) =>
          type === 'drop'
            ? {
                title: 'Drop file here',
              }
            : {
                icon: <CloudUploadOutlined />,
                title: 'Upload files',
                description: 'Click or drag files to this area to upload',
              }
        }
        getDropContainer={() => senderRef.current?.nativeElement}
      />
    </Sender.Header>
  );

  return (
    <div className="py-2 pr-4">
      <Sender
        loading={sendLoading}
        disabled={disabled}
        ref={senderRef}
        header={senderHeader}
        prefix={
          canAttachments ? (
            <Badge dot={items.length > 0 && !open}>
              <Button onClick={() => setOpen(!open)} icon={<LinkOutlined />} />
            </Badge>
          ) : null
        }
        value={text}
        onChange={setText}
        onSubmit={async () => {
          await onSubmit(text, EMessageContentType.TEXT);
          setItems([]);
          setText('');
        }}
      />
    </div>
  );
};
export default ChatSender;
