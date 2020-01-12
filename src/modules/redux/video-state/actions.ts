import { VideoModel } from 'src/features/popular/models';
import { ReduxAction, VideoState } from 'src/modules/redux/models';
import { RequestStateEnum } from 'src/modules/shared/models';

export enum VideoActionType {
  addFirstPage = 'Video/Add/First',
  addNextPage = 'Video/Add/Next',
  load = 'Video/load',
  openBehaviour = 'Video/open',
  batch = 'Video/batch',
}

export type VideoPayload = boolean | VideoModel[] | RequestStateEnum | VideoState;
export interface VideoAction<P = VideoPayload, E = boolean> extends ReduxAction<VideoActionType, P, E> {}

export function addVideoList(data: VideoModel[]): VideoAction {
  return { type: VideoActionType.addFirstPage, payload: data };
}

export function addNextVideoList(data: VideoModel[]): VideoAction {
  return { type: VideoActionType.addNextPage, payload: data };
}

export function loadVideoList(data: RequestStateEnum): VideoAction {
  return { type: VideoActionType.load, payload: data };
}

export function openBehaviour(data: boolean): VideoAction {
  return { type: VideoActionType.openBehaviour, payload: data };
}

export function batchUpdate(data: VideoState): VideoAction {
  return { type: VideoActionType.batch, payload: data };
}
