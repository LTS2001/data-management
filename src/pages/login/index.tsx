import { AI_LAB_TOKEN_KEY, SYSTEM_NAME } from '@/config';
import { defaultCatchApiError } from '@/services/request';
import { ILoginParams } from '@/services/types/user.type';
import { login, register } from '@/services/user.service';
import { checkLogin } from '@/utils/auth';
import { buildLink } from '@/utils/link';
import { local } from '@/utils/storage';
import { Button, ConfigProvider, Form, Input, message, Tabs } from 'antd';
import { FormInstance } from 'antd/lib/form/hooks/useForm';
import { TFunction } from 'i18next';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
// import { useTranslation } from 'react-i18next';
// import { TFunction } from 'i18next';
// import { openExternalUrl } from '@/utils/client';

enum EActiveKey {
  login = 'login',
  register = 'register',
  forgetPassword = 'forgetPassword',
}

const RegisterForm = ({
  form,
  t,
  activeKey,
}: {
  form: FormInstance;
  t: TFunction;
  activeKey: EActiveKey;
  setActiveKey: (key: EActiveKey) => void;
}) => {
  // const handleSendCode = async () => {
  //   const values = await form.getFieldsValue();
  //   await sendCode(values.account, 1);=
  //   message.success(t('send-code-success'));
  // };
  return (
    <>
      {/* 验证码 */}
      {/* <ProFormCaptcha
        fieldProps={{
          prefix: <LockOutlined className={'prefixIcon'} />,
        }}
        countDown={60}
        placeholder={t('input-captcha')}
        captchaTextRender={(timing, count) => {
          if (timing) {
            return `${count} ${t('get-captcha')}`;
          }
          return t('get-captcha');
        }}
        name="code"
        rules={[
          {
            required: true,
            message: t('input-captcha-required'),
          },
        ]}
        onGetCaptcha={handleSendCode}
      /> */}

      <Form.Item
        name={'password'}
        // - 至少一个大写字母
        // - 至少一个小写字母
        // - 至少一个数字
        // - 至少一个特殊字符（如：!@#$%^&*）
        // - 8位以上
        rules={[
          {
            required: true,
            message: t('password-is-required'),
          },
          // {
          //   pattern:
          //     /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-.|]).{8,}$/,
          //   message: t('password-format-error'),
          // },
        ]}
      >
        <Input.Password
          placeholder={t('please-input-password')}
          autoComplete="off"
        />
      </Form.Item>
      <Form.Item
        name={'repeat-password'}
        required={true}
        rules={[
          // {
          //   pattern:
          //     /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-.|]).{8,}$/,
          //   message: t('password-format-error'),
          // },
          {
            validator: (_, value) => {
              if (value !== form.getFieldValue('password')) {
                return Promise.reject(new Error(t('password-not-match')));
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <Input.Password
          placeholder={t('please-input-password-again')}
          autoComplete="off"
        />
      </Form.Item>
      {activeKey === EActiveKey.register && (
        <Form.Item
          name={'name'}
          rules={[
            {
              required: true,
              message: t('user-name-is-required'),
            },
          ]}
        >
          <Input placeholder={t('please-input-user-name')} autoComplete="off" />
        </Form.Item>
      )}
    </>
  );
};

const LoginForm = ({
  t,
}: // ,
{
  t: TFunction;
  setActiveKey: (key: EActiveKey) => void;
}) => {
  return (
    <Form.Item
      name={'password'}
      rules={[
        {
          required: true,
          message: t('password-is-required'),
        },
      ]}
    >
      <Input.Password
        placeholder={t('please-input-password')}
        autoComplete="off"
        style={{ borderRadius: '6px', height: '40px' }}
      />
    </Form.Item>
  );
};

export default function Login() {
  // const navigate = useNavigate();
  const { t } = useTranslation('user');
  const [loading, setLoading] = useState(false);
  const buttonTextMap = {
    [EActiveKey.login]: t('login'),
    [EActiveKey.register]: t('register'),
    [EActiveKey.forgetPassword]: t('change-your-password'),
  };

  // 获取地址栏的activeTab参数
  const urlParams = new URL(window.location.href).searchParams;
  const activeTab = urlParams.get('activeTab') as EActiveKey;
  const email = urlParams.get('email') as string;
  const [activeKey, setActiveKey] = useState<EActiveKey>(
    activeTab || EActiveKey.login,
  );

  const [form] = Form.useForm();
  const handleSubmit = async (values: ILoginParams) => {
    // return;
    if (activeKey === EActiveKey.login) {
      try {
        setLoading(true);
        const loginRes = await login({ ...values, email: values.email });
        const token: string = `${loginRes.data.token_type} ${loginRes.data.access_token}`;
        Cookies.set(AI_LAB_TOKEN_KEY, token, {
          domain: location.origin,
          path: '/',
        });

        local.set(AI_LAB_TOKEN_KEY, token);

        await checkLogin();
        window.location.href = buildLink('/home');
      } catch (error) {
        console.error(error);
        defaultCatchApiError(error);
      } finally {
        setLoading(false);
      }
    } else if (activeKey === EActiveKey.register) {
      try {
        setLoading(true);
        await register({
          ...values,
          email: values.email,
        });

        message.success(t('register-success'));
        sessionStorage.setItem('register-info', JSON.stringify(values));
        setActiveKey(EActiveKey.login);
      } catch (error) {
        defaultCatchApiError(error);
      } finally {
        setLoading(false);
      }
    }
    // else if (activeKey === EActiveKey.forgetPassword) {
    //   const forgetPasswordRes = await resetPassword({
    //     ...values,
    //     email: values.account,
    //     newPassword: values.password,
    //     code: values.code,
    //   });
    //   if (forgetPasswordRes.code !== 0) {
    //     message.error(forgetPasswordRes.msg);
    //     return;
    //   }
    //   message.success(t('reset-password-success'));
    //   sessionStorage.setItem('register-info', JSON.stringify(values));
    //   setActiveKey(EActiveKey.login);
    // }
  };

  useEffect(() => {
    const registerInfo = sessionStorage.getItem('register-info');
    if (registerInfo) {
      form.setFieldsValue(JSON.parse(registerInfo));
    }
    if (email) {
      form.setFieldsValue({ account: email });
    }
  }, [activeKey, email]);

  return (
    <ConfigProvider
      theme={
        {
          // token: {
          //   colorPrimary: '#048b60',
          // },
        }
      }
    >
      <div className="h-full flex gap-10 flex-col">
        {/* <img src={logo} alt="logo" className="w-40 max-md:w-32 object-contain" /> */}
        <div className="h-[80px]" />
        <div className="flex flex-col items-center justify-center h-full  sm:transform-none ">
          {/* <img
            src={logo}
            alt="logo"
            className="w-40 max-md:w-32 object-contain mb-5"
          /> */}
          <h1 className="text-3xl font-bold  mb-8 text-[#1677ff]">
            {SYSTEM_NAME}
          </h1>

          <Tabs
            activeKey={activeKey}
            onChange={(value) => setActiveKey(value as EActiveKey)}
            items={[
              { key: EActiveKey.login, label: t('login') },
              { key: EActiveKey.register, label: t('register') },
            ]}
          />

          <Form<ILoginParams>
            form={form}
            onFinish={async (values) => {
              await handleSubmit(values);
            }}
            autoComplete="off"
            className="w-80 mt-8"
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: t('email-is-required'),
                },
                {
                  type: 'email',
                  message: t('email-is-valid'),
                },
              ]}
            >
              <Input
                placeholder={t('please-input-email')}
                autoComplete="off"
                style={{ borderRadius: '6px', height: '40px' }}
              />
            </Form.Item>
            {activeKey === EActiveKey.login ? (
              <LoginForm t={t} setActiveKey={setActiveKey} />
            ) : (
              <RegisterForm
                form={form}
                t={t}
                activeKey={activeKey}
                setActiveKey={setActiveKey}
              />
            )}

            <Button
              size={'large'}
              type="primary"
              htmlType="submit"
              style={{ width: '100%', borderRadius: '6px' }}
              loading={loading}
            >
              {buttonTextMap[activeKey]}
            </Button>
            {/* {(activeKey === EActiveKey.login ||
              activeKey === EActiveKey.forgetPassword) && (
              <span
                onClick={() =>
                  setActiveKey(
                    activeKey === EActiveKey.login
                      ? EActiveKey.forgetPassword
                      : EActiveKey.login,
                  )
                }
                className="text-right w-full block  mt-2 cursor-pointer text-[#1677ff]"
              >
                {activeKey === EActiveKey.login
                  ? t('reset-password')
                  : t('back-to-login')}
              </span>
            )} */}
          </Form>
        </div>
      </div>
    </ConfigProvider>
  );
}
