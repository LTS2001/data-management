import { SearchOutlined } from '@ant-design/icons';
import { Input, theme } from 'antd';

const ChatSearch = ({
  searchText,
  handleSearch,
}: {
  searchText: string;
  //   setSearchText: Dispatch<SetStateAction<string>>;
  handleSearch: (text: string) => void;
}) => {
  const { token } = theme.useToken();

  return (
    <div className="w-full min-w-full p-4">
      <Input
        placeholder="Search message or contact"
        prefix={<SearchOutlined style={{ color: token.colorTextSecondary }} />}
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
        allowClear
      />
    </div>
  );
};
export default ChatSearch;
