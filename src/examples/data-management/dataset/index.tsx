import CustomProTable from '@/components/basic/custom-table';
import {
  deleteDataset,
  getDatasetList,
  saveDataset,
  updateDataset,
} from '@/services/prompt.service';
import { IDataSetResItem } from '@/services/types/prompt.type';
import {
  DeleteOutlined,
  EditOutlined,
  SnippetsOutlined,
} from '@ant-design/icons';
import type {
  ActionType,
  FormInstance,
  ProColumns,
} from '@ant-design/pro-components';
import { useNavigate } from '@umijs/max';
import { Button, Form, Input, message, Modal, Popconfirm, Space } from 'antd';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Index: React.FC = () => {
  const formRef = useRef<FormInstance>();
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm<{
    id?: number;
    name: string;
    description: string;
    count: number;
    status?: number;
  }>();
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, SetLoading] = useState(false);
  const { t } = useTranslation('evaluate');
  const navigate = useNavigate();

  const handleDetail = (record: IDataSetResItem) => {
    navigate(`/data-management/dataset/${record.id}`);
  };
  //新增
  const handleAdd = () => {
    setIsEditMode(false);
    form.resetFields();
    setModalVisible(true);
  };
  // 处理编辑
  const handleEdit = (record: IDataSetResItem) => {
    setIsEditMode(true);
    form.setFieldsValue({
      id: record.id,
      name: record.name,
      description: record.description,
      count: record.count,
    });
    setModalVisible(true);
  };
  //删除
  const handleDelete = async (record: IDataSetResItem) => {
    const res = await deleteDataset(record.id);
    if (res?.code === 0) {
      message.success(t('delete-success'));
      actionRef.current?.reload();
    }
  };
  // 列定义
  const columns: ProColumns<IDataSetResItem>[] = [
    {
      title: t('name'),
      dataIndex: 'name',
      width: 150,
      search: true,
    },
    {
      title: t('description'),
      dataIndex: 'description',
      width: 200,
      ellipsis: true,
      search: false,
    },
    {
      title: t('count'),
      dataIndex: 'count',
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
          <Button
            type="link"
            size="small"
            icon={<SnippetsOutlined />}
            onClick={() => handleDetail(record)}
          >
            {t('detail')}
          </Button>
        </Space>
      ),
    },
  ];

  // 保存
  const handlesaveDataset = async () => {
    if (loading) return;
    try {
      const values = await form.validateFields();
      SetLoading(true);
      const payload = {
        id: values.id,
        name: values.name,
        description: values.description,
        count: values.count,
      };

      const res =
        isEditMode && values.id
          ? await updateDataset(payload as any)
          : await saveDataset(payload);

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
      <CustomProTable<IDataSetResItem>
        formRef={formRef}
        actionRef={actionRef}
        columns={columns}
        rowKey="id"
        scroll={{ x: 1200 }}
        requestFn={getDatasetList}
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
              {t('datesetadd')}
            </Button>,
          ],
        }}
      />

      {/* 修改数据集弹窗 */}
      <Modal
        title={isEditMode ? t('edit') : t('datesetadd')}
        open={modalVisible}
        onOk={handlesaveDataset}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        confirmLoading={loading}
        okButtonProps={{ disabled: loading }}
        width={800}
        style={{
          height: '500px',
          maxHeight: '500px',
          overflow: 'auto',
        }}
      >
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
              { max: 50, message: t('please-enter-name-max') },
            ]}
          >
            <Input placeholder={t('please-enter-name')} />
          </Form.Item>
          <Form.Item
            name="description"
            label={t('description')}
            rules={[
              { required: true, message: t('please-enter-description') },
              { max: 1000, message: t('please-enter-description-max') },
            ]}
          >
            <Input.TextArea
              rows={8}
              showCount
              maxLength={1000}
              placeholder={t('please-enter-description')}
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
