import type {
  IDateParams,
  IGetInteractionAnalysis,
  IInteractionAiAnalysis,
} from '@/services/types/data-market';
import { DualAxes } from '@ant-design/plots';
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
import { useGetInteractionAnalysis } from './hooks';

const InteractionAnalysis: React.FC<{ dates: IDateParams }> = ({ dates }) => {
  const { t } = useTranslation('dashboard');
  const { data: chartsData, run, loading } = useGetInteractionAnalysis();
  const chartResizeOnReady = useChartResizeOnReady();
  const { aiData, cardStatus, triggerRequest } =
    useAiCards<IInteractionAiAnalysis>('interaction', chartsData);
  useEffect(() => {
    run(dates);
  }, [dates]);
  // #region  LEVEL 1 柱线图：柱 = 人均 PV，线 = 点赞数（使用 DualAxes 官方 geometryOptions 写法）
  const avgPvMetric = chartsData?.siteInteractionTrends?.find(
    (item) => item.index === '人均PV',
  );
  const likesMetric = chartsData?.siteInteractionTrends?.find(
    (item) => item.index === '点赞',
  );
  const commentsMetric = chartsData?.siteInteractionTrends?.find(
    (item) => item.index === '评论',
  );
  const registrationsMetric = chartsData?.siteInteractionTrends?.find(
    (item) => item.index === '注册',
  );
  const leadsMetric = chartsData?.siteInteractionTrends?.find(
    (item) => item.index === '留资',
  );

  const trendBarData =
    avgPvMetric?.dates?.map((date, idx) => ({
      date,
      value: avgPvMetric.values[idx],
      type: t('avg-pv-per-person'),
    })) || [];

  const buildRateSeries = (
    metric?: IGetInteractionAnalysis['siteInteractionTrends'][0],
    nameLabel?: string,
  ) => {
    if (!metric) return [];
    return metric.dates.map((date, idx) => ({
      date,
      count: metric.values[idx],
      name: nameLabel,
    }));
  };

  const trendLineData = [
    ...buildRateSeries(registrationsMetric, t('register-rate')),
    ...buildRateSeries(leadsMetric, t('retention-rate')),
    ...buildRateSeries(likesMetric, t('like-rate')),
    ...buildRateSeries(commentsMetric, t('comment-rate')),
  ];

  const trendConfig = {
    xField: 'date',
    marginTop: 60,
    tooltip: {
      items: [
        (item: {
          name?: string;
          count?: number;
          type?: string;
          value?: number;
        }) => {
          if (item.name) {
            return {
              name: item.name,
              value:
                typeof item.count === 'number'
                  ? `${item.count?.toFixed(2)}%`
                  : '-',
            };
          }
          return {
            name: item.type,
            value:
              typeof item.value === 'number' ? item.value?.toFixed(2) : '-',
          };
        },
      ],
    },
    children: [
      {
        data: trendBarData,
        type: 'interval',
        yField: 'value',
        colorField: 'type',
        group: true,
        style: {
          maxWidth: 50,
        },
        interaction: {
          elementHighlight: {
            background: true,
          },
        },
      },
      {
        data: trendLineData,
        type: 'line',
        yField: 'count',
        colorField: 'name',
        style: {
          lineWidth: 2,
        },
        axis: {
          x: {
            line: true,
          },
          y: {
            position: 'right',
            title: t('rate'),
            titlePosition: 'top',
            titleTransform: 'rotate(0)',
          },
        },
        scale: {
          series: {
            independent: true,
          },
        },
        interaction: {
          tooltip: {
            crosshairs: false,
            marker: false,
          },
        },
      },
    ],
    legend: {
      color: {
        position: 'bottom',
        layout: {
          justifyContent: 'center',
        },
        // 区分柱状图与折线图的图例形状
        itemMarker: (_name: string, index: number) => {
          return index === 0 ? 'square' : 'smooth';
        },
      },
    },
  };
  // #endregion

  // #region LEVEL 2 柱线 + 多折线：柱 = 人均 PV，线 = 注册率 / 留存率
  const platformBarData = chartsData?.platformInteractions.map((item) => ({
    platform: item.platform.toUpperCase(),
    value: item.avgPv,
    type: t('avg-pv-per-person'),
  }));

  const platformRateData = chartsData?.platformInteractions.flatMap((item) => [
    {
      platform: item.platform.toUpperCase(),
      count: item.registerRate,
      name: t('register-rate'),
    },
    {
      platform: item.platform.toUpperCase(),
      count: item.retentionRate,
      name: t('retention-rate'),
    },
  ]);

  const platformConfig = {
    xField: 'platform',
    marginTop: 60,
    tooltip: {
      items: [
        (item: {
          name?: string;
          count?: number;
          type?: string;
          value?: number;
        }) => {
          if (item.name) {
            return {
              name: item.name,
              value:
                typeof item.count === 'number'
                  ? `${item.count?.toFixed(2)}%`
                  : '-',
            };
          }
          return {
            name: item.type,
            value:
              typeof item.value === 'number' ? item.value?.toFixed(2) : '-',
          };
        },
      ],
    },
    children: [
      {
        data: platformBarData,
        type: 'interval',
        yField: 'value',
        colorField: 'type',
        style: {
          maxWidth: 200,
        },
        axis: {
          y: {
            position: 'left',
            title: t('magnitude'),
            titlePosition: 'top',
            titleTransform: 'rotate(0)',
          },
        },
        interaction: {
          elementHighlight: {
            background: true,
          },
        },
      },
      {
        data: platformRateData,
        type: 'line',
        yField: 'count',
        colorField: 'name',
        style: {
          lineWidth: 2,
        },
        axis: {
          y: {
            position: 'right',
            title: t('rate'),
            titlePosition: 'top',
            titleTransform: 'rotate(0)',
          },
        },
        scale: {
          series: {
            independent: true,
          },
        },
        interaction: {
          tooltip: {
            crosshairs: false,
            marker: false,
          },
        },
      },
    ],
    legend: {
      color: {
        position: 'bottom',
        layout: {
          justifyContent: 'center',
        },
        // 柱状为方块，折线为线型，和卡片一保持一致
        itemMarker: (_name: string, index: number) => {
          return index === 0 ? 'square' : 'smooth';
        },
      },
    },
  };
  // #endregion

  // #region LEVEL 3 柱线 + 多折线：和 LEVEL 2 一致的样式（按模块维度）
  const moduleBarData = chartsData?.moduleInteractions.map((item) => ({
    module: t(item.module),
    value: item.avgPv,
    type: t('avg-pv-per-person'),
  }));

  const moduleRateData = chartsData?.moduleInteractions.flatMap((item) => [
    {
      module: t(item.module),
      count: item.registerRate,
      name: t('register-rate'),
    },
    {
      module: t(item.module),
      count: item.retentionRate * 100,
      name: t('retention-rate'),
    },
  ]);

  const moduleConfig = {
    xField: 'module',
    marginTop: 60,
    tooltip: {
      items: [
        (item: {
          name?: string;
          count?: number;
          type?: string;
          value?: number;
        }) => {
          if (item.name) {
            return {
              name: item.name,
              value:
                typeof item.count === 'number'
                  ? `${item.count?.toFixed(2)}%`
                  : '-',
            };
          }
          return {
            name: item.type,
            value:
              typeof item.value === 'number' ? item.value?.toFixed(2) : '-',
          };
        },
      ],
    },
    children: [
      {
        data: moduleBarData,
        type: 'interval',
        yField: 'value',
        colorField: 'type',
        style: {
          maxWidth: 200,
        },
        axis: {
          y: {
            position: 'left',
            title: t('magnitude'),
            titlePosition: 'top',
            titleTransform: 'rotate(0)',
          },
        },
        interaction: {
          elementHighlight: {
            background: true,
          },
        },
      },
      {
        data: moduleRateData,
        type: 'line',
        yField: 'count',
        colorField: 'name',
        style: {
          lineWidth: 2,
        },
        axis: {
          y: {
            position: 'right',
            title: t('rate'),
            titlePosition: 'top',
            titleTransform: 'rotate(0)',
          },
        },
        scale: {
          series: {
            independent: true,
          },
        },
        interaction: {
          tooltip: {
            crosshairs: false,
            marker: false,
          },
        },
      },
    ],
    legend: {
      color: {
        position: 'bottom',
        layout: {
          justifyContent: 'center',
        },
        // 柱状为方块，折线为线型，与 LEVEL 2 一致
        itemMarker: (name: string, index: number) => {
          if (index === 0 || name === t('avg-pv-per-person')) {
            return 'square';
          }
          return 'smooth';
        },
      },
    },
  };
  // #endregion

  return (
    <div className="space-y-6">
      <ModuleTitle
        serialNum="04"
        firstTitle={t('互动分析')}
        secondTitle={t('核心指标：人均PV/点赞/评论/注册量及率/留资数及率')}
      />
      {/* LEVEL 1 全站互动趋势 */}
      <Card
        className="rounded-lg shadow-md"
        title={
          <AiAnalysisCardTitle
            level={1}
            color="rgb(59,130,245)"
            title={t('site-interaction-trend')}
            status={cardStatus[1]}
            onChange={() => triggerRequest(1)}
          />
        }
      >
        <AiAnalysisReference
          status={cardStatus[1]}
          markdown={aiData?.siteInteraction?.en || ''}
        />
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <ChartLoading loading={loading}>
              <DualAxes {...trendConfig} onReady={chartResizeOnReady} />
            </ChartLoading>
          </Col>
          <Col span={24}>
            <Table
              size="small"
              rowKey="index"
              pagination={false}
              dataSource={chartsData?.siteInteractionTrends || []}
              columns={[
                {
                  title: t('metric'),
                  dataIndex: 'index',
                  render: (value: string) => t(value),
                },
                {
                  title: t('daily-avg'),
                  dataIndex: 'dailyAvg',
                  render: (value: number) =>
                    value ? `${value.toFixed(1)}` : '-',
                },
                {
                  title: t('ring-ratio'),
                  dataIndex: 'ringRatio',
                  render: (value: number) =>
                    `${value > 0 ? '+' : ''}${value.toFixed(1)}%`,
                },
                {
                  title: t('year-ratio'),
                  dataIndex: 'yearRatio',
                  render: (value: number) =>
                    `${value > 0 ? '+' : ''}${value.toFixed(1)}%`,
                },
                {
                  title: t('conversion-rate'),
                  dataIndex: 'conversionRate',
                  render: (value: number) =>
                    value ? `${value.toFixed(2)}%` : '-',
                },
              ]}
            />
          </Col>
        </Row>
      </Card>

      {/* LEVEL 2 分端互动对比 */}
      <Card
        className="rounded-lg shadow-md"
        title={
          <AiAnalysisCardTitle
            level={2}
            color="rgb(139,91,246)"
            title={t('platform-interaction-comparison')}
            status={cardStatus[2]}
            onChange={() => triggerRequest(2)}
          />
        }
      >
        <AiAnalysisReference
          status={cardStatus[2]}
          markdown={aiData?.platformInteraction?.en || ''}
        />
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <ChartLoading loading={loading}>
              <DualAxes {...platformConfig} onReady={chartResizeOnReady} />
            </ChartLoading>
          </Col>
          <Col span={24}>
            <Table
              size="small"
              rowKey="platform"
              pagination={false}
              dataSource={chartsData?.platformInteractions || []}
              columns={[
                {
                  title: t('platform'),
                  dataIndex: 'platform',
                  render: (value: string) => value.toUpperCase(),
                },
                {
                  title: t('avg-pv-per-person'),
                  dataIndex: 'avgPv',
                  render: (value) =>
                    typeof value === 'number' ? value.toFixed(1) : '-',
                },
                {
                  title: t('likes'),
                  dataIndex: 'likeCount',
                  render: (value) =>
                    typeof value === 'number' ? value.toLocaleString() : '-',
                },
                {
                  title: t('comments'),
                  dataIndex: 'commentCount',
                  render: (value) =>
                    typeof value === 'number' ? value.toLocaleString() : '-',
                },
                {
                  title: t('registrations'),
                  dataIndex: 'registerCount',
                  render: (value: number, record) => (
                    <div>
                      <span>
                        {typeof value === 'number'
                          ? value.toLocaleString()
                          : '-'}
                      </span>
                      &nbsp;
                      <span className="text-blue-500">{`(${
                        typeof record?.registerRate === 'number'
                          ? `${record.registerRate.toFixed(2)}%`
                          : '-'
                      })`}</span>
                    </div>
                  ),
                },
                {
                  title: t('retention-count-rate'),
                  dataIndex: 'retentionCount',
                  render: (value: number, record) => (
                    <div>
                      <span>{`${
                        typeof value === 'number' ? value.toLocaleString() : '-'
                      }`}</span>
                      &nbsp;
                      <span className="text-green-500">{`(${
                        typeof record?.retentionRate === 'number'
                          ? `${(record.retentionRate * 100).toFixed(2)}%`
                          : '-'
                      })`}</span>
                    </div>
                  ),
                },
              ]}
            />
          </Col>
        </Row>
      </Card>

      {/* LEVEL 3 模块互动表现 */}
      <Card
        className="rounded-lg shadow-md"
        title={
          <AiAnalysisCardTitle
            level={3}
            color="rgb(18,184,129)"
            title={t('module-interaction-performance')}
            status={cardStatus[3]}
            onChange={() => triggerRequest(3)}
          />
        }
      >
        <AiAnalysisReference
          status={cardStatus[3]}
          markdown={aiData?.moduleInteraction?.en || ''}
        />
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <ChartLoading loading={loading}>
              <DualAxes {...moduleConfig} onReady={chartResizeOnReady} />
            </ChartLoading>
          </Col>
          <Col span={24}>
            <Table
              size="small"
              rowKey="module"
              pagination={false}
              dataSource={chartsData?.moduleInteractions || []}
              columns={[
                {
                  title: t('page-module'),
                  dataIndex: 'module',
                  render: (value: string) => t(value),
                },
                {
                  title: t('avg-pv-per-person'),
                  dataIndex: 'avgPv',
                },
                {
                  title: t('likes'),
                  dataIndex: 'likeCount',
                  render: (value) =>
                    typeof value === 'number' ? value.toLocaleString() : '-',
                },
                {
                  title: t('comments'),
                  dataIndex: 'commentCount',
                  render: (value) =>
                    typeof value === 'number' ? value.toLocaleString() : '-',
                },
                {
                  title: t('registrations'),
                  dataIndex: 'registerCount',
                  render: (value: number, record) => (
                    <div>
                      <span>
                        {typeof value === 'number'
                          ? value.toLocaleString()
                          : '-'}
                      </span>
                      &nbsp;
                      <span className="text-blue-500">{`(${
                        typeof record?.registerRate === 'number'
                          ? `${record.registerRate.toFixed(2)}%`
                          : '-'
                      })`}</span>
                    </div>
                  ),
                },
                {
                  title: t('retention-count-rate'),
                  dataIndex: 'retentionCount',
                  render: (value: number, record) => (
                    <div>
                      <span>
                        {typeof value === 'number'
                          ? value.toLocaleString()
                          : '-'}
                      </span>
                      &nbsp;
                      <span className="text-blue-500">{`(${
                        typeof record?.retentionRate === 'number'
                          ? `${(record.retentionRate * 100).toFixed(2)}%`
                          : '-'
                      })`}</span>
                    </div>
                  ),
                },
              ]}
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default InteractionAnalysis;
