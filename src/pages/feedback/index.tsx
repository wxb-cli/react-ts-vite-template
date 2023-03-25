import { useEffect } from 'react';
import styles from './index.module.less';
import { queryFeedback } from '@/services/api';

function Feedback() {
  useEffect(() => {
    queryFeedback({});
  }, []);
  return <div className={styles.wrapper}>feedback</div>;
}

export default Feedback;
