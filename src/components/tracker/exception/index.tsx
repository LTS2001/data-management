import { Link } from '@umijs/max';
import { Button } from 'antd';
import typeConfigMap from './config';
import styles from './style.module.less';

interface ExceptionProps {
  type: keyof typeof typeConfigMap;
  homePage?: string;
}

export default function Exception(props: ExceptionProps) {
  const { type, homePage } = props;
  const pageType = type in typeConfigMap ? type : '404';
  const configObj = typeConfigMap[pageType];

  console.log(props);
  console.log(pageType);

  return (
    <div className={styles.exception}>
      <div className={styles.imgBlock}>
        <div
          className={styles.imgEle}
          style={{ backgroundImage: `url(${configObj.img})` }}
        />
      </div>
      <div className={styles.content}>
        <h1>{configObj.title}</h1>
        <div className={styles.desc}>{configObj.desc}</div>
        <div className={styles.actions}>
          <Link to={homePage || '/'}>
            <Button type="primary">返回首页</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
