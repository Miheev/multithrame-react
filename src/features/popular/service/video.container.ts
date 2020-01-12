import { AppStoreConnector } from 'src/modules/core/services/app-store.connector';
import { sharedInjector } from 'src/modules/core/services/shared.container';
import { VideoConnector } from './video.connector';
import { YoutubeService } from 'src/modules/youtubeApi/services/youtube.service';
import { ContainerRef } from 'src/modules/di/models';

let videoConnector = new VideoConnector(
  sharedInjector.get('youtubeService') as YoutubeService,
  sharedInjector.get('appConnector') as AppStoreConnector,
);

let containerRef = {
  container: {
    videoConnector,
    /*videoConnector: null as VideoConnector,
    videoConnectorProvider: {
      type: VideoConnector,
      deps: ['youtubeService', 'appConnector'],
    } as DiProvider,*/
  },
};

let injector = sharedInjector.createChild();

export const videoContainerRef: ContainerRef<typeof containerRef.container> = containerRef;
export const videoInjector = injector.mergeContainer<typeof videoContainerRef.container>(videoContainerRef);
