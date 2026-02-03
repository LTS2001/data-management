import { Select } from 'antd';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

interface FilterBarProps {
  timeRange: string;
  platform: string;
  channel: string;
  onTimeRangeChange: (value: string) => void;
  onPlatformChange: (value: string) => void;
  onChannelChange: (value: string) => void;
}

const FilterBar = ({
  timeRange,
  platform,
  channel,
  onTimeRangeChange,
  onPlatformChange,
  onChannelChange,
}: FilterBarProps) => {
  const { t } = useTranslation('dashboard');

  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Select
          value={timeRange}
          onChange={onTimeRangeChange}
          style={{ width: 120 }}
        >
          <Option value="last-7-days">{t('last-7-days')}</Option>
        </Select>
        <Select
          value={platform}
          onChange={onPlatformChange}
          style={{ width: 120 }}
        >
          <Option value="all-platforms">{t('all-platforms')}</Option>
        </Select>
        <Select
          value={channel}
          onChange={onChannelChange}
          style={{ width: 120 }}
        >
          <Option value="all-channels">{t('all-channels')}</Option>
        </Select>
      </div>
    </div>
  );
};

export default FilterBar;

