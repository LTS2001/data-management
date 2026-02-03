import { Col, Layout, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

const Dashboard = () => {
  const { t } = useTranslation('dashboard');

  return (
    <Layout className="p-6">
      <Row className="mb-6" justify="space-between" align="middle">
        <Col>
          <Title level={2} className="mb-0">
            {t('user-asset-overview')}
          </Title>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}></Col>
        <Col xs={24} lg={8}></Col>
      </Row>
    </Layout>
  );
};

export default Dashboard;
