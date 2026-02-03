import { Col, Layout, Row, Typography } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConversionFunnel from './components/conversion-funnel';
import FilterBar from './components/filter-bar';
import KPICards from './components/kpi-cards';
import RetentionRate from './components/retention-rate';
import TrafficTrend from './components/traffic-trend';

const { Title, Link } = Typography;

const Dashboard = () => {
  const { t } = useTranslation('dashboard');
  const [timeRange, setTimeRange] = useState('last-7-days');
  const [platform, setPlatform] = useState('all-platforms');
  const [channel, setChannel] = useState('all-channels');

  return (
    <Layout className="p-6">
      <Row className="mb-6" justify="space-between" align="middle">
        <Col>
          <Title level={2} className="mb-0">
            {t('platform-data-dashboard')}
          </Title>
        </Col>
        <Col>
          <Link href="#">{t('data-dictionary')}</Link>
        </Col>
      </Row>

      <FilterBar
        timeRange={timeRange}
        platform={platform}
        channel={channel}
        onTimeRangeChange={setTimeRange}
        onPlatformChange={setPlatform}
        onChannelChange={setChannel}
      />

      <KPICards />
      <TrafficTrend />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <ConversionFunnel />
        </Col>
        <Col xs={24} lg={8}>
          <RetentionRate />
        </Col>
      </Row>
    </Layout>
  );
};

export default Dashboard;
