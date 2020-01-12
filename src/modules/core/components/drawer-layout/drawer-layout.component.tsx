import * as styles from './drawer-layout.module.scss';

import React, { Component, ReactNode } from 'react';
import { Box, Collapsible } from 'grommet';

import { DrawerLayoutProps, DrawerLayoutState } from './drawer-layout.type';

export class DrawerLayout extends Component<DrawerLayoutProps, DrawerLayoutState> {
  static defaultProps = {
    column: '',
    main: '',
    children: '',
  };

  state = {
    sidebarToggle: false,
  };

  constructor(props) {
    super(props);

    this.slide = this.slide.bind(this);
    this.props.slideHandler(this.slide);
  }

  shouldComponentUpdate(nextProps: Readonly<DrawerLayoutProps>, nextState: Readonly<DrawerLayoutState>, nextContext: unknown): boolean {
    return this.props !== nextProps || this.state !== nextState;
  }

  slide(): void {
    this.setState((prevState) => ({ sidebarToggle: !prevState.sidebarToggle }));
  }

  render(): ReactNode {
    return (
      <div className={styles['app-drawer-layout']}>
        <Box
          flex
          direction='row'
          align='stretch'
          elevation='small'
          className={styles['page-collapse']}
        >
          <Collapsible direction="horizontal" open={this.state.sidebarToggle}>
            <Box
              flex
              width='small'
              pad="small"
              elevation='small'
              className={styles['collapse-column']}
            >
              {this.props.column}
            </Box>
          </Collapsible>

          <div>
            {this.props.children || this.props.main}
          </div>
        </Box>
      </div>
    );
  }
}
