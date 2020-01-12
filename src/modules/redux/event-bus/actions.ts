import { ReduxAction, SagaSubscribeAction } from 'src/modules/redux/models';

export enum EventBusActionType {
  subscribe = 'EventBus/Saga/Subscribe',
  subscribeList = 'EventBus/Saga/Subscribe/List',
}

export type EventBusPayload = SagaSubscribeAction | SagaSubscribeAction[];

export interface EventBusAction<P = EventBusPayload, E = boolean> extends ReduxAction<EventBusActionType, P, E> {
}

export function sagaSubscribe(data: SagaSubscribeAction): EventBusAction {
  return { type: EventBusActionType.subscribe, payload: data };
}

export function sagaSubscribeList(data: SagaSubscribeAction[]): EventBusAction {
  return { type: EventBusActionType.subscribeList, payload: data };
}
