import type { IListCUsersRes } from '@/services/types/user-manage.type';
import { formatDateYYMMDD } from '@/utils/format';
import { Descriptions, Modal, Tag, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { channelInterestLabelMap } from './constant';

const { Title, Text } = Typography;

export interface CUserDetailModalProps {
  open: boolean;
  user?: IListCUsersRes | null;
  onCancel: () => void;
}

const CUserDetailModal: React.FC<CUserDetailModalProps> = ({
  open,
  user,
  onCancel,
}) => {
  const { t } = useTranslation('user');

  if (!user) {
    return (
      <Modal open={open} onCancel={onCancel} footer={null} width={720}>
        <Text type="secondary">{t('no-data')}</Text>
      </Modal>
    );
  }

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={720}
      destroyOnClose
    >
      <div className="mb-4 flex items-center justify-between">
        <Title level={4} className="!mb-0">
          {t('user-detail-title', { name: user.carteaUserId })}
        </Title>
        <Text type="secondary">ID: {user.userPseudoId || '-'}</Text>
      </div>

      <Descriptions
        title={t('basic-profile')}
        bordered
        column={1}
        className="mb-6"
      >
        <Descriptions.Item label={t('country')}>
          {user.country || '-'}
        </Descriptions.Item>
        <Descriptions.Item label={t('region')}>
          {user.region || '-'}
        </Descriptions.Item>
        <Descriptions.Item label={t('device-os')}>
          {user.deviceOs || '-'}
        </Descriptions.Item>
        <Descriptions.Item label={t('device-model')}>
          {user.deviceModel || '-'}
        </Descriptions.Item>
      </Descriptions>

      <Descriptions
        title={t('contact-info')}
        bordered
        column={1}
        className="mb-6"
      >
        <Descriptions.Item label={t('phone-number')}>
          {user.phoneNumber || '/'}
        </Descriptions.Item>
        <Descriptions.Item label={t('email-address')}>
          {user.email || '/'}
        </Descriptions.Item>
      </Descriptions>

      <Descriptions title={t('source-and-behavior')} bordered column={1}>
        <Descriptions.Item label={t('source-channel')}>
          {user.sourceChannel || '-'}
        </Descriptions.Item>
        <Descriptions.Item label={t('first-visit-time')}>
          {formatDateYYMMDD(user.firstVisitTime)}
        </Descriptions.Item>
        <Descriptions.Item label={t('register-time')}>
          {formatDateYYMMDD(user.registerTime)}
        </Descriptions.Item>
        <Descriptions.Item label={t('first-visit-port')}>
          {user.firstVisitPort || '-'}
        </Descriptions.Item>
        <Descriptions.Item label={t('channel-interest')}>
          {user.channelInterest ? (
            <Tag color="blue">
              {channelInterestLabelMap[user.channelInterest]}
            </Tag>
          ) : (
            '-'
          )}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default CUserDetailModal;
