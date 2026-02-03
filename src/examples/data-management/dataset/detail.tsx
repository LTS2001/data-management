import CustomProTable from '@/components/basic/custom-table';
import {
  deleteDatasetQa,
  getDatasetQaList,
  saveDatasetQa,
  updateDatasetQa,
} from '@/services/prompt.service';
import {
  IDataSetQaListParams,
  IDataSetQaResItem,
} from '@/services/types/prompt.type';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type {
  ActionType,
  FormInstance,
  ProColumns,
} from '@ant-design/pro-components';
import { useParams } from '@umijs/max';
import { Button, Form, Input, message, Modal, Popconfirm, Space } from 'antd';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Index: React.FC = () => {
  const formRef = useRef<FormInstance>();
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm<{
    id?: number;
    answer: string;
    question: string;
  }>();
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, SetLoading] = useState(false);
  const { t } = useTranslation('evaluate');
  const { id: datasetId } = useParams<{ id: string }>();
  const requestWithDataset = (params: IDataSetQaListParams) =>
    getDatasetQaList({ ...params, dataset_id: Number(datasetId) });

  //新增
  const handleAdd = () => {
    setIsEditMode(false);
    form.resetFields();
    setModalVisible(true);
  };
  // 处理编辑
  const handleEdit = (record: IDataSetQaResItem) => {
    setIsEditMode(true);
    form.setFieldsValue({
      id: record.id,
      question: record.question,
      answer: record.answer,
    });
    setModalVisible(true);
  };
  //删除
  const handleDelete = async (record: IDataSetQaResItem) => {
    const res = await deleteDatasetQa(record.id);
    if (res?.code === 0) {
      message.success(t('delete-success'));
      actionRef.current?.reload();
    }
  };
  // 列定义
  const columns: ProColumns<IDataSetQaResItem>[] = [
    {
      title: t('question'),
      dataIndex: 'question',
      width: 150,
      search: true,
      ellipsis: true,
    },
    {
      title: t('answer'),
      dataIndex: 'answer',
      width: 200,
      ellipsis: true,
      search: true,
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
      title: t('action'),
      dataIndex: 'action',
      width: 180,
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
        </Space>
      ),
    },
  ];

  // 保存
  const handlesaveDatasetQa = async () => {
    if (loading) return;
    try {
      const values = await form.validateFields();
      SetLoading(true);
      const payload = {
        dataset_id: Number(datasetId),
        ...(values.id && { id: values.id }),
        question: values.question,
        answer: values.answer,
        status: 1,
      };

      const res =
        isEditMode && values.id
          ? await updateDatasetQa(payload as any)
          : await saveDatasetQa(payload);

      if (res?.code === 0) {
        message.success(isEditMode ? t('update-success') : t('create-success'));
        setModalVisible(false);
        form.resetFields();
        actionRef.current?.reload();
      } else {
        message.error(res?.message || res?.msg || '操作失败');
      }
    } catch (error: any) {
      console.error(t('save-failure'), error);
      message.error(error?.message || t('save-failure-message'));
    } finally {
      SetLoading(false);
    }
  };

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

      {/* 修改数据集弹窗 */}
      <Modal
        title={isEditMode ? t('edit') : t('datesetadd')}
        open={modalVisible}
        onOk={handlesaveDatasetQa}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        confirmLoading={loading}
        okButtonProps={{ disabled: loading }}
      >
        <Form
          form={form}
          layout="horizontal"
          requiredMark={false}
          labelCol={{ span: 4, style: { textAlign: 'right' } }}
          wrapperCol={{ span: 20 }}
        >
          <Form.Item
            name="question"
            label={t('question')}
            rules={[{ required: true, message: t('please-enter-question') }]}
          >
            <Input placeholder={t('please-enter-question')} />
          </Form.Item>
          <Form.Item
            name="answer"
            label={t('answer')}
            rules={[{ required: true, message: t('please-enter-answer') }]}
          >
            <Input.TextArea
              rows={8}
              showCount
              placeholder={t('please-enter-answer')}
            />
          </Form.Item>
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Index;
