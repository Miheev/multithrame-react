import { AppConfig } from 'src/modules/shared/app.config';

export class VideoFilterModel {
  videosPerPage = AppConfig.defaultVideosPerPage;
  country = AppConfig.defaultRegion;
  category = AppConfig.defaultCategoryId;
}
