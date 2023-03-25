import { lazy } from 'react';
import { RouteConfig } from 'react-router-config';

const routes: RouteConfig[] = [
  {
    path: '/index',
    component: lazy(() => import('@/pages/index/index')),
  },
  {
    exact: true,
    path: '/login',
    component: lazy(() => import('@/pages/login/index')),
  },
  {
    path: '*',
    component: lazy(() => import('@/pages/404/index')),
  },
];

export const menuRoutes: RouteConfig[] = [
  {
    path: '/index/feedback',
    component: lazy(() => import('@/pages/feedback/index')),
  },
];

export default routes;
