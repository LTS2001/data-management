import { IDateParams, ILossAiAnalysis } from '@/services/types/data-market';
import { Bar, Column, Funnel } from '@ant-design/plots';
import { Card, Table } from 'antd';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AiAnalysisCardTitle,
  AiAnalysisReference,
  ChartLoading,
  ModuleTitle,
} from '../common';
import { useAiCards, useChartResizeOnReady } from '../common/hooks';
import { useGetLossAnalysis } from './hooks';

const LossAnalysis: React.FC<{ dates: IDateParams }> = ({ dates }) => {
  const { t } = useTranslation('dashboard');
  const { data: chartsData, run, loading } = useGetLossAnalysis();
  const chartResizeOnReady = useChartResizeOnReady();
  const { aiData, cardStatus, triggerRequest } = useAiCards<ILossAiAnalysis>(
    'loss',
    chartsData,
  );
  useEffect(() => {
    run(dates);
  }, [dates]);
  const flowFunnelConfig = {
    data: chartsData?.flowLossFunnels,
    xField: 'stage',
    yField: 'bounceRate',
    shapeField: 'pyramid',
    label: {
      text: (d: any) => `${t(d.stage)}\n${d.bounceRate}%`,
    },
  };

  // 将 platformLosses 转换为图表所需格式
  const platformLossChartData = chartsData?.platformLosses.flatMap((item) => {
    const platformMap: Record<string, string> = {
      app: 'APP',
      h5: 'H5',
      web: 'PC',
    };
    const platform = platformMap[item.platform] || item.platform.toUpperCase();
    return [
      {
        platform,
        lossRate: item.second3BounceRate,
        name: t('loss-rate-3s'),
        field: 'second3BounceRate',
      },
      {
        platform,
        lossRate: item.second10BounceRate,
        name: t('loss-rate-10s'),
        field: 'second10BounceRate',
      },
      {
        platform,
        lossRate: item.loadBounceRate,
        name: t('load-bounce-rate'),
        field: 'loadBounceRate',
      },
    ];
  });

  const platformLossConfig = {
    data: platformLossChartData,
    xField: 'platform',
    yField: 'lossRate',
    colorField: 'name',
    group: {},
  };

  const channelLossConfig = {
    data: chartsData?.channelLosses.flatMap((item) => [
      {
        channel: item.channel,
        lossRate: item.loadBounceRate,
        name: t('load-bounce-rate'),
        field: 'loadBounceRate',
      },
      {
        channel: item.channel,
        lossRate: item.lossRate3s,
        name: t('loss-rate-3s'),
        field: 'lossRate3s',
      },
      {
        channel: item.channel,
        lossRate: item.lossRate10s,
        name: t('loss-rate-10s'),
        field: 'lossRate10s',
      },
    ]),
    xField: 'channel',
    yField: 'lossRate',
    colorField: 'name',
    group: {},
  };

  const pageWarningConfig = {
    data: chartsData?.pageWarnings,
    xField: 'path',
    yField: 'loseRate',
    legend: false,
    label: {
      text: 'loseRate',
      fill: 'white',
    },
    style: {
      // 自己的样式
      fill: '#e53730',
    },
  };

  return (
    <div className="space-y-6">
      <ModuleTitle
        serialNum="03"
        firstTitle={t('折损分析')}
        secondTitle={t('全站→分端→渠道→页面，精准定位流失根源。')}
      />
      {/* LEVEL 1 全站流量折损漏斗 */}
      <Card
        className="rounded-lg shadow-md"
        title={
          <AiAnalysisCardTitle
            level={1}
            color="rgb(59,130,245)"
            title={t('flow-loss-funnel')}
            status={cardStatus[1]}
            onChange={() => triggerRequest(1)}
          />
        }
      >
        <AiAnalysisReference
          status={cardStatus[1]}
          markdown={aiData?.flowLossFunnels?.en || ''}
        />
        <ChartLoading loading={loading}>
          <Funnel {...flowFunnelConfig} onReady={chartResizeOnReady} />
        </ChartLoading>
        <Table
          size="small"
          rowKey="stage"
          dataSource={chartsData?.flowLossFunnels}
          pagination={false}
          columns={[
            {
              title: t('funnel-stage'),
              dataIndex: 'stage',
              render: (value: string) => t(value),
            },
            {
              title: t('UV'),
              dataIndex: 'uv',
            },
            {
              title: t('loss-rate'),
              dataIndex: 'loseRate',
              render: (value: number) => `${value} %`,
            },
            {
              title: t('ring-ratio'),
              dataIndex: 'ringRatio',
              render: (value: number) => `${value} %`,
            },
            {
              title: t('yearRatio'),
              dataIndex: 'yearRatio',
              render: (value: number) => `${value} %`,
            },
          ]}
        />
      </Card>

      {/* LEVEL 2 分端折损对比 */}
      <Card
        className="rounded-lg shadow-md"
        title={
          <AiAnalysisCardTitle
            level={2}
            color="purple-inverse"
            title={t('platform-loss-comparison')}
            status={cardStatus[2]}
            onChange={() => triggerRequest(2)}
          />
        }
      >
        <AiAnalysisReference
          status={cardStatus[2]}
          markdown={aiData?.platformLosses?.en || ''}
        />
        <ChartLoading loading={loading}>
          <Column {...platformLossConfig} onReady={chartResizeOnReady} />
        </ChartLoading>
        <Table
          size="small"
          rowKey="platform"
          dataSource={chartsData?.platformLosses}
          pagination={false}
          columns={[
            {
              title: t('platform'),
              dataIndex: 'platform',
            },
            {
              title: t('流量占比（UV）'),
              dataIndex: 'loadUv',
            },
            {
              title: t('加载跳出率（UV）'),
              dataIndex: 'loadBounceRate',
              render: (value: number) => `${value} % `,
            },
            {
              title: t('3s跳出率（UV）'),
              dataIndex: 'second3BounceRate',
              render: (value: number) => `${value} % `,
            },
            {
              title: t('3-10s跳出率（UV）'),
              dataIndex: 'second10BounceRate',
              render: (value: number) => `${value} % `,
            },
          ]}
        />
      </Card>

      {/* LEVEL 3 渠道流量折损 */}
      <Card
        className="rounded-lg shadow-md"
        title={
          <AiAnalysisCardTitle
            level={3}
            color="orange-inverse"
            title={t('channel-attrition')}
            status={cardStatus[3]}
            onChange={() => triggerRequest(3)}
          />
        }
      >
        <AiAnalysisReference
          status={cardStatus[3]}
          markdown={aiData?.channelLosses?.en || ''}
        />
        <ChartLoading loading={loading}>
          <Column {...channelLossConfig} onReady={chartResizeOnReady} />
        </ChartLoading>
        <Table
          size="small"
          rowKey="channel"
          dataSource={chartsData?.channelLosses}
          pagination={false}
          columns={[
            {
              title: t('channel'),
              dataIndex: 'channel',
              render: (value: string) => t(value),
            },
            {
              title: t('流量占比（UV）'),
              dataIndex: 'percentage',
              render: (value: number) => `${value}%`,
            },
            {
              title: t('加载跳出率（UV）'),
              dataIndex: 'loadBounceRate',
              render: (value: number) => `${value}%`,
            },
            {
              title: t('3s跳出率（UV）'),
              dataIndex: 'lossRate3s',
              render: (value: number) => `${value}%`,
            },
            {
              title: t('3-10s跳出率（UV）'),
              dataIndex: 'lossRate10s',
              render: (value: number) => `${value}%`,
            },
          ]}
        />
      </Card>

      {/* LEVEL 4 高折损页面 Top10 */}
      <Card
        className="rounded-lg shadow-md"
        title={
          <AiAnalysisCardTitle
            level={4}
            color="red-inverse"
            title={t('high-bounce-pages')}
            status={cardStatus[4]}
            onChange={() => triggerRequest(4)}
          />
        }
      >
        <AiAnalysisReference
          status={cardStatus[4]}
          markdown={aiData?.pageWarnings?.en || ''}
        />
        <ChartLoading loading={loading}>
          <Bar {...pageWarningConfig} onReady={chartResizeOnReady} />
        </ChartLoading>
        <Table
          size="small"
          rowKey="path"
          dataSource={chartsData?.pageWarnings}
          pagination={false}
          columns={[
            {
              title: t('排名'),
              dataIndex: 'rank',
            },
            {
              title: t('page-path'),
              dataIndex: 'path',
            },
            {
              title: t('page-module'),
              dataIndex: 'module',
              render: (value: string) => t(value),
            },
            {
              title: t('loss-rate'),
              dataIndex: 'loseRate',
              render: (value: number) => `${value}%`,
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default LossAnalysis;
