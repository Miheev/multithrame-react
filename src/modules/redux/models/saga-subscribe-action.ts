import { ReduxAction } from './redux-action';

export type StoreEventSelector = string | ((action: ReduxAction) => boolean);

export interface SagaSubscribeAction {
  event: StoreEventSelector | StoreEventSelector[];
  subscriber: (action?: ReduxAction) => void;
}
