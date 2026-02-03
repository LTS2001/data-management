import { isRTL } from '@/i18n';
import { ConfigProviderLanguageLocale } from '@/i18n/resources';
import { useSelectedLanguage } from '@/i18n/utils';
import { StyleProvider } from '@ant-design/cssinjs';
import { XProvider } from '@ant-design/x';

function Index({ children }: { children: React.ReactNode }) {
  const { language } = useSelectedLanguage();
  return (
    <StyleProvider>
      <XProvider
        direction={isRTL ? 'rtl' : 'ltr'}
        locale={ConfigProviderLanguageLocale[language]}
      >
        {children}
      </XProvider>
    </StyleProvider>
  );
}

export default Index;
