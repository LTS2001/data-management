import { IDateParams } from '@/services/types/data-market';
import { Col, Layout, Row } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Header, Navbar } from './_components/common';
import ConversionAnalysis from './_components/conversion-analysis';
import GrowthAnalysis from './_components/growth-analysis';
import InteractionAnalysis from './_components/interaction-analysis';
import LossAnalysis from './_components/loss-analysis';
import UserAssets from './_components/user-assets';

const Dashboard = () => {
  const [dates, setDates] = useState<IDateParams>({
    startDate: dayjs().add(-7, 'd').format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
  });

  return (
    <Layout className="p-4">
      <Row>
        <Col span={2} className="-mt-10">
          <Navbar />
        </Col>
        <Col span={1} />
        <Col span={21} className="flex-1 space-y-8">
          <Header dates={dates} setDates={setDates} />
          <div className="space-y-16">
            <section id="section-user-assets">
              <UserAssets dates={dates} />
            </section>
            <section id="section-growth">
              <GrowthAnalysis dates={dates} />
            </section>
            <section id="section-loss">
              <LossAnalysis dates={dates} />
            </section>
            <section id="section-interaction">
              <InteractionAnalysis dates={dates} />
            </section>
            <section id="section-conversion">
              <ConversionAnalysis dates={dates} />
            </section>
          </div>
        </Col>
      </Row>
    </Layout>
  );
};

export default Dashboard;
