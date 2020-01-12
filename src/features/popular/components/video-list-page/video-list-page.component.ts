import { connect } from 'react-redux';

import { AppState } from 'src/modules/redux/models';
import { AppStoreConnector } from 'src/modules/core/services/app-store.connector';
import { videoInjector } from 'src/features/popular/service/video.container';
import { VideoConnector } from 'src/features/popular/service/video.connector';
import { VideoListPageView } from './video-list-page.view';
import { InfiniteScrollConnector } from 'src/modules/core/services/infinite-scroll.connector';


export const videoListPageInjector = videoInjector.createChild();

function removeScrollConnector(): void {
  videoListPageInjector.remove('scrollConnector');
}

let isNotUpd = true;

export const VideoListPage = connect((state: AppState) => {
  if (isNotUpd) {
    console.time('VideoListPage');
    isNotUpd = false;
  }

  // not time consuming operations
  let appConnector: AppStoreConnector = videoListPageInjector.get('appConnector') as AppStoreConnector;
  let videoConnector: VideoConnector = videoListPageInjector.get('videoConnector') as VideoConnector;
  let scrollConnector: InfiniteScrollConnector = videoListPageInjector.getOrCreateIfAbsent('scrollConnector') as InfiniteScrollConnector;

  return {
    common: state.common,
    videoList: state.video.videoList,
    remainingVideos: state.video.remainingVideos,
    loadingState: state.video.loadingState,

    appConnector,
    videoConnector,
    scrollConnector,
    removeScrollConnector,
  };
})(VideoListPageView);
