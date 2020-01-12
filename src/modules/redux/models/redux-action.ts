import { Action } from 'redux';

export interface ReduxAction<T = string, P = unknown, E = boolean> extends Action<T> {
  payload: P;
  error?: E;
}
