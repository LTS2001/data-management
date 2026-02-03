import CustomProTable from '@/components/basic/custom-table';
import { colorsList } from '@/config/constant';
import { saveEvaluation } from '@/services/evaluate.service';
import { IEvaluateResItem } from '@/services/types/evaluate.type';
import { EditOutlined } from '@ant-design/icons';
import type {
  ActionType,
  FormInstance,
  ProColumns,
} from '@ant-design/pro-components';
import { Button, Form, Input, message, Modal, Select, Space, Tag } from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getEvaluateListByFormData } from '../data-management/get-data';

enum EEvaluation {
  NOT_EVALUATED,
  SATISFIED,
  GENERAL,
  DISSATISFIED,
}

export interface ISearchValue {
  rate: number;
  time_range: number;
}

const Index: React.FC = () => {
  const formRef = useRef<FormInstance>();
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm<Pick<IEvaluateResItem, 'id' | 'rate'>>();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const { t } = useTranslation('evaluate');

  const evaluationMap = {
    [EEvaluation.NOT_EVALUATED]: t('not-evaluated'),
    [EEvaluation.SATISFIED]: t('satisfied'),
    [EEvaluation.GENERAL]: t('general'),
    [EEvaluation.DISSATISFIED]: t('dissatisfied'),
  };
  const evaluationOptions = useMemo(
    () =>
      Object.entries(evaluationMap).map(([value, label]) => ({
        value: Number(value),
        label,
      })),
    [evaluationMap],
  );

  // 处理编辑
  const handleEdit = (record: IEvaluateResItem) => {
    form.setFieldsValue({
      rate: record.rate,
      id: record.id,
    });
    setEditModalVisible(true);
  };

  // 列定义
  const columns: ProColumns<IEvaluateResItem>[] = [
    {
      title: t('user-send-time'),
      dataIndex: 'create_time',
      width: 100,
      valueType: 'dateTime',
      search: false,
    },
    {
      title: t('username'),
      dataIndex: 'contact_name',
      width: 150,
      search: false,
    },
    {
      title: t('users-send-content'),
      dataIndex: 'content',
      width: 200,
      ellipsis: true,
      search: false,
    },
    {
      title: t('ai-replies'),
      dataIndex: 'reply_content',
      width: 200,
      ellipsis: true,
      search: false,
    },
    {
      title: t('time-range'),
      dataIndex: 'time_range',
      width: 100,
      valueType: 'select',
      hidden: true,
      fieldProps: {
        options: [
          { value: 0, label: t('today-0') },
          { value: 1, label: t('nearly-7-days-0') },
        ],
      },
      search: true,
    },
    {
      title: t('evaluate-results'),
      dataIndex: 'rate',
      valueType: 'select',
      width: 120,
      fieldProps: {
        options: evaluationOptions,
      },
      search: true,
      render: (_, entity) => (
        <Tag color={colorsList[entity.rate]}>
          {evaluationMap[entity.rate as EEvaluation]}
        </Tag>
      ),
    },
    {
      title: t('action'),
      dataIndex: 'action',
      width: 120,
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
            {t('modify-the-evaluate')}
          </Button>
        </Space>
      ),
    },
  ];

  // 保存评估
  const handleSaveEvaluation = async () => {
    try {
      const values = await form.validateFields();
      const res = await saveEvaluation({
        message_id: values.id,
        rate: values.rate,
      });
      if (res && res.code === 0) {
        message.success(t('evaluation-update-successful'));
        setEditModalVisible(false);
        form.resetFields();
        // 刷新表格
        actionRef.current?.reload();
      }
    } catch (error) {
      console.error('修改失败: ', error);
    }
  };

  return (
    <>
      <CustomProTable<IEvaluateResItem>
        formRef={formRef}
        actionRef={actionRef}
        columns={columns}
        rowKey="id"
        scroll={{ x: 1200 }}
        requestFn={getEvaluateListByFormData}
        columnsState={{
          persistenceKey: 'Evaluate-Table-Columns',
          persistenceType: 'localStorage',
        }}
      />

      {/* 修改评估弹窗 */}
      <Modal
        title={t('revise-the-evaluation')}
        open={editModalVisible}
        onOk={handleSaveEvaluation}
        onCancel={() => {
          setEditModalVisible(false);
          form.resetFields();
        }}
        width={600}
        destroyOnHidden
      >
        <Form
          form={form}
          className="my-8"
          layout="horizontal"
          requiredMark={false}
        >
          <Form.Item
            name="rate"
            label={t('evaluation-results')}
            rules={[
              {
                required: true,
                message: t('please-select-evaluation-results'),
              },
            ]}
          >
            <Select
              options={evaluationOptions.map((opt) => ({
                label: opt.label,
                value: opt.value,
              }))}
              placeholder={t('please-select-evaluation-results')}
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
