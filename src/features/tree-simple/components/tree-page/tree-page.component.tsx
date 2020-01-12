import * as styles from './tree-page.module.scss';

import React, { ReactElement } from 'react';
import { Header } from 'src/modules/core/components/header/header.component';
import { Tree } from 'src/features/tree-simple/components/tree/tree.component';

const height = 12;
const lengthFormatted = (2 ** height - 1).toLocaleString();

export function TreePage(): ReactElement {
  return (
    <div className={styles['app-tree-page']}>
      <Header/>
      <main className="l-one-pad">
        <p className={styles['tree-height']}>Tree height: { height }</p>
        <p className={styles['tree-height']}>Tree nodes count: { lengthFormatted }</p>
        <Tree height={height}/>
      </main>
    </div>
  )
}
