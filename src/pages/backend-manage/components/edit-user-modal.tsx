import { EAccountStatus, EUserRole } from '@/config/enum';
import { saveAdmin } from '@/services/backend-manage.service';
import { defaultCatchApiError } from '@/services/request';
import { ISaveAdminParams } from '@/services/types/backend-manage.type';
import { IListAdminsRes } from '@/services/types/user-manage.type';
import { ActionType } from '@ant-design/pro-components';
import { message, Switch } from 'antd';

import { Col, Form, Input, Modal, Row, Select } from 'antd';
import React, { MutableRefObject, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  visible: boolean;
  editing?: IListAdminsRes | null;
  currentUserRole: EUserRole;
  onCancel: () => void;
  actionRef?: MutableRefObject<ActionType | undefined>;
}

const EditUserModal: React.FC<
  Props & { departments: { label: string; value: number }[] }
> = ({
  visible,
  editing,
  currentUserRole,
  onCancel,
  actionRef,
  departments,
}) => {
  const { t } = useTranslation('backend-manage');
  const [form] = Form.useForm();
  const handleSave = async (vals: ISaveAdminParams) => {
    const params: ISaveAdminParams = {
      ...vals,
      password: vals.password || 'Aa123456',
      proStatus: vals.proStatus
        ? EAccountStatus.Enable
        : EAccountStatus.Disable,
      id: editing?.id || undefined,
    };

    try {
      await saveAdmin(params);
      message.success(t('save-success'));
      onCancel();
      actionRef?.current?.reload();
    } catch (err) {
      defaultCatchApiError(err);
      // message.error(t('save-fail'));
    }
  };

  useEffect(() => {
    if (visible && editing) {
      form.setFieldsValue({
        ...editing,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        password: 'Aa123456',
        proStatus: 1,
        departmentId: 5,
      });
    }
  }, [visible, editing]);

  return (
    <Modal
      title={editing ? t('edit-user') : t('add-user')}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={880}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={async (vals) => await handleSave(vals)}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="username"
              label={t('username')}
              rules={[{ required: true }, { max: 30 }]}
            >
              <Input placeholder={t('username-placeholder')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="departmentId"
              label={t('department')}
              rules={[{ required: true }]}
            >
              <Select
                placeholder={t('department-placeholder')}
                options={departments}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="account"
              label={t('account')}
              rules={[{ required: true }]}
            >
              <Input placeholder={t('email-account-placeholder')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="password" label={t('initial-password')}>
              <Input placeholder={t('initial-password-placeholder')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16} align="middle">
          <Col span={12}>
            <Form.Item
              name="roleId"
              label={t('role-name')}
              rules={[{ required: true }]}
            >
              <Select
                placeholder={t('role-placeholder')}
                options={[
                  {
                    label: t('user-role-2'),
                    value: EUserRole.Admin,
                    disabled: currentUserRole !== EUserRole.SuperAdmin,
                  },
                  { label: t('user-role-3'), value: EUserRole.Ops },
                ]}
              />
            </Form.Item>
            {/* {currentUserRole !== EUserRole.SuperAdmin &&
            currentUserRole === EUserRole.Admin ? (
              <div style={{ color: '#888', marginTop: -12 }}>
                管理员角色由超级管理员开通
              </div>
            ) : null} */}
          </Col>
          <Col span={12}>
            <Form.Item
              name="proStatus"
              label={t('account-status')}
              valuePropName="checked"
            >
              <Switch
                checkedChildren={t('enable')}
                unCheckedChildren={t('disable')}
                defaultChecked
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EditUserModal;
