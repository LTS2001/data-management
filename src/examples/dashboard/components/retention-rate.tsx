import { Pie, PieConfig } from '@ant-design/plots';
import { Card, Typography } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

const RetentionRate = () => {
  const { t } = useTranslation('dashboard');

  // 写死的数据，根据设计稿：68%留存率
  // 蓝色：次日UV 68%，绿色：次日留存用户 32%
  const pieData = [
    {
      type: t('next-day-uv'),
      value: 68,
    },
    {
      type: t('next-day-retained-users'),
      value: 32,
    },
  ];

  const config: PieConfig = {
    data: pieData,
    angleField: 'value',
    colorField: 'type',
    height: 300,
    radius: 0.8,
    label: {
      text: 'value',
      style: {
        fontWeight: 'bold',
      },
    },
    tooltip: {
      items: [
        {
          field: 'value',
          name: t('next-day-retention'),
          formatter: (value: number) => `${value}%`,
        },
      ],
    },
    legend: {
      color: {
        title: false,
        position: 'bottom',
        rowPadding: 5,
      },
    },
    color: ['#1890ff', '#52c41a'],
    statistic: {
      title: false,
      content: {
        style: {
          fontSize: '32px',
          fontWeight: 600,
          color: '#1890ff',
          textAlign: 'center',
        },
        content: '68%',
      },
    },
  };

  return (
    <Card
      className="mb-6 rounded-lg shadow-md"
      title={<Title level={4}>{t('next-day-retention')}</Title>}
    >
      <div className="relative" style={{ height: '300px' }}>
        <Pie {...config} />
        <div
          className="absolute text-center"
          style={{
            left: '50%',
            top: 'calc(50% + 25px)',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
          }}
        >
          <div className="text-sm text-green-600">
            <ArrowUpOutlined className="mr-1" />
            +2.4%
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RetentionRate;

