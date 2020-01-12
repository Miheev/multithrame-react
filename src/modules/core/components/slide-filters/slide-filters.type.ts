import { VideoCategory, VideoFilterModel } from 'src/modules/shared/models';
import { AppStoreConnector } from 'src/modules/core/services/app-store.connector';

export interface SlideFiltersProps {
  videoFilter: VideoFilterModel
}

export interface SlideFiltersViewProps extends SlideFiltersProps {
  appConnector: AppStoreConnector,
}

export interface SlideFiltersState {
  category: VideoCategory,
  videoCount: string,
}
