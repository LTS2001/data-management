interface ICommonGetUserAssets {
  percentage: number;
  ringRatio: number;
  yearRatio: number;
  dailyAvg: number;
}
export interface IGetUserAssets {
  userLayeredAssets: Array<
    ICommonGetUserAssets & {
      type: string;
      totalUsers: number;
      dates: string[];
      values: string[];
    }
  >;
  regionItems: Array<
    ICommonGetUserAssets & {
      region: string;
      uv: number;
      dates: string[];
      values: string[];
    }
  >;
  userGroups: Array<
    ICommonGetUserAssets & {
      userGroup: string;
      uv: number;
      scope: string;
    }
  >;
  aiAnalysis: {
    regionItems: { cn: string };
    userGroups: { cn: string };
    userLayeredAssets: { cn: string };
  };
}

export interface IUserAssetsAiAnalysis {
  userGroups: {
    en: string;
  };
  userLayeredAssets: {
    en: string;
  };
  regionItems: {
    en: string;
  };
}

export interface IGetGrowthAnalysis {
  totalGrowths: Array<{
    index: string;
    number: number;
    percentage: number;
    ringRatio: number;
    yearRatio: number;
    dailyTrend: number;
    dates: string[];
    values: string[];
  }>;
  platformBreakdowns: Array<{
    platform: 'APP' | 'PC' | 'H5';
    uv: number;
    validUv: number;
    percentage: number;
    retentionRate1d: number;
    retentionRate7d: number;
    retentionRate30d: number;
    dailyTrend: number;
    ringRatio: number;
    yearRatio: number;
    validUvRatio: number;
    uvRatio: number;
  }>;
  channelTraffics: Array<{
    channel: string;
    uv: number;
    validUv: number;
    percentage: number;
    retained1d: number;
    retained7d: number;
    retained30d: number;
    retentionRate1d: number;
    retentionRate7d: number;
    retentionRate30d: number;
    dates: string[];
    values: string[];
    newUser: number;
  }>;
  moduleBreakdowns: Array<{
    module: string;
    moduleEn: string;
    uv: number;
    validUv: number;
    validUvRatio: number;
    percentage: number;
    retentionRate1d: number;
    retentionRate7d: number;
    retentionRate30d: number;
  }>;
  secondModuleBreakdowns: {
    [key: string]: IGetGrowthAnalysis['moduleBreakdowns'];
  };
  platGrowths: Array<
    Record<
      string,
      Array<{
        index: string;
        number: number;
        percentage: number;
        ringRatio: number;
        yearRatio: number;
        dailyTrend: number;
        dates: string[];
        values: number[];
      }>
    >
  >;
}
export interface IGrowthAiAnalysis {
  totalGrowths: {
    en: string;
  };
  platformBreakdowns: {
    en: string;
  };
  channelTraffics: {
    en: string;
  };
  moduleBreakdowns: {
    en: string;
  };
}

export interface IGetLossAnalysis {
  flowLossFunnels: Array<{
    bounceRate: number;
    loseRate: number;
    ringRatio: number;
    stage: string;
    uv: number;
    yearRatio: number;
  }>;
  platformLosses: Array<{
    loadBounceRate: number;
    loadUv: number;
    platform: 'APP' | 'H5' | 'PC';
    second3BounceRate: number;
    second3BounceUv: number;
    second10BounceRate: number;
    second10BounceUv: number;
  }>;
  channelLosses: Array<{
    channel: string;
    loadBounceRate: number;
    loadBounceUv: number;
    lossRate3s: number;
    lossRate10s: number;
    percentage: number;
    second3BounceUv: number;
    second10BounceUv: number;
    uv: number;
  }>;
  pageWarnings: Array<{
    path: string;
    module: string;
    loseRate: number;
    rank: number;
  }>;
}

export interface ILossAiAnalysis {
  flowLossFunnels: {
    en: string;
  };
  platformLosses: {
    en: string;
  };
  channelLosses: {
    en: string;
  };
  pageWarnings: {
    en: string;
  };
}

export interface IGetInteractionAnalysis {
  siteInteractionTrends: Array<{
    index: string;
    dailyAvg: string;
    ringRatio: number;
    yearRatio: number;
    conversionRate: number;
    dates: string[];
    values: number[];
  }>;
  platformInteractions: Array<{
    platform: 'app' | 'h5' | 'web';
    avgPv: number;
    likeCount: number;
    commentCount: number;
    registerCount: number;
    registerRate: number;
    retentionRate: number;
    retentionCount: number;
  }>;
  moduleInteractions: Array<{
    module: string;
    avgPv: number;
    likeCount: number;
    commentCount: number;
    registerCount: number;
    registerRate: number;
    retentionRate: number;
    retentionCount: number;
  }>;
}

export interface IInteractionAiAnalysis {
  moduleInteraction: {
    en: string;
  };
  platformInteraction: {
    en: string;
  };
  siteInteraction: {
    en: string;
  };
}

export interface IGetConversionAnalysis {
  totalConversionFunnels: Array<{
    stage: string;
    userCount: number;
    stageConversionRate: number;
    overallConversionRate: number;
    ringRatio: number;
  }>;
  platformConversions: Array<{
    platform: string;
    uv: number;
    loginConversionRate: number;
    retentionConversionRate: number;
    finalClueCount: number;
  }>;
}

export interface IGetTransitionAnalysis {
  totalConversionFunnels: Array<{
    stage: string;
    userCount: number;
    overallConversionRate: number;
    ringRatio: number;
    yearRatio: number;
  }>;
  platformConversions: Array<{
    platform: 'APP' | 'PC' | 'H5';
    userCount: number;
    engagedCount: number;
    engagedConversionRate: number;
    registerCount: number;
    registerConversionRate: number;
    retentionCount: number;
    retentionConversionRate: number;
  }>;
}

export interface ITransitionAiAnalysis {
  totalConversionFunnel: {
    en: string;
  };
  platformConversion: {
    en: string;
  };
}

export interface IDateParams {
  startDate?: string;
  endDate?: string;
}
