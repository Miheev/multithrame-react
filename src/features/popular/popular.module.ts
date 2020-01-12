import { lazy } from 'react';
import { registerVideoEffects } from 'src/features/popular/service/video.subscription';

registerVideoEffects();

let VideoListPage = lazy(() => import('./components/video-list-page'));
let PlayerPage = lazy(() => import('./components/player-page'));

export const popularRoutes = [
  { path: '/popular/:id', component: PlayerPage },
  { exact: true, path: '/popular', component: VideoListPage },
];
