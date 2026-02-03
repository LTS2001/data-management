import { BasePath, Bucket, cosDomainName, Region } from '@/config/cos.config';
import { t } from '@/i18n/utils';
import { cosSession } from '@/services/cos.service';
import { message } from 'antd';
import { RcFile } from 'antd/es/upload';
import COS from 'cos-js-sdk-v5';

export enum taskStatusEnum {
  /* 上传成功 */
  success = 'success',
  /* 上传中 */
  uploading = 'uploading',
  /* 暂停上传 */
  paused = 'paused',
  canceled = 'canceled',
}

export interface ICOSUpload {
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
  statusCode: number;
  headers: Headers;
  Location: string;
  ETag: string;
  RequestId: string;
  url: string;
  name: string;
  size: number;
  webkitRelativePath: string;
}
export interface IUploadResultRes extends COS.UploadFileResult {
  url: string;
  name: string;
  size: number;
  webkitRelativePath: string;
}
export interface Headers {
  'content-length': string;
  etag: string;
  'x-cos-request-id': string;
}
export const cos = new COS({
  Domain: 'gcc-1307444343.cos.accelerate.myqcloud.com', // 自定义加速域名
  Protocol: 'https:', // 请求协议： 'https:' 或 'http:'
  async getAuthorization(_, callback) {
    const { data } = await cosSession();
    callback({
      TmpSecretId: data.credentials.tmpSecretId,
      TmpSecretKey: data.credentials.tmpSecretKey,
      SecurityToken: data.credentials.sessionToken,
      StartTime: data.startTime, // 时间戳，单位秒，如：1580000000
      ExpiredTime: data.expiredTime, // 时间戳，单位秒，如：1580000000
    });
  },
});

export const uploadFile = ({
  uid,
  file,
  dir,
  fileName,
  onProgress,
  onSuccess,
  onError,
}: {
  uid?: string;
  file: RcFile | File;
  dir: string;
  /** 默认以 {uid}_{file.name} 作为文件名， 该字段直接指定文件名 */ fileName?: string;
  onProgress?: (progress: { percent: number }) => void;
  onSuccess?: (res: IUploadResultRes) => void;
  onError?: (err: COS.CosSdkError) => void;
}) => {
  const Key = fileName
    ? `${BasePath}${dir}/${fileName}`
    : `${BasePath}${dir}/${uid}_${file.name}`;

  return new Promise((resolve, reject) => {
    cos.uploadFile(
      {
        Bucket,
        Region,
        Key,
        Body: file,
        SliceSize: 1024 * 1024 * 5,
        onProgress(progressData) {
          const percent =
            parseInt(String(progressData.percent * 10000), 10) / 100;
          if (onProgress) {
            onProgress({ percent });
          }
        },
      },
      (err, data) => {
        if (err) {
          // console.error('err', err);
          if (onError) {
            onError(err);
          }
          reject(err);
        }
        try {
          const fileUrl = `https://${data.Location}`;
          if (onSuccess) {
            onSuccess({
              ...data,
              url: fileUrl,
              name: file.name,
              size: file.size,
              webkitRelativePath: Key,
            });
          }
          resolve({
            ...data,
            url: fileUrl,
            name: file.name,
            size: file.size,
            webkitRelativePath: Key,
          } as unknown as IUploadRes);
        } catch (e) {
          // console.error(e);
          message.error(t('service-error'));
        }
      },
    );
  }) as Promise<IUploadRes>;
};

export const downloadInBrowserBuilt = (
  downloadUrl: string,
  fileName: string,
) => {
  cos.getObjectUrl(
    {
      Bucket,
      Region,
      Key: decodeURI(
        downloadUrl.replace(
          `https://${Bucket}.cos.${Region}.${cosDomainName}`,
          '',
        ),
      ),
      Sign: true,
      Headers: {
        ResponseContentDisposition: `attachment;filename=${fileName}`,
      },
    },
    function (err, data) {
      if (err) return;
      const browserDownloadUrl = `${
        data.Url + (data.Url.indexOf('?') > -1 ? '&' : '?')
      }response-content-disposition=attachment;filename=${fileName}`; // 补充强制下载的参数以及文件名
      window.open(browserDownloadUrl, '_self');
    },
  );
};

// 轮询任务执行结果
export function queryTranceTrack(jobId: string | number) {
  setTimeout(() => {
    const key = `jobs/${jobId}`; // jobId: 需要查询的jobId;
    const host = Bucket + '.ci.' + Region + '.myqcloud.com';
    const url = `https://${host}/${key}`;
    cos.request(
      {
        Bucket,
        Region,
        Method: 'GET',
        Url: url,
        Key: key /** 固定值，必须 */,
        ContentType: 'application/xml' /** 固定值，必须 */,
      },
      async (err, data) => {
        if (err) {
          console.log(JSON.stringify(err));
          return;
        }
        const resp = data.Response || {};
        //判断任务是否在执行中
        console.log(resp.JobsDetail.Progress, resp.JobsDetail);
        if (
          resp.JobsDetail.State !== 'Success' &&
          resp.JobsDetail.State !== 'Failed'
        ) {
          queryTranceTrack(jobId);
          return;
        } else {
          console.log('转码结束', resp.JobsDetail);
        }
      },
    );
  }, 2000);
}

/**
 * 对一个视频文件进行混音和转码操作
 *  或配置转码参数 不支持选分辨率
 *   Transcode: {
 *   Container: {
 *     Format: 'mp4',
 *   },
 *   Video: {
 *     Codec: 'H.264',
 *   },
 *   Audio: {
 *     Codec: "aac",
 *    },
 *    混音参数
 *   AudioMix: {
 *       AudioSource: config.MixFileNa 混音文件路径
 *       Replace: tr 是否保留被混音视频的源音频
 *   },
 *  },
 * @param originFileName - 需要操作的视频文件的文件名 '/transcode/test4k.mp4'   支持使用cos桶文件，如果文件为私有读，需要使用cos.getObjectUrl方法得到一个带有签名信息的url
 ** @param resultFileName - 操作结果的文件名 '/transcode/test4k-H264-transcode-result.mp4'
 ** @returns {Promise<void>}
 */

export async function transVideoCode({
  originFilePath,
  resultFilePath,
}: {
  originFilePath: string;
  resultFilePath: string;
}) {
  console.log('resultFilePath:', resultFilePath);
  const key = `jobs`; // 固定值，必须
  const host = `${Bucket}.ci.${Region}.myqcloud.com`;
  const url = `https://${host}/${key}`;
  const body = COS.util.json2xml({
    Request: {
      Tag: 'Transcode',
      Input: {
        Object: originFilePath,
      },
      Operation: {
        // 转码参数模板
        // TemplateId: 't04df9eb0c373c4a8780ec894ce05469a7',
        // TemplateId: 't1a8fab9383d554fb1a521ce35a54eba3c',
        Transcode: {
          Container: {
            Format: 'mp4',
          },
          Video: {
            Codec: 'H.264',
          },
          Audio: {
            Codec: 'aac',
          },
        },

        Output: {
          Region,
          Bucket,
          Object: resultFilePath,
        },
      },
    },
  });

  const res = await cos.request({
    Method: 'POST', // 固定值
    Key: key, // 固定值
    Url: url, // 请求的url
    Body: body, // 请求体参数
    ContentType: 'application/xml', // 固定值
  });
  console.log('res:', res);
  queryTranceTrack(res.Response.JobsDetail.JobId);
}
