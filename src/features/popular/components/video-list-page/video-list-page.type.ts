import { RouteComponentProps } from 'react-router-dom';

import { AppStoreConnector } from 'src/modules/core/services/app-store.connector';
import { VideoConnector } from 'src/features/popular/service/video.connector';
import { VideoModel } from 'src/features/popular/models';
import { InfiniteScrollConnector } from 'src/modules/core/services/infinite-scroll.connector';
import { CommonState } from 'src/modules/redux/models';
import { RequestStateEnum } from 'src/modules/shared/models';

export interface VideoListPageProps {
  common: CommonState;
  videoList: VideoModel[];
  remainingVideos: number;
  loadingState: RequestStateEnum;
}

export interface VideoListPageViewProps extends VideoListPageProps, RouteComponentProps {
  videoConnector: VideoConnector,
  appConnector: AppStoreConnector,
  scrollConnector: InfiniteScrollConnector;
  removeScrollConnector: () => void;
}
