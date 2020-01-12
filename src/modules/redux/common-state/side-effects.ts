/*function* onCommonChange(action: CommonAction) {
  let commonState = yield select((state: AppState) => state.common);
  let service = sharedInjector.get('appConnector') as AppStoreConnector;

  service.commonState = commonState;
}*/

export function* commonSaga() {
//   yield takeEvery((action: ReduxAction) => action.type.startsWith('App'), onCommonChange);
//   yield takeEvery(Object.values(CommonActionType), onCommonChange);
}
