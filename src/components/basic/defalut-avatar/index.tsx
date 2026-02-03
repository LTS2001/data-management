/**
 * 优先使用传入的头像地址  其次根据名称首字生成默认头像 不传则使用antd默认的头像兜底
 */
import { generateAvatar } from '@/utils/generate';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, AvatarProps } from 'antd';
import { forwardRef } from 'react';

type DefaultAvatarProps = Omit<AvatarProps, 'src' | 'size'> & {
  name?: string;
  size?: AvatarProps['size'];
  src?: AvatarProps['src'];
};

const DefaultAvatar = forwardRef<HTMLElement, DefaultAvatarProps>(
  ({ name, size = 35, src: propSrc, ...rest }, ref) => {
    const src =
      propSrc ||
      (name ? (
        generateAvatar(name)
      ) : (
        <UserOutlined style={{ backgroundColor: '#87d068' }} />
      ));

    return (
      <Avatar ref={ref as any} size={size} src={src} alt="avatar" {...rest} />
    );
  },
);

DefaultAvatar.displayName = 'DefaultAvatar';

export default DefaultAvatar;
