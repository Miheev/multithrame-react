import * as stylesRaw from './autocomplete-input.module.scss';

import React, { ChangeEvent, Component, ReactElement } from 'react';
import { Button, FormField, TextInput } from 'grommet';
import classNames from 'classnames';

import { Selectable, StringMap } from 'src/modules/shared/models';
import { AppConfig } from 'src/modules/shared/app.config';
import { AutocompleteInputProps, AutocompleteInputState } from './autocomplete-input.type';
import { emptyOption, filterOptions, userInputId } from 'src/modules/shared/utils/select';


const styles = stylesRaw as unknown as StringMap;
const cField = classNames(styles['app-autocomplete-input'], 'field-closable');

export class AutocompleteInput extends Component<AutocompleteInputProps, AutocompleteInputState> {
  static defaultProps = {
    value: emptyOption(),
    suggestions: [],
    onSelect: () => void (0),

    label: '',
    id: '',
    name: '',
  };

  static getDerivedStateFromProps(props: AutocompleteInputProps, state: AutocompleteInputState): Partial<AutocompleteInputState> | null {
    if (props.suggestions !== state.suggestions) {
      return {
        suggestions: props.suggestions,
        filtered: props.suggestions.slice(0, AppConfig.maxSelectOptions),
        selected: props.value,
      };
    }

    return null;
  }

  constructor(props: AutocompleteInputProps) {
    super(props);

    this.state = {
      selected: props.value,
      filtered: props.suggestions.slice(0, AppConfig.maxSelectOptions),
      suggestions: props.suggestions,
    };

    this.onInput = this.onInput.bind(this);
    this.onSet = this.onSet.bind(this);
    this.onClean = this.onClean.bind(this);
  }

  shouldComponentUpdate(nextProps: Readonly<AutocompleteInputProps>, nextState: Readonly<AutocompleteInputState>): boolean {
    return nextProps.suggestions !== this.props.suggestions || nextState !== this.state;
  }

  onInput(event: ChangeEvent<HTMLInputElement>): void {
    this.setState({
      selected: {
        label: event.target.value,
        value: userInputId,
      },
      filtered: filterOptions(event.target.value, this.props.suggestions),
    });
  }

  onSet(event: { suggestion: Selectable }): void {
    this.setState({
      selected: event.suggestion,
      filtered: this.props.suggestions.slice(0, AppConfig.maxSelectOptions),
    });
    this.props.onSelect(event.suggestion);
  }

  onClean(): void {
    this.setState({ selected: emptyOption() });
  }

  render(): ReactElement {
    return (
      <FormField label={this.props.label}
                 htmlFor={this.props.id}
                 className={cField}>
        <TextInput
          id={this.props.id}
          name={this.props.name}
          a11yTitle={this.props.label}
          value={this.state.selected.label}
          suggestions={this.state.filtered}
          onChange={this.onInput}
          onSelect={this.onSet}
        />
        <Button a11yTitle="Close" onClick={this.onClean}>
          <i className="material-icons">close</i>
        </Button>
      </FormField>
    );
  }
}
