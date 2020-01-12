import { Selectable } from 'src/modules/shared/models';

export interface AutocompleteInputProps {
  value: Selectable;
  suggestions: Selectable[];
  onSelect: (suggestion: Selectable) => void;

  label: string;
  id: string;
  name: string;
}

export interface AutocompleteInputState {
  selected: Selectable;
  filtered: Selectable[];
  suggestions: Selectable[];
}
