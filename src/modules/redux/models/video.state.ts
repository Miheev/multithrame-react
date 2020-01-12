import { RequestStateEnum } from 'src/modules/shared/models';
import { ScrollState } from './scroll.state';
import { VideoModel } from 'src/features/popular/models';

export class VideoState extends ScrollState {
  loadingState = RequestStateEnum.empty;
  videoList: VideoModel[] = [];
  isOpenFromList = false;
  nextPageToken = '';
  remainingVideos = -1;
}
