import { connect } from 'react-redux';

import { PlayerPageView } from 'src/features/popular/components/player-page/player-page.view';
import { VideoConnector } from 'src/features/popular/service/video.connector';
import { videoInjector } from 'src/features/popular/service/video.container';
import { YoutubeService } from 'src/modules/youtubeApi/services/youtube.service';
import { AppState } from 'src/modules/redux/models';
import { ToasterService } from 'src/modules/di/models';

export const playerPageInjector = videoInjector.createChild();

export const PlayerPage = connect((state: AppState) => {
  let videoConnector: VideoConnector = playerPageInjector.get('videoConnector') as VideoConnector;
  let youtubeService: YoutubeService = playerPageInjector.get('youtubeService') as YoutubeService;
  let toaster: ToasterService = playerPageInjector.get('toaster') as ToasterService;

  return {
    isOpenFromList: state.video.isOpenFromList,

    videoConnector,
    toaster,
    youtubeService,
  };
})(PlayerPageView);
