import { VideoModel } from './video.model';
import { YoutubeVideoResponse } from 'src/modules/youtubeApi/models';

export interface VideoConvertedResponse {
  videos: VideoModel[];
  response: YoutubeVideoResponse;
}
