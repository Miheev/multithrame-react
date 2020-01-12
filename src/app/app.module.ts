import { channelRoutes } from 'src/features/channel/channel.module';
import { popularRoutes } from 'src/features/popular/popular.module';
import { treeSimpleRoutes } from 'src/features/tree-simple/tree-simple.module';
import { treeRoutes } from 'src/features/tree/tree.module';
import { registerCommonEffects } from 'src/modules/core/services/common.subscription';

registerCommonEffects();

export const appModule = [
  ...popularRoutes,
  ...channelRoutes,
  ...treeSimpleRoutes,
  ...treeRoutes,
];
