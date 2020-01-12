export interface DataMap {
  [key: string]: unknown;
}

export interface StringMap {
  [key: string]: string;
}

export interface Instantiable extends DataMap {
  new(...args: unknown[]): unknown;
}
