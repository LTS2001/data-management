import { Row, Select } from 'antd';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

export enum ETimeRangeType {
  day7 = 1,
  day15 = 2,
}

interface TimeSelectProps {
  value?: ETimeRangeType;
  onChange?: (value: ETimeRangeType) => void;
  style?: React.CSSProperties;
}

const TimeSelect: React.FC<TimeSelectProps> = ({
  value = ETimeRangeType.day7,
  onChange,
  style = { width: 140 },
}) => {
  const { t } = useTranslation('translation');

  return (
    <Row justify="end" align="middle">
      <Select value={value} onChange={onChange} style={style}>
        <Option value={ETimeRangeType.day7}>{t('last-7-days')}</Option>
        <Option value={ETimeRangeType.day15}>{t('last-14-days')}</Option>
      </Select>
    </Row>
  );
};

export default TimeSelect;
