import { useEffect, useState } from 'react';
import styles from './App.module.less';
import routes from '../config/routes';
import { renderRoutes } from 'react-router-config';
import { checkAuth } from './services/api';
import { Row, Col, Spin } from 'antd';

function RouteAuthLoading() {
  return (
    <Row justify="center" align="middle" style={{ height: '100vh' }}>
      <Col>
        <Spin tip="用户认证中..." />
      </Col>
    </Row>
  );
}

const whitelist = ['/login'];

function useAuth() {
  const [loading, setLoading] = useState(
    !whitelist.includes(location.pathname)
  );
  useEffect(() => {
    checkAuth().then(() => {
      setLoading(false);
    });
  }, []);
  return { loading };
}

function App() {
  const { loading } = useAuth();
  if (loading) {
    return <RouteAuthLoading />;
  }

  return <div className={styles.app}>{renderRoutes(routes)}</div>;
}

export default App;
