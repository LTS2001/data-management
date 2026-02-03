import ChatBox from '@/components/business/chat-box';
import { COUNTRY_OPTIONS } from '@/config';
import { ActionType } from '@ant-design/pro-components';
import { Modal, Splitter } from 'antd';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import ConversationForm from './form';

interface ConversationModalProps {
  open: boolean;
  onCancel: () => void;
  conversationId?: number;
  setConversationId: (conversationId: number) => void;
  actionRef: React.MutableRefObject<ActionType | undefined>;
  formValues?: Partial<IFormValue>;
  setFormValues: Dispatch<SetStateAction<Partial<IFormValue> | undefined>>;
}

export interface IFormValue {
  country: (typeof COUNTRY_OPTIONS)[number]['value'];
  promptId: number;
  model_id: number;
  name?: string;
  prompt: string;
  current: number;
  tool_ids?: number[];
}

const ConversationModal = ({
  conversationId,
  open,
  onCancel,
  formValues,
  setFormValues,
}: // setConversationId,
// actionRef,
ConversationModalProps) => {
  const { t } = useTranslation('experiment');

  return (
    <Modal
      title={t('chat-management')}
      open={open}
      onCancel={() => onCancel()}
      width={1200}
      footer={null}
      destroyOnHidden
    >
      <Splitter style={{ height: 650 }}>
        <Splitter.Panel
          defaultSize="40%"
          min="30%"
          max="50%"
          className="!pr-[20px]"
        >
          <ConversationForm
            formValues={formValues}
            setFormValues={setFormValues}
          />
        </Splitter.Panel>
        <Splitter.Panel className="!pl-[20px]">
          <ChatBox
            conversationId={conversationId}
            country={formValues?.country}
            promptId={formValues?.promptId}
          />
        </Splitter.Panel>
      </Splitter>
    </Modal>
  );
};

export default ConversationModal;
