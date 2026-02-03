import { Language } from '@/i18n/resources';
import { useSelectedLanguage } from '@/i18n/utils';
import { Dropdown, MenuProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { FaLanguage } from 'react-icons/fa6';

function LanguageSelect() {
  const { language, setLanguage } = useSelectedLanguage();
  const { t } = useTranslation('translation');
  const onClick: MenuProps['onClick'] = ({ key }) => {
    setLanguage(key as Language);
  };

  const items: MenuProps['items'] = Object.values(Language)
    .filter((i) => i !== language)
    .map((item) => ({
      key: item,
      label: (
        <>
          {t('flag-icon', { lng: item })}&nbsp;
          {t('language', { lng: item })}
        </>
      ),
    }));
  return (
    <Dropdown menu={{ items, onClick }}>
      <span className="text-black text-3xl">
        <FaLanguage />
      </span>
    </Dropdown>
  );
}

export default LanguageSelect;
