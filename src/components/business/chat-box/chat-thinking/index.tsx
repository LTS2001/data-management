/**
 * @description AI消息思考组件
 */
import { Think } from '@ant-design/x';
import { useEffect, useRef, useState } from 'react';
import './thinking.css';

const ChatThinking = ({
  title,
  content: _content,
  thinkingKey,
  finish,
}: {
  title?: string;
  content?: string;
  thinkingKey: string | number;
  finish?: boolean;
}) => {
  const [expand, setExpand] = useState<boolean>(!finish);
  const preContentRef = useRef<string>();
  const preThinkeyRef = useRef<string | number>();
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    if (preThinkeyRef.current !== thinkingKey) {
      setContent(_content ?? '');
      preContentRef.current = _content;
    } else {
      preContentRef.current = `${preContentRef.current ?? ''}${_content ?? ''}`;
      setContent(preContentRef.current);
    }
    setExpand(!finish);
    preThinkeyRef.current = thinkingKey;
  }, [thinkingKey, _content, finish]);

  return (
    <Think
      title={title}
      expanded={expand}
      onExpand={() => setExpand((pre) => !pre)}
      blink={!finish}
    >
      <div style={{ whiteSpace: 'break-spaces' }}>{content}</div>
    </Think>
  );
};

export default ChatThinking;
