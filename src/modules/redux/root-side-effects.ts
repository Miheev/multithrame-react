import { eventBusSaga } from './event-bus/side-effects';

export function* rootSaga() {
  yield* eventBusSaga();
}
