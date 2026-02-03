import CustomProTable from '@/components/basic/custom-table';
import { colorsList } from '@/config/constant';
import { getBatchInferenceDetailList } from '@/services/prompt.service';
import {
  IBatchInferenceDetailListParams,
  IDataSetQaResItem,
} from '@/services/types/prompt.type';
import type {
  ActionType,
  FormInstance,
  ProColumns,
} from '@ant-design/pro-components';
import { useParams } from '@umijs/max';
import { Tag } from 'antd';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';

const Index: React.FC = () => {
  const formRef = useRef<FormInstance>();
  const actionRef = useRef<ActionType>();
  const { t } = useTranslation('evaluate');
  const { id: datasetId } = useParams<{ id: string }>();
  const requestWithDataset = (params: IBatchInferenceDetailListParams) =>
    getBatchInferenceDetailList({
      ...params,
      batch_inference_id: Number(datasetId),
    } as any);

  // 列定义
  const columns: ProColumns<IDataSetQaResItem>[] = [
    {
      title: t('question'),
      dataIndex: 'question',
      width: 150,
    },
    {
      title: t('answer'),
      dataIndex: 'answer',
      width: 200,
      ellipsis: true,
    },
    {
      title: t('result'),
      dataIndex: 'status',
      width: 200,
      ellipsis: true,
      render: (_, record) => (
        <Tag color={colorsList[record.status]}>
          {record.status === 1 ? t('correct') : t('incorrect')}
        </Tag>
      ),
    },
    {
      title: t('ai-answer'),
      dataIndex: 'ai_answer',
      width: 200,
      ellipsis: true,
    },
    {
      title: t('create-time'),
      dataIndex: 'create_time',
      width: 100,
      valueType: 'dateTime',
      search: false,
    },
    {
      title: t('update-time'),
      dataIndex: 'update_time',
      width: 100,
      valueType: 'dateTime',
      search: false,
    },
  ];

  return (
    <>
      <CustomProTable<IDataSetQaResItem>
        formRef={formRef}
        actionRef={actionRef}
        columns={columns}
        rowKey="id"
        scroll={{ x: 1200 }}
        requestFn={requestWithDataset}
        columnsState={{
          persistenceKey: 'Evaluate-Table-Columns',
          persistenceType: 'localStorage',
        }}
      />
    </>
  );
};

export default Index;
