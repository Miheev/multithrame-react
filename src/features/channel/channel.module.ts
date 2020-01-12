import { lazy } from 'react';

let ChannelListPage = lazy(() => import('./components/channel-list-page'));

export const channelRoutes = [
  { exact: true, path: '/channel', component: ChannelListPage },
];
