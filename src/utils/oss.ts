import {
  OssBasePath,
  OssBucket,
  OssBucketHZ,
  OssRegion,
  ossDomainName,
} from '@/config/cos.config';
import { t } from '@/i18n/utils';
import { ossSession } from '@/services/cos.service';
import OSS from 'ali-oss';
import { message } from 'antd';
import { RcFile } from 'antd/es/upload';

export enum taskStatusEnum {
  /* 上传成功 */
  success = 'success',
  /* 上传中 */
  uploading = 'uploading',
  /* 暂停上传 */
  paused = 'paused',
  canceled = 'canceled',
}

export interface IOSSUpload {
  id: string;
  Bucket: string;
  Region: string;
  Key: string;
  FilePath: string;
  state: taskStatusEnum;
  loaded: number;
  size: number;
  speed: number;
  percent: number;
  hashPercent: number;
  error: null;
}

export interface IUploadRes {
  name: string;
  url: string;
  size: number;
  status: string;
  res: OSS.MultipartUploadResult;
  webkitRelativePath: string;
}

export interface IUploadResultRes extends OSS.MultipartUploadOptions {
  url: string;
  name: string;
  size: number;
  webkitRelativePath: string;
}

export interface IOssClientOptions {
  accessKeyId: string;
  accessKeySecret: string;
  stsToken: string;
  bucket: string;
  region: string;
  secure: boolean;
}

// 创建OSS客户端
let ossClient: OSS | null = null;

const options = {
  // 设置并发上传的分片数量。
  parallel: 4,
  // 设置分片大小。默认值为1 MB，最小值为100 KB，最大值为5 GB。最后一个分片的大小允许小于100 KB。
  partSize: 1024 * 1024,
  // headers,
  // 自定义元数据，通过HeadObject接口可以获取Object的元数据。
  // meta: { uid: Number(uid) || Math.random(), pid: Number(uid) || Math.random() },
  mime: 'text/plain',
};

// 初始化OSS客户端
export const initOssClient = async (bucket?: string, region?: string) => {
  console.log('🚀 ~ oss.ts:80 ~ region:', region);
  try {
    const { data } = await ossSession();
    ossClient = new OSS({
      accessKeyId: data.access_key_id,
      accessKeySecret: data.access_key_secret,
      stsToken: data.security_token,
      bucket: data.bucket || bucket,
      region: OssRegion,
    });
    return ossClient;
  } catch (error) {
    console.error('初始化OSS客户端失败', error);
    message.error(t('service-error'));
    return null;
  }
};

// 获取OSS客户端实例
export const getOssClient = async (
  bucket?: string,
  region?: string,
): Promise<OSS | null> => {
  const currentBucket = (ossClient as any)?.options?.bucket;
  const isSameBucket = bucket ? currentBucket === bucket : true;

  if (ossClient && isSameBucket) {
    return ossClient;
  }

  // 如果当前没有实例，或 bucket 不一致，则重新初始化
  return await initOssClient(bucket, region);
};

export const uploadFile = async ({
  uid,
  file,
  dir,
  fileName,
  onProgress,
  onSuccess,
  onError,
  needTranscoding = false, // 需要后端转码时，需要将视频上传到 杭州的存储桶
}: {
  uid?: string;
  file: RcFile | File;
  dir: string;
  /** 默认以 {uid}_{file.name} 作为文件名， 该字段直接指定文件名 */ fileName?: string;
  onProgress?: (progress: { percent: number }) => void;
  onSuccess?: (res: IUploadRes) => void;
  onError?: (err: Error) => void;
  needTranscoding?: boolean;
}) => {
  const bucket = needTranscoding ? OssBucketHZ : OssBucket;
  const client = await getOssClient(bucket, OssRegion);
  if (!client) {
    const error = new Error(t('oss-client-init-error'));
    if (onError) onError(error);
    return Promise.reject(error);
  }

  const Key = fileName
    ? `${OssBasePath}${dir}/${fileName}`
    : `${OssBasePath}${dir}/${uid}_${file.name}`;

  return new Promise<IUploadRes>((resolve, reject) => {
    client
      .multipartUpload(Key, file, {
        ...options,
        progress: (p) => {
          const percent = Math.floor(p * 100);
          console.log(' oss.ts:124 percent:', percent);
          if (onProgress) {
            onProgress({ percent });
          }
        },
      })
      .then((result: OSS.MultipartUploadResult) => {
        const fileUrl = `https://${bucket}.${OssRegion}.${ossDomainName}/${result.name}`;
        const response = {
          name: file.name,
          url: fileUrl,
          size: file.size,
          status: 'done',
          res: result,
          webkitRelativePath: Key,
        };
        onSuccess?.(response);
        resolve(response);
      })
      .catch((err) => {
        message.error(t('service-error'));
        onError?.(err);
        reject(err);
      });
  });
};

export const downloadInBrowserBuilt = async (
  downloadUrl: string,
  fileName: string,
) => {
  try {
    const client = await getOssClient();
    if (!client) {
      message.error(t('oss-client-init-error'));
      return;
    }

    // 解析出OSS Key
    const key = decodeURI(
      downloadUrl.replace(
        `https://${OssBucket}.${OssRegion}.${ossDomainName}/`,
        '',
      ),
    );

    // 生成签名URL，设置文件下载而非预览
    const url = client.signatureUrl(key, {
      expires: 3600, // 链接有效期1小时
      response: {
        'content-disposition': `attachment; filename=${encodeURIComponent(
          fileName,
        )}`,
      },
    });

    // 在新窗口打开下载链接
    window.open(url, '_self');
  } catch (error) {
    console.error('下载文件失败', error);
    message.error(t('service-error'));
  }
};
