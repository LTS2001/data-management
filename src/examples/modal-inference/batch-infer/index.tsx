import CustomProTable from '@/components/basic/custom-table';
import { colorsList2 } from '@/config/constant';
import {
  deleteBatchInference,
  getBatchInferenceList,
  getDatasetList,
  getPromptList,
  runBatchInference,
  saveBatchInference,
} from '@/services/prompt.service';
import {
  IBatchInferenceResItem,
  IDataSetResItem,
  IPromptResItem,
} from '@/services/types/prompt.type';
import {
  CheckSquareOutlined,
  DeleteOutlined,
  SnippetsOutlined,
} from '@ant-design/icons';
import type {
  ActionType,
  FormInstance,
  ProColumns,
} from '@ant-design/pro-components';
import { useNavigate } from '@umijs/max';
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Progress,
  Select,
  Space,
  Tag,
} from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

enum EInference {
  NOT_START,
  IN_PROGRESS,
  FINISH,
  FAILURE,
}
const Index: React.FC = () => {
  const formRef = useRef<FormInstance>();
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm<{
    id?: number;
    name: string;
    dataset_id: number;
    prompt_id: number;
  }>();
  const [modalVisible, setModalVisible] = useState(false);
  const [promptLoading, setPromptLoading] = useState(false);
  const [datasetLoading, setDatasetLoading] = useState(false);
  const [loading, SetLoading] = useState(false);
  const [promptList, setPromptList] = useState<IPromptResItem[]>([]);
  const [datasetList, setDatasetList] = useState<IDataSetResItem[]>([]);
  const { t } = useTranslation('evaluate');
  const navigate = useNavigate();
  const inferenceMap = {
    [EInference.NOT_START]: t('not-start'),
    [EInference.IN_PROGRESS]: t('in-progress'),
    [EInference.FINISH]: t('completed'),
    [EInference.FAILURE]: t('failure'),
  };
  const inferenceOptions = useMemo(
    () =>
      Object.entries(inferenceMap).map(([value, label]) => ({
        value: Number(value),
        label,
      })),
    [inferenceMap],
  );

  const loadPromptList = async () => {
    if (promptList.length > 0 || promptLoading) return;
    setPromptLoading(true);
    try {
      const res = await getPromptList({ params: { page: 1, size: 1000 } });
      if (res?.code === 0) {
        setPromptList(res.data?.items || []);
      }
    } catch (error) {
      console.error('获取 Prompt 列表失败:', error);
    } finally {
      setPromptLoading(false);
    }
  };

  const loadDatasetList = async () => {
    if (datasetList.length > 0 || datasetLoading) return;
    setDatasetLoading(true);
    try {
      const res = await getDatasetList({ params: { page: 1, size: 1000 } });
      if (res?.code === 0) {
        setDatasetList(res.data?.items || []);
      }
    } catch (error) {
      console.error('获取数据集列表失败:', error);
    } finally {
      setDatasetLoading(false);
    }
  };
  //点击详情跳转
  const handleDetail = (record: IBatchInferenceResItem) => {
    navigate(`/modal-inference/batch-infer/${record.id}`);
  };
  //新增
  const handleAdd = () => {
    form.resetFields();
    setModalVisible(true);
  };
  //删除
  const handleDelete = async (record: IBatchInferenceResItem) => {
    const res = await deleteBatchInference(record.id);
    if (res?.code === 0) {
      message.success(t('delete-success'));
      actionRef.current?.reload();
    } else {
      message.error(res?.message);
    }
  };
  //执行
  const handleRun = async (record: IBatchInferenceResItem) => {
    const res = await runBatchInference(record.id);
    if (res?.code === 0) {
      message.success(t('execute-success'));
      actionRef.current?.reload();
    } else {
      message.error(res?.message);
    }
  };
  // 列定义
  const columns: ProColumns<IBatchInferenceResItem>[] = [
    {
      title: t('name'),
      dataIndex: 'name',
      width: 150,
      search: true,
    },
    {
      title: t('status'),
      dataIndex: 'status',
      valueType: 'select',
      width: 200,
      fieldProps: {
        options: inferenceOptions,
      },
      ellipsis: true,
      search: true,
      render: (_, entity) => (
        <Tag color={colorsList2[entity.status]}>
          {inferenceMap[entity.status as EInference]}
        </Tag>
      ),
    },
    {
      title: t('process'),
      dataIndex: 'completed_count',
      width: 200,
      search: false,
      render: (_, entity) => {
        const total = entity.total_count || 0;
        const done = entity.completed_count || 0;
        const percent = total > 0 ? Math.round((done / total) * 100) : 0;
        return (
          <>
            <div className="flex items-center gap-2 justify-start">
              <div>
                {done} / {total}
              </div>
              <div className="text-gray-500 text-sm">({percent}%)</div>
            </div>
            <Progress percent={percent} showInfo={false} />
          </>
        );
      },
    },
    {
      title: t('promptName'),
      dataIndex: 'prompt_name',
      width: 150,
      search: {
        transform: (value) => ({ prompt_id: value }),
      },
      valueType: 'select',
      fieldProps: {
        showSearch: true,
        placeholder: t('please-select-prompt'),
        options: promptList.map((item) => ({
          value: item.id,
          label: item.name,
        })),
        onFocus: loadPromptList,
        loading: promptLoading,
        filterOption: (
          input: string,
          option?: { label: string; value: number },
        ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
      },
      ellipsis: true,
      render: (_, entity) => entity.prompt_name,
    },
    {
      title: t('datesetName'),
      dataIndex: 'dataset_name',
      width: 150,
      search: {
        transform: (value) => ({ dataset_id: value }),
      },
      valueType: 'select',
      fieldProps: {
        showSearch: true,
        placeholder: t('please-select-dataset'),
        options: datasetList.map((item) => ({
          value: item.id,
          label: item.name,
        })),
        onFocus: loadDatasetList,
        loading: datasetLoading,
        filterOption: (
          input: string,
          option?: { label: string; value: number },
        ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
      },
      ellipsis: true,
      render: (_, entity) => entity.dataset_name,
    },
    {
      title: t('token'),
      dataIndex: 'total_token',
      width: 150,
      search: false,
    },
    {
      title: t('action'),
      dataIndex: 'action',
      width: 260,
      fixed: 'right',
      search: false,
      render: (_, record) => {
        const isNotStart = record.status === EInference.NOT_START;
        return (
          <Space size="small">
            <Button
              type="link"
              size="small"
              icon={<SnippetsOutlined />}
              onClick={() => handleDetail(record)}
            >
              {t('detail')}
            </Button>
            <Button
              type="link"
              size="small"
              icon={<CheckSquareOutlined />}
              disabled={!isNotStart}
            >
              <Popconfirm
                placement="bottom"
                title={t('confirm-execute')}
                okText={t('yes')}
                cancelText={t('no')}
                onConfirm={() => handleRun(record)}
              >
                <span>{t('execute')}</span>
              </Popconfirm>
            </Button>
            <Button
              type="link"
              size="small"
              icon={<DeleteOutlined />}
              disabled={!isNotStart}
            >
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
        );
      },
    },
  ];

  // 保存
  const handlesaveBatchInference = async () => {
    if (loading) return;
    try {
      const values = await form.validateFields();
      SetLoading(true);

      const payload = {
        name: values.name,
        dataset_id: values.dataset_id,
        prompt_id: values.prompt_id,
      };

      const res = await saveBatchInference(payload);

      if (res?.code === 0) {
        message.success(t('create-success'));
        setModalVisible(false);
        form.resetFields();
        actionRef.current?.reload();
      } else {
        message.error(res?.msg || res?.message || t('create-failure'));
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
      <CustomProTable<IBatchInferenceResItem>
        formRef={formRef}
        actionRef={actionRef}
        columns={columns}
        rowKey="id"
        scroll={{ x: 1200 }}
        requestFn={getBatchInferenceList}
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
        title={t('promptadd')}
        open={modalVisible}
        onOk={handlesaveBatchInference}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        confirmLoading={loading}
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
            name="prompt_id"
            label={t('prompt')}
            rules={[{ required: true, message: t('please-select-prompt') }]}
          >
            <Select
              placeholder={t('please-select-prompt')}
              loading={promptLoading}
              onFocus={loadPromptList}
              options={promptList.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="dataset_id"
            label={t('dataset')}
            rules={[{ required: true, message: t('please-select-dataset') }]}
          >
            <Select
              placeholder={t('please-select-dataset')}
              loading={datasetLoading}
              onFocus={loadDatasetList}
              options={datasetList.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
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
