import { CommonState } from './common.state';
import { VideoState } from './video.state';

export interface AppState {
  common: CommonState;
  video: VideoState;
}
