import { VideoCategory } from './video-selectable';

export interface VideoLocatedCategory {
  categories: VideoCategory[];
  selected: VideoCategory;
}
