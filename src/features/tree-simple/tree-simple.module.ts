import { lazy } from 'react';

let TreePage = lazy(() => import('./components/tree-page'));

export const treeSimpleRoutes = [
  { exact: true, path: '/tree-simple', component: TreePage },
];
