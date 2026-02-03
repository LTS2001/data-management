import { IPromptParams } from '@/services/types/prompt.type';
import { ActionType } from '@ant-design/pro-components';
import { Form, Modal } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSavePrompt } from '../hooks';
import PromptForm from './form';

interface PromptModalProps {
  open: boolean;
  isEditMode: boolean;
  onCancel: () => void;
  actionRef: React.MutableRefObject<ActionType | undefined>;
  initialValues?: IPromptParams;
}

const defaultPrompt = `You are a helpful WhatsApp Reply Agent for a car dealership.
Your Core Instructions:
1. Greetings: If the user says "hi", "hello", or similar, respond warmly and greet them. Do not call tools for simple greetings.
2. Logistics: If the user asks about "logistics", "shipping", or "delivery", DO NOT answer immediately. Instead, ask them specifically what cars they are interested in or need help with first.
3. Car Queries:
   - If the user provides a brand and series (e.g., "BMW 320i"), use the 'find_used_car_on_sale' tool.
   - If the user provides a vague description (e.g., "I need a cheap family car"), use the 'query_car_by_text' tool.
Keep your responses concise and friendly, suitable for WhatsApp.`;

const PromptModal: React.FC<PromptModalProps> = ({
  open,
  isEditMode,
  onCancel,
  actionRef,
  initialValues,
}) => {
  const { t } = useTranslation('evaluate');
  const [form] = Form.useForm<{
    id?: number;
    name: string;
    prompt: string;
    model_id?: number;
    tool_ids?: number[];
  }>();
  const { saveLoading, savePrompt } = useSavePrompt();

  useEffect(() => {
    if (open) {
      if (isEditMode && initialValues) {
        form.setFieldsValue({
          id: initialValues.id,
          name: initialValues.name,
          prompt: initialValues.prompt,
          model_id: initialValues.model_id,
          tool_ids: initialValues.tool_ids || [],
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ prompt: defaultPrompt });
      }
    }
  }, [open, isEditMode, initialValues, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        id: values.id,
        name: values.name,
        prompt: values.prompt,
        model_id: values.model_id,
        tool_ids: values.tool_ids || [],
      };

      await savePrompt(payload, isEditMode);
      onCancel();
      form.resetFields();
      actionRef.current?.reload();
    } catch (error) {
      console.error(t('save-failure'), error);
    }
  };

  return (
    <Modal
      title={isEditMode ? t('edit') : t('promptadd')}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={saveLoading}
      okButtonProps={{ disabled: saveLoading }}
      width={800}
      styles={{
        body: {
          height: '490px',
          overflowY: 'auto',
          maxHeight: '500px',
        },
      }}
    >
      <PromptForm form={form} />
    </Modal>
  );
};

export default PromptModal;
