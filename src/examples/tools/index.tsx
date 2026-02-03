import CustomProTable from '@/components/basic/custom-table';
import { getToolsList } from '@/services/tools.service';
import { IToolsResItem } from '@/services/types/tools.type';
import type {
  ActionType,
  FormInstance,
  ProColumns,
} from '@ant-design/pro-components';
import { Typography } from 'antd';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';

const Index: React.FC = () => {
  const formRef = useRef<FormInstance>();
  const actionRef = useRef<ActionType>();
  const { t } = useTranslation('evaluate');

  // 列定义
  const columns: ProColumns<IToolsResItem>[] = [
    {
      title: 'Id',
      dataIndex: 'id',
      width: 150,
      search: false,
    },
    {
      title: t('name'),
      dataIndex: 'name',
      width: 200,
      ellipsis: true,
      search: true,
    },
    {
      title: t('description'),
      dataIndex: 'description',
      width: 200,
      ellipsis: false,
      search: false,
      render: (text) => {
        if (!text) return '-';
        const textStr = String(text);
        return (
          <Typography.Paragraph
            ellipsis={{
              rows: 1,
              tooltip: {
                title: textStr,
                styles: {
                  root: { maxWidth: 600 },
                },
              },
            }}
            style={{ marginBottom: 0 }}
          >
            {textStr}
          </Typography.Paragraph>
        );
      },
    },
    {
      title: t('create-time'),
      dataIndex: 'create_time',
      width: 100,
      valueType: 'dateTime',
      search: false,
    },
  ];

  return (
    <>
      <CustomProTable<IToolsResItem>
        formRef={formRef}
        actionRef={actionRef}
        columns={columns}
        rowKey="id"
        scroll={{ x: 1200 }}
        requestFn={getToolsList}
        columnsState={{
          persistenceKey: 'Evaluate-Table-Columns',
          persistenceType: 'localStorage',
        }}
        search={{
          optionRender: (searchConfig, formProps, dom) => [...dom],
        }}
      />
    </>
  );
};

export default Index;
