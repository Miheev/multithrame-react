import { Instantiable } from 'src/modules/shared/models';

export interface ContainerRef<T extends {}> {
  container: T;
}

export interface DiProvider<T extends Instantiable = Instantiable> {
  type: T;
  deps: (keyof T)[];
}
