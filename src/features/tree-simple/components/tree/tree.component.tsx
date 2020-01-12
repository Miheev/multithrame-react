import * as styles from './tree.module.scss';

import React, { Component, ReactNode } from 'react';

import { Node } from 'src/features/tree-simple/components/node/node.component';
import { TreeNode } from 'src/features/tree-simple/models';

export class Tree extends Component<{height: number}> {
  // todo: remove later, it's for performance measure only
  static measure = {
    edgeNodeCount: 0,
    edgeNodeLength: 0,
  };

  treeList: TreeNode[] = [];
  length = 0;
  height = 1;

  constructor(props) {
    super(props);

    if (this.props.height < 1) {
      console.error('height should be positive integer');
    } else {
      this.height = this.props.height;
    }
  }

  render(): ReactNode {
    this.timeStart();
    this.treeList.push({
      value: 0,
      height: 0,
      maxHeight: this.height,
      isBinarySubtree: true,
    });

    return (
      <div className={styles['app-tree']}>
        {this.treeList.map((rootNode, id) => (
          <Node key={id} node={rootNode} />
        ))}
      </div>
    )
  }

  private timeStart(): void {
    this.length = 2 ** this.height;
    Tree.measure.edgeNodeCount = 0;
    Tree.measure.edgeNodeLength = this.length / 2;
    console.time('TreeBuilding');
  }
}
