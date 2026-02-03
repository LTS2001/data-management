import { Card, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
const { Title } = Typography;

import { Funnel } from '@ant-design/plots';

const DemoFunnel = () => {
  const data = [
    { stage: '简历筛选', number: 253 },
    { stage: '初试人数', number: 151 },
    { stage: '复试人数', number: 113 },
    { stage: '录取人数', number: 87 },
    { stage: '入职人数', number: 59 },
  ];

  const config = {
    data,
    xField: 'stage',
    yField: 'number',
    label: {
      text: (d: any) => `${d.stage}\n${d.number}`,
    },
  };
  const { t } = useTranslation('dashboard');

  return (
    <Card
      className="mb-6 rounded-lg shadow-md"
      title={<Title level={4}>{t('conversion-funnel')}</Title>}
    >
      <div className="mb-4 text-center text-sm text-gray-600">
        {t('user-journey')}: {t('total-uv')} → {t('effective-browse-uv-label')}{' '}
        → {t('login-registrations')} → {t('leads')}
      </div>
      <Funnel {...config} />
    </Card>
  );
};
export default DemoFunnel;
