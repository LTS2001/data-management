import CustomProTable from '@/components/basic/custom-table';
import { datePickerPresets } from '@/components/basic/custom-table/table-config';
import { listEvaluateConversations } from '@/services/evaluate.service';
import { IListConversationRes } from '@/services/types/evaluate.type';
import { removeEmptyValues } from '@/utils/format';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, DatePicker, Space, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { omit } from 'lodash';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConversationModal, { IFormValue } from './components/modal';
import { useCreateExperiment } from './hooks';

const ExperimentList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const { t } = useTranslation('experiment');
  const [open, setOpen] = useState(false);
  const {
    conversationId,
    createLoading,
    runCreateExperiment,
    setConversationId,
  } = useCreateExperiment({});

  const [formValues, setFormValues] = useState<Partial<IFormValue>>();

  const handleCreate = async () => {
    await runCreateExperiment();

    setOpen(true);
    setTimeout(() => {
      actionRef.current?.reload();
    }, 1000);
  };

  const columns: ProColumns<IListConversationRes>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: `Propmt ${t('name')}`,
      dataIndex: 'prompt_name',
      render: (_, record) => record?.prompt?.name || '-',
    },
    {
      title: t('message'),
      dataIndex: 'last_message',
      width: 400,
      render: (text) => (
        <div className="w-[400px]">
          <Typography.Paragraph
            ellipsis={{ rows: 2, tooltip: String(text || '') }}
            style={{ marginBottom: 0 }}
          >
            {text || ''}
          </Typography.Paragraph>
        </div>
      ),
    },
    {
      title: t('country'),
      dataIndex: 'country',
    },
    {
      title: t('tools'),
      dataIndex: 'tool_names',
      width: 200,
      ellipsis: true,
      search: false,
      render: (_, record) => {
        const toolNames = record?.prompt?.tool_names || [];
        if (toolNames.length === 0) {
          return '-';
        }
        return (
          <Space size={[4, 4]} wrap className="flex flex-col justify-center">
            {toolNames.map((name: string, index: number) => (
              <Tag key={index} color="blue">
                {name}
              </Tag>
            ))}
          </Space>
        );
      },
    },

    {
      title: t('create-time'),
      dataIndex: 'create_time',
      align: 'center',
    },
    {
      title: t('create-time'),
      dataIndex: 'date',
      hideInTable: true,
      // valueType: 'dateRange',
      search: true,
      renderFormItem: () => {
        return (
          <DatePicker.RangePicker
            presets={datePickerPresets}
            // 默认为今天
            defaultValue={[dayjs().add(-7, 'd'), dayjs()]}
            format="YYYY-MM-DD"
          />
        );
      },
    },
    {
      title: t('update-time'),
      dataIndex: 'update_time',
      align: 'center',
    },
    {
      title: t('content'),
      hideInTable: true,
      dataIndex: 'q',
      valueType: 'text',
      align: 'center',
    },
    {
      title: t('operation'),
      dataIndex: 'operation',
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          onClick={() => {
            setConversationId(record.id);
            setFormValues(
              removeEmptyValues({
                country: record.country,
                promptId: record?.prompt?.id,
                model_id: record?.prompt?.model_id,
                name: record?.prompt?.name,
                prompt: record?.prompt?.prompt,
                current: record?.prompt?.current,
                tool_ids: record?.prompt?.tool_ids,
              }),
            );
            setOpen(true);
          }}
        >
          {t('detail')}
        </Button>
      ),
      align: 'center',
    },
  ];

  return (
    <div>
      <CustomProTable<IListConversationRes>
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            onClick={handleCreate}
            loading={createLoading}
          >
            {t('create-experiment')}
          </Button>,
        ]}
        columns={columns}
        scroll={{ x: 1200 }}
        requestFn={listEvaluateConversations}
        beforeSearchSubmit={(params) => {
          return {
            ...omit(params, 'date'),
            start:
              `${dayjs(params.date?.[0] || dayjs().add(-7, 'd')).format(
                'YYYY-MM-DD',
              )} 00:00:00` || '',
            end:
              `${dayjs(params.date?.[1]).format('YYYY-MM-DD')} 23:59:59` || '',
          };
        }}
      />

      <ConversationModal
        conversationId={conversationId}
        open={open}
        formValues={formValues}
        setFormValues={setFormValues}
        actionRef={actionRef}
        setConversationId={setConversationId}
        onCancel={() => {
          setConversationId(undefined);
          setOpen(false);
          setFormValues(undefined);
          actionRef.current?.reload();
        }}
      />
    </div>
  );
};

export default ExperimentList;
