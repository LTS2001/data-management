// 腾讯云COS相关常量
export const Bucket = 'gcc-1307444343';
export const Region = 'ap-singapore';
export const BasePath = '/cc';
export const cosDomainName = 'myqcloud.com';
export const cosFileBasePath = `https://${Bucket}.cos.${Region}.${cosDomainName}${BasePath}`;

// 阿里云OSS相关常量
export const OssBucket = 'cartea-ai-labs';
export const OssBucketHZ = 'cartea-hz';
export const OssRegion = 'oss-cn-shenzhen';
export const OssRegionAccelerate = 'oss-accelerate'; // 加速地址
export const OssBasePath = '/cc';
export const ossDomainName = 'aliyuncs.com';
export const ossFileBasePath = `https://${OssBucket}.${OssRegionAccelerate}.${ossDomainName}${OssBasePath}`;
