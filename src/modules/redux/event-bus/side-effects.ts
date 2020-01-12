import { takeEvery } from '@redux-saga/core/effects';

import { EventBusAction, EventBusActionType } from './actions';
import { SagaSubscribeAction } from 'src/modules/redux/models';

function* onRegisterSubscription(action: EventBusAction) {
  let { event, subscriber } = action.payload as SagaSubscribeAction;
  yield takeEvery(event, subscriber);
}

function* onRegisterSubscriptionList(action: EventBusAction) {
  let subscriptionList = action.payload as SagaSubscribeAction[];
  for (let subscription of subscriptionList) {
    yield takeEvery(subscription.event, subscription.subscriber);
  }
}

export function* eventBusSaga() {
  yield takeEvery(EventBusActionType.subscribe, onRegisterSubscription);
  yield takeEvery(EventBusActionType.subscribeList, onRegisterSubscriptionList);
}
