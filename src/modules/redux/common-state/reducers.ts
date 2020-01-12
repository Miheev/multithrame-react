import { CommonAction, CommonActionType } from './actions';
import { CommonState } from 'src/modules/redux/models';
import { ScrollStateEnum, VideoFilterModel } from 'src/modules/shared/models';

export function commonReducer(state = new CommonState(), action: CommonAction): CommonState {
  const { type, payload, error } = action;

  switch (type) {
    case CommonActionType.destroy: {
      let flag: boolean = payload as boolean;
      if (flag !== state.isDestroyed) {
        return { ...state, isDestroyed: flag };
      }
      return state;
    }
    case CommonActionType.infiniteScroll: {
      let subState: ScrollStateEnum = payload as ScrollStateEnum;
      if (subState !== state.infiniteScroll) {
        return { ...state, infiniteScroll: subState };
      }
      return state;
    }
    case CommonActionType.videoFilter: {
      if (state.videoFilter !== payload) {
        let videoFilter: VideoFilterModel = Object.assign({} as VideoFilterModel, state.videoFilter, payload as Partial<VideoFilterModel>);
        return { ...state, videoFilter };
      }
      return state;
    }
    default: {
      if ((type as string).startsWith('App')) {
        console.warn('Action', type, 'not supported by CommonState');
      }
      return state;
    }
  }
}
