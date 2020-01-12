import { RouteComponentProps } from 'react-router-dom';

import { ToasterService } from 'src/modules/di/models';
import { VideoConnector } from 'src/features/popular/service/video.connector';
import { YoutubeService } from 'src/modules/youtubeApi/services/youtube.service';

export interface PlayerPageParams {
  id: string
}

export interface PlayerPageProps extends RouteComponentProps<PlayerPageParams> {
  isOpenFromList: boolean;

  videoConnector: VideoConnector,
  toaster: ToasterService,
  youtubeService: YoutubeService
}

export interface PlayerPageState {
  isLoading: boolean;
  embedUrl: string;
}
