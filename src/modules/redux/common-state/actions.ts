import { ScrollStateEnum, VideoFilterModel } from 'src/modules/shared/models';
import { ReduxAction } from 'src/modules/redux/models';

export enum CommonActionType {
  destroy = 'App/Destroy',
  infiniteScroll = 'App/infiniteScroll',
  videoFilter = 'App/VideoFilter',
}

export type CommonPayload = boolean | ScrollStateEnum | Partial<VideoFilterModel>;

export interface CommonAction<P = CommonPayload, E = boolean> extends ReduxAction<CommonActionType, P, E> {
}

export function destroyApp(data = true): CommonAction {
  return { type: CommonActionType.destroy, payload: data };
}

export function scrollApp(data: ScrollStateEnum): CommonAction {
  return { type: CommonActionType.infiniteScroll, payload: data };
}

export function filterVideos(data: Partial<VideoFilterModel>): CommonAction {
  return { type: CommonActionType.videoFilter, payload: data };
}
