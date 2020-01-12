import { ReduxAction } from 'src/modules/redux/models';

export enum ScrollActionType {
  savePosition = 'Scroll/Position/Save',
}

export type ScrollPayload = number;
export interface ScrollAction<P = ScrollPayload, E = boolean> extends ReduxAction<ScrollActionType, P, E> {}

export function saveScrollPosition(data: number): ScrollAction {
  return { type: ScrollActionType.savePosition, payload: data };
}
