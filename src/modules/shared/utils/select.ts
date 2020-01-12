import { Selectable } from 'src/modules/shared/models';
import { AppConfig } from 'src/modules/shared/app.config';

export const userInputId = '-1';

export function emptyOption(): Selectable {
  return { label: '', value: userInputId };
}

export function findDefaultOption(term: string, options: Selectable[]): Selectable {
  return options.find((variant) => {
    return variant.value === term;
  });
}

export function filterOptions(term: string, options: Selectable[]): Selectable[] {
  let searchTerm = term.toLowerCase();
  return options
    .filter((variant) => {
      return variant.label.toLowerCase().startsWith(searchTerm);
    })
    .slice(0, AppConfig.maxSelectOptions);
}

export function escapeInput(value: string, selectList: string[]): string[] {
  // The line below escapes regular expression special characters:
  // [ \ ^ $ . | ? * + ( )
  const escapedText = value.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');

  // Create the regular expression with modified value which
  // handles escaping special characters. Without escaping special
  // characters, errors will appear in the console
  const exp = new RegExp(escapedText, 'i');
  return selectList.filter(variant => exp.test(variant));
}
