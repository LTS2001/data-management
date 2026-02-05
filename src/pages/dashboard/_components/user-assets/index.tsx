import {
  IDateParams,
  IUserAssetsAiAnalysis,
} from '@/services/types/data-market';
import { Area, Line, Pie } from '@ant-design/plots';
import { Card, Table } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AiAnalysisCardTitle,
  AiAnalysisReference,
  ChartLoading,
  ModuleTitle,
} from '../common';
import { useAiCards, useChartResizeOnReady } from '../common/hooks';
import { useGetUserAssetsAnalysis } from './hooks';

export default function UserAssets({ dates }: { dates: IDateParams }) {
  const { t } = useTranslation('dashboard');
  const { data: chartsData, run, loading } = useGetUserAssetsAnalysis();
  const chartResizeOnReady = useChartResizeOnReady();
  const { aiData, cardStatus, triggerRequest } =
    useAiCards<IUserAssetsAiAnalysis>('user', chartsData);
  useEffect(() => {
    run(dates);
  }, [dates]);
  // 处理用户分层资产堆叠面积图数据
  const assetsChartData = chartsData?.userLayeredAssets.flatMap((asset) =>
    asset.dates.map((date, index) => ({
      date,
      value: parseFloat(asset.values[index]),
      type: asset.type,
    })),
  );

  // 处理地区用户访问量线图数据：多条线
  const regionChartData = chartsData?.regionItems.flatMap((region) =>
    region.dates.map((date, index) => ({
      date,
      value: parseFloat(region.values[index]),
      region: region.region,
    })),
  );

  // 处理饼图数据：从userGroups提取
  const pieChartData = chartsData?.userGroups.map((item) => ({
    type: item.userGroup,
    value: item.uv,
  }));

  const assetsAreaConfig = {
    data: assetsChartData,
    xField: 'date',
    yField: 'value',
    colorField: 'type',
    height: 400,
    legend: {
      color: {
        position: 'bottom',
        layout: {
          justifyContent: 'center',
        },
      },
    },
  };

  const regionLineConfig = {
    data: regionChartData,
    xField: 'date',
    yField: 'value',
    colorField: 'region',
    height: 400,
    legend: {
      color: {
        position: 'bottom',
        layout: {
          justifyContent: 'center',
        },
      },
    },
  };

  const pieConfig = {
    data: pieChartData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    innerRadius: 0.5,
    label: {
      text: 'type',
      position: 'outside',
      transform: [{ type: 'overlapDodgeY' }],
    },
    height: 400,
    legend: {
      color: {
        position: 'bottom',
        layout: {
          justifyContent: 'center',
        },
      },
    },
  };

  const assetsColumns = [
    {
      title: t('asset-type'),
      dataIndex: 'type',
      key: 'type',
      render: (value: string) => t(value),
    },
    {
      title: t('accumulated-users'),
      dataIndex: 'totalUsers',
      key: 'totalUsers',
      render: (value: number) => value?.toLocaleString(),
    },
    {
      title: t('ring-ratio'),
      dataIndex: 'ringRatio',
      key: 'ringRatio',
      render: (value: number) => `${value > 0 ? '+' : ''}${value?.toFixed(1)}%`,
    },
    {
      title: t('year-ratio'),
      dataIndex: 'yearRatio',
      key: 'yearRatio',
      render: (value: number) => `${value > 0 ? '+' : ''}${value?.toFixed(1)}%`,
    },
    {
      title: t('daily-new-additions'),
      dataIndex: 'dailyAvg',
      key: 'dailyAvg',
      render: (value: number) => `+${value?.toLocaleString()}`,
    },
    {
      title: t('penetration-rate'),
      dataIndex: 'percentage',
      key: 'percentage',
      render: (value: number) => `${value?.toFixed(1)}%`,
    },
  ];

  const regionColumns = [
    {
      title: t('region'),
      dataIndex: 'region',
      key: 'region',
      render: (value: string) => t(value) || value,
    },
    {
      title: t('current-traffic-uv'),
      dataIndex: 'uv',
      key: 'uv',
      render: (value: number) => value?.toLocaleString(),
    },
    {
      title: t('traffic-percentage'),
      dataIndex: 'percentage',
      key: 'percentage',
      render: (value: number) => `${value?.toFixed(1)}%`,
    },
    {
      title: t('ring-ratio'),
      dataIndex: 'ringRatio',
      key: 'ringRatio',
      render: (value: number) => `${value > 0 ? '+' : ''}${value?.toFixed(1)}%`,
    },
    {
      title: t('year-ratio'),
      dataIndex: 'yearRatio',
      key: 'yearRatio',
      render: (value: number) => `${value > 0 ? '+' : ''}${value?.toFixed(1)}%`,
    },
    {
      title: t('daily-new-additions'),
      dataIndex: 'dailyAvg',
      key: 'dailyAvg',
      render: (value: number) => `+${value?.toLocaleString()}`,
    },
  ];

  const groupColumns = [
    {
      title: t('segment-group'),
      dataIndex: 'userGroup',
      key: 'userGroup',
      render: (value: string) => t(value),
    },
    {
      title: t('coverage'),
      dataIndex: 'scope',
      key: 'scope',
      render: (value: string) => t(value) || value,
    },
    {
      title: t('user-count'),
      dataIndex: 'uv',
      key: 'uv',
      render: (value: number) => value?.toLocaleString(),
    },
    {
      title: t('proportion'),
      dataIndex: 'percentage',
      key: 'percentage',
      render: (value: number) => `${value?.toFixed(1)}%`,
    },
    {
      title: t('ring-ratio'),
      dataIndex: 'ringRatio',
      key: 'ringRatio',
      render: (value: number) => `${value > 0 ? '+' : ''}${value?.toFixed(1)}%`,
    },
    {
      title: t('year-ratio'),
      dataIndex: 'yearRatio',
      key: 'yearRatio',
      render: (value: number) => `${value > 0 ? '+' : ''}${value?.toFixed(1)}%`,
    },
    {
      title: t('daily-new-additions'),
      dataIndex: 'dailyAvg',
      key: 'dailyAvg',
      render: (value: number) => `+${value?.toLocaleString()}`,
    },
  ];

  return (
    <div className="space-y-6">
      <ModuleTitle
        serialNum="01"
        firstTitle={t('user-asset-overview')}
        secondTitle={t('存量池监控：注册、认证及车主用户的区域分布与健康度。')}
      />
      {/* 用户分层资产统计 */}
      <Card
        className="rounded-lg shadow-md"
        title={
          <AiAnalysisCardTitle
            level={1}
            color="rgb(59,130,245)"
            title={t('user-tiered-asset-statistics')}
            status={cardStatus[1]}
            onChange={() => triggerRequest(1)}
          />
        }
      >
        <AiAnalysisReference
          status={cardStatus[1]}
          markdown={aiData?.userLayeredAssets?.en || ''}
        />
        <ChartLoading loading={loading}>
          <Area {...assetsAreaConfig} onReady={chartResizeOnReady} />
        </ChartLoading>
        <Table
          className="mt-4"
          size="small"
          columns={assetsColumns}
          dataSource={chartsData?.userLayeredAssets}
          rowKey="type"
          pagination={false}
        />
      </Card>

      {/* 区域流量资产趋势 */}
      <Card
        className="rounded-lg shadow-md"
        title={
          <AiAnalysisCardTitle
            level={2}
            color="rgb(59,130,245)"
            title={t('regional-traffic-asset-trends')}
            status={cardStatus[2]}
            onChange={() => triggerRequest(2)}
          />
        }
      >
        <AiAnalysisReference
          status={cardStatus[2]}
          markdown={aiData?.regionItems?.en || ''}
        />
        <ChartLoading loading={loading}>
          <Line {...regionLineConfig} onReady={chartResizeOnReady} />
        </ChartLoading>
        <Table
          className="mt-4"
          size="small"
          columns={regionColumns}
          dataSource={chartsData?.regionItems}
          rowKey="region"
          pagination={false}
        />
      </Card>

      {/* 用户群体划分 */}
      <Card
        className="rounded-lg shadow-md"
        title={
          <AiAnalysisCardTitle
            level={3}
            color="rgb(59,130,245)"
            title={t('user-segmentation')}
            status={cardStatus[3]}
            onChange={() => triggerRequest(3)}
          />
        }
      >
        <AiAnalysisReference
          status={cardStatus[3]}
          markdown={aiData?.userGroups?.en || ''}
        />
        <ChartLoading loading={loading}>
          <Pie {...pieConfig} onReady={chartResizeOnReady} />
        </ChartLoading>
        <Table
          className="mt-4"
          size="small"
          columns={groupColumns}
          dataSource={chartsData?.userGroups}
          rowKey="userGroup"
          pagination={false}
        />
      </Card>
    </div>
  );
}
