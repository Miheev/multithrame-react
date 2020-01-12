import { VideoAction, VideoActionType } from './actions';
import { RequestStateEnum } from 'src/modules/shared/models';
import { VideoModel } from 'src/features/popular/models';
import { scrollComposableReducer } from 'src/modules/redux/scroll-composable/reducers';
import { ScrollAction } from 'src/modules/redux/scroll-composable/actions';
import { VideoState } from 'src/modules/redux/models';

export function videoReducer(state = new VideoState(), action: VideoAction): VideoState {
  let result = scrollComposableReducer(state, action as unknown as ScrollAction);
  if (result !== null) {
    return result;
  }

  const { type, payload, error } = action;
  switch (type) {
    case VideoActionType.openBehaviour: {
      let flag: boolean = payload as boolean;
      if (flag !== state.isOpenFromList) {
        return { ...state, isOpenFromList: flag };
      }
      return state;
    }
    case VideoActionType.load: {
      let httpState = payload as RequestStateEnum;
      if (httpState !== state.loadingState) {
        return { ...state, loadingState: httpState };
      }
      return state;
    }
    case VideoActionType.addFirstPage: {
      if (state.videoList !== payload) {
        return { ...state, videoList: payload as VideoModel[] };
      }
      return state;
    }
    case VideoActionType.addNextPage: {
      if (state.videoList !== payload) {
        let videoList = ([] as VideoModel[]).concat(state.videoList, payload as VideoModel[]);
        return { ...state, videoList };
      }
      return state;
    }
    case VideoActionType.batch: {
      return payload as VideoState;
    }
    default: {
      if ((type as string).startsWith('Video')) {
        console.warn('Action', type, 'not supported by CommonState');
      }
      return state;
    }
  }
}
