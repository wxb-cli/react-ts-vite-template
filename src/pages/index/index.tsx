import React, { useMemo, useState } from 'react';
import styles from './index.module.less';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  QuestionOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import logoIcon from '../../../public/logo.jpg';
import { useHistory, Switch } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { menuRoutes } from '../../../config/routes';

const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('反馈意见', '/feedback', <QuestionOutlined />),
  getItem('Team', 'sub2', <TeamOutlined />, [
    getItem('Team 1', '/feedback1'),
    getItem('Team 2', '/feedback2'),
  ]),
];

const Index: React.FC = () => {
  const history = useHistory();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [keyPathList, setKeyPathList] = useState<string[]>([]);

  const selectedMenuItem = ({
    key,
    keyPath,
  }: {
    key: string;
    keyPath: string[];
  }) => {
    setKeyPathList(keyPath);
    history.push('/index' + key);
  };

  const breadcrumbList = useMemo(() => {
    let arr = keyPathList.reverse();
    if (!arr.length) {
      return [];
    }
    let itemsArr = JSON.parse(JSON.stringify(items));

    function findPath(
      itemsArr: any[],
      arr: any[],
      arrIndex: number
    ): any[] | null {
      for (let i = 0; i < itemsArr.length; i++) {
        if (arr[arrIndex] === itemsArr[i].key) {
          const temp = findPath(itemsArr[i].children || [], arr, arrIndex + 1);
          if (Array.isArray(temp)) {
            return [{ title: itemsArr[i].label }, temp[0]];
          }
          return [{ title: itemsArr[i].label }];
        }
      }
      return null;
    }
    return findPath(itemsArr, arr, 0);
  }, [keyPathList]);

  return (
    <Layout className={styles.layout}>
      <Sider
        className={`${styles.siderBox} ${
          collapsed ? styles.collapsedSider : ''
        }`}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className={styles.siderTitle}>
          <img src={logoIcon} alt="logo" />
          <span>记账小册后台管理系统</span>
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={['/feedback']}
          mode="inline"
          items={items}
          onSelect={selectedMenuItem}
        />
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb
            style={{ margin: '16px 0' }}
            items={breadcrumbList || []}
          ></Breadcrumb>
          <Switch>{renderRoutes(menuRoutes)}</Switch>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Index;
