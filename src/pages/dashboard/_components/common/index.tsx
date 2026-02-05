import {
  Button,
  DatePicker,
  Skeleton,
  Tag,
  TagProps,
  Tooltip,
  Typography,
} from 'antd';
import { PresetColorType, PresetStatusColorType } from 'antd/es/_util/colors';
import { LiteralUnion } from 'antd/es/_util/type';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
// 仅引入MD解析核心组件，无其他依赖
import { IDateParams } from '@/services/types/data-market';
import { LoadingOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

const { Title } = Typography;

// LevelTag 完全不变
export const LevelTag = ({
  level,
  color,
  variant,
}: {
  level: number;
  color?: LiteralUnion<PresetColorType | PresetStatusColorType>;
  variant?: TagProps['variant'];
}) => {
  return (
    <Tag
      color={color || 'blue-inverse'}
      variant={variant || 'solid'}
      className="mr-2 rounded-full"
    >
      {`LEVEL ${level}`}
    </Tag>
  );
};

// ModuleTitle 完全不变
export const ModuleTitle = ({
  serialNum,
  firstTitle,
  secondTitle,
}: {
  serialNum: string;
  firstTitle: string;
  secondTitle: string;
}) => {
  return (
    <div className="flex items-center gap-3">
      <div className="text-4xl font-bold">{serialNum}</div>
      <div>
        <div className="text-2xl font-bold">{firstTitle}</div>
        <div className="text-sm text-gray-500">{secondTitle}</div>
      </div>
    </div>
  );
};

// 核心改造：纯解析MD，无任何多余处理，保留原始格式
export const CardReference = ({
  markdown, // 接收后端原始MD字符串（必传）
  paragraphNode, // 可选：自定义节点，优先级高于MD解析
}: {
  markdown: string;
  paragraphNode?: React.ReactNode;
}) => {
  return (
    <div className="border-l-4 border-blue-500 pl-2 p-2 bg-blue-50 mb-8">
      {/* 优先展示自定义节点，否则直接原生解析MD */}
      {paragraphNode ? (
        paragraphNode
      ) : (
        // 直接解析MD，不做任何分割/剔除/修改
        <ReactMarkdown
          components={{
            h3: ({ children }) => (
              <h3 className="text-base font-bold text-blue-500 mb-2 ml-1 mt-0 pl-4">
                {children}
              </h3>
            ),
          }}
        >
          {markdown}
        </ReactMarkdown>
      )}
    </div>
  );
};

// CardTitleWithTag 完全不变
export const CardTitleWithTag = ({
  level,
  title,
  color,
  variant,
}: {
  level: number;
  title: string;
  color?: LiteralUnion<PresetColorType | PresetStatusColorType>;
  variant?: TagProps['variant'];
}) => {
  return (
    <div className="flex items-center">
      <LevelTag level={level} variant={variant} color={color} />
      <Title level={4} className="!mb-0">
        {title}
      </Title>
    </div>
  );
};

/** 卡片状态：undefined 视为未开始；仅 success 时隐藏按钮；loading 时参考区显示骨架屏 */
export type AiAnalysisCardStatus = 'loading' | 'success' | 'error' | undefined;

/** 根据 status 决定：undefined/idle/error 不展示，loading 展示骨架屏，success 展示正文 */
export const AiAnalysisReference = (props: {
  status: AiAnalysisCardStatus;
  markdown: string;
  paragraphNode?: React.ReactNode;
}) => {
  const { status, ...rest } = props;
  if (status === undefined || status === 'error') return null;
  if (status === 'loading') {
    return (
      <div className="border-l-4 border-blue-500 pl-2 px-2 py-4 bg-blue-50 mb-8">
        <Skeleton title={false} paragraph={{ rows: 2 }} />
      </div>
    );
  }
  return <CardReference {...rest} />;
};

export const AiAnalysisCardTitle = (props: {
  status: AiAnalysisCardStatus;
  onChange: () => void;
  level: number;
  title: string;
  color?: LiteralUnion<PresetColorType | PresetStatusColorType>;
  variant?: TagProps['variant'];
}) => {
  const { t } = useTranslation('translation');
  const { status, onChange, ...rest } = props;
  const showButton = status !== 'success';
  const loading = status === 'loading';
  const isError = status === 'error';
  return (
    <div className="flex justify-between">
      <CardTitleWithTag {...rest} />
      {showButton ? (
        <Button loading={loading} onClick={onChange}>
          {isError ? t('retry') : t('ai-analysis')}
        </Button>
      ) : null}
    </div>
  );
};

export const DataDictionary = () => {
  const { t } = useTranslation('dashboard');
  return (
    <ol className="list-decimal space-y-1 text-sm leading-6 pl-6">
      <li>
        {t(
          'UV：在指定时间段内，产生page_view事件后按照user id去重后统计得到的用户总数。',
        )}
      </li>
      <li>
        {t(
          '留存：某一时间点的新用户，在后续指定时间窗口内再次产生有效访问行为的比例。',
        )}
        <div>
          {t(
            '留存率 =（窗口期内回访的新用户数 / 首次访问日（T 日）的总新用户数）× 100%',
          )}
          <ol className="list-[lower-alpha] space-y-1 ml-4">
            <li>
              {t(
                '次日留存：T 日（首次访问日）的新用户，在 T+1 日（次日）至少有 1 次访问的比例。',
              )}
            </li>
            <li>
              {t(
                '7 日留存：T 日的新用户，在 T+7 日（首次访问后的第 7 天）至少有 1 次访问的比例。',
              )}
            </li>
            <li>
              {t('30 日留存：T 日新用户，在 T+30 日 至少有 1 次访问的比例。')}
            </li>
            <li>
              {t('人均 PV：在指定时间段内，用户平均浏览的页面数。')}
              <br />
              {t('人均 PV = 总 PV 数 / 总 UV 数。')}
            </li>
          </ol>
        </div>
      </li>
      <li>
        {t('平均会话时长：当前统计为用户的平均会话时长。')}
        <div className="ml-4">
          <ol className="list-[lower-alpha] space-y-1">
            <li>
              {t(
                '平均会话时长 = AVG（用户离开平台的时间 − 用户进入平台的时间）。',
              )}
            </li>
            <li>
              {t(
                '取用户进入平台的时间戳、用户离开平台的时间戳来算差值后，再求平均值。',
              )}
            </li>
          </ol>
        </div>
      </li>
      <li>{t('新增用户数：在指定时间段内，新增用户数量。')}</li>
      <li>{t('注册数：在指定时间段内，成功注册用户总数。')}</li>
      <li>{t('注册率：计算口径 = 注册用户数 / 总 UV × 100%。')}</li>
      <li>
        {t(
          '跳出率：其定义为只访问了 1 个页面就离开的会话数，占总会话数的百分比。',
        )}
        <div>{t('跳出率 = 单个页面会话数 / 总会话数 × 100%。')}</div>
      </li>
      <li>
        {t('表单线索数：即在指定时间段内，成功提交留资表单的数量。')}
        <div>
          {t(
            '表单提交数事件分为两层：先通过【go_click】行为打开表单，再通过【button_click】与【content_type=Submit_Success】来统计表单提交数量。',
          )}
        </div>
      </li>
      <li>
        {t('有效浏览 UV：在指定时间段内，用户产生的会话时长大于 3s。')}
        <div>{t('用户进入页面，产生page_view事件后，会话时长时候>=3s')}</div>
      </li>
      <li>{t('有效浏览占比：计算口径 = 有效浏览 UV / 总 UV × 100%。')}</li>
      <li>
        {t('环比：所选时间范围内的数据与上一个时间周期的数据的增长对比。')}
        <div>
          {t('环比增长率 = （本期数值 − 上期数值） / 上期数值 × 100%。')}
        </div>
      </li>
      <li>
        {t('同比：所选时间范围内的数据与去年同时间周期的数据的增长对比。')}
        <div>
          {t(
            '同比增长率 = （本期数值 − 去年同期数值） / 去年同期数值 × 100%。',
          )}
        </div>
      </li>
    </ol>
  );
};

export const Header = ({
  dates,
  setDates,
}: {
  dates: IDateParams;
  setDates: Dispatch<SetStateAction<IDateParams>>;
}) => {
  const { t } = useTranslation('dashboard');
  return (
    <div className="flex justify-between items-center cursor-pointer sticky top-0 z-50 bg-white rounded-md border p-3 shadow-md">
      <div className="text-sm text-gray-500">
        {t('Tips：数据统计时间为T-1的数据，每天上午8点拉取前一天的最新数据')}
      </div>
      <div className="flex justify-end items-center gap-14">
        <div className="flex justify-center items-center">
          <Tooltip
            title={<DataDictionary />}
            classNames={{ container: 'w-[690px] mt-5' }}
            placement="leftBottom"
            arrow={false}
          >
            <div className="flex items-center gap-1 text-blue-600">
              <QuestionCircleOutlined />
              <div>{t('数据词典')}</div>
            </div>
          </Tooltip>
        </div>
        <DatePicker.RangePicker
          allowClear={false}
          presets={[
            {
              label: t('last-7-days'),
              value: [dayjs().add(-7, 'd'), dayjs()],
            },
            {
              label: t('last-30-days'),
              value: [dayjs().add(-30, 'd'), dayjs()],
            },
          ]}
          defaultValue={[dayjs(dates.startDate), dayjs(dates.endDate)]}
          format="YYYY-MM-DD"
          onChange={(value) => {
            if (!value || !value[0] || !value[1]) {
              return;
            }
            setDates({
              startDate: value[0].format('YYYY-MM-DD'),
              endDate: value[1].format('YYYY-MM-DD'),
            });
          }}
          maxDate={dayjs()}
        />
      </div>
    </div>
  );
};

/** 锚点滚动时距离视口顶部的偏移（如为固定头留出空间） */
const SCROLL_OFFSET_TOP = 88;
const SECTION_IDS = [
  'section-user-assets',
  'section-growth',
  'section-loss',
  'section-interaction',
  'section-conversion',
] as const;
export const Navbar = () => {
  const { t } = useTranslation('dashboard');
  const [activeSectionId, setActiveSectionId] = useState<string>(
    SECTION_IDS[0],
  );
  useEffect(() => {
    const onScroll = () => {
      const threshold = SCROLL_OFFSET_TOP + 80;
      let current: string = SECTION_IDS[0];
      for (let i = SECTION_IDS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTION_IDS[i]);
        if (el && el.getBoundingClientRect().top <= threshold) {
          current = SECTION_IDS[i];
          break;
        }
      }
      setActiveSectionId(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className="sticky top-4 bg-white rounded-md shadow-md">
      {[
        {
          id: 'section-user-assets',
          label: t('01 用户资产概览'),
        },
        { id: 'section-growth', label: t('02 增长分析') },
        { id: 'section-loss', label: t('03 折损分析') },
        { id: 'section-interaction', label: t('04 互动分析') },
        { id: 'section-conversion', label: t('05 转化分析') },
      ].map(({ id, label }, i) => (
        <div key={id} className={`${i === 4 ? '' : 'border-b'}`}>
          <a
            href={`#${id}`}
            className={`block py-3 px-3 hover:text-black hover:bg-gray-100 ${
              activeSectionId === id
                ? 'font-semibold text-blue-600'
                : 'text-gray-600'
            }`}
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById(id);
              if (el) {
                const top =
                  el.getBoundingClientRect().top +
                  window.scrollY -
                  SCROLL_OFFSET_TOP;
                window.scrollTo({ top, behavior: 'smooth' });
              }
            }}
          >
            {label}
          </a>
        </div>
      ))}
    </nav>
  );
};

export const ChartLoading = (
  props: React.PropsWithChildren & { loading: boolean },
) => {
  const { loading, children } = props;
  return (
    <div className="relative">
      {children}
      {loading ? (
        <div className="absolute w-full h-full bg-[rgba(255,255,255,0.8)] top-0 left-0 text-blue-600 text-4xl flex justify-center items-center">
          <LoadingOutlined />
        </div>
      ) : null}
    </div>
  );
};
