import * as stylesRaw from './player-page.module.scss';

import React, { Component, ReactNode } from 'react';
import { Button } from 'grommet';
import classNames from 'classnames';
import { History } from 'history';
import { match } from 'react-router-dom';

import { AppSpinner } from 'src/modules/core/components/app-spinner/app-spinner.component';
import { Header } from 'src/modules/core/components/header/header.component';
import { PlayerPageParams, PlayerPageProps, PlayerPageState } from './player-page.type';
import { VideoConnector } from 'src/features/popular/service/video.connector';
import { YoutubeService } from 'src/modules/youtubeApi/services/youtube.service';
import { StringMap } from 'src/modules/shared/models';
import { ToasterService } from 'src/modules/di/models';


const styles = stylesRaw as unknown as StringMap;
const cMain = classNames(styles['app-player-page'], 'l-one-pad');

export class PlayerPageView extends Component<PlayerPageProps, PlayerPageState> {
  static defaultProps = {
    isOpenFromList: false,
  };

  state = {
    isLoading: true,
    embedUrl: '',
  };

  constructor(props: PlayerPageProps) {
    super(props);

    this.onLoadVideo = this.onLoadVideo.bind(this);
    this.onClickBack = this.onClickBack.bind(this);
  }

  private get toaster(): ToasterService {
    return this.props.toaster;
  }
  private get videoConnector(): VideoConnector {
    return this.props.videoConnector;
  }
  private get youtubeService(): YoutubeService {
    return this.props.youtubeService;
  }

  private get history(): History {
    return this.props.history;
  }
  private get pathParams(): match<PlayerPageParams> {
    return this.props.match;
  }

  componentDidMount(): void {
    const id = this.pathParams.params.id;
    if (!id) {
      this.goBack();
      return;
    }

    /**
     * Video id server side check is needed only for case: opening video directly from url.
     * So this check is skipped in case of opening from video list (should have correct id from Youtube API).
     */
    let videoValidationMethod: Promise<boolean>;
    if (this.props.isOpenFromList) {
      videoValidationMethod = Promise.resolve(true);
      this.videoConnector.isOpenFromList = false;
    } else {
      videoValidationMethod = this.youtubeService.videoExist(id);
    }
    videoValidationMethod.then((result: boolean) => {
      if (result) {
        this.setUrl(YoutubeService.embedUrl(id));
      } else {
        this.goBack();
      }
    });
  }

  /* Hide loader on video ready */
  onLoadVideo(): void {
    if (!this.state.embedUrl) {
      return;
    }
    this.setState({ isLoading: false });
  }

  onClickBack(): void {
    this.history.push('/popular');
  }

  render(): ReactNode {
    return (
      <div className={cMain}>
        <Header/>
        <main>
          {this.state.isLoading ? (<AppSpinner/>) : ''}
          <Button onClick={this.onClickBack}
                  primary={true}
                  label="Back to Popular"
                  a11yTitle="Back"/>

          <div className={styles.video}>
            <iframe
              onLoad={this.onLoadVideo}
              hidden={this.state.isLoading}
              src={this.state.embedUrl}
              allowFullScreen
              title="video"
              height="100%"
              width="100%"> </iframe>
          </div>
        </main>
      </div>
    );
  }

  private goBack(title: string = 'The video not found. Select another one please.') {
    this.toaster.warning('', title);
    this.history.push('/popular');
  }

  private setUrl(url: string): void {
    this.setState({ embedUrl: url });
  }
}
