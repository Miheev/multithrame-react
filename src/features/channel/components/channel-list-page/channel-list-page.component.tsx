import * as styles from './channel-list-page.module.scss';

import React, { Component, ReactNode } from 'react';

import { DataMap } from 'src/modules/shared/models';
import { Header } from 'src/modules/core/components/header/header.component';
import { DrawerLayout } from 'src/modules/core/components/drawer-layout/drawer-layout.component';
import { SlideFilters } from 'src/modules/core/components/slide-filters/slide-filters.component';

export class ChannelListPage extends Component<DataMap> {
  private slideStateChange = () => void(0);

  constructor(props: DataMap) {
    super(props);
    console.time('ChannelListPage');

    this.slideHandler = this.slideHandler.bind(this);
    this.slide = this.slide.bind(this);
  }

  componentDidMount(): void {
    console.timeEnd('ChannelListPage');
  }

  slideHandler(slide: () => void): void {
    this.slideStateChange = slide;
  }

  slide(): void {
    this.slideStateChange();
  }

  render(): ReactNode {
    return (
      <div className={styles['app-channel-list-page']}>
        <Header showVideoFilter={true} onFilterToggle={this.slide}/>
        <DrawerLayout column={<SlideFilters/>} slideHandler={this.slideHandler}>
          <div className="l-one-pad">
            <h3>Here should be list of popular channel</h3>
            <p>
              Channels
              Note: The channel resource's statistics.subscriberCount property value has been updated to reflect a YouTube policy change that
              affects the way that subscriber counts are displayed. Please see the Revision History or the YouTube Help Center for more information.
              A channel resource contains information about a YouTube channel.

              list
              Returns a collection of zero or more channel resources that match the request criteria. Try it now.
            </p>
            <p>
              YouTube is an American video-sharing platform headquartered in San Bruno, California. Three former PayPal employees—Chad Hurley, Steve
              Chen, and Jawed Karim—created the service in February 2005. Google bought the site in November 2006 for US$1.65 billion; YouTube now
              operates as one of Google's subsidiaries.

              YouTube allows users to upload, view, rate, share, add to playlists, report, comment on videos, and subscribe to other users. It
              offers a wide variety of user-generated and corporate media videos. Available content includes video clips, TV show clips, music
              videos, short and documentary films, audio recordings, movie trailers, live streams, and other content such as video blogging, short
              original videos, and educational videos. Most content on YouTube is uploaded by individuals, but media corporations including CBS, the
              BBC, Vevo, and Hulu offer some of their material via YouTube as part of the YouTube partnership program. Unregistered users can only
              watch videos on the site, while registered users are permitted to upload an unlimited number of videos and add comments to videos.
              Videos deemed potentially inappropriate are available only to registered users affirming themselves to be at least 18 years old.

              YouTube and selected creators earn advertising revenue from Google AdSense, a program which targets ads according to site content and
              audience. The vast majority of its videos are free to view, but there are exceptions, including subscription-based premium channels,
              film rentals, as well as YouTube Music and YouTube Premium, subscription services respectively offering premium and ad-free music
              streaming, and ad-free access to all content, including exclusive content commissioned from notable personalities. As of February
              2017, there were more than 400 hours of content uploaded to YouTube each minute, and one billion hours of content being watched on
              YouTube every day. As of August 2018, the website is ranked as the second-most popular site in the world, according to Alexa Internet,
              just behind Google.[1] As of May 2019, more than 500 hours of video content are uploaded to YouTube every minute.[6]

              YouTube has faced criticism over aspects of its operations, including its handling of copyrighted content contained within uploaded
              videos,[7] its recommendation algorithms perpetuating videos that promote conspiracy theories and falsehoods,[8] hosting videos
              ostensibly targeting children but containing violent and/or sexually suggestive content involving popular characters,[9] videos of
              minors attracting pedophilic activities in their comment sections,[10] and fluctuating policies on the types of content that is
              eligible to be monetized with advertising.
            </p>
          </div>
        </DrawerLayout>
      </div>
    );
  }
}
