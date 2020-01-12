import { select } from '@redux-saga/core/effects';
import { Store } from 'redux';

import { AppState, CommonState, ReduxAction } from 'src/modules/redux/models';
import { CommonAction, CommonActionType } from 'src/modules/redux/common-state/actions';
import { videoInjector } from 'src/features/popular/service/video.container';
import { VideoAction } from 'src/modules/redux/video-state/actions';
import { VideoConnector } from 'src/features/popular/service/video.connector';
import { videoListPageInjector } from 'src/features/popular/components/video-list-page/video-list-page.component';
import { InfiniteScrollConnector } from 'src/modules/core/services/infinite-scroll.connector';
import { sagaSubscribeList } from 'src/modules/redux/event-bus/actions';


function* onVideoChange(action: CommonAction | VideoAction) {
  let state: AppState = yield select();
  let videoConnector = videoInjector.get('videoConnector') as VideoConnector;

  videoConnector.commonState = { videoFilter: state.common.videoFilter };
  videoConnector.videoState = state.video;
}

function* onScrollChange(action: CommonAction) {
  let commonState: CommonState = yield select((state: AppState) => state.common);
  let scrollConnector = videoListPageInjector.get('scrollConnector') as InfiniteScrollConnector;

  scrollConnector.onStateUpdate(commonState);
}

export function registerVideoEffects() {
  let appStore = videoInjector.get('appStore') as Store;

  appStore.dispatch(sagaSubscribeList([
    {
      event: [
        CommonActionType.videoFilter,
        (action: ReduxAction) => action.type.startsWith('Video'),
      ],
      subscriber: onVideoChange,
    }, {
      event: CommonActionType.infiniteScroll,
      subscriber: onScrollChange,
    },
  ]));
}
