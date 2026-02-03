export interface IHomeDataParams {
  start?: string;
  end?: string;
}

export interface IHomeDataResItem {
  conversation_num: number;
  day: string;
  message_num: number;
  reply_avg: number;
  rate: number;
}

export type HomeDataRes = IHomeDataResItem[];
