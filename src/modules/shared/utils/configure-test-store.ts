import { createStore, Store } from 'redux';
import { initValues, reducers } from 'src/modules/redux/configure-store';
import { AppState, CommonState, VideoState } from 'src/modules/redux/models';

function initTestValues(
  initValue?: Partial<CommonState>,
): AppState {
  let state = initValues();
  if (state && initValue) {
    return Object.assign(state, initValue);
  }
  if (initValue) {
    return {
      common: initValue as CommonState,
      video: new VideoState(),
    };
  }

  return state;
}

export function configureTestStore(initValue?: Partial<CommonState>): Store {
  let store: Store = createStore(reducers, initTestValues(initValue));
  return store;
}
