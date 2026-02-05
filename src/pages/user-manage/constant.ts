import { EChannelInterest } from '@/config/enum';

export const channelInterestLabelMap: Record<EChannelInterest, string> = {
  [EChannelInterest.News]: 'News',
  [EChannelInterest.NewCar]: 'New Cars',
  [EChannelInterest.UsedCar]: 'Used Cars',
  [EChannelInterest.Service]: 'Car Service',
  [EChannelInterest.Topic]: 'Topic',
  [EChannelInterest.Other]: 'Other',
  [EChannelInterest.CarPriceInquiry]: 'Car Price Inquiry',
  [EChannelInterest.CarModelComparison]: 'Car Model Comparison',
  [EChannelInterest.CarDetails]: 'Car Details',
};
