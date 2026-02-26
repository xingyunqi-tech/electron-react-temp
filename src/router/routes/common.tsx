import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

const Home = lazy(() => import('@/views/Home/index'));
const OrganoidIntelligence = lazy(() => import('@/views/OrganoidIntelligence/index'));
const Platform = lazy(() => import('@/views/Platform/index'));
const Capabilities = lazy(() => import('@/views/Capabilities/index'));
const Products = lazy(() => import('@/views/Products/index'));
const AboutUs = lazy(() => import('@/views/AboutUs/index'));
const News = lazy(() => import('@/views/News/index'));
const Contact = lazy(() => import('@/views/Contact/index'));

/** 着陆页共用的 Layout 配置：隐藏系统 Header */
const landingLayout = { layout: { layout: { header: false } } };

/**
 * 公共路由（所有登录用户可访问）
 */
export const commonRoutes: RouteObject[] = [
  {
    index: true,
    element: <Navigate to="/home" replace />,
  },
  {
    path: 'home',
    element: <Home />,
    handle: { title: '首页' },
  },
  {
    path: 'organoid-intelligence',
    element: <OrganoidIntelligence />,
    handle: { title: 'Organoid Intelligence', ...landingLayout },
  },
  {
    path: 'platform',
    element: <Platform />,
    handle: { title: 'Platform', ...landingLayout },
  },
  {
    path: 'capabilities',
    element: <Capabilities />,
    handle: { title: 'Capabilities', ...landingLayout },
  },
  {
    path: 'products',
    element: <Products />,
    handle: { title: 'Products', ...landingLayout },
  },
  {
    path: 'about-us',
    element: <AboutUs />,
    handle: { title: 'About Us', ...landingLayout },
  },
  {
    path: 'news',
    element: <News />,
    handle: { title: 'News & Perspectives', ...landingLayout },
  },
  {
    path: 'contact',
    element: <Contact />,
    handle: { title: 'Contact', ...landingLayout },
  },
];
