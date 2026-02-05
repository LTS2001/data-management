import CustomProTable from '@/components/basic/custom-table';
import { transformSearchToString } from '@/components/basic/custom-table/table-config';
import { EChannelInterest } from '@/config/enum';
import { defaultCatchApiError } from '@/services/request';
import {
  ERevealCUserInfo,
  type IListCUsersRes,
} from '@/services/types/user-manage.type';
import { exportCUsersInfo, listCUsers } from '@/services/user-manage.serivce';
import { downloadBlobAsFile } from '@/utils/download';
import { maskEmail, maskPhone } from '@/utils/format';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Space, Tag, Typography, message } from 'antd';
import dayjs from 'dayjs';
import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { channelInterestLabelMap } from './constant';
import { useGetCUserOptions, useReveal } from './hooks';
import CUserDetailModal from './user-detail-modal';

const { Text } = Typography;

const UserManage: React.FC = () => {
  const { t } = useTranslation('user');
  const actionRef = useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { phoneVisibleMap, emailVisibleMap, handleReveal } = useReveal();
  const [detailOpen, setDetailOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<IListCUsersRes | null>(null);

  // 获取选项数据（渠道、国家等）
  const { channels, countries, optionLoading } = useGetCUserOptions();

  // useReveal 已提供 handleReveal(type, userId)

  const columns = useMemo<ProColumns<IListCUsersRes>[]>(
    () => [
      {
        title: t('user-id'),
        dataIndex: 'id',
        width: 100,
        render: (_, record) =>
          `${record.carteaUserId || record.cuserId || record.userPseudoId}`,
      },
      {
        title: t('basic-profile'),
        dataIndex: 'basicProfile',
        search: false,
        width: 200,
        render: (_, record) => (
          <div className="flex flex-col gap-1 min-w-[200px]">
            <Text>
              {t('username')}: {record.username || '-'}
            </Text>
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
        minWidth: 200,
        render: (_, record) => (
          <Space
            size="small"
            className="hover:cursor-pointer min-w-[200px] flex justify-center"
          >
            <span>
              {phoneVisibleMap[record.cuserId]
                ? record.phoneNumber || '/'
                : maskPhone(record.phoneNumber)}
            </span>
            {record.phoneNumber && !phoneVisibleMap[record.cuserId] && (
              <Button
                type="link"
                size="small"
                onClick={() =>
                  handleReveal(ERevealCUserInfo.PHONE, record.cuserId)
                }
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
        minWidth: 200,
        render: (_, record) => (
          <Space
            size="small"
            className="hover:cursor-pointer min-w-[200px] flex justify-center"
          >
            <span>
              {emailVisibleMap[record.cuserId]
                ? record.email || '/'
                : maskEmail(record.email)}
            </span>
            {record.email && !emailVisibleMap[record.cuserId] && (
              <Button
                type="link"
                size="small"
                onClick={() =>
                  handleReveal(ERevealCUserInfo.EMAIL, record.cuserId)
                }
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
        width: 100,
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
        width: 100,
        search: false,
      },
      {
        title: t('register-time'),
        dataIndex: 'registerTime',
        width: 100,
        search: false,
      },
      {
        title: t('first-visit-port'),
        dataIndex: 'firstVisitPort',
        search: false,
        width: 100,
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
        search: {
          transform: (value) => transformSearchToString(value),
        },
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
        search: {
          transform: (value) => transformSearchToString(value),
        },
      },
      {
        title: t('filter-country'),
        dataIndex: 'countries',
        valueType: 'select',
        hideInTable: true,
        search: {
          transform: (value) => transformSearchToString(value),
        },
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
        fixed: 'right',
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
      const data = await exportCUsersInfo({
        userIds: selectedRowKeys as string[],
      });
      downloadBlobAsFile(
        data,
        `c-users-${dayjs().format('YYYYMMDDHHmmss')}.xlsx`,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      message.success(t('export-success'));
    } catch (error) {
      // eslint-disable-next-line no-console
      defaultCatchApiError(error);
      message.error(t('export-failed'));
    }
  };

  return (
    <>
      <CustomProTable<IListCUsersRes>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        requestFn={listCUsers}
        pagination={{ pageSize: 20 }}
        scroll={{ x: 1400 }}
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
