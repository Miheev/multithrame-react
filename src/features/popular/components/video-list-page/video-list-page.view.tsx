import * as stylesRaw from './video-list-page.module.scss';

import React, { Component, createRef, ReactNode } from 'react';
import classNames from 'classnames';

import { AppStoreConnector } from 'src/modules/core/services/app-store.connector';
import { AppSpinner } from 'src/modules/core/components/app-spinner/app-spinner.component';
import { RequestStateEnum, ScrollStateEnum, StringMap, VideoFilterModel } from 'src/modules/shared/models';
import { DrawerLayout } from 'src/modules/core/components/drawer-layout/drawer-layout.component';
import { Header } from 'src/modules/core/components/header/header.component';
import { SlideFilters } from 'src/modules/core/components/slide-filters/slide-filters.component';
import { VideoConnector } from 'src/features/popular/service/video.connector';
import { VideoListPageViewProps } from './video-list-page.type';
import { VideoList } from 'src/features/popular/components/video-list.component';
import { InfiniteScrollConnector } from 'src/modules/core/services/infinite-scroll.connector';


const styles = stylesRaw as unknown as StringMap;
const cErrorMessage = classNames(styles['video-state-info'], styles['video-error']);
let isFirstUpd = true;

export class VideoListPageView extends Component<VideoListPageViewProps> {
  videoListRef = createRef<HTMLDivElement>();

  private slideStateChange = () => void(0);

  constructor(props: VideoListPageViewProps) {
    super(props);
    console.time('VideoListPageView');

    this.slideHandler = this.slideHandler.bind(this);
    this.slide = this.slide.bind(this);
    this.reloadOnFilterChange = this.reloadOnFilterChange.bind(this);
    this.unblockScroll = this.unblockScroll.bind(this);
    this.loadNext = this.loadNext.bind(this);
  }

  private get appConnector(): AppStoreConnector {
    return this.props.appConnector;
  }
  private get videoConnector(): VideoConnector {
    return this.props.videoConnector;
  }
  private get scrollConnector(): InfiniteScrollConnector {
    return this.props.scrollConnector;
  }

  private get videoFilter(): VideoFilterModel {
    return this.props.common.videoFilter;
  }
  private get infiniteScroll(): ScrollStateEnum {
    return this.props.common.infiniteScroll;
  }
  private get isDestroyed(): boolean {
    return this.props.common.isDestroyed;
  }

  componentDidMount(): void {
    this.scrollConnector.init(this.videoListRef.current, 'video');
    if (!this.props.videoList.length) {
      this.reloadOnFilterChange();
    } else {
      this.appConnector.infiniteScroll = ScrollStateEnum.scrollBack;
    }

    if (this.props.loadingState === RequestStateEnum.success) {
      console.timeEnd('VideoListPageView');
    }
  }

  shouldComponentUpdate(nextProps: Readonly<VideoListPageViewProps>, nextState: Readonly<{}>): boolean {
    if (this.videoFilter !== nextProps.common.videoFilter) {
      console.time('VideoListPageView');
      this.reloadOnFilterChange();
    }
    if (this.infiniteScroll !== nextProps.common.infiniteScroll && nextProps.common.infiniteScroll === ScrollStateEnum.locked) {
      console.time('VideoListPageView');
      this.scrollSubscription();
    }
    // not really sure that necessary
    if (this.isDestroyed !== nextProps.common.isDestroyed) {
      this.componentWillUnmount();
    }

    return this.state !== nextState ||
      this.props.videoList !== nextProps.videoList ||
      this.props.loadingState !== nextProps.loadingState;
  }

  componentDidUpdate(props: VideoListPageViewProps) {
    if (props.loadingState === RequestStateEnum.loading) {
      console.timeEnd('VideoListPageView');
      if (isFirstUpd) {
        console.timeEnd('VideoListPage');
        isFirstUpd = false;
      }
    }
  }

  componentWillUnmount(): void {
    this.appConnector.infiniteScroll = ScrollStateEnum.scrollSave;
    setTimeout(() => {
      this.scrollConnector.destroy();
      this.props.removeScrollConnector();
    });
  }

  slideHandler(slide: () => void): void {
    this.slideStateChange = slide;
  }
  slide(): void {
    this.slideStateChange();
  }

  renderHttpStateContent(): ReactNode {
    if (this.props.loadingState === RequestStateEnum.empty) {
      return (<p className={styles['video-state-info']}>No videos found.</p>);
    }
    if (this.props.loadingState === RequestStateEnum.error) {
      return (
        <p className={cErrorMessage}>
          <i className="material-icons">warning</i>
          <span>Error loading. Please try again later.</span>
        </p>
      );
    }

    return '';
  }

  render(): ReactNode {
    let cMainContent = classNames(styles['youtube-list'], {
      'is-excluded': this.props.loadingState !== RequestStateEnum.success
                  && this.props.loadingState !== RequestStateEnum.loading
    });

    let spinner: ReactNode = this.props.loadingState === RequestStateEnum.loading
      ? (<AppSpinner/>)
      : '';

    return (
      <div className={styles['app-video-list-page']}>
        <Header showVideoFilter={true} onFilterToggle={this.slide}/>
        <DrawerLayout column={<SlideFilters/>} slideHandler={this.slideHandler}>
          <div className={styles['app-video-content']} ref={this.videoListRef} onScroll={this.scrollConnector.listenScroll}>
            {spinner}
            <div className={cMainContent}>
              <VideoList videoList={this.props.videoList} history={this.props.history}/>
            </div>

            {this.renderHttpStateContent()}
          </div>
        </DrawerLayout>
      </div>);
  }

  private reloadOnFilterChange(): void {
    this.videoConnector.loadVideos();
    this.appConnector.infiniteScroll = ScrollStateEnum.resetScroll;
  }

  private scrollSubscription() {
    /** Case for < 0 not included, it can happens only during first request or request on filter change.
     *  In that case scroll will be blocked and remainingVideos will be updated after request will complete.
     */
    if (this.props.remainingVideos === 0) {
      this.unblockScroll();
    } else if (this.props.remainingVideos > 0) {
      this.loadNext();
    }
  }

  private unblockScroll(): void {
    this.appConnector.infiniteScroll = ScrollStateEnum.unlocked;
  }
  private loadNext(): void {
    this.videoConnector.loadVideos(true);
  }
}
