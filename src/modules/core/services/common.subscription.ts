import { select } from '@redux-saga/core/effects';
import { Store } from 'redux';

import { AppState } from 'src/modules/redux/models';
import { sharedInjector } from 'src/modules/core/services/shared.container';
import { AppStoreConnector } from 'src/modules/core/services/app-store.connector';
import { EventBusAction, sagaSubscribe } from 'src/modules/redux/event-bus/actions';
import { CommonActionType } from 'src/modules/redux/common-state/actions';

function* onVideoFilterChange(action: EventBusAction) {
  let videoFilter = yield select((state: AppState) => state.common.videoFilter);
  let service = sharedInjector.get('appConnector') as AppStoreConnector;

  service.commonState = { videoFilter };
  service.save();
}

export function registerCommonEffects() {
  (sharedInjector.get('appStore') as Store).dispatch(sagaSubscribe({
    event: CommonActionType.videoFilter,
    subscriber: onVideoFilterChange,
  }));
}
