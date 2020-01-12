import { ScrollAction, ScrollActionType } from './actions';
import { ScrollState } from 'src/modules/redux/models/scroll.state';

export function scrollComposableReducer<S extends ScrollState = ScrollState>(state: S, action: ScrollAction): S | null {
  switch (action.type) {
    case ScrollActionType.savePosition: {
      return { ...state, scrollPosition: action.payload };
    }
    default: {
      if ((action.type as string).startsWith('Scroll')) {
        console.warn('Action', action.type, 'not supported');
      }
      return null;
    }
  }
}
