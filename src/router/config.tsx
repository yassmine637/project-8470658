import type { RouteObject } from 'react-router-dom';
import NotFound from '@/pages/NotFound';
import HomePage from '@/pages/home/page';
import ProductsPage from '@/pages/products/page';
import ProductDetailPage from '@/pages/products/detail';
import B2BPage from '@/pages/b2b/page';
import ConfiguratorPage from '@/pages/configurator/page';
import AuthPage from '@/pages/auth/page';
import AdminPage from '@/pages/admin/page';
import AccountPage from '@/pages/account/page';
import CheckoutSuccess from '@/pages/checkout/success';
import CheckoutCancel from '@/pages/checkout/cancel';
const routes: RouteObject[] = [
  { path: '/', element: <HomePage /> },
  { path: '/products', element: <ProductsPage /> },
  { path: '/products/:slug', element: <ProductDetailPage /> },
  { path: '/b2b', element: <B2BPage /> },
  { path: '/configurator', element: <ConfiguratorPage /> },
  { path: '/auth', element: <AuthPage /> },
  { path: '/admin', element: <AdminPage /> },
  { path: '/account', element: <AccountPage /> },
  { path: '/checkout/success', element: <CheckoutSuccess /> },
  { path: '/checkout/cancel', element: <CheckoutCancel /> },
  { path: '*', element: <NotFound /> },
];

export default routes;
