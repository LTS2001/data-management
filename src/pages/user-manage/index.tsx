import CustomProTable from '@/components/basic/custom-table';
import { EChannelInterest } from '@/config/enum';
import { defaultCatchApiError } from '@/services/request';
import {
  ERevealCUserInfo,
  type IListCUsersRes,
} from '@/services/types/user-manage.type';
import {
  exportCUsersInfo,
  listCUsers,
  revealCUserInfo,
} from '@/services/user-manage.serivce';
import { maskEmail, maskPhone } from '@/utils/format';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Space, Tag, Typography, message } from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { channelInterestLabelMap } from './constant';
import { useGetCUserOptions } from './hooks';
import CUserDetailModal from './user-detail-modal';

const { Title, Text } = Typography;

const UserManage: React.FC = () => {
  const { t } = useTranslation('user');
  const actionRef = useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [phoneVisibleMap, setPhoneVisibleMap] = useState<
    Record<number, boolean>
  >({});
  const [emailVisibleMap, setEmailVisibleMap] = useState<
    Record<number, boolean>
  >({});
  const [detailOpen, setDetailOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<IListCUsersRes | null>(null);

  // 获取选项数据（渠道、国家等）
  const { channels, countries, optionLoading } = useGetCUserOptions();

  const handleReveal = async (type: ERevealCUserInfo, userId: number) => {
    try {
      await revealCUserInfo(type);
      if (type === ERevealCUserInfo.PHONE) {
        setPhoneVisibleMap((prev) => ({ ...prev, [userId]: true }));
      } else {
        setEmailVisibleMap((prev) => ({ ...prev, [userId]: true }));
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Reveal user info failed', error);
    }
  };

  const columns: ProColumns<IListCUsersRes>[] = useMemo(
    () => [
      {
        title: t('user-id'),
        dataIndex: 'userPseudoId',
        width: 120,
        render: (_, record) => `#${record.userPseudoId}`,
      },
      {
        title: t('basic-profile'),
        dataIndex: 'basicProfile',
        search: false,
        render: (_, record) => (
          <div className="flex flex-col gap-1">
            <Text>
              {t('country')}: {record.country || '-'}
            </Text>
            <Text>
              {t('region')}: {record.region || '-'}
            </Text>
            <Text>
              {t('device-os')}: {record.deviceOs || '-'}
            </Text>
            <Text>
              {t('device-model')}: {record.deviceModel || '-'}
            </Text>
          </div>
        ),
      },
      {
        title: t('phone-number'),
        dataIndex: 'phoneNumber',
        search: false,
        render: (_, record) => (
          <Space size="small">
            <span>
              {phoneVisibleMap[record.id]
                ? record.phoneNumber || '/'
                : maskPhone(record.phoneNumber)}
            </span>
            {record.phoneNumber && !phoneVisibleMap[record.id] && (
              <Button
                type="link"
                size="small"
                onClick={() => handleReveal(ERevealCUserInfo.PHONE, record.id)}
              >
                {t('view-full')}
              </Button>
            )}
          </Space>
        ),
      },
      {
        title: t('email-address'),
        dataIndex: 'email',
        search: false,
        render: (_, record) => (
          <Space size="small">
            <span>
              {emailVisibleMap[record.id]
                ? record.email || '/'
                : maskEmail(record.email)}
            </span>
            {record.email && !emailVisibleMap[record.id] && (
              <Button
                type="link"
                size="small"
                onClick={() => handleReveal(ERevealCUserInfo.EMAIL, record.id)}
              >
                {t('view-full')}
              </Button>
            )}
          </Space>
        ),
      },
      {
        title: t('source-channel'),
        dataIndex: 'sourceChannel',
        render: (_, record) =>
          record.sourceChannel ? (
            <Tag color="blue">{record.sourceChannel}</Tag>
          ) : (
            '-'
          ),
      },
      {
        title: t('first-visit-time'),
        dataIndex: 'firstVisitTime',
        search: false,
      },
      {
        title: t('register-time'),
        dataIndex: 'registerTime',
        search: false,
      },
      {
        title: t('first-visit-port'),
        dataIndex: 'firstVisitPort',
        search: false,
      },
      {
        title: t('channel-interest'),
        dataIndex: 'channelInterest',
        valueType: 'select',
        fieldProps: {
          mode: 'multiple',
          options: Object.values(EChannelInterest)
            .filter((v) => typeof v === 'number')
            .map((value) => ({
              label: channelInterestLabelMap[value as EChannelInterest],
              value,
            })),
        },
        render: (_, record) =>
          record.channelInterest ? (
            <Tag color="purple">
              {channelInterestLabelMap[record.channelInterest]}
            </Tag>
          ) : (
            '-'
          ),
      },
      {
        title: t('filter-source-channel'),
        dataIndex: 'channels',
        valueType: 'select',
        hideInTable: true,
        fieldProps: {
          mode: 'multiple',
          options: channels,
          loading: optionLoading,
        },
      },
      {
        title: t('filter-country'),
        dataIndex: 'countries',
        valueType: 'select',
        hideInTable: true,
        fieldProps: {
          mode: 'multiple',
          options: countries,
          loading: optionLoading,
        },
      },
      {
        title: t('operation'),
        dataIndex: 'operation',
        valueType: 'option',
        width: 120,
        render: (_, record) => (
          <Button
            type="link"
            size="small"
            onClick={() => {
              setCurrentUser(record);
              setDetailOpen(true);
            }}
          >
            {t('view-detail')}
          </Button>
        ),
      },
    ],
    [t, channels, countries, optionLoading, phoneVisibleMap, emailVisibleMap],
  );

  const handleExport = async () => {
    if (!selectedRowKeys.length) return;
    try {
      await exportCUsersInfo({
        userIds: selectedRowKeys as string[],
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      defaultCatchApiError(error);
      message.error(t('export-failed'));
    }
  };

  return (
    // <Layout className="p-6">
    //   <Row className="mb-6" justify="space-between" align="middle">
    //     <Col>
    //       <Title level={2} className="mb-0">
    //         {t('user-manage')}
    //       </Title>
    //     </Col>
    //   </Row>
    <>
      <CustomProTable<IListCUsersRes>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        requestFn={listCUsers}
        pagination={{ pageSize: 20 }}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
        }}
        toolBarRender={() => [
          <Button
            key="export"
            type="primary"
            onClick={handleExport}
            disabled={!selectedRowKeys.length}
          >
            {t('export-data')}
          </Button>,
        ]}
      />

      <CUserDetailModal
        open={detailOpen}
        user={currentUser}
        onCancel={() => {
          setDetailOpen(false);
          setCurrentUser(null);
        }}
      />
    </>
    // </Layout>
  );
};

export default UserManage;
