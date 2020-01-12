import { Dispatch, Store } from 'redux';

import { AppConfig } from 'src/modules/shared/app.config';
import { AppStoreConnector } from 'src/modules/core/services/app-store.connector';
import { AppHttpError, IService, RequestStateEnum, ScrollStateEnum, VideoFilterModel } from 'src/modules/shared/models';
import { addVideoList, batchUpdate, loadVideoList, openBehaviour } from 'src/modules/redux/video-state/actions';
import { VideoConvertedResponse, VideoModel } from 'src/features/popular/models';
import { YoutubeService } from 'src/modules/youtubeApi/services/youtube.service';
import { YoutubeVideo, YoutubeVideoRequest, YoutubeVideoResponse } from 'src/modules/youtubeApi/models';
import { CommonState, VideoState } from 'src/modules/redux/models';

/**
 * ~ 425ms for update
 */
export class VideoConnector implements IService {
  /**
   * Filter data updated & used only
   * @type {CommonState | ((state: CommonState, action: CommonAction) => CommonState)}
   */
  commonState: Partial<CommonState>;
  videoState: VideoState;

  private dispatch: Dispatch;
  private appStore: Store;

  private _nextPageToken = '';
  private _remainingVideos = -1;

  constructor(private youtubeService: YoutubeService,
              private appConnector: AppStoreConnector) {
    this.appStore = this.appConnector.appStore;
    this.commonState = this.appStore.getState().common;
    this.videoState = this.appStore.getState().video;
    this.dispatch = this.appStore.dispatch;
  }

  set isOpenFromList(value: boolean) {
    this.dispatch(openBehaviour(value));
  }
  set loadingState(value: RequestStateEnum) {
    this.dispatch(loadVideoList(value));
  }

  private get videoFilterData(): VideoFilterModel {
    return this.commonState.videoFilter;
  }
  private get videosPerPage(): number {
    return this.videoFilterData.videosPerPage;
  }

  private get videos(): VideoModel[] {
    return this.videoState.videoList;
  }
  private set videos(value: VideoModel[]) {
    this.dispatch(addVideoList(value));
  }

  private get nextPageToken(): string {
    return this._nextPageToken;
  }
  private set nextPageToken(value: string) {
    this._nextPageToken = value;
  }

  private get remainingVideos(): number {
    return this._remainingVideos;
  }
  private set remainingVideos(value: number) {
    this._remainingVideos = value;
  }

  destroy(): void {
    this.youtubeService = null;
    this.appConnector = null;

    this.dispatch = null;
    this.commonState = {};
    this.videoState = {} as VideoState;
  }

  loadVideos(isNextPage: boolean = false): void {
    this.loadingState = RequestStateEnum.loading;
    this.startBatch();

    this.getVideosRange(isNextPage)
      .then((videos: VideoModel[]) => {
        if ((!isNextPage && !videos.length) || (isNextPage && !this.videos.length && !videos.length)) {
          this.loadingState = RequestStateEnum.empty;
        } else {
          this.loadingState = RequestStateEnum.success;
        }
        if (isNextPage) {
          this.videos = [...this.videos, ...videos];
          this.appConnector.infiniteScroll = ScrollStateEnum.scrollSave;
          this.appConnector.infiniteScroll = ScrollStateEnum.unlocked;
        } else {
          this.videos = videos;
        }

        this.commitChanges();
      }, (error: AppHttpError) => {
        this.loadingState = RequestStateEnum.error;
        this.commitChanges();
      });
  }

  private getVideosRange(isNextPage: boolean): Promise<VideoModel[]> {
    const params: YoutubeVideoRequest = {
      part: AppConfig.commonParts,
      chart: AppConfig.chart,
      regionCode: this.videoFilterData.country,
      maxResults: this.videosPerPage,
      key: AppConfig.youtubeApiKey,
    };

    if (this.videoFilterData.category) {
      params.videoCategoryId = this.videoFilterData.category;
    }

    if (isNextPage && !this.nextPageToken) {
      return Promise.resolve([]);
    } else if (isNextPage) {
      params.pageToken = this.nextPageToken;
    } else {
      this.nextPageToken = '';
      this.remainingVideos = -1;
    }

    if (this.videosPerPage < AppConfig.maxVideosToLoad) {
      return this.requestVideos(params)
        .then((results: VideoConvertedResponse) => {
          this.updateNextParams(results);
          return results.videos;
        });
    }

    const requestCount = Math.ceil(this.videosPerPage / AppConfig.maxVideosToLoad);
    let videoList: VideoModel[] = [];

    params.maxResults = AppConfig.maxVideosToLoad;
    let requestFlow = this.requestVideos(params);

    let i;
    for (i = 2; i < requestCount; i += 1) {
      // eslint-disable-next-line no-loop-func
      requestFlow = requestFlow.then((results: VideoConvertedResponse) => {
        videoList = videoList.concat(results.videos);
        return this.partialRequest(params, results.response);
      });
    }

    return requestFlow
      .then((results: VideoConvertedResponse) => {
        videoList = videoList.concat(results.videos);
        const lastItemCount = this.videosPerPage - (requestCount - 1) * AppConfig.maxVideosToLoad;
        return this.partialRequest(params, results.response, lastItemCount);
      })
      .then((results: VideoConvertedResponse) => {
        this.updateNextParams(results);
        videoList = videoList.concat(results.videos);

        return videoList;
      });
  }

  private partialRequest(rawParams: YoutubeVideoRequest, results: YoutubeVideoResponse,
                         itemPerPage: number = AppConfig.maxVideosToLoad):
    Promise<VideoConvertedResponse> {

    const params: YoutubeVideoRequest = Object.assign({}, rawParams);
    params.maxResults = itemPerPage;
    params.pageToken = results.nextPageToken;

    if (!params.pageToken) {
      return Promise.resolve({
        response: {} as YoutubeVideoResponse,
        videos: [],
      });
    }

    return this.requestVideos(params);
  }

  private requestVideos(params: YoutubeVideoRequest): Promise<VideoConvertedResponse> {
    return this.youtubeService.requestVideos(params)
      .then((data: YoutubeVideoResponse) => {
        return {
          response: data,
          videos: data.items
            .map((item: YoutubeVideo) => new VideoModel(item))
            .filter((item: VideoModel) => item.id !== ''),
        };
      });
  }

  private updateNextParams(data: VideoConvertedResponse): void {
    let raw = data.response;
    this.nextPageToken = raw.nextPageToken;

    if (this.remainingVideos === -1) {
      this.remainingVideos = raw.pageInfo.totalResults - raw.items.length;
    } else if (this.remainingVideos > 0) {
      this.remainingVideos = this.videosPerPage < this.remainingVideos ? this.remainingVideos - this.videosPerPage : 0;
    }
  }

  private startBatch(): void {
    this._nextPageToken = this.videoState.nextPageToken;
    this._remainingVideos = this.videoState.remainingVideos;
  }

  private commitChanges(): void {
    this.dispatch(batchUpdate(Object.assign(
      {},
      this.videoState,
      {nextPageToken: this._nextPageToken, remainingVideos: this._remainingVideos})));
  }
}
