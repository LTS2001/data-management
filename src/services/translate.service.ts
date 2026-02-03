import { t } from '@/i18n/utils';
import { message } from 'antd';
import axios from 'axios';

/** dify 反思翻译 更准确 */
export const criticismTranslate = async ({
  sourceLang,
  targetLang,
  sourceText,
  country,
}: {
  sourceLang: string;
  targetLang: string;
  sourceText: string;
  country: string;
}): Promise<string | null> => {
  try {
    const options = {
      method: 'POST',
      url: 'https://dify.xiaofeilun.cn/v1/workflows/run',
      params: { '': '' },
      headers: {
        Authorization: 'Bearer app-1iMIe70xyb0q2DUHhiAg9LtM',
        'Content-Type': 'application/json',
      },
      data: {
        inputs: {
          source_lang: sourceLang,
          target_lang: targetLang,
          source_text: sourceText,
          country,
        },
        response_mode: 'blocking',
        user: 'cartea-super-admin',
      },
    };
    const result = await axios.request(options);
    return result.data?.data?.outputs?.Translation;
  } catch (err) {
    console.log(err);
    return null;
  }
};

/** 谷歌翻译接口 */
export const googleTranslate = async ({
  query,
  source = 'auto',
  target = 'en',
}: {
  query: string;
  source?: string;
  target?: string;
}) => {
  if (!query) return query;
  try {
    const response = await axios.get(
      'https://translate.googleapis.com/translate_a/single',
      {
        params: {
          client: 'gtx',
          dt: 't',
          sl: source,
          tl: target,
          q: query,
        },
      },
    );

    // console.log('Translation:', response.data[0][0][0]);
    // return response;
    return response.data[0].map((item: any) => item[0]).join('');
  } catch (error) {
    console.error('Error:', error);
  }
};

/** yandex翻译token */
export async function getYandexToken() {
  try {
    const url =
      'https://translate.yandex.net/website-widget/v1/widget.js?widgetId=ytWidget&pageLang=es&widgetTheme=light&autoMode=false';

    const response = await axios.get(url);
    const data = response.data;
    // eslint-disable-next-line no-useless-escape
    const sidMatch = data.match(/sid\:\s\'[0-9a-f\.]+/);
    let token = '';
    let expires = Date.now() + 30 * 60 * 1000; // 30 minutes from now

    if (!sidMatch || !sidMatch[0] || sidMatch[0].length <= 7) {
      return null;
    }

    token = sidMatch[0].substring(6);

    return {
      accessToken: token,
      accessTokenExpiresAt: new Date(expires).toISOString(),
    };
  } catch (error) {
    message.error(t('get-translate-token-failed'));
    console.error('getYandexToken error:', error);
    return Promise.reject();
  }
}

/** yandex翻译接口 */
export async function yandexTranslate(
  text: string,
  token: string,
  lang = 'ar',
  sourceLang: string = 'zh',
) {
  // console.log("text:", text)
  if (!text) return null;
  try {
    const query = new URLSearchParams();
    query.append('srv', 'tr-url-widget');
    query.append('id', `${token}-0-0`);
    query.append('format', 'html');
    query.append('source_lang', sourceLang);
    query.append('target_lang', lang);
    query.append('text', text);

    const url = `https://translate.yandex.net/api/v1/tr.json/translate?${query.toString()}`;

    const response = await axios.get(url);

    if (response.status !== 200) {
      console.log('Request failed with status:', response.status);
      return null;
    }

    const data = response.data;

    if (!data || !data.text || !data.text[0]) {
      console.log('Invalid response data:', data);
      return null;
    }

    return data.text[0];
  } catch (error) {
    message.error(t('translate-failed'));
    console.error('translate error:', error);
    return Promise.reject();
  }
}

export async function difyTranslate(ARABIC_NEWS: string): Promise<{
  content?: string;
  description?: string;
  title?: string;
}> {
  return new Promise((resolve, reject) => {
    let result = {};
    let workflowRunId = '';
    axios({
      url: 'https://dify.xiaofeilun.cn/v1/workflows/run',
      method: 'POST',
      headers: {
        Authorization: `Bearer app-AcleUOgJcgrCccVD3LFpU8WR`,
      },
      data: {
        inputs: {
          ARABIC_NEWS,
        },
        response_mode: 'streaming',
        user: 'cartea-super-admin',
      },
      onDownloadProgress(progressEvent) {
        if (!workflowRunId) {
          const firstChunk = progressEvent.event.target.responseText;
          workflowRunId = firstChunk;
          const match = firstChunk.match(/"workflow_run_id":\s*"([^"]+)"/);
          if (match) {
            workflowRunId = match[1];
            console.log(workflowRunId);
          } else {
            console.log('difyTranslate error: workflow_run_id not found');
            throw new Error();
          }
        }
      },
    }).then(
      async () => {
        const res = await axios({
          url: `https://dify.xiaofeilun.cn/v1/workflows/run/${workflowRunId}`,
          method: 'GET',
          headers: {
            Authorization: `Bearer app-AcleUOgJcgrCccVD3LFpU8WR`,
          },
        });
        try {
          const outputs = JSON.parse(res.data.outputs);
          const _result = ((Object.values(outputs)[0] as string) || '')
            .replace(/^```json\s*|\s*```$/g, '') // 移除首尾的```json标记
            .trim();
          console.log('这是翻译后的结果', _result);
          result = JSON.parse(_result)[0];
          result ? resolve(result) : reject('');
        } catch (error) {
          console.error(
            `difyTranslate error: /workflows/run/${workflowRunId} return data.outputs is not JSON string`,
          );
          reject('');
        }
      },
      (error) => {
        console.error('difyTranslate error:', error);
        reject('');
      },
    );
  });
}
