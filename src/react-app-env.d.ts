/// <reference types="react-scripts" />

/**
 * Bypass TS JSX & React check
 * http://www.typescriptlang.org/docs/handbook/jsx.html#function-component
 */

declare namespace JSX {
  // enable non standard HTMLElements
  interface IntrinsicElements {
    [elemName: string]: any;
  }

  // specify extra properties used by the JSX framework
  interface IntrinsicAttributes extends React.Attributes {
    [attribute: string]: any;
  }
  // specify extra properties for class components (and not Function Components)
  interface IntrinsicClassAttributes<T> extends React.ClassAttributes<T> {
    [attribute: string]: any;
  }
}

declare namespace React {
  // enable non standard HTMLElement's attributes
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    [attribute: string]: any;
  }
}
