import TimeSelect, { ETimeRangeType } from '@/components/basic/time-select';
import { IContactAnalysisRes } from '@/services/types/concat.type';
import { Bar, Line, Pie } from '@ant-design/plots';
import {
  Card,
  Col,
  Layout,
  Progress,
  Row,
  Statistic,
  Tag,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetContactAnalysisData } from './hooks';
import './index.css';

const Index = () => {
  const { t } = useTranslation('concat');

  const data = useGetContactAnalysisData();
  const [currentData, setCurrentData] = useState<IContactAnalysisRes | null>(
    null,
  );
  const [timeRange, setTimeRange] = useState<ETimeRangeType>(
    ETimeRangeType.day7,
  );

  useEffect(() => {
    if (!data) return;
    setCurrentData(
      timeRange === ETimeRangeType.day7 ? data.data.data7d : data.data.data15d,
    );
  }, [timeRange, data]);

  // 可按需替换为真实数据
  const { Title } = Typography;

  const pieData =
    currentData?.intents?.map((item) => ({
      type: item.tag,
      value: item.percentage,
    })) ?? [];
  const maxValue = Math.max(...(pieData?.map((item) => item.value) || []));
  const maxType = pieData?.find((item) => item.value === maxValue)?.type;
  const pieConfig = {
    data: pieData,
    angleField: 'value',
    colorField: 'type',
    innerRadius: 0.6,
    height: 360,
    label: {
      text: 'value',
      style: {
        fontWeight: 'bold',
      },
    },
    tooltip: {
      title: 'type',
      items: ['value'],
    },
    legend: {
      color: {
        title: false,
        position: 'right',
        crossPadding: 5,
      },
    },
    annotations: [
      {
        type: 'text',
        style: {
          text: maxValue + '%',
          x: '50%',
          y: '50%',
          textAlign: 'center',
          fontSize: 35,
          fontStyle: 'bold',
        },
      },
      {
        type: 'text',
        style: {
          text: maxType,
          x: '50%',
          y: '58%',
          textAlign: 'center',
          fontSize: 14,
          color: '#a8adb8',
        },
      },
    ],
  };

  const trendconfig = {
    data:
      currentData?.trend?.labels?.map((label, index) => ({
        day: label,
        value: currentData.trend.values[index],
      })) ?? [],
    xField: 'day',
    yField: 'value',
    height: 360,
    shapeField: 'smooth',
    scale: {
      y: {
        domainMin: 0,
      },
    },
    interaction: {
      tooltip: {
        marker: false,
      },
    },
    style: {
      lineWidth: 2,
    },
    point: {
      shapeField: 'circle',
      sizeField: 4,
    },
  };
  const ratingConfig = {
    data:
      currentData?.brands?.map((item) => ({
        labelName: item.brand,
        value: item.inquiries,
      })) ?? [],
    xField: 'labelName',
    yField: 'value',
    height: 360,
    style: {
      maxWidth: 20,
    },
    label: {
      position: 'right',
      textAlign: 'left',
      text: (d: any) => d.value,
      style: {
        fill: '#000000',
        fontSize: 12,
      },
    },
    axis: {
      x: {
        line: true,
      },
      y: {
        line: true,
      },
    },
  };

  return (
    <Layout>
      <Row>
        <Card
          style={{
            width: '100%',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            marginBottom: '24px',
          }}
          styles={{
            body: {
              padding: '24px',
              backgroundColor: '#f8f9fa',
            },
          }}
          title={
            <Row justify="space-between" align="middle">
              <span className="text-subtitle">
                {t('user-activity-analysis')}
              </span>
              <TimeSelect value={timeRange} onChange={setTimeRange} />
            </Row>
          }
        >
          <div className="mb-3">{t('performance-overview-description')}</div>
          <Row gutter={24}>
            <Col sm={24} md={12} lg={8}>
              <Card
                title={t('total-events')}
                extra={
                  <Tag
                    color={`${
                      currentData?.summary.events_change_percent &&
                      currentData?.summary.events_change_percent > 0
                        ? 'red'
                        : 'blue'
                    }`}
                  >
                    {currentData?.summary.events_change_percent &&
                    currentData?.summary.events_change_percent > 0
                      ? '+'
                      : ''}
                    {currentData?.summary.events_change_percent}%
                  </Tag>
                }
                className="mb-4 rounded-lg shadow-md min-h-48"
              >
                <Statistic
                  value={currentData?.summary.total_events}
                  valueStyle={{
                    fontSize: '28px',
                    color: '#000000',
                    fontWeight: 600,
                    marginTop: '-10px',
                  }}
                  precision={0}
                />
                <span className="text-gray-500 text-sm">
                  {t('interaction-count-description')}
                </span>
              </Card>
            </Col>
            <Col sm={24} md={12} lg={8}>
              <Card
                title={t('unique-users')}
                extra={
                  <Tag
                    color={`${
                      currentData?.summary.users_change_percent &&
                      currentData?.summary.users_change_percent > 0
                        ? 'red'
                        : 'blue'
                    }`}
                  >
                    {currentData?.summary.users_change_percent &&
                    currentData?.summary.users_change_percent > 0
                      ? '+'
                      : ''}
                    {currentData?.summary.users_change_percent}%
                  </Tag>
                }
                className="mb-4 rounded-lg shadow-md min-h-48"
              >
                <Statistic
                  value={currentData?.summary.unique_users}
                  valueStyle={{
                    fontSize: '28px',
                    color: '#000000',
                    fontWeight: 600,
                    marginTop: '-10px',
                  }}
                  precision={0}
                />
                <span className="text-gray-500 text-sm">
                  {t('different-active-sessions')}
                </span>
              </Card>
            </Col>
            <Col sm={24} md={12} lg={8}>
              <Card
                title={t('primary-intent')}
                className="mb-4 rounded-lg shadow-md min-h-48"
              >
                <Statistic
                  value={currentData?.summary.top_intent}
                  valueStyle={{
                    fontSize: '28px',
                    color: '#000000',
                    fontWeight: 600,
                    marginTop: '-10px',
                  }}
                  precision={0}
                />
                <div className="text-gray-500 text-sm flex gap-1">
                  <span>{t('accounting-for-all-actions')}</span>
                  <span>{currentData?.summary.top_intent_percentage}%</span>
                </div>
              </Card>
            </Col>
          </Row>

          <Row
            gutter={[16, 16]}
            style={{ display: 'flex', alignItems: 'stretch', marginTop: '8px' }}
          >
            <Col xs={24} md={12} style={{ display: 'flex' }}>
              <div
                className="rounded-2xl p-3 bg-white"
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div className="text-subtitle">{t('intent-distribution')}</div>
                <div className="text-body-strong my-2">
                  {t('intent-distribution-description')}
                </div>
                {currentData?.intents?.length ? (
                  <Pie {...pieConfig} />
                ) : (
                  <div className="text-center text-gray-500 my-10">
                    {t('no-data')}
                  </div>
                )}
              </div>
            </Col>

            <Col xs={24} md={12} style={{ display: 'flex' }}>
              <div
                className="rounded-2xl p-3 bg-white"
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div className="mb-2 text-subtitle">
                  {t('engagement-timeline')}
                </div>
                <div className="text-body-strong my-2">
                  {t('engagement-timeline-description')}
                </div>
                {currentData?.trend?.labels?.length ? (
                  <Line {...trendconfig} />
                ) : (
                  <div className="text-center text-gray-500 my-10">
                    {t('no-data')}
                  </div>
                )}
              </div>
            </Col>
          </Row>
          <Title level={2} style={{ marginTop: '20px' }}>
            {t('target-market-and-product-segmentation')}
          </Title>
          <div>{t('target-market-and-product-segmentation-description')}</div>
          <Row
            gutter={[16, 16]}
            style={{
              marginTop: '24px',
              display: 'flex',
              alignItems: 'stretch',
            }}
          >
            <Col xs={24} md={12} style={{ display: 'flex' }}>
              <div
                style={{
                  borderRadius: '15px',
                  padding: '15px',
                  backgroundColor: '#ffffff',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div className="text-subtitle">{t('top-5-car-brands')}</div>
                <div className="text-body-strong my-2">
                  {t('top-5-car-brands-description')}
                </div>
                <Bar {...ratingConfig} />
              </div>
            </Col>

            <Col xs={24} md={12} style={{ display: 'flex' }}>
              <div className="w-full p-3 rounded-2xl flex flex-col bg-white">
                <div className="mb-2 text-subtitle">
                  {t('region-activity-ranking')}
                </div>
                <div className="text-body-strong my-2 mb-6">
                  {t('region-activity-ranking-description')}
                </div>
                <div className="flex flex-col flex-1 justify-between pb-10">
                  {currentData?.regions?.length ? (
                    (() => {
                      const totalEvents =
                        currentData?.regions?.reduce(
                          (sum, item) => sum + (item.events || 0),
                          0,
                        ) || 1;
                      return (
                        currentData?.regions?.map((item, index) => {
                          const percent = Math.round(
                            (item.events / totalEvents) * 100,
                          );
                          const rank = index + 1;
                          const isFirst = rank === 1;
                          return (
                            <div
                              key={item.country}
                              className="flex gap-2 items-start"
                            >
                              <div
                                className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-[5px] ${
                                  isFirst
                                    ? 'bg-[#2989ff] text-white'
                                    : 'bg-gray-200 text-black'
                                }`}
                              >
                                {rank}
                              </div>
                              <div className="flex flex-col  w-full">
                                <div className="flex justify-between">
                                  <p className="font-bold">{item.country}</p>
                                  <p className="font-bold text-[#2989ff]">
                                    {item.events}
                                  </p>
                                </div>
                                <Progress percent={percent} showInfo={false} />
                              </div>
                            </div>
                          );
                        }) || []
                      );
                    })()
                  ) : (
                    <div className="text-center text-gray-500 my-10">
                      {t('no-data')}
                    </div>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      </Row>
    </Layout>
  );
};

export default Index;
