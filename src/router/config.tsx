import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import NotFound from '@/pages/NotFound';
import HomePage from '@/pages/home/page';
import ProductsPage from '@/pages/products/page';
import ConfiguratorPage from '@/pages/configurator/page';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/products',
    element: <ProductsPage />,
  },
  {
    path: '/products/:id',
    element: <Navigate to="/products" replace />,
  },
  {
    path: '/configurator',
    element: <ConfiguratorPage />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
