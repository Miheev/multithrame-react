import { lazy } from 'react';

let TreePage = lazy(() => import('./components/tree-page'));

export const treeRoutes = [
  { exact: true, path: '/tree', component: TreePage },
];
