import * as styles from './tree.module.scss';

import React, { Component, ReactNode } from 'react';

import { TreeNode } from 'src/features/tree/models';
import { TreeConnector } from 'src/features/tree/services/tree.connector';
import { treeInjector } from 'src/features/tree/services/tree.container';
import { Node } from 'src/features/tree/components/node/node.component';

export class Tree extends Component {
  treeList: TreeNode[] = [];

  constructor(props) {
    super(props);

    this.treeConnector.onRebuildTree(() => {
      this.treeConnector.timeStart();
      this.treeList = [];
      this.forceUpdate(this.regenerate);
    });

    this.newList();

    this.regenerate = this.regenerate.bind(this);
  }

  private get treeConnector(): TreeConnector {
    return treeInjector.get('treeConnector') as TreeConnector;
  }

  shouldComponentUpdate(nextProps: Readonly<{}>, nextState: Readonly<{}>, nextContext: unknown): boolean {
    return false;
  }

  render(): ReactNode {
    return (
      <div className={styles['app-tree']}>
        <div className={styles['app-tree']}>
          {this.treeList.map((rootNode, id) => (
            <Node key={id} node={rootNode} />
          ))}
        </div>
      </div>
    );
  }

  private newList(): void {
    this.treeConnector.timeStart();
    this.treeList = [ this.treeConnector.createRootNode() ];
  }

  private regenerate(): void {
    this.treeList = [ this.treeConnector.createRootNode() ];
    this.forceUpdate();
  }
}
