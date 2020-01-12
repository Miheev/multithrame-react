export interface IInjector<T extends {}> {
  get(name: keyof T): unknown;
  create(serviceName: keyof T): void;
  has(name: keyof T): boolean;
  remove(name: string): void;
  destroy(): void;
}
