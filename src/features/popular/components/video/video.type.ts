import { History } from 'history';
import { VideoModel } from 'src/features/popular/models';

export interface VideoProps {
  video: VideoModel;
  history: History;
}
