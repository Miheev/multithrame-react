import React, { Component, ReactElement, useState } from 'react';
import { Box, Button, CheckBox, Form, FormField, RadioButtonGroup, RangeInput, TextInput } from 'grommet';

import { DataMap } from 'src/modules/shared/models';


const suggestionList = [
  'xxxx',
  'yyyy',
];

export function SlideFilters(props: DataMap): ReactElement {
  console.time('filter');

  const stateUtils = useState({
    value: '',
    suggestions: suggestionList,
  });

  const state = stateUtils[0];
  const setState = stateUtils[1];

  console.log(props, state, 'render SlideFilters');

  const onChange = event => {
    const {
      target: { value },
    } = event;
    // The line below escapes regular expression special characters:
    // [ \ ^ $ . | ? * + ( )
    const escapedText = value.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');

    // Create the regular expression with modified value which
    // handles escaping special characters. Without escaping special
    // characters, errors will appear in the console
    const exp = new RegExp(escapedText, 'i');
    const suggestions = suggestionList.filter(s => exp.test(s));
    setState({ value, suggestions });
  };

  const onSelect = event => setState({ ...state, value: event.suggestion });
  const submit = (event) => {
    console.log(event.value, state.value);
  };

  return (
    <Form
      onReset={event => console.log(event.value, this.state.value)}
      onSubmit={submit}
    >
      <FormField label="Label" htmlFor="text-input" {...props}>
        <TextInput
          name="autocomplete"
          id="text-input"
          placeholder="placeholder"
          value={state.value}
          onChange={onChange}
          onSelect={onSelect}
          suggestions={state.suggestions}
        />
      </FormField>
      <FormField
        label="Employee ID"
        name="employeeId"
        required
        value={2222}
        validate={{ regexp: /^[0-9]{4,6}$/, message: '4-6 digits' }}
      />
      <FormField
        label="Age"
        name="age"
        component={RangeInput}
        pad
        min={15}
        max={75}
      />


      <FormField
        name="subscribe"
        component={CheckBox}
        pad
        label="Subscribe?"
      />
      <FormField
        name="ampm"
        component={RadioButtonGroup}
        pad
        options={['morning', 'evening']}
      />


      <Box direction="row" justify="between" margin={{ top: 'medium' }}>

        <Button type="submit" label="Update" primary/>
        <Button label="Cancel"/>
        <Button type="reset" label="Reset"/>

      </Box>
      {
        console.timeEnd('filter')
      }
    </Form>
  );
}


export class SlideFilters2 extends Component {

  state = {
    value: '',
    suggestions: suggestionList,
  };

  constructor(props: DataMap) {
    super(props);

    this.onSelect = this.onSelect.bind(this);
    this.submit = this.submit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onSelect(event) {
    this.setState({ ...this.state, value: event.suggestion });
  }

  submit(event) {
    console.log(event.value, this.state.value);
  }

  onChange(event) {
    const {
      target: { value },
    } = event;
    // The line below escapes regular expression special characters:
    // [ \ ^ $ . | ? * + ( )
    const escapedText = value.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');

    // Create the regular expression with modified value which
    // handles escaping special characters. Without escaping special
    // characters, errors will appear in the console
    const exp = new RegExp(escapedText, 'i');
    const suggestions = suggestionList.filter(s => exp.test(s));
    this.setState({ value, suggestions });
  };

  render(): ReactElement {
    console.time('filter2');
    console.log(this.props, this.state, 'render SlideFilters');

    return (
      <Form
        onReset={event => console.log(event.value, this.state.value)}
        onSubmit={this.submit}
      >
        <FormField label="Label" htmlFor="text-input" {...this.props}>
          <TextInput
            name="autocomplete"
            id="text-input"
            placeholder="placeholder"
            value={this.state.value}
            onChange={this.onChange}
            onSelect={this.onSelect}
            suggestions={this.state.suggestions}
          />
        </FormField>
        <FormField
          label="Employee ID"
          name="employeeId"
          required
          value={2222}
          validate={{ regexp: /^[0-9]{4,6}$/, message: '4-6 digits' }}
        />
        <FormField
          label="Age"
          name="age"
          component={RangeInput}
          pad
          min={15}
          max={75}
        />


        <FormField
          name="subscribe"
          component={CheckBox}
          pad
          label="Subscribe?"
        />
        <FormField
          name="ampm"
          component={RadioButtonGroup}
          pad
          options={['morning', 'evening']}
        />


        <Box direction="row" justify="between" margin={{ top: 'medium' }}>

          <Button type="submit" label="Update" primary/>
          <Button label="Cancel"/>
          <Button type="reset" label="Reset"/>

        </Box>
        {
          console.timeEnd('filter2')
        }
      </Form>
    );
  }
}
