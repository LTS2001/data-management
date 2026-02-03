import { Line, LineConfig } from '@ant-design/plots';
import { Card, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

const TrafficTrend = () => {
  const { t } = useTranslation('dashboard');

  // 生成30天的日期数据
  const generateDays = () => {
    const days = [];
    for (let i = 1; i <= 30; i++) {
      days.push(`${i}日`);
    }
    return days;
  };

  const days = generateDays();

  // 写死的数据，根据设计稿描述
  const allChannelsData = days.map((day, index) => {
    // 全渠道：从78000-80000开始，保持相对平稳，在25-28天左右略有下降，结束约75000
    let value = 79000;
    if (index >= 24 && index <= 27) {
      value = 76000;
    } else if (index >= 28) {
      value = 75000;
    }
    return { day, value, channel: t('all-channels') };
  });

  const googleAdsData = days.map((day, index) => {
    // Google ads：从15000开始，稳步增长到第15天约40000，然后略有下降并稳定在40000-45000
    let value = 15000 + index * 1600;
    if (index >= 15) {
      value = 40000 + (index - 15) * 200;
      if (value > 45000) value = 45000;
    }
    return { day, value, channel: t('google-ads') };
  });

  const tiktokAdsData = days.map((day) => {
    // Tiktok ads：几乎为0
    return { day, value: 0, channel: t('tiktok-ads') };
  });

  const metaAdsData = days.map((day) => {
    // Meta ads：几乎为0
    return { day, value: 0, channel: t('meta-ads') };
  });

  const socialMediaData = days.map((day, index) => {
    // 社媒：从15000开始，增长到第10天约30000，然后急剧上升到第18-20天约60000，然后略有下降到约55000
    let value = 15000;
    if (index < 10) {
      value = 15000 + index * 1500;
    } else if (index < 18) {
      value = 30000 + (index - 10) * 3750;
    } else if (index < 20) {
      value = 60000;
    } else {
      value = 60000 - (index - 20) * 500;
      if (value < 55000) value = 55000;
    }
    return { day, value, channel: t('social-media') };
  });

  const chartData = [
    ...allChannelsData,
    ...googleAdsData,
    ...tiktokAdsData,
    ...metaAdsData,
    ...socialMediaData,
  ];

  const config: LineConfig = {
    data: chartData,
    xField: 'day',
    yField: 'value',
    seriesField: 'channel',
    height: 400,
    shapeField: 'smooth',
    // 为每个渠道设置不同的颜色
    colorField: 'channel',
    color: ({ channel }: { channel: string }) => {
      const colorMap: Record<string, string> = {
        [t('all-channels')]: '#9254de', // 紫色 - 全渠道
        [t('google-ads')]: '#52c41a', // 绿色 - Google ads
        [t('tiktok-ads')]: '#1890ff', // 蓝色 - Tiktok ads
        [t('meta-ads')]: '#ff4d4f', // 红色 - Meta ads
        [t('social-media')]: '#fa8c16', // 橙色 - 社媒
      };
      return colorMap[channel] || '#1890ff';
    },
    legend: {
      position: 'bottom',
    },
    tooltip: {
      items: [
        {
          field: 'value',
          name: t('daily-active-users'),
        },
      ],
    },
    scale: {
      y: {
        domainMin: 0,
        nice: true,
      },
    },
    interaction: {
      tooltip: {
        marker: true,
      },
    },
    style: {
      lineWidth: 2,
    },
  };

  return (
    <Card
      className="mb-6 rounded-lg shadow-md"
      title={<Title level={4}>{t('traffic-trend')}</Title>}
    >
      <Line {...config} />
    </Card>
  );
};

export default TrafficTrend;
