import { IService, ThemeColorEnum } from 'src/modules/shared/models';
import { TreeNode } from 'src/features/tree/models';
import { ToasterService } from 'src/modules/di/models';

export class TreeConnector implements IService {
  static readonly defaultHeight = 12;
  static readonly binaryTreeChildrenLength = 2;

  currentValue = 0;
  height = TreeConnector.defaultHeight;
  length = 2 ** TreeConnector.defaultHeight;

  colors: ThemeColorEnum[] = [ThemeColorEnum.brand, ThemeColorEnum.error];

  tree: TreeNode = null;
  edgeNodeCount = 0;
  edgeNodeLength = 0;

  private rebuildSubscriptionList: Array<() => void> = [];

  constructor(private toaster: ToasterService) {
  }

  get lengthFormatted(): string {
    return (this.length - 1).toLocaleString();
  }

  destroy(): void {
    this.toaster = null;
    this.rebuildSubscriptionList = [];
  }

  nextValue(): number {
    let current = this.currentValue;
    this.currentValue += 1;
    return current;
  }

  resetHeight(): void {
    this.height = TreeConnector.defaultHeight;
    this.length = 2 ** TreeConnector.defaultHeight;
  }

  rebuildTree(): void {
    this.rebuildSubscriptionList.forEach(fn => fn());
  }

  onRebuildTree(fn: () => void) {
    this.rebuildSubscriptionList.push(fn);
  }

  createRootNode(): TreeNode {
    this.currentValue = 0;
    this.tree = {
      value: this.nextValue(),
      height: 0,
      isBinarySubtree: true,
      children: [],
    };

    return this.tree;
  }

  addBinaryTreeChildren(node: TreeNode): TreeNode[] {
    let index;
    for (index = 0; index < TreeConnector.binaryTreeChildrenLength; ++index) {
      node.children.push({
        value: this.nextValue(),
        height: node.height + 1,
        isBinarySubtree: true,
        children: [],
      });
    }

    return node.children;
  }

  addNodeTo(node: TreeNode): void {
    node.children.push({
      value: this.nextValue(),
      height: node.height + 1,
      isBinarySubtree: false,
      children: [],
    });
  }

  deleteChildren(node: TreeNode): TreeNode[] {
    node.children = [];
    return node.children;
  }

  timeStart(): void {
    this.edgeNodeLength = this.length / 2;
    this.edgeNodeCount = 0;
    console.time('TreeBuilding');
  }
  timeEnd(): void {
    this.edgeNodeCount += 1;
    if (this.edgeNodeCount === this.edgeNodeLength) {
      console.timeEnd('TreeBuilding');
      console.log(performance);

      setTimeout(() => {
        this.toaster.success('Done!', 'See console for performance details');
      });
    }
  }
}
