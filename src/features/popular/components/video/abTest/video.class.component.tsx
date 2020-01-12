import * as stylesRaw from './video.module.scss';

import React, { Component, MouseEvent, ReactElement } from 'react';
import classNames from 'classnames';

import { StringMap } from 'src/modules/shared/models';
import { isUrlHashUsed } from 'src/modules/shared/utils/url-hash-handling';
import { VideoProps } from '../video.type';
import { videoInjector } from 'src/features/popular/service/video.container';
import { VideoConnector } from 'src/features/popular/service/video.connector';


const styles = stylesRaw as unknown as StringMap;
const cCard = classNames('card', styles['video-card']);
const cCardContent = classNames('card-content', styles['video-card-content']);

export const videoDetailInjector = videoInjector.createChild();

export class Video extends Component<VideoProps> {
  constructor(props: VideoProps) {
    super(props);

    this.onVideoOpen = this.onVideoOpen.bind(this);
  }

  private get videoConnector(): VideoConnector {
    return videoDetailInjector.get('videoConnector') as VideoConnector;
  }

  shouldComponentUpdate(nextProps: Readonly<VideoProps>, nextState: Readonly<{}>, nextContext: unknown): boolean {
    return nextProps.video !== this.props.video;
  }

  onVideoOpen(event: MouseEvent) {
    let url = `${this.props.history.location.pathname}/${this.props.video.id}`;
    if (!event.ctrlKey) {
      this.videoConnector.isOpenFromList = true;
      this.props.history.push(url);
      return;
    }

    if (isUrlHashUsed()) {
      url = '/#/' + url;
      url = window.location.origin + url;
    }
    window.open(url, '_blank');
  }

  render(): ReactElement {
    let video = this.props.video;
    console.time('video');

    return (
      <div className={cCard} onClick={this.onVideoOpen}>
        <div className={cCardContent}>
          {video.thumbnail ? (<img src={video.thumbnail} alt=''/>) : ''}
          <i className="material-icons">photo</i>

          <div className={styles['video-info']}>
            <div className={styles['video-info-main']}>
              <i className="material-icons">av_timer</i><span>{video.publishedAt}</span>
              <i className="material-icons">visibility</i><span>{video.viewCount}</span>
              <i className="material-icons">thumb_up</i><span>{video.likeCount}</span>
            </div>
            <div className={styles['video-info-ext']}>
              <p><i className="material-icons">thumbs_up_down</i><span>{video.likeRate}%</span></p>
              <p><i className="material-icons">comment</i><span>{video.commentCount}</span></p>
              <p><i className="material-icons">group</i><span>{video.channelTitle}</span></p>
              <p><i className="material-icons">cloud</i><span>{video.tags}</span></p>
            </div>
          </div>

          <div className={styles['video-title']}>
            {video.title}
          </div>
        </div>
        {console.timeEnd('video')}
      </div>
    );
  }
}
