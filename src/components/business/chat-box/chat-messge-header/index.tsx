/**
 * @description 聊天消息头部组件
 */

import { Avatar } from 'antd';

export default function ChatMessageHeader({
  concatName,
}: {
  concatName: string;
}) {
  return (
    <div className="flex w-full border-b p-4 ">
      <div className="flex items-center">
        {/* <DefaultAvatar
          size={36}
          className="bg-[#E6F4FF] text-[#1677FF]"
          name={concatName}
        /> */}
        <Avatar size={36} className="bg-[#E6F4FF] text-[#1677FF]">
          {concatName?.charAt(0).toUpperCase() || 'U'}
        </Avatar>
        <div className="ml-3">
          <div className="text-base font-semibold">{concatName}</div>
        </div>
      </div>
    </div>
  );
}
