import type { IListCUsersRes } from '@/services/types/user-manage.type';
import { ERevealCUserInfo } from '@/services/types/user-manage.type';
import { formatDateYYMMDD, maskEmail, maskPhone } from '@/utils/format';
import { Button, Descriptions, Modal, Tag, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { channelInterestLabelMap } from './constant';
import { useReveal } from './hooks';

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
  const { phoneVisibleMap, emailVisibleMap, handleReveal } = useReveal();

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
      destroyOnClose={true}
      style={{ top: 40 }}
      title={
        <div className="mb-4 flex gap-4 items-end">
          <Title level={4} className="!mb-0">
            {t('user-detail-title', { name: user.carteaUserId || '-' })}
          </Title>
          <Text type="secondary">ID: {user.cuserId || '-'}</Text>
        </div>
      }
    >
      <div>
        <Descriptions
          title={t('basic-profile')}
          bordered
          column={1}
          className="mb-6"
        >
          <Descriptions.Item label={t('username')}>
            {user.username || '-'}
          </Descriptions.Item>
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
            <>
              <span>
                {phoneVisibleMap[user.cuserId]
                  ? user.phoneNumber || '/'
                  : maskPhone(user.phoneNumber)}
              </span>
              {user.phoneNumber && !phoneVisibleMap[user.cuserId] && (
                <Button
                  type="link"
                  size="small"
                  onClick={() =>
                    handleReveal(ERevealCUserInfo.PHONE, user.cuserId)
                  }
                >
                  {t('view-full')}
                </Button>
              )}
            </>
          </Descriptions.Item>
          <Descriptions.Item label={t('email-address')}>
            <>
              <span>
                {emailVisibleMap[user.cuserId]
                  ? user.email || '/'
                  : maskEmail(user.email)}
              </span>
              {user.email && !emailVisibleMap[user.cuserId] && (
                <Button
                  type="link"
                  size="small"
                  onClick={() =>
                    handleReveal(ERevealCUserInfo.EMAIL, user.cuserId)
                  }
                >
                  {t('view-full')}
                </Button>
              )}
            </>
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
      </div>
    </Modal>
  );
};

export default CUserDetailModal;
