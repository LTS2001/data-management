import { ArrowUpOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const { Link } = Typography;

interface KPICard {
  title: string;
  value: number;
  change: number;
  key: string;
}

const KPICards = () => {
  const { t } = useTranslation('dashboard');

  // 写死的数据，所有KPI都是68，+2.4%
  const kpiData: KPICard[] = [
    {
      title: t('uv'),
      value: 68,
      change: 2.4,
      key: 'uv',
    },
    {
      title: t('avg-pv-per-person'),
      value: 68,
      change: 2.4,
      key: 'avg-pv',
    },
    {
      title: t('avg-session-duration'),
      value: 68,
      change: 2.4,
      key: 'avg-session',
    },
    {
      title: t('new-users'),
      value: 68,
      change: 2.4,
      key: 'new-users',
    },
    {
      title: t('registrations'),
      value: 68,
      change: 2.4,
      key: 'registrations',
    },
    {
      title: t('bounce-rate'),
      value: 68,
      change: 2.4,
      key: 'bounce-rate',
    },
    {
      title: t('business-opportunities'),
      value: 68,
      change: 2.4,
      key: 'business-opportunities',
    },
    {
      title: t('form-leads'),
      value: 68,
      change: 2.4,
      key: 'form-leads',
    },
    {
      title: t('effective-browse-uv'),
      value: 68,
      change: 2.4,
      key: 'effective-browse-uv',
    },
  ];

  return (
    <Row gutter={[16, 16]} className="mb-6">
      {kpiData.map((item) => (
        <Col xs={24} sm={12} md={8} lg={8} xl={8} key={item.key}>
          <Card className="rounded-lg shadow-md">
            <Statistic
              title={item.title}
              value={item.value}
              precision={0}
              valueStyle={{
                fontSize: '24px',
                fontWeight: 600,
                color: '#1890ff',
              }}
              suffix={
                <span className="ml-2 text-sm text-green-600">
                  <ArrowUpOutlined className="mr-1" />
                  +{item.change}%
                </span>
              }
            />
            <Link className="mt-2 block text-xs" href="#">
              {t('view-details')}
            </Link>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default KPICards;

