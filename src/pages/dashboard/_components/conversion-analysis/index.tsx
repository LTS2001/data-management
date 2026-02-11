import {
  IDateParams,
  ITransitionAiAnalysis,
} from '@/services/types/data-market';
import { Funnel } from '@ant-design/plots';
import { Card, Col, Row, Table } from 'antd';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AiAnalysisCardTitle,
  AiAnalysisReference,
  ChartLoading,
  ModuleTitle,
} from '../common';
import { useAiCards, useChartResizeOnReady } from '../common/hooks';
import { useGetTransitionAnalysis } from './hooks';

const ConversionAnalysis: React.FC<{ dates: IDateParams }> = ({ dates }) => {
  const { t } = useTranslation('dashboard');
  const { data: chartsData, run, loading } = useGetTransitionAnalysis();
  useEffect(() => {
    run(dates);
  }, [dates]);
  const chartResizeOnReady = useChartResizeOnReady();
  const { aiData, cardStatus, triggerRequest } =
    useAiCards<ITransitionAiAnalysis>('transition', chartsData);

  // LEVEL 1 全站转化漏斗图配置
  const totalFunnelData = chartsData?.totalConversionFunnels.map((item) => ({
    stage: t(`transaction.${item.stage}`),
    value: item.userCount,
  }));
  const totalFunnelConfig = {
    data: totalFunnelData,
    xField: 'stage',
    yField: 'value',
    label: {
      style: {
        fontSize: 14,
      },
      text: (d: { stage: string; value: number }) =>
        `${d.stage}\n${d.value?.toLocaleString()}`,
    },
  };

  const totalTableData = chartsData?.totalConversionFunnels.map((item) => ({
    key: item.stage,
    stage: t(`transaction.${item.stage}`),
    userCount: item.userCount?.toLocaleString(),
    overallConversionRate: `${item.overallConversionRate.toFixed(1)}%`,
    ringRatio:
      item.ringRatio === 0
        ? '-'
        : `${item.ringRatio > 0 ? '+' : ''}${item.ringRatio.toFixed(1)}%`,
    yearRatio:
      item.yearRatio === 0
        ? '-'
        : `${item.yearRatio > 0 ? '+' : ''}${item.yearRatio.toFixed(1)}%`,
  }));

  const totalColumns = [
    {
      title: t('funnel-stage'),
      dataIndex: 'stage',
      key: 'stage',
    },
    {
      title: t('uv'),
      dataIndex: 'userCount',
      key: 'userCount',
    },
    {
      title: t('overall-conversion-rate'),
      dataIndex: 'overallConversionRate',
      key: 'overallConversionRate',
    },
    {
      title: t('ring-ratio'),
      dataIndex: 'ringRatio',
      key: 'ringRatio',
    },
    {
      title: t('year-ratio'),
      dataIndex: 'yearRatio',
      key: 'yearRatio',
    },
  ];

  // LEVEL 2 分端转化漏斗：三个端的单独漏斗 + 表格
  const platformFunnelConfigs = chartsData?.platformConversions.map((item) => {
    const data = [
      {
        stage: t('funnel-stage-entry-uv'),
        value: item.userCount,
      },
      {
        stage: t('login-registrations'),
        value: item.registerCount,
      },
      {
        stage: t('funnel-stage-retention-leads'),
        value: item.retentionCount,
      },
    ];

    return {
      platform: item.platform,
      config: {
        data,
        xField: 'stage',
        yField: 'value',
        isTransposed: true,
        dynamicHeight: true,
        legend: false,
        label: {
          position: 'center',
          formatter: (datum: any) =>
            `${datum.stage}\n${datum.value?.toLocaleString()}`,
        },
      },
    };
  });

  const platformTableData = chartsData?.platformConversions.map((item) => ({
    key: item.platform,
    platform: item.platform,
    userCount: item.userCount?.toLocaleString(),
    registerCount: item.registerCount?.toLocaleString(),
    retentionCount: item.retentionCount?.toLocaleString(),
    registerConversionRate: `${item.registerConversionRate.toFixed(1)}%`,
    retentionConversionRate: `${item.retentionConversionRate.toFixed(1)}%`,
  }));

  const platformColumns = [
    {
      title: t('platform'),
      dataIndex: 'platform',
      key: 'platform',
    },
    {
      title: t('uv'),
      dataIndex: 'userCount',
      key: 'userCount',
    },
    {
      title: t('login-conversion-rate'),
      dataIndex: 'registerConversionRate',
      key: 'registerConversionRate',
    },
    {
      title: t('retention-conversion-rate'),
      dataIndex: 'retentionConversionRate',
      key: 'retentionConversionRate',
    },
    {
      title: t('final-clue-count'),
      dataIndex: 'retentionCount',
      key: 'retentionCount',
    },
  ];
  if (!chartsData) return;
  return (
    <div className="space-y-6">
      <ModuleTitle
        serialNum="05"
        firstTitle={t('conversion-analysis')}
        secondTitle={t('conversion-analysis-desc')}
      />
      {/* LEVEL 1 全站转化漏斗 */}
      <Card
        className="rounded-lg shadow-md"
        title={
          <AiAnalysisCardTitle
            level={1}
            color="rgb(59,130,245)"
            title={t('total-conversion-funnel')}
            status={cardStatus[1]}
            onChange={() => triggerRequest(1)}
          />
        }
      >
        <AiAnalysisReference
          status={cardStatus[1]}
          markdown={aiData?.totalConversionFunnel?.en || ''}
        />
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <ChartLoading loading={loading}>
              <Funnel {...totalFunnelConfig} onReady={chartResizeOnReady} />
            </ChartLoading>
          </Col>
          <Col span={24}>
            <Table
              size="small"
              pagination={false}
              rowKey="key"
              dataSource={totalTableData}
              columns={totalColumns}
            />
          </Col>
        </Row>
      </Card>

      {/* LEVEL 2 分端转化效率 */}
      <Card
        className="rounded-lg shadow-md"
        title={
          <AiAnalysisCardTitle
            level={2}
            color="#785aec"
            title={t('platform-conversion-efficiency')}
            status={cardStatus[2]}
            onChange={() => triggerRequest(2)}
          />
        }
      >
        <AiAnalysisReference
          status={cardStatus[2]}
          markdown={aiData?.platformConversion?.en || ''}
        />
        <Row gutter={[16, 16]}>
          {platformFunnelConfigs?.map(({ platform, config }) => (
            <Col xs={24} md={8} key={platform}>
              <div className="mb-2 text-center font-semibold">
                {platform.toUpperCase()}
              </div>
              <ChartLoading loading={loading}>
                <Funnel {...config} onReady={chartResizeOnReady} />
              </ChartLoading>
            </Col>
          ))}
          <Col span={24}>
            <Table
              size="small"
              pagination={false}
              rowKey="key"
              dataSource={platformTableData}
              columns={platformColumns}
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ConversionAnalysis;
