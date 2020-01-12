import './video-list-page.scss';

import React, { Component, ReactNode } from 'react';
import { Box, Button, Collapsible } from 'grommet';

import { DataMap } from 'src/modules/shared/models';
import { Header } from 'src/modules/core/components/header/header.component';
import { SlideFilters } from 'src/modules/core/components/slide-filters/slide-filters.component';

export class VideoListPage extends Component<{}, { sidebarToggle: boolean, btn: number }> {
  state = {
    sidebarToggle: false,
    btn: 0,
  };

  constructor(props: DataMap) {
    super(props);
    this.slide = this.slide.bind(this);
    this.upBtn = this.upBtn.bind(this);
  }

  slide(): void {
    this.setState((prevState) => ({ sidebarToggle: !prevState.sidebarToggle }));
  }

  upBtn() {
    this.setState(prev => {
      return { btn: prev.btn + 1 };
    });
  }

  render(): ReactNode {
    return (
      <div className="app-video-list-page">
        <Header showVideoFilter={true} onFilterToggle={this.slide}/>

        <Box
          flex
          direction='row'
          align='stretch'
          elevation='small'
          className="page-collapse"
        >
          <Collapsible direction="horizontal" open={this.state.sidebarToggle}>
            <Box
              flex
              width='small'
              pad="small"
              elevation='small'
              className="collapse-column"
            >
              <SlideFilters/>
            </Box>
          </Collapsible>

          <div appInfiniteScroll>
            <div className="youtube-list">
              <Button onClick={this.upBtn}>{this.state.btn}</Button>
            </div>
          </div>
        </Box>
      </div>);
  }
}
