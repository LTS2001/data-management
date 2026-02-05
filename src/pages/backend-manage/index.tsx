import CustomProTable from '@/components/basic/custom-table';
import { EAccountStatus, EUserRole } from '@/config/enum';
import { t as defaultTranslate, TxKeyPath } from '@/i18n/utils';
import { listAdmins, saveAdmin } from '@/services/backend-manage.service';
import { defaultCatchApiError } from '@/services/request';
import { IListOperationsRes } from '@/services/types/backend-manage.type';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { useAccess } from '@umijs/max';
import { Button, message, Popconfirm, Radio, Space, Switch } from 'antd';
import { CheckboxGroupProps } from 'antd/es/checkbox';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import EditUserModal from './components/edit-user-modal';
import { useDepartmentOptions } from './hooks';

const BackendManage = () => {
  const access = useAccess();
  const { t } = useTranslation('backend-manage');
  const [listType, setListType] = useState<EUserRole>(EUserRole.Admin);
  const actionRef = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<IListOperationsRes | null>(null);
  const { departments } = useDepartmentOptions();
  const currentUserRole = useMemo(() => access.role, []);

  const options: CheckboxGroupProps<EUserRole>['options'] = [
    { label: t('user-role-admin'), value: EUserRole.Admin },
    { label: t('user-role-ops'), value: EUserRole.Ops },
  ];

  const handleToggle = async (record: IListOperationsRes, checked: boolean) => {
    const params = {
      id: record.id,
      proStatus: checked ? EAccountStatus.Enable : EAccountStatus.Disable,
    };
    try {
      await saveAdmin(params);
      message.success(t('status-update-success'));
      actionRef.current?.reload();
    } catch (err) {
      defaultCatchApiError(err);
      message.error(t('update-fail'));
    }
  };

  const handleDelete = async (record: IListOperationsRes) => {
    const params = { id: record.id, proStatus: EAccountStatus.Delete };
    try {
      await saveAdmin(params);
      message.success(t('delete-success'));
      actionRef.current?.reload();
    } catch (err) {
      defaultCatchApiError(err);
      message.error(t('delete-fail'));
    }
  };

  const columns: ProColumns<IListOperationsRes>[] = [
    {
      title: t('username'),
      dataIndex: 'username',
      key: 'username',
      search: {
        transform: (val) => ({ username: val || undefined }),
      },
    },
    {
      title: t('account'),
      dataIndex: 'account',
      key: 'account',
    },
    {
      title: t('department'),
      dataIndex: 'departmentId',
      key: 'department',
      render: (_, record) => {
        if (!record.departmentId) return 'Cartea';
        const department = departments.find(
          (item) => item.value === record.departmentId,
        );
        return defaultTranslate(department?.label as TxKeyPath) || '-';
      },
    },
    {
      title: t('role-name'),
      dataIndex: 'roleId',
      key: 'roleId',
      render: (_, record) => t(`user-role-${record.roleId}`),
    },
    {
      title: t('account-status'),
      dataIndex: 'proStatus',
      key: 'proStatus',
      render: (_: any, record: IListOperationsRes) => (
        <Switch
          checked={record.proStatus === EAccountStatus.Enable}
          onChange={(checked) => handleToggle(record, checked)}
          checkedChildren={t('enable')}
          unCheckedChildren={t('disable')}
        />
      ),
    },
    {
      title: t('action'),
      key: 'action',
      render: (_: any, record: IListOperationsRes) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setEditing(record);
              setModalVisible(true);
            }}
          >
            {t('edit')}
          </Button>
          <Popconfirm
            title={t('confirm-delete', { name: record.username })}
            onConfirm={() => handleDelete(record)}
            okText={t('ok')}
            cancelText={t('cancel')}
          >
            <Button type="link" danger>
              {t('delete')}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <CustomProTable<IListOperationsRes>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        requestFn={listAdmins}
        pagination={{ pageSize: 20 }}
        toolBarRender={() => [
          <Button
            key="add-user"
            type="primary"
            onClick={() => {
              setEditing(null);
              setModalVisible(true);
            }}
          >
            {t('add-user')}
          </Button>,
        ]}
        params={{ roleId: listType }}
        search={{
          defaultCollapsed: false,
          labelWidth: 'auto',
          optionRender: (_searchConfig, _formProps, dom) => [
            ...dom.reverse(),
            <Radio.Group
              key="role"
              block
              options={options}
              defaultValue={EUserRole.Admin}
              optionType="button"
              buttonStyle="solid"
              onChange={(e) => setListType(e.target.value)}
            />,
          ],
        }}
      />

      <EditUserModal
        departments={departments}
        visible={modalVisible}
        editing={editing}
        currentUserRole={currentUserRole}
        onCancel={() => setModalVisible(false)}
        actionRef={actionRef}
      />
    </>
  );
};

export default BackendManage;
