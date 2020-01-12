import * as styles from './node.module.scss';

import React, { Component, ReactNode } from 'react';
import { Button } from 'grommet';

import { TreeNode } from 'src/features/tree-simple/models';
import { ThemeColorEnum } from 'src/modules/shared/models';
import { Tree } from 'src/features/tree-simple/components/tree/tree.component';


const colors: ThemeColorEnum[] = [ThemeColorEnum.brand, ThemeColorEnum.error];

export class Node extends Component<{node: TreeNode}> {
  children: TreeNode[] = [];
  colorIndex = 1;
  color = ThemeColorEnum.brand;

  constructor(props) {
    super(props);

    this.initChildren();
    this.changeColorDelayed();

    this.onAddChild = this.onAddChild.bind(this);
    this.onDeleteChildren = this.onDeleteChildren.bind(this);
  }

  componentDidMount(): void {
    Tree.measure.edgeNodeCount += 1;
    if (Tree.measure.edgeNodeCount === Tree.measure.edgeNodeLength) {
      console.timeEnd('TreeBuilding');
      console.log(performance);
    } else if (!this.props.node.isBinarySubtree) {
      console.timeEnd('TreeNode Add');
    }
  }

  componentWillUnmount(): void {
    if (this.props.node.isBinarySubtree === undefined) {
      console.timeEnd('TreeNode Delete');
    }
  }

  shouldComponentUpdate(nextProps: Readonly<{ node: TreeNode }>, nextState: Readonly<{}>, nextContext: unknown): boolean {
    return false;
  }

  onAddChild(): void {
    console.time('TreeNode Add');
    this.children.push({
      value: this.props.node.value + 11,
      height: this.props.node.height + 1,
      maxHeight: this.props.node.maxHeight,
      isBinarySubtree: false,
    });

    this.detectChanges();
  }

  onDeleteChildren(): void {
    // unsafe operation, only for set up flag used in delete time measurement
    this.children[this.children.length - 1].isBinarySubtree = undefined;
    console.time('TreeNode Delete');

    this.children = [];
    this.detectChanges();
  }

  render(): ReactNode {
    return (
      <div className={styles['app-node']}>
        <div className={styles['node-info']}>
          <span>{ this.props.node.value }</span>
          <Button color={this.color} a11yTitle="Add" onClick={this.onAddChild}>
            <i className="material-icons">add_circle</i>
          </Button>
          {this.children.length
            ? (
              <Button color={this.color} a11yTitle="Remove" onClick={this.onDeleteChildren}>
                <i className="material-icons">delete</i>
              </Button>
            )
            : ('')
          }
        </div>
        <div className={styles['node-children']}>
          {this.children.map((child, id) => (
            <Node key={id} node={child} />
          ))}
        </div>
      </div>
    );
  }

  private initChildren(): void {
    if (!this.props.node.isBinarySubtree || this.props.node.height + 1 >= this.props.node.maxHeight) {
      return;
    }
    let index;
    for (index = 0; index < 2; ++index) {
      this.children.push({
        value: this.props.node.value + 1,
        height: this.props.node.height + 1,
        maxHeight: this.props.node.maxHeight,
        isBinarySubtree: true,
      });
    }
  }

  private changeColorDelayed(): void {
    setTimeout(() => {
      this.color = colors[this.colorIndex];
      this.colorIndex = Number(!Boolean(this.colorIndex));
    });
  }

  private detectChanges(): void {
    this.changeColorDelayed();
    this.forceUpdate();
  }
}
