import { applyMiddleware, combineReducers, compose, createStore, Store } from 'redux';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import * as store from 'store/dist/store.modern';

import { commonReducer } from 'src/modules/redux/common-state/reducers';
import { videoReducer } from 'src/modules/redux/video-state/reducers';
import { rootSaga } from './root-side-effects';
import { AppState, CommonState, VideoState } from 'src/modules/redux/models';
import { VideoFilterModel } from 'src/modules/shared/models';

interface ReduxWindow extends Window {
  __REDUX_DEVTOOLS_EXTENSION__: Function;
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: Function;
}

export const reducers = combineReducers<AppState>({
  common: commonReducer,
  video: videoReducer,
});

export function initValues(): AppState | undefined {
  let videoFilter: VideoFilterModel = store.get(VideoFilterModel.name);
  if (!videoFilter) {
    return undefined;
  }

  const state = {
    common: new CommonState(),
    video: new VideoState(),
  };
  state.common.videoFilter = videoFilter;

  return state;
}

export function configureStore(): Store {
  const sagaMiddleware: SagaMiddleware = createSagaMiddleware();

  const $window = window as unknown as ReduxWindow;
  const composeEnhancers =
    $window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store: Store = createStore(
    reducers,
    initValues(),
    composeEnhancers(applyMiddleware(sagaMiddleware)),
  );
  sagaMiddleware.run(rootSaga);

  return store;
}
