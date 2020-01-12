import { ScrollStateEnum, VideoFilterModel } from 'src/modules/shared/models';

export class CommonState {
  /**
   * In global state due to feature of wide scroll interaction (e.g. header, ticket XYZ-1111).
   * Also we have 1 infinite scroll per page by requirements, that's why we can use one state variable for all infinite scrolls.
   *
   * @type {ScrollStateEnum} infiniteScroll
   */
  infiniteScroll = ScrollStateEnum.unlocked;
  videoFilter = new VideoFilterModel();
  isDestroyed = false;
}
