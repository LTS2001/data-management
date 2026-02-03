import { Form, Input, Select } from 'antd';
import { FormInstance } from 'antd/es/form';
import { useTranslation } from 'react-i18next';
import { useGetModelList, useGetToolsList } from '../hooks';

interface PromptFormProps {
  form: FormInstance;
}
const PromptForm: React.FC<PromptFormProps> = ({ form }) => {
  const { t } = useTranslation('evaluate');
  const { modelOptions, modelLoading } = useGetModelList();
  const { toolOptions, toolsLoading } = useGetToolsList();

  return (
    <Form
      form={form}
      layout="horizontal"
      requiredMark={false}
      labelCol={{ span: 4, style: { textAlign: 'right' } }}
      wrapperCol={{ span: 20 }}
    >
      <Form.Item
        name="name"
        label={t('name')}
        rules={[
          { required: true, message: t('please-enter-name') },
          { max: 100, message: t('please-enter-name-max') },
        ]}
      >
        <Input placeholder={t('please-enter-name')} />
      </Form.Item>
      <Form.Item
        name="model_id"
        label={t('model')}
        rules={[{ required: true, message: t('please-select-model') }]}
      >
        <Select
          placeholder={t('please-select-model')}
          loading={modelLoading}
          options={modelOptions}
        />
      </Form.Item>
      <Form.Item name="tool_ids" label={t('tools')}>
        <Select
          mode="multiple"
          placeholder={t('please-select-tools')}
          loading={toolsLoading}
          options={toolOptions}
        />
      </Form.Item>
      <Form.Item
        name="prompt"
        label={t('content')}
        rules={[
          { required: true, message: t('please-enter-prompt') },
          { max: 4000, message: t('please-enter-prompt-max') },
        ]}
      >
        <Input.TextArea
          rows={13}
          showCount
          maxLength={4000}
          placeholder={t('please-enter-prompt')}
          style={{ resize: 'vertical' }}
        />
      </Form.Item>
      <Form.Item name="id" hidden>
        <Input />
      </Form.Item>
    </Form>
  );
};

export default PromptForm;
