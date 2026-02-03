import { HomeDataRes } from '@/services/types/home.type';
import {
  CheckCircleOutlined,
  MessageOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Line, LineConfig } from '@ant-design/plots';
import {
  Card,
  Col,
  Layout,
  Row,
  Select,
  Space,
  Statistic,
  Tabs,
  Tag,
} from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetOverViewData } from './hooks';

const { Option } = Select;
const { TabPane } = Tabs;

enum ETimeRangeType {
  day7 = 1,
  day15 = 2,
}

enum EDataChartsType {
  message_num = '1',
  conversation_num = '2',
  reply_avg = '3',
  rate = '4',
}

const Index = () => {
  const [timeRange, setTimeRange] = useState<ETimeRangeType>(
    ETimeRangeType.day7,
  );
  const [currentData, setCurrentData] = useState<HomeDataRes>([]);
  const [activeTab, setActiveTab] = useState<EDataChartsType>(
    EDataChartsType.message_num,
  ); // 当前激活的tab
  const { t } = useTranslation('overview');
  const data = useGetOverViewData();

  // 切换时间范围时更新数据
  useEffect(() => {
    if (!data) return;
    setCurrentData(
      timeRange === ETimeRangeType.day7 ? data.data7d : data.data15d,
    );
  }, [timeRange, data]);

  const messageNumChartConfig: LineConfig = {
    data: currentData,
    xField: 'day',
    yField: 'message_num',
    tooltip: {
      items: [
        {
          field: 'message_num',
          name: t('replies'),
        },
      ],
    },
    key: `message_num-${activeTab}-${timeRange}`,
  };

  const conversationNumChartConfig = {
    data: currentData,
    xField: 'day',
    yField: 'conversation_num',
    tooltip: {
      items: [
        {
          field: 'conversation_num',
          name: t('conversation'),
        },
      ],
    },
    key: `conversation_num-${activeTab}-${timeRange}`,
  };

  const replyAvgChartConfig: LineConfig = {
    data: currentData,
    xField: 'day',
    yField: 'reply_avg',
    tooltip: {
      items: [
        {
          field: 'reply_avg',
          name: t('reply-avg'),
        },
      ],
    },
    key: `reply_avg-${activeTab}-${timeRange}`,
  };

  const rateChartConfig = {
    data: currentData,
    xField: 'day',
    yField: 'rate',
    tooltip: {
      items: [
        {
          field: 'rate',
          name: t('resolution-rate'),
        },
      ],
    },
    key: `rate-${activeTab}-${timeRange}`, // 添加key强制重新渲染
  };

  // Tab切换处理
  const handleTabChange = (key: string) => {
    setActiveTab(key as EDataChartsType);
  };

  return (
    <Layout>
      {/* <Title level={2}>{t('data-overview')}</Title> */}
      <Row gutter={24}>
        <Col sm={24} md={12} lg={6}>
          <Card
            title={t('total-number-of-user-replies')}
            extra={
              <Tag icon={<MessageOutlined />} color="blue">
                {t('today')}
              </Tag>
            }
            className="mb-4 rounded-lg shadow-md"
          >
            <Statistic
              value={data?.data1d?.[0]?.message_num || 0}
              prefix={
                <MessageOutlined style={{ color: '#1890ff', fontSize: 20 }} />
              }
              valueStyle={{
                fontSize: '28px',
                color: '#1890ff',
                fontWeight: 600,
              }}
              precision={0}
            />
          </Card>
        </Col>
        <Col sm={24} md={12} lg={6}>
          <Card
            title={t('number-of-new-sessions-per-day')}
            extra={
              <Tag icon={<UserOutlined />} color="cyan">
                {t('today')}
              </Tag>
            }
            className="mb-4 rounded-lg shadow-md"
          >
            <Statistic
              value={data?.data1d?.[0]?.conversation_num || 0}
              prefix={
                <UserOutlined style={{ color: '#36cbcb', fontSize: 20 }} />
              }
              valueStyle={{
                fontSize: '28px',
                color: '#36cbcb',
                fontWeight: 600,
              }}
              precision={0}
            />
          </Card>
        </Col>
        <Col sm={24} md={12} lg={6}>
          <Card
            title={t('average-number-of-user-responses')}
            extra={
              <Tag icon={<TeamOutlined />} color="green">
                {t('today')}
              </Tag>
            }
            className="mb-4 rounded-lg shadow-md"
          >
            <Statistic
              value={data?.data1d?.[0]?.reply_avg || 0}
              prefix={
                <TeamOutlined style={{ color: '#52c41a', fontSize: 20 }} />
              }
              valueStyle={{
                fontSize: '28px',
                color: '#52c41a',
                fontWeight: 600,
              }}
              precision={1}
            />
          </Card>
        </Col>
        <Col sm={24} md={12} lg={6}>
          <Card
            title={t('overall-resolution-rate')}
            extra={
              <Tag icon={<CheckCircleOutlined />} color="purple">
                {t('today')}
              </Tag>
            }
            className="mb-4 rounded-lg shadow-md"
          >
            <Statistic
              value={data?.data1d?.[0]?.rate || 0}
              suffix="%"
              prefix={
                <CheckCircleOutlined
                  style={{ color: '#722ed1', fontSize: 20 }}
                />
              }
              valueStyle={{
                fontSize: '28px',
                color: '#722ed1',
                fontWeight: 600,
              }}
              precision={0}
            />
          </Card>
        </Col>
      </Row>
      <Card
        style={{
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          marginBottom: '24px',
        }}
        styles={{
          body: {
            padding: '24px',
          },
        }}
        title={
          <Row justify="space-between" align="middle">
            <span>{t('data-trend-analysis')}</span>
            <Select
              value={timeRange}
              onChange={setTimeRange}
              style={{ width: 140 }}
            >
              <Option value={ETimeRangeType.day7}>{t('nearly-7-days')}</Option>
              <Option value={ETimeRangeType.day15}>
                {t('nearly-15-days')}
              </Option>
            </Select>
          </Row>
        }
      >
        <Tabs
          defaultActiveKey={EDataChartsType.message_num}
          activeKey={activeTab}
          onChange={handleTabChange}
          tabPosition="top"
          style={{ marginBottom: '20px' }}
          size="large"
          destroyOnHidden={true}
        >
          <TabPane
            tab={
              <Space>
                <MessageOutlined /> {t('total-number-of-user-replies')}
              </Space>
            }
            key={EDataChartsType.message_num}
            forceRender={false} // 不强制渲染，让React管理
          >
            <Line {...messageNumChartConfig} />
          </TabPane>
          <TabPane
            tab={
              <Space>
                <UserOutlined /> {t('number-of-new-sessions-per-day')}
              </Space>
            }
            key={EDataChartsType.conversation_num}
            forceRender={false}
          >
            <Line {...conversationNumChartConfig} />
          </TabPane>
          <TabPane
            tab={
              <Space>
                <TeamOutlined />
                {t('average-number-of-user-responses')}
              </Space>
            }
            key={EDataChartsType.reply_avg}
            forceRender={false}
          >
            <Line {...replyAvgChartConfig} />
          </TabPane>
          <TabPane
            tab={
              <Space>
                <CheckCircleOutlined /> {t('overall-resolution-rate')}
              </Space>
            }
            key={EDataChartsType.rate}
            forceRender={false}
          >
            <Line {...rateChartConfig} />
          </TabPane>
        </Tabs>
      </Card>
    </Layout>
  );
};

export default Index;
