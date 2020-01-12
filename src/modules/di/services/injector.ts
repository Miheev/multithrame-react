import { ContainerRef, DiProvider, IInjector } from 'src/modules/di/models';
import { IService } from 'src/modules/shared/models';

export class Injector<T extends {}> implements IInjector<T> {
  private containerRef: ContainerRef<T>;
  private children: Array<Injector<T>> = [];

  constructor(ref: ContainerRef<T>) {
    this.containerRef = ref;
  }

  /**
   * Basic Service CRUD
   */

  get(name: keyof T): unknown {
    if (!this.has(name)) {
      throw new Error(`service not found ${name}`);
    }

    return this.containerRef.container[name];
  }

  create(serviceName: keyof T): void {
    let providerName = (serviceName + 'Provider') as keyof T;
    let provider = this.get(providerName) as DiProvider;
    let params = provider.deps.map((depKey) => this.get(depKey as keyof T));

    this.containerRef.container[serviceName] = new provider.type(...params) as T[keyof T];
  }

  has(name: keyof T): boolean {
    return Boolean(this.containerRef.container[name]);
  }

  getOrCreateIfAbsent(name: keyof T): unknown {
    if (!this.has(name)) {
      this.create(name);
    }

    return this.containerRef.container[name];
  }

  remove(name: string): void {
    delete this.containerRef.container[name];
  }

  /**
   * Container & Injector Manipulation
   */

  mergeContainer<F extends {}>(ref: ContainerRef<F>): Injector<T & F> {
    Object.assign(this.containerRef.container, ref.container);
    return this as unknown as Injector<T & F>;
  }

  createChild(): Injector<T> {
    let childContainerRef = { container: Object.create(this.containerRef.container) };
    let child = new Injector<T>(childContainerRef);
    this.children.push(child);

    return child;
  }

  destroyChildren(): void {
    this.children.forEach((child) => child.destroy());
    this.children = [];
  }

  destroy(): void {
    this.destroyChildren();

    let service: IService | null;
    Object.keys(this.containerRef.container)
      .filter((key) => !key.endsWith('Provider'))
      .forEach((key: string) => {
        service = this.containerRef.container[key] as IService | null;
        if (service && service.destroy) {
          service.destroy();
        }
      });
    this.containerRef.container = {} as T;
  }
}
