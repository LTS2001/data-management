import CustomProTable from '@/components/basic/custom-table';
import { colorsList } from '@/config/constant';
import { getPromptList } from '@/services/prompt.service';
import { IPromptParams, IPromptResItem } from '@/services/types/prompt.type';
import {
  CheckSquareOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import type {
  ActionType,
  FormInstance,
  ProColumns,
} from '@ant-design/pro-components';
import { Button, Popconfirm, Space, Tag } from 'antd';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PromptModal from './components/modal';
import { useDeletePrompt, useUpdatePromptCurrent } from './hooks';

const Index: React.FC = () => {
  const formRef = useRef<FormInstance>();
  const actionRef = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editRecord, setEditRecord] = useState<IPromptParams | undefined>();
  const { t } = useTranslation('evaluate');
  const { deletePrompt: handleDeletePrompt } = useDeletePrompt();
  const { updatePromptCurrent } = useUpdatePromptCurrent();

  // 新增
  const handleAdd = () => {
    setIsEditMode(false);
    setEditRecord(undefined);
    setModalVisible(true);
  };

  // 处理编辑
  const handleEdit = (record: IPromptParams) => {
    setIsEditMode(true);
    setEditRecord({
      id: record.id,
      name: record.name,
      prompt: record.prompt,
      model_id: record.model_id,
      tool_ids: record.tool_ids || [],
    });
    setModalVisible(true);
  };

  // 删除
  const handleDelete = async (record: IPromptResItem) => {
    await handleDeletePrompt(record.id);
    actionRef.current?.reload();
  };

  // 将当前prompt设为生产使用
  const handleUse = async (record: IPromptResItem) => {
    await updatePromptCurrent({
      id: record.id,
      name: record.name,
      prompt: record.prompt,
    });
    actionRef.current?.reload();
  };

  // 列定义
  const columns: ProColumns<IPromptResItem>[] = [
    {
      title: t('name'),
      dataIndex: 'name',
      width: 150,
      search: true,
    },
    {
      title: t('content'),
      dataIndex: 'prompt',
      width: 200,
      ellipsis: true,
      search: false,
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
    {
      title: t('current-model'),
      dataIndex: 'model_name',
      width: 200,
      ellipsis: true,
      search: false,
    },
    {
      title: t('tools'),
      dataIndex: 'tool_names',
      width: 180,
      ellipsis: true,
      search: false,
      render: (_, record) => {
        const toolNames = record.tool_names || [];
        if (toolNames.length === 0) {
          return '-';
        }
        return (
          <Space size={[4, 4]} wrap className="flex flex-col">
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
      title: t('status'),
      dataIndex: 'current',
      width: 120,
      render: (_, entity) => (
        <Tag color={colorsList[entity.current]}>
          {entity.current === 1 ? t('current') : ''}
        </Tag>
      ),
    },
    {
      title: t('action'),
      dataIndex: 'action',
      width: 220,
      fixed: 'right',
      search: false,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            {t('edit')}
          </Button>
          <Button type="link" size="small" icon={<DeleteOutlined />}>
            <Popconfirm
              placement="bottom"
              title={t('confirm-delete')}
              okText={t('yes')}
              cancelText={t('no')}
              onConfirm={() => handleDelete(record)}
            >
              <span>{t('delete')}</span>
            </Popconfirm>
          </Button>
          <Button type="link" size="small" icon={<CheckSquareOutlined />}>
            <Popconfirm
              placement="bottom"
              title={t('confirm-execute')}
              okText={t('yes')}
              cancelText={t('no')}
              onConfirm={() => handleUse(record)}
            >
              <span>{t('use')}</span>
            </Popconfirm>
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <CustomProTable<IPromptResItem>
        formRef={formRef}
        actionRef={actionRef}
        columns={columns}
        rowKey="id"
        scroll={{ x: 1200 }}
        requestFn={getPromptList}
        columnsState={{
          persistenceKey: 'Evaluate-Table-Columns',
          persistenceType: 'localStorage',
        }}
        search={{
          optionRender: (searchConfig, formProps, dom) => [
            ...dom,
            <Button
              key="add"
              type="primary"
              onClick={handleAdd}
              style={{ marginLeft: 8 }}
            >
              {t('promptadd')}
            </Button>,
          ],
        }}
      />

      <PromptModal
        open={modalVisible}
        isEditMode={isEditMode}
        onCancel={() => {
          setModalVisible(false);
          setEditRecord(undefined);
        }}
        actionRef={actionRef}
        initialValues={editRecord}
      />
    </>
  );
};

export default Index;
