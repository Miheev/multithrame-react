import { AppConfig } from 'src/modules/shared/app.config';
import { AppHttpError, AppHttpParams, IService } from 'src/modules/shared/models';
import {
  YoutubeCategoryRequest,
  YoutubeCategoryResponse,
  YoutubeVideoRequest,
  YoutubeVideoResponse,
} from 'src/modules/youtubeApi/models';
import { HttpClient, ToasterService } from 'src/modules/di/models';
// import videoStub from './video.response.json';

export class YoutubeService implements IService {
  static apiUrl(url: string) {
    return `https://www.googleapis.com/youtube/v3/${url}`;
  }

  static embedUrl(id: string) {
    return `https://www.youtube.com/embed/${id}??autoplay=1`;
  }

  constructor(private http: HttpClient,
              private toaster: ToasterService) {
  }

  destroy(): void {
    this.http = null;
    this.toaster = null;
  }

  videoExist(id: string): Promise<boolean> {
    const params: YoutubeVideoRequest = {
      part: AppConfig.baseParts,
      id,
      key: AppConfig.youtubeApiKey,
    };

    return this.httpVideos(params).then(
      (data: YoutubeVideoResponse) => Boolean(data.items && data.items.length),
      (error: AppHttpError) => this.handleError(error, 'videoExist'),
    ) as Promise<boolean>;
  }

  requestVideos(params: YoutubeVideoRequest): Promise<YoutubeVideoResponse> {
    return this.httpVideos(params)
      .catch((error: AppHttpError) => this.handleError(error, 'requestVideos')) as Promise<YoutubeVideoResponse>;
  }

  async videoCategories(countryId: string = 'US'): Promise<YoutubeCategoryResponse> {
    const params: YoutubeCategoryRequest = {
      part: AppConfig.baseParts,
      key: AppConfig.youtubeApiKey,
      regionCode: countryId,
    };

    try {
      let response = await this.http.request({
        url: YoutubeService.apiUrl('videoCategories'),
        params: params as unknown as AppHttpParams,
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'videoCategories');
    }
  }

  private async httpVideos(params: YoutubeVideoRequest): Promise<YoutubeVideoResponse> {
    let response = await this.http.request({
      url: YoutubeService.apiUrl('videos'),
      params: params as unknown as AppHttpParams,
    });
    return response.data;

    // @ts-ignore
    // return this.responseAfterTime(videoStub);
  }

  private async responseAfterTime(response: unknown): Promise<unknown> {
    console.log('fake request');
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // @ts-ignore
        resolve(response);
        console.log('end fake request');
      }, 300);
    });
  }

  private handleError(error: AppHttpError, operation: string) {
    error.operation = operation;
    console.error(error);
    this.toaster.warning('Requested data could not be loaded, please try again later or contact our support.');

    throw error;
  }
}
