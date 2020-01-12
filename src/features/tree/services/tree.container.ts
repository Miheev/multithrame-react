import { sharedInjector } from 'src/modules/core/services/shared.container';
import { ContainerRef, DiProvider } from 'src/modules/di/models';
import { TreeConnector } from 'src/features/tree/services/tree.connector';

let containerRef = {
  container: {
    treeConnector: null as TreeConnector,
    treeConnectorProvider: {
      type: TreeConnector,
      deps: ['toaster'],
    } as unknown as DiProvider,
  },
};

let injector = sharedInjector.createChild();

export const treeContainerRef: ContainerRef<typeof containerRef.container> = containerRef;
export const treeInjector = injector.mergeContainer<typeof treeContainerRef.container>(treeContainerRef);
