import * as styles from 'src/features/tree-simple/components/node/node.module.scss';

import React, { FC, memo, ReactElement, useEffect, useState } from 'react';
import { Button } from 'grommet';

import { TreeNode } from 'src/features/tree-simple/models';
import { ThemeColorEnum } from 'src/modules/shared/models';
import { Tree } from 'src/features/tree-simple/components/tree/tree.component';


const colors: ThemeColorEnum[] = [ThemeColorEnum.brand, ThemeColorEnum.error];
// const colorState = new WeakMap<TreeNode, {color: ThemeColorEnum, colorIndex: number}>();

// todo: fix delete. it works partially: deletes edge nodes only and can produce add effect instead
export function NodeView(props: {node: TreeNode}): ReactElement {
  let state = useState([] as TreeNode[]);
  let setState = state[1];
  let children: TreeNode[] = state[0];
  let colorIndex = 1;
  let color = ThemeColorEnum.brand;

  // if (colorState.has(props.node)) {
  //   let tmpState = colorState.get(props.node);
  //   color = tmpState.color;
  //   colorIndex = tmpState.colorIndex;
  // }

  initChildren();
  changeColorDelayed();

  useEffect(() => {
    Tree.measure.edgeNodeCount += 1;
    if (Tree.measure.edgeNodeCount === Tree.measure.edgeNodeLength) {
      console.timeEnd('TreeBuilding');
      console.log(performance);
    }
  }, []);

  // useEffect(() => {
  //   console.log(colorState)
  // });

  function onAddChild(): void {
    children = [].concat(children, [{
      value: props.node.value + 11,
      height: props.node.height + 1,
      maxHeight: props.node.maxHeight,
      isBinarySubtree: false,
    }]);

    detectChanges();
  }

  function onDeleteChildren(): void {
    children = [];
    detectChanges();
  }

  function initChildren(): void {
    if (!props.node.isBinarySubtree || props.node.height + 1 >= props.node.maxHeight) {
      return;
    }
    let index;
    for (index = 0; index < 2; ++index) {
      children.push({
        value: props.node.value + 1,
        height: props.node.height + 1,
        maxHeight: props.node.maxHeight,
        isBinarySubtree: true,
      });
    }
  }

  function changeColorDelayed(): void {
    setTimeout(() => {
      color = colors[colorIndex];
      colorIndex = Number(!Boolean(colorIndex));
      // colorState.set(props.node, {color, colorIndex});
    });
  }

  function detectChanges(): void {
    changeColorDelayed();
    setState(children);
  }


  return (
    <div className={styles['app-node']}>
      <div className={styles['node-info']}>
        <span>{ props.node.value }</span>
        <Button color={color} a11yTitle="Add" onClick={onAddChild}>
          <i className="material-icons">add_circle</i>
        </Button>
        {children.length
          ? (
            <Button color={color} a11yTitle="Remove" onClick={onDeleteChildren}>
              <i className="material-icons">delete</i>
            </Button>
          )
          : ('')
        }
      </div>
      <div className={styles['node-children']}>
        {children.map((child, id) => (
          <Node key={id} node={child} />
        ))}
      </div>
    </div>
  );
}

export const Node = memo(NodeView as FC<{node: TreeNode}>);
