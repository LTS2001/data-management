import CustomProTable from '@/components/basic/custom-table';
import { datePickerPresets } from '@/components/basic/custom-table/table-config';
import DefaultAvatar from '@/components/basic/defalut-avatar';
import { getConcatList } from '@/services/concat.service';
import { IConcatListRes } from '@/services/types/concat.type';
import { ActionType, FormInstance } from '@ant-design/pro-components';
import { DatePicker, Tag } from 'antd';
import dayjs from 'dayjs';
import { omit } from 'lodash';
import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetConcatTags } from '../hooks';

function List() {
  const formRef = useRef<FormInstance>();
  const actionRef = useRef<ActionType>();
  const tagList = useGetConcatTags();
  const { t } = useTranslation('concat');
  const columns = useMemo<ProColumnsTipKey<IConcatListRes>[]>(() => {
    return [
      {
        title: 'id',
        dataIndex: 'id',

        // fieldProps: {
        //   placeholder: '来源账号',
        // },
        // formItemProps: {
        //   label: null,
        // },
        // renderFormItem: () => {
        //   return <DynamicTree actionRef={actionRef} />;
        // },
        // search: {
        //   transform: (value) => {
        //     return {
        //       fieldList: [
        //         {
        //           fieldId: lastFieldId,
        //           value,
        //         },
        //       ],
        //     };
        //   },
        // },
      },
      {
        title: t('user'),
        dataIndex: 'name',
      },
      {
        title: t('avatar'),
        dataIndex: 'avatar_url',
        render: (_, record) => {
          return (
            <DefaultAvatar
              size="small"
              src={record.avatar_url}
              name={record.name}
            />
          );
        },
      },
      {
        title: t('phone-number'),
        dataIndex: 'phone_number',
      },
      {
        title: t('address'),
        width: 150,
        dataIndex: 'address',
      },
      {
        title: t('country'),
        width: 150,
        dataIndex: 'country',
      },
      {
        title: t('tag-ids'),
        dataIndex: 'tag_ids',
        valueType: 'select',
        hideInTable: true,
        fieldProps: {
          options: tagList,
        },
        search: true,
      },
      {
        title: t('tag-ids'),
        dataIndex: 'tags',
        width: 150,
        render: (_, record) => {
          return (
            <div className="flex flex-col gap-1">
              {record?.tags?.length
                ? record.tags
                    .slice(0, 3)
                    .map((tag) => <Tag key={tag}>{tag}</Tag>)
                : '-'}
            </div>
          );
        },
      },
      {
        title: t('create-time'),
        dataIndex: 'date',
        hideInTable: true,
        // valueType: 'dateRange',
        search: true,
        renderFormItem: () => {
          return (
            <DatePicker.RangePicker
              presets={datePickerPresets}
              // 默认为今天
              defaultValue={[dayjs().add(-7, 'd'), dayjs()]}
              format="YYYY-MM-DD"
            />
          );
        },
      },
      {
        title: t('create-time'),
        dataIndex: 'create_time',
        render: (_, record) =>
          dayjs(record.create_time).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: t('update-time'),
        dataIndex: 'update_time',
        render: (_, record) =>
          dayjs(record.update_time).format('YYYY-MM-DD HH:mm:ss'),
      },
    ];
  }, [tagList]);

  return (
    <CustomProTable<IConcatListRes>
      formRef={formRef}
      beforeSearchSubmit={(params) => {
        return {
          ...omit(params, 'date'),
          start_time:
            `${dayjs(params.date?.[0] || dayjs().add(-7, 'd')).format(
              'YYYY-MM-DD',
            )} 00:00:00` || '',
          end_time:
            `${dayjs(params.date?.[1]).format('YYYY-MM-DD')} 23:59:59` || '',
        };
      }}
      actionRef={actionRef}
      columns={columns}
      rowKey="conversationId"
      scroll={{ x: 'max-content' }}
      requestFn={getConcatList}
      columnsState={{
        persistenceKey: 'Conversations-Table-Columns',
        persistenceType: 'localStorage',
      }}
      form={{
        syncToUrl: false,
      }}
    />
  );
}

export default List;
