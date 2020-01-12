import * as stylesRaw from './tree-page.module.scss';

import React, { ChangeEvent, Component, createRef, ReactNode, Ref } from 'react';
import { Button, FormField, MaskedInput, MaskedInputProps } from 'grommet';
import classNames from 'classnames';

import { Header } from 'src/modules/core/components/header/header.component';
import { treeInjector } from 'src/features/tree/services/tree.container';
import { TreeConnector } from 'src/features/tree/services/tree.connector';
import { StringMap } from 'src/modules/shared/models';
import { Tree } from 'src/features/tree/components/tree/tree.component';


const styles = stylesRaw as unknown as StringMap;
const cField = classNames(styles['tree-height-field'], 'field-closable');

export class TreePage extends Component {
  treeHeight = String(TreeConnector.defaultHeight);
  inputRef = createRef<HTMLInputElement>();
  numMask = [
    {
      length: 2,
      regexp: /^[0-9]{1,2}$/,
      placeholder: 'xx',
    },
  ];

  constructor(props) {
    super(props);

    treeInjector.create('treeConnector');

    this.onTreeChange = this.onTreeChange.bind(this);
    this.onHeightInput = this.onHeightInput.bind(this);
    this.onClean = this.onClean.bind(this);
  }

  get treeConnector(): TreeConnector {
    return treeInjector.get('treeConnector') as TreeConnector;
  }

  get heightInputValue(): number {
    return Number.parseInt(this.treeHeight, 10);
  }

  get numIsValid(): boolean {
    return !this.inputRef.current || this.inputRef.current.validity.valid;
  }

  componentWillUnmount(): void {
    this.treeConnector.destroy();
    treeInjector.remove('treeConnector');
  }

  onHeightInput(event: ChangeEvent<HTMLInputElement>) {
    this.treeHeight = event.target.value;
    if (this.numIsValid) {
      this.treeConnector.length = 2 ** this.heightInputValue
    }
    this.forceUpdate();
  }

  onTreeChange(): void {
    if (this.inputRef.current.reportValidity()) {
      this.treeConnector.height = this.heightInputValue;
      this.treeConnector.rebuildTree();
    }
  }

  onClean(): void {
    this.treeHeight = String(TreeConnector.defaultHeight);
    this.treeConnector.resetHeight();
    this.forceUpdate();
  }

  render(): ReactNode {
    return (
      <div className={styles['app-tree-page']}>
        <Header/>
        <main className="l-one-pad">
          <div className={styles['tree-height']}>
              <FormField
                label="Enter tree height"
                htmlFor="tree-height-config"
                className={cField}
              >
                <MaskedInput
                  id="tree-height-config"
                  name="treeHeight"
                  a11yTitle="Tree height"
                  type="number"
                  ref={this.inputRef as unknown as Ref<Component<MaskedInputProps>>}
                  mask={this.numMask}
                  value={this.treeHeight}
                  onChange={this.onHeightInput}
                  required
                  min="1"
                />
                <Button a11yTitle="Close" onClick={this.onClean}>
                  <i className="material-icons">close</i>
                </Button>
              </FormField>
              <Button onClick={this.onTreeChange}
                      primary={true}
                      label="Rebuild tree"
                      a11yTitle="Rebuild tree"/>


            <p>Expected number of nodes: {this.treeConnector.lengthFormatted}</p>
          </div>

          <Tree/>
        </main>
      </div>
    );
  }
}
