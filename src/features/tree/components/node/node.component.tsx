import * as styles from './node.module.scss';

import React, {Component, ReactNode} from 'react';
import { Button } from 'grommet';

import { ThemeColorEnum } from 'src/modules/shared/models';
import { TreeNode } from 'src/features/tree/models';
import { TreeConnector } from 'src/features/tree/services/tree.connector';
import { treeInjector } from 'src/features/tree/services/tree.container';

export class Node extends Component<{node: TreeNode}> {
  static defaultProps = {
    node: {
      children: [],
    } as TreeNode
  };

  colorIndex = 1;
  color = ThemeColorEnum.brand;

  constructor(props) {
    super(props);

    this.initChildren();
    this.changeColorDelayed();

    this.onAddChild = this.onAddChild.bind(this);
    this.onDeleteChildren = this.onDeleteChildren.bind(this);
  }

  get children(): TreeNode[] {
    return this.props.node.children;
  }

  get noChildren(): boolean {
    return !this.props.node.isBinarySubtree || this.props.node.height + 1 >= this.treeConnector.height;
  }

  private get treeConnector(): TreeConnector {
    return treeInjector.get('treeConnector') as TreeConnector;
  }

  componentDidMount(): void {
    if (!this.props.node.isBinarySubtree) {
      console.timeEnd('TreeNode Add');
      this.treeConnector.timeEnd();
    } else if (this.props.node.height + 1 >= this.treeConnector.height) {
      this.treeConnector.timeEnd();
    }
  }

  componentWillUnmount(): void {
    if (this.props.node.isBinarySubtree === undefined) {
      console.timeEnd('TreeNode Delete')
    }
  }

  shouldComponentUpdate(nextProps: Readonly<{ node: TreeNode }>, nextState: Readonly<{}>, nextContext: unknown): boolean {
    return this.props.node !== nextProps.node;
  }

  onAddChild(): void {
    console.time('TreeNode Add');
    this.treeConnector.addNodeTo(this.props.node);
    this.detectChanges();
  }

  onDeleteChildren(): void {
    // unsafe operation, only for set up flag used in delete time measurement
    this.children[this.children.length - 1].isBinarySubtree = undefined;
    console.time('TreeNode Delete');

    this.treeConnector.deleteChildren(this.props.node);
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
    if (this.noChildren) {
      return;
    }
    this.treeConnector.addBinaryTreeChildren(this.props.node);
  }

  private changeColorDelayed(): void {
    setTimeout(() => {
      this.color = this.treeConnector.colors[this.colorIndex];
      this.colorIndex = Number(!Boolean(this.colorIndex));
    });
  }

  private detectChanges(): void {
    this.changeColorDelayed();
    this.forceUpdate();
  }
}
