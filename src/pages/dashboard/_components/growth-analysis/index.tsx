import {
  IDateParams,
  IGetGrowthAnalysis,
  IGrowthAiAnalysis,
} from '@/services/types/data-market';
import { DualAxes, Line, Pie } from '@ant-design/plots';
import { Card, Table } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AiAnalysisCardTitle,
  AiAnalysisReference,
  ChartLoading,
  ModuleTitle,
} from '../common';
import { useAiCards, useChartResizeOnReady } from '../common/hooks';
import { useGetGrowthAnalysis } from './hooks';

export default function GrowthAnalysis({ dates }: { dates: IDateParams }) {
  const { t } = useTranslation('dashboard');
  const { data: chartsData, run, loading } = useGetGrowthAnalysis();
  useEffect(() => {
    run(dates);
  }, [dates]);
  const chartResizeOnReady = useChartResizeOnReady();
  const { aiData, cardStatus, triggerRequest } = useAiCards<IGrowthAiAnalysis>(
    'growth',
    chartsData,
  );
  const [activePlatformTab, setActivePlatformTab] = useState('ALL');
  const [activeModuleBreakdownTab, setActiveModuleBreakdownTab] =
    useState('all');

  // #region 全站增长大盘
  const totalGrowths = chartsData?.totalGrowths ?? [];
  const barData = totalGrowths
    .filter((item) => item.index === 'UV' || item.index === '有效浏览UV')
    .flatMap((item) =>
      item.dates.map((date, i) => ({
        date,
        count: parseFloat(item.values[i] ?? '0'),
        type: item.index,
      })),
    );
  const lineData = totalGrowths
    .filter(
      (item) =>
        item.index === '次日留存' ||
        item.index === '7日留存' ||
        item.index === '30日留存',
    )
    .flatMap((item) =>
      item.dates.map((date, i) => ({
        date,
        rate: parseFloat(item.values[i] ?? '0'),
        type: item.index,
      })),
    );
  const totalGrowthConfig = {
    xField: 'date',
    legend: {
      color: {
        position: 'bottom',
        layout: {
          justifyContent: 'center',
        },
      },
    },
    children: [
      {
        data: barData,
        type: 'interval',
        yField: 'count',
        colorField: 'type',
        style: { maxWidth: 200 },
        transform: [{ type: 'dodgeX', padding: 0.01 }],
        axis: {
          y: {
            position: 'left',
            title: 'UV',
            titlePosition: 'bottom',
            titleTransform: 'rotate(0)',
          },
        },
      },
      {
        data: lineData,
        type: 'line',
        yField: 'rate',
        colorField: 'type',
        style: { lineWidth: 2 },
        axis: {
          y: {
            position: 'right',
            title: t('留存率'),
            titleTransform: 'rotate(0)',
            titlePosition: 'bottom',
          },
        },
      },
    ],
  };
  const totalColumns = [
    { title: t('指标'), dataIndex: 'index', key: 'index' },
    {
      title: t('数值'),
      dataIndex: 'number',
      key: 'number',
      render: (v: number) => (typeof v === 'number' ? `${v.toFixed(2)}` : '-'),
    },
    {
      title: t('流量占比'),
      dataIndex: 'percentage',
      key: 'percentage',
      render: (v: number) => (typeof v === 'number' ? `${v.toFixed(2)}%` : '-'),
    },
    {
      title: t('环比'),
      dataIndex: 'ringRatio',
      key: 'ringRatio',
      render: (v: number) => (typeof v === 'number' ? `${v.toFixed(2)}%` : '-'),
    },
    {
      title: t('同比'),
      dataIndex: 'yearRatio',
      key: 'yearRatio',
      render: (v: number) => (typeof v === 'number' ? `${v.toFixed(2)}%` : '-'),
    },
    {
      title: t('日均新增'),
      dataIndex: 'dailyTrend',
      key: 'dailyTrend',
      render: (v: number) => (typeof v === 'number' ? v : '-'),
    },
  ];
  // #endregion

  // #region 分端增长拆解
  const { platformChartConfig, currentPlatformTableData, isAllPlatform } =
    useMemo(() => {
      const isAll = activePlatformTab === 'ALL';
      let chartChildren = [];
      let xField = 'month';
      let tableData: any[] = [];

      if (isAll) {
        xField = 'platform';
        // Prepare chart data from platformTableData
        const pValues = chartsData?.platformBreakdowns || [];
        const pBar = pValues.flatMap((p) => [
          { platform: p.platform, count: p.uv, type: 'UV' },
          { platform: p.platform, count: p.validUv, type: '有效浏览UV' },
        ]);
        const pLine = pValues.flatMap((p) => [
          { platform: p.platform, rate: p.retentionRate1d, type: '次日留存' },
          { platform: p.platform, rate: p.retentionRate7d, type: '7日留存' },
          { platform: p.platform, rate: p.retentionRate30d, type: '30日留存' },
        ]);

        chartChildren = [
          {
            data: pBar,
            type: 'interval',
            yField: 'count',
            colorField: 'type',
            style: { maxWidth: 200 },
            transform: [{ type: 'dodgeX', padding: 0 }],
            axis: {
              y: {
                position: 'left',
                title: t('用户量'),
                titlePosition: 'bottom',
                titleTransform: 'rotate(0)',
                titleTextBaseline: 'bottom',
              },
            },
          },
          {
            data: pLine,
            type: 'line',
            yField: 'rate',
            colorField: 'type',
            style: { lineWidth: 2 },
            axis: {
              y: {
                position: 'right',
                title: t('留存率'),
                titlePosition: 'bottom',
                titleTransform: 'rotate(0)',
                titleTextBaseline: 'bottom',
              },
            },
          },
        ];
        tableData = pValues;
      } else {
        xField = 'month';

        const temp = chartsData?.platGrowths?.reduce(
          (p, c) => ({ ...p, ...c }),
          {} as IGetGrowthAnalysis['platGrowths'][0],
        );
        const activeKey = activePlatformTab || '';

        const activeData = activeKey && temp ? temp[activeKey] : [];

        const trendData = activeData?.reduce((p, c) => {
          p[c.index] = c;
          return p;
        }, {} as Record<string, IGetGrowthAnalysis['platGrowths'][0][string][0]>);

        const tBar = ['UV', '有效浏览UV'].flatMap((key) => {
          if (!trendData[key]) return [];
          return trendData[key].dates.map((date, index) => ({
            type: key,
            count: trendData[key]['values'][index],
            month: date,
          }));
        });

        const tLine = ['次日留存', '7日留存', '30日留存'].flatMap((key) => {
          if (!trendData[key]) return [];
          return trendData[key].dates.map((date, index) => ({
            type: key,
            rate: trendData[key]['values'][index],
            month: date,
          }));
        });

        chartChildren = [
          {
            data: tBar,
            type: 'interval',
            yField: 'count',
            colorField: 'type',
            style: { maxWidth: 200 },
            transform: [{ type: 'dodgeX', padding: 0 }],
            axis: {
              y: {
                position: 'left',
                title: t('用户量'),
              },
            },
          },
          {
            data: tLine,
            type: 'line',
            yField: 'rate',
            colorField: 'type',
            style: { lineWidth: 2 },
            axis: {
              y: {
                position: 'right',
                title: t('留存率'),
              },
            },
            scale: { y: { domain: [0, 100] } },
          },
        ];

        // Calculate Trend Table for specific platform
        tableData = activeData;
      }
      return {
        platformChartConfig: {
          xField,
          legend: {
            color: {
              position: 'bottom',
              layout: {
                justifyContent: 'center',
              },
            },
          },
          tooltip: {
            items: [
              (item: {
                month?: string;
                rate?: number;
                type?: string;
                count?: number;
              }) => {
                if (item.rate) {
                  return {
                    value:
                      typeof item.rate === 'number'
                        ? `${item.rate?.toFixed(2)}%`
                        : '-',
                  };
                }
                return {
                  value:
                    typeof item.count === 'number'
                      ? item.count?.toFixed(2)
                      : '-',
                };
              },
            ],
          },
          children: chartChildren,
        },
        currentPlatformTableData: tableData,
        isAllPlatform: isAll,
      };
    }, [activePlatformTab, chartsData]);
  const platformOverviewColumns = [
    { title: t('端口'), dataIndex: 'platform', key: 'platform' },
    { title: t('UV'), dataIndex: 'uv', key: 'uv' },
    {
      title: t('流量占比'),
      dataIndex: 'percentage',
      key: 'percentage',
      render: (v: number) => (typeof v === 'number' ? `${v.toFixed(2)}%` : '-'),
    },
    {
      title: t('有效浏览(有效占比)'),
      key: 'validUv',
      render: (_: any, r: any) => (
        <div>
          <span>
            {typeof r?.validUv === 'number' ? r.validUv.toLocaleString() : '-'}
          </span>
          &nbsp;
          <span>{`(${
            typeof r?.uvRatio === 'number' ? `${r.uvRatio.toFixed(2)}%` : '-'
          })`}</span>
        </div>
      ),
    },
    {
      title: t('次日留存'),
      dataIndex: 'retentionRate1d',
      key: 'retentionRate1d',
      render: (v: number) => (typeof v === 'number' ? `${v.toFixed(2)}%` : '-'),
    },
    {
      title: t('七日留存'),
      dataIndex: 'retentionRate7d',
      key: 'retentionRate7d',
      render: (v: number) => (typeof v === 'number' ? `${v.toFixed(2)}%` : '-'),
    },
    {
      title: t('30日留存'),
      dataIndex: 'retentionRate30d',
      key: 'retentionRate30d',
      render: (v: number) => (typeof v === 'number' ? `${v.toFixed(2)}%` : '-'),
    },
  ];
  // #endregion

  // #region 渠道流量分析
  const channelTraffics = chartsData?.channelTraffics || [];
  const channelData = channelTraffics.flatMap((item) =>
    item?.dates?.map((date, i) => ({
      date,
      value: parseFloat(item.values[i] ?? 0),
      channel: item.channel,
    })),
  );
  const channelConfig = {
    data: channelData,
    xField: 'date',
    yField: 'value',
    colorField: 'channel',
    style: {
      lineWidth: 2,
    },
    legend: {
      color: {
        position: 'bottom',
        layout: {
          justifyContent: 'center',
        },
      },
    },
  };
  const channelColumns = [
    { title: t('渠道'), dataIndex: 'channel', key: 'channel' },
    { title: t('UV'), dataIndex: 'uv', key: 'uv' },
    {
      title: t('占比'),
      dataIndex: 'percentage',
      key: 'percentage',
      render: (v: number) => (v ? `${v} %` : '-'),
    },
    {
      title: t('有效UV'),
      dataIndex: 'validUv',
      key: 'validUv',
      render: (v: number) => (v ? v : '-'),
    },
    {
      title: t('次日留存'),
      dataIndex: 'retentionRate1d',
      key: 'retentionRate1d',
      render: (v: number) => (v ? `${v} %` : '-'),
    },
    {
      title: t('7日留存'),
      dataIndex: 'retentionRate7d',
      key: 'retentionRate7d',
      render: (v: number) => (v ? `${v} %` : '-'),
    },
    {
      title: t('30日留存率'),
      dataIndex: 'retentionRate30d',
      key: 'retentionRate30d',
      render: (v: number) => (v ? `${v} %` : '-'),
    },
  ];
  // #endregion

  // #region 功能模块引流分析
  const {
    moduleBreakdownChartConfig,
    moduleBreakdownTableColumns,
    moduleBreakdownTableData,
    moduleBreakdownTabList,
  } = useMemo(() => {
    const moduleBreakdown = chartsData?.moduleBreakdowns || [];
    const secondModuleBreakdown =
      chartsData?.secondModuleBreakdowns?.[activeModuleBreakdownTab] || [];
    return {
      moduleBreakdownChartConfig: {
        data: (activeModuleBreakdownTab === 'all'
          ? moduleBreakdown
          : secondModuleBreakdown
        ).map((m) => ({ type: m.module, value: m.uv })),
        angleField: 'value',
        colorField: 'type',
        radius: 0.8,
        innerRadius: 0.5,
        label: [
          {
            text: 'type',
            position: 'outside',
            transform: [{ type: 'overlapDodgeY' }],
          },
        ],
        legend: {
          color: {
            position: 'left',
          },
        },
      },
      moduleBreakdownTableData:
        activeModuleBreakdownTab === 'all'
          ? moduleBreakdown
          : secondModuleBreakdown,
      moduleBreakdownTableColumns: [
        { title: t('模块/页面'), dataIndex: 'module', key: 'module' },
        { title: t('UV'), dataIndex: 'uv', key: 'uv' },
        {
          title: t('流量占比'),
          dataIndex: 'percentage',
          key: 'percentage',
          render: (v: unknown) =>
            typeof v === 'number' ? `${v.toFixed(2)} %` : '-',
        },
        { title: t('有效浏览'), dataIndex: 'validUv', key: 'validUv' },
        {
          title: t('次日留存'),
          dataIndex: 'retentionRate1d',
          key: 'retentionRate1d',
          render: (v: unknown) =>
            typeof v === 'number' ? `${v.toFixed(2)} %` : '-',
        },
        {
          title: t('7日留存'),
          dataIndex: 'retentionRate7d',
          key: 'retentionRate7d',
          render: (v: unknown) =>
            typeof v === 'number' ? `${v.toFixed(2)} %` : '-',
        },
        {
          title: t('30日留存'),
          dataIndex: 'retentionRate30d',
          key: 'retentionRate30d',
          render: (v: unknown) =>
            typeof v === 'number' ? `${v.toFixed(2)} %` : '-',
        },
      ],
      moduleBreakdownTabList: [
        { key: 'all', label: '频道划分' },
        ...moduleBreakdown.map(({ module: label, moduleEn: key }) => ({
          key,
          label,
        })),
      ],
    };
  }, [chartsData, activeModuleBreakdownTab]);
  // #endregion
  if (!chartsData) return;
  return (
    <div className="space-y-6">
      <ModuleTitle
        serialNum="02"
        firstTitle={t('增长分析')}
        secondTitle={t('核心指标：UV/有效浏览UV/留存率(1/7/30日)。')}
      />
      <Card
        title={
          <AiAnalysisCardTitle
            level={1}
            title={t('全站增长大盘')}
            status={cardStatus[1]}
            onChange={() => triggerRequest(1)}
          />
        }
      >
        <AiAnalysisReference
          status={cardStatus[1]}
          markdown={aiData?.totalGrowths?.en || ''}
        />
        <ChartLoading loading={loading}>
          <DualAxes {...totalGrowthConfig} onReady={chartResizeOnReady} />
        </ChartLoading>
        <Table
          columns={totalColumns}
          dataSource={totalGrowths}
          rowKey="index"
          pagination={false}
          size="small"
        />
      </Card>
      <Card
        title={
          <AiAnalysisCardTitle
            level={2}
            color="#785aec"
            title={t('分端增长拆解')}
            status={cardStatus[2]}
            onChange={() => triggerRequest(2)}
          />
        }
        tabList={[
          { key: 'ALL', tab: '全站端数据' },
          { key: 'APP', tab: 'APP端' },
          { key: 'H5', tab: 'H5端' },
          { key: 'PC', tab: 'PC端' },
        ]}
        activeTabKey={activePlatformTab}
        onTabChange={(key) => setActivePlatformTab(key)}
      >
        <AiAnalysisReference
          status={cardStatus[2]}
          markdown={aiData?.platformBreakdowns?.en || ''}
        />
        <ChartLoading loading={loading}>
          <DualAxes {...platformChartConfig} onReady={chartResizeOnReady} />
        </ChartLoading>
        <Table
          columns={isAllPlatform ? platformOverviewColumns : totalColumns}
          dataSource={currentPlatformTableData}
          rowKey={isAllPlatform ? 'platform' : 'index'}
          pagination={false}
          size="small"
        />
      </Card>
      <Card
        title={
          <AiAnalysisCardTitle
            level={3}
            color="#eb9631"
            title={t('渠道流量分析')}
            status={cardStatus[3]}
            onChange={() => triggerRequest(3)}
          />
        }
      >
        <AiAnalysisReference
          status={cardStatus[3]}
          markdown={aiData?.channelTraffics?.en || ''}
        />
        <ChartLoading loading={loading}>
          <Line {...channelConfig} onReady={chartResizeOnReady} />
        </ChartLoading>
        <Table
          columns={channelColumns}
          dataSource={channelTraffics}
          rowKey="channel"
          pagination={false}
          size="small"
        />
      </Card>
      <Card
        title={
          <AiAnalysisCardTitle
            level={4}
            color="#3fac7a"
            title={t('功能模块引流分析')}
            status={cardStatus[4]}
            onChange={() => triggerRequest(4)}
          />
        }
        tabList={moduleBreakdownTabList}
        activeTabKey={activeModuleBreakdownTab}
        onTabChange={(k) => setActiveModuleBreakdownTab(k)}
      >
        <AiAnalysisReference
          status={cardStatus[4]}
          markdown={aiData?.moduleBreakdowns?.en || ''}
        />
        <ChartLoading loading={loading}>
          <Pie {...moduleBreakdownChartConfig} onReady={chartResizeOnReady} />
        </ChartLoading>
        <Table
          columns={moduleBreakdownTableColumns}
          dataSource={moduleBreakdownTableData}
          rowKey="module"
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  );
}
