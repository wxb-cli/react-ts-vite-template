import { useState } from 'react';
import { Button, Input, message } from 'antd';
import styles from './index.module.less';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { fetchLogin, checkAuth } from '@/services/api';
import { useHistory } from 'react-router-dom';

const Login = () => {
  const history = useHistory();
  const [name, setName] = useState('');
  const [userPassword, setUserPassword] = useState('');

  const sumbitHandler = async () => {
    if (!name || !userPassword) {
      message.info('用户名和密码不能为空');
      return;
    }
    const res = await fetchLogin({
      name,
      userPassword,
    });
    localStorage.setItem('token', res.token);
    message.success('登录成功');
    history.push('/index');
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.main}>
        <h1 className={styles.title}>记账小册后台管理系统</h1>
        <div className={styles.fnContent}>
          <div className={styles.inputBox}>
            <UserOutlined className={styles.inputIcon} />
            <Input
              className={styles.inputCommon}
              bordered={false}
              placeholder="输入用户名"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className={styles.inputBox}>
            <LockOutlined className={styles.inputIcon} />
            <Input
              type="password"
              className={styles.inputCommon}
              bordered={false}
              placeholder="输入密码"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
            />
          </div>
          <Button
            block
            size="large"
            type="primary"
            className={styles.submitBtn}
            onClick={sumbitHandler}
          >
            登录
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
