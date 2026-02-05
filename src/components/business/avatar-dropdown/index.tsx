import { IInitialState } from '@/app';
import DefaultAvatar from '@/components/basic/defalut-avatar';
import { toLogOut } from '@/utils/auth';
import { buildLink } from '@/utils/link';
import { LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import { useModel, useNavigate } from '@umijs/max';
import { Dropdown } from 'antd';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const AvatarDropdown: React.FC = () => {
  const { t } = useTranslation('user');
  const { initialState } = useModel('@@initialState');
  const { userInfo } = initialState as IInitialState;
  const router = useNavigate();

  const onMenuClick = useCallback((event: { key: string }) => {
    const { key } = event;
    const menuMap = {
      // userInfo: () => router('/user-info'),
      logout: () => toLogOut(),
      login: () => router(buildLink('/login')),
    };
    menuMap[key as keyof typeof menuMap]?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const menu = useMemo(() => {
    if (!userInfo) {
      return [
        {
          key: 'login',
          label: t('login'),
          icon: <LoginOutlined />,
        },
      ];
    }
    return [
      // {
      //   key: 'userInfo',
      //   label: t('user-info'),
      //   icon: <UserOutlined />,
      // },
      {
        key: 'logout',
        label: t('logout'),
        icon: <LogoutOutlined />,
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Dropdown
      menu={{
        items: menu,
        onClick: onMenuClick,
      }}
      key={userInfo?.admin.username}
      trigger={['click', 'hover']}
      className="hover:cursor-pointer"
      // overlayStyle={{ top: 55 }}
    >
      <div>
        <DefaultAvatar size={35} alt="avatar" name={userInfo?.admin.username} />
        <span className="m-1">{userInfo?.admin.username}</span>
      </div>
    </Dropdown>
  );
};

export default AvatarDropdown;
