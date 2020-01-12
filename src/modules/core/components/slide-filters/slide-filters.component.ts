import { connect } from 'react-redux';

import { AppState } from 'src/modules/redux/models';
import { AppStoreConnector } from 'src/modules/core/services/app-store.connector';
import { SlideFiltersView } from './slide-filters.view';
import { sharedInjector } from 'src/modules/core/services/shared.container';

export const slideFiltersInjector = sharedInjector.createChild();

export const SlideFilters = connect((state: AppState) => {
  let appConnector: AppStoreConnector = slideFiltersInjector.get('appConnector') as AppStoreConnector;
  return {
    videoFilter: state.common.videoFilter,
    appConnector,
  };
})(SlideFiltersView);
