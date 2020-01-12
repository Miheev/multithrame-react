// ts-nocheck
import * as stylesRaw from './header.module.scss';

import React, { Component, ReactElement } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Box, Button, DropButton, DropProps } from 'grommet';

import { CE, StringMap } from 'src/modules/shared/models';
import { HeaderProps, HeaderState } from './header.type';


const styles = stylesRaw as unknown as StringMap;
const cHeader = classNames(styles['app-header'], 'l-one-pad');
const cStaticOptions = classNames(styles.options, 'options-static');
const cDynamicOptions = classNames(styles.options, 'options-dynamic');
const cMenuOptions: DropProps = { align: { top: 'bottom' } } as DropProps;

function NavigationMenu(): ReactElement {
  return (
    <nav className={styles['app-menu']}>
      <Link to="/popular">Popular videos</Link>
      <Link to="/channel">Popular channels</Link>
      <Link to="/tree-simple">Static tree</Link>
      <Link to="/tree">Dynamic tree</Link>
    </nav>
  );
}


export class Header extends Component<HeaderProps, HeaderState> {
  static defaultProps = {
    showVideoFilter: false,
    onFilterToggle(): void {
    },
  };

  state = {
    serviceToggle: false,
  };

  cDynamicOptions = classNames(cDynamicOptions, { 'is-hidden': !this.props.showVideoFilter });

  constructor(props: HeaderProps) {
    super(props);

    this.openServiceMenu = this.openServiceMenu.bind(this);
    this.closeServiceMenu = this.closeServiceMenu.bind(this);
  }

  /**
   * https://github.com/facebook/react/issues/10062
   * https://github.com/facebook/react/blob/864ae8fa987bebfc43ea87476a03a44ac010ebce/src/renderers/shared/fiber/ReactFiberClassComponent.js#L144-L148
   * https://github.com/facebook/react/blob/864ae8fa987bebfc43ea87476a03a44ac010ebce/src/isomorphic/modern/class/ReactBaseClasses.js#L129-L137
   * https://github.com/facebook/fbjs/blob/master/packages/fbjs/src/core/shallowEqual.js
   *
   * @param {Readonly<HeaderProps>} nextProps
   * @param {Readonly<{}>} nextState
   * @param {any} nextContext context also can be managed here, but doesn't affected but default
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps: Readonly<HeaderProps>, nextState: Readonly<{}>): boolean {
    return nextState !== this.state;
  }

  openServiceMenu(): void {
    this.setState({ serviceToggle: true });
  }

  closeServiceMenu(): void {
    this.setState({ serviceToggle: false });
  }

  render(): ReactElement {
    return (
      <header className={cHeader}>
        <div className={styles.left}>
          <div className={cStaticOptions}>
            <DropButton
              a11yTitle="Service select"
              tooltipLabel="Supported services"
              dropContent={<Box pad="medium" background={CE.light1} onClick={this.closeServiceMenu}>youtube</Box>}
              dropProps={cMenuOptions}
              open={this.state.serviceToggle}
              onClose={this.closeServiceMenu}
              onOpen={this.openServiceMenu}
            >
              <i className="material-icons">local_movies</i>
            </DropButton>
          </div>
          <div className={this.cDynamicOptions}>
            <Button color={CE.brand} a11yTitle="Settings" onClick={this.props.onFilterToggle}>
              <i className="material-icons">settings</i>
            </Button>
          </div>
          <div className={cStaticOptions}>
            <DropButton
              a11yTitle="Navigation menu"
              dropContent={<NavigationMenu/>}
              dropProps={cMenuOptions}>
              <i className="material-icons">menu</i>
            </DropButton>
          </div>
        </div>
        <div className={styles.right}>
          <Link to="/popular" className={styles.logo}>
            <i className="material-icons">theaters</i>
            <i className="material-icons">thumb_up</i>
            <h1>PopStream</h1>
          </Link>
        </div>
      </header>
    );
  }
}
