import PagedSelect from '@/components/basic/page-select';
import { COUNTRY_OPTIONS } from '@/config';
import { getPromptOptions, savePrompt } from '@/services/prompt.service';
import { defaultCatchApiError } from '@/services/request';
import { IPromptResItem } from '@/services/types/prompt.type';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { ProForm, ProFormInstance } from '@ant-design/pro-components';
import { Flex, Form, Input, message, Modal, Select } from 'antd';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetModelList, useGetToolsList, useUpdatePrompt } from '../hooks';
import { IFormValue } from './modal';

const ConversationForm = ({
  setFormValues,
  formValues,
}: // formRef,
  {
    formValues?: Partial<IFormValue>;
    setFormValues: Dispatch<SetStateAction<Partial<IFormValue> | undefined>>;
  }) => {
  const { t } = useTranslation('experiment');
  const { modelList } = useGetModelList();
  const { toolsList } = useGetToolsList();
  const { updatePrompt } = useUpdatePrompt({});
  const [refresh, setRefresh] = useState<boolean>(false);
  const formRef = useRef<ProFormInstance<IFormValue>>();

  const formatFieldsValue = (data?: IPromptResItem) => {
    let newData = {};
    if (data) {
      newData = {
        promptId: data.id,
        model_id: data.model_id || 1,
        prompt: data.prompt,
        country: (data?.country as string) || 'uae',
        current: data.current,
        tool_ids: data.tool_ids || [],
      };
    }
    return newData;
  };

  const handleFormValuesChange = (values: Partial<IFormValue>) => {
    setFormValues((pre) => ({ ...pre, ...values }));
    formRef?.current?.setFieldsValue(values);
  };

  const onPromptListChange = (dataList: IPromptResItem[]) =>
    handleFormValuesChange({
      ...formatFieldsValue(dataList?.[0]),
      ...formValues,
    });

  const onPromptSelectChange = (
    _value: number,
    _: any,
    data?: IPromptResItem,
  ) => handleFormValuesChange(formatFieldsValue(data));

  return (
    <ProForm<IFormValue>
      layout="vertical"
      initialValues={formValues}
      className="w-full"
      formRef={formRef}
      submitter={{
        render: () => <></>,
      }}
      onValuesChange={async (
        changedValues: Partial<IFormValue>,
        values: IFormValue,
      ) => {
        if (changedValues.prompt && values.current) {
          let name = '';
          let modelId: number | undefined = undefined;
          let toolIds: number[] = [];
          Modal.confirm({
            title: t('create-new-prompt'),
            icon: <ExclamationCircleFilled />,
            content: (
              <Flex gap={12} className="w-full my-3 " vertical>
                <Input
                  placeholder="name"
                  onChange={(e) => {
                    name = e.target.value;
                    handleFormValuesChange({ name: e.target.value });
                  }}
                />
                <Select
                  className="w-full"
                  placeholder={t('model-id')}
                  options={modelList}
                  onChange={(val) => {
                    modelId = val;
                    handleFormValuesChange({ model_id: val });
                  }}
                />
                <Select
                  mode="multiple"
                  className="w-full"
                  placeholder={t('please-select-tools')}
                  options={toolsList}
                  onChange={(val) => {
                    toolIds = val;
                    handleFormValuesChange({ tool_ids: val });
                  }}
                />
              </Flex>
            ),
            onOk: async () => {
              try {
                const newPromptRes = await savePrompt({
                  name: name || '',
                  model_id: modelId,
                  prompt: values.prompt,
                  tool_ids: toolIds,
                });
                setRefresh((prev) => !prev);
                setTimeout(() => {
                  handleFormValuesChange({
                    promptId: newPromptRes.data.id,
                    model_id: modelId,
                    current: 0,
                    tool_ids: toolIds,
                  });
                }, 500);
                message.success(t('create-success'));
              } catch (error) {
                defaultCatchApiError(error);
              }
            },
            onCancel() {
              console.log('Cancel');
            },
          });
          return;
        }
        if (changedValues.prompt || changedValues.tool_ids) {
          updatePrompt({
            id: values.promptId,
            prompt: values.prompt,
            tool_ids: values.tool_ids,
          });
        }
        handleFormValuesChange(values);
      }}
    >
      <Form.Item
        name="model_id"
        label={t('model-id')}
        rules={[{ required: true }]}
      >
        <Select
          options={modelList}
          disabled={true}
          defaultValue={modelList[0]?.value}
        />
      </Form.Item>
      <Form.Item
        name="country"
        label={t('country')}
        rules={[{ required: true }]}
      >
        <Select options={COUNTRY_OPTIONS} />
      </Form.Item>
      <Form.Item
        name="promptId"
        label={t('prompt')}
        rules={[{ required: true }]}
      >
        <PagedSelect<IPromptResItem>
          className="w-[100px]"
          otherParams={{}}
          defaultValue={1}
          fetchApi={getPromptOptions}
          options={(dataList) =>
            dataList.map(({ id, name, current }) => ({
              label: `${name} ${current ? '(current)' : ''}`,
              value: id,
            }))
          }
          refresh={refresh}
          showSearch={true}
          searchFieldName="name"
          onChange={onPromptSelectChange}
          onDataListChange={onPromptListChange}
        />
      </Form.Item>
      <Form.Item name="tool_ids" label={t('tools')}>
        <Select
          mode="multiple"
          placeholder={t('please-select-tools')}
          options={toolsList}
          showSearch
        // filterOption={(input, option) =>
        //   (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        // }
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
          rows={14}
          showCount
          maxLength={4000}
          placeholder={t('please-enter-prompt')}
          style={{ resize: 'vertical' }}
        />
      </Form.Item>
      <Form.Item name="current" hidden />
      <Form.Item name="name" hidden />
    </ProForm>
  );
};
export default ConversationForm;
