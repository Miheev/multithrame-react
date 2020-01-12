import * as store from 'store/dist/store.modern';
import { Dispatch, Store } from 'redux';

import { IService, ScrollStateEnum, VideoCategory, VideoFilterModel, VideoLocatedCategory } from 'src/modules/shared/models';
import { YoutubeService } from 'src/modules/youtubeApi/services/youtube.service';
import { destroyApp, filterVideos, scrollApp } from 'src/modules/redux/common-state/actions';
import { YoutubeCategory, YoutubeCategoryResponse } from 'src/modules/youtubeApi/models';
import { AppConfig } from 'src/modules/shared/app.config';
import { findDefaultOption } from 'src/modules/shared/utils/select';
import { CommonState } from 'src/modules/redux/models';

export class AppStoreConnector implements IService {
  /**
   * Filter data updated & used only
   * @type {CommonState | ((state: CommonState, action: CommonAction) => CommonState)}
   */
  commonState: Partial<CommonState>;

  private dispatch: Dispatch;

  constructor(private youtubeService: YoutubeService,
              public appStore: Store) {
    this.commonState = this.appStore.getState().common;
    this.dispatch = this.appStore.dispatch;
  }

  get videoFilterData(): Partial<VideoFilterModel> {
    return this.commonState.videoFilter;
  }

  set videoFilterData(params: Partial<VideoFilterModel>) {
    this.dispatch(filterVideos(params));
  }

  set infiniteScroll(value: ScrollStateEnum) {
    this.dispatch(scrollApp(value));
  }

  destroy(): void {
    this.dispatch(destroyApp());

    this.commonState = {};
    this.youtubeService = null;
    this.dispatch = null;
  }

  loadVideoCategories(countryId?: string): Promise<VideoCategory[]> {
    const requestId = countryId ? countryId : this.videoFilterData.country;
    return this.youtubeService.videoCategories(requestId)
      .then((response: YoutubeCategoryResponse) => {
        return response.items.map((category: YoutubeCategory) => ({
          label: category.snippet.title,
          value: category.id,
        }));
      });
  }

  loadCategoriesForNewCountry(countryId: string): Promise<VideoLocatedCategory> {
    return this.loadVideoCategories(countryId)
      .then((categories: VideoCategory[]) => {
        return {
          categories,
          selected: findDefaultOption(this.videoFilterData.category, categories) || AppConfig.defaultCategory,
        };
      });
  }

  save(): void {
    store.set(VideoFilterModel.name, this.videoFilterData);
  }
}
