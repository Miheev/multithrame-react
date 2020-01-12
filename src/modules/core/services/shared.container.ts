import * as toastr from 'toastr';
import * as axios from 'axios';
import * as store from 'store/dist/store.modern';

import { AppStore } from 'src/modules/redux/app.store';
import { YoutubeService } from 'src/modules/youtubeApi/services/youtube.service';
import { AppStoreConnector } from 'src/modules/core/services/app-store.connector';
import { InfiniteScrollConnector } from 'src/modules/core/services/infinite-scroll.connector';
import { ContainerRef, DiProvider } from 'src/modules/di/models';
import { Injector } from 'src/modules/di/services/injector';


let youtubeService = new YoutubeService(axios.default, toastr);
let appConnector = new AppStoreConnector(youtubeService, AppStore);

let containerRef = {
  container: {
    http: axios.default,
    toaster: toastr,
    store,
    appStore: AppStore,
    youtubeService,
    appConnector,

    scrollConnector: null as InfiniteScrollConnector,
    scrollConnectorProvider: {
      type: InfiniteScrollConnector,
      deps: ['appConnector', 'appStore'],
    } as DiProvider,
  },
};

export const sharedContainerRef: ContainerRef<typeof containerRef.container> = containerRef;
export const sharedInjector = new Injector<typeof containerRef.container>(sharedContainerRef);
