import { Dispatch, Store } from 'redux';

import { AppStoreConnector } from 'src/modules/core/services/app-store.connector';
import { saveScrollPosition } from 'src/modules/redux/scroll-composable/actions';
import { IService, ScrollStateEnum } from 'src/modules/shared/models';
import { ScrollState } from 'src/modules/redux/models/scroll.state';
import { AppState, CommonState } from 'src/modules/redux/models';

export class InfiniteScrollConnector implements IService {
  private dispatch: Dispatch;

  private scrollOffset = 30;
  private scrollPosition = -1;
  private isInited = false;
  private scrollLock = false;
  private stateBrunch = '';

  private infiniteScroll: ScrollStateEnum = null;
  private scrollElement: HTMLElement = null;

  constructor(private appConnector: AppStoreConnector,
              private appStore: Store) {
    this.dispatch = this.appStore.dispatch;
    this.listenScroll = this.listenScroll.bind(this);
  }

  get currentScrollPosition(): number {
    if (!this.stateBrunch) {
      console.error('Scroll state brunch not defined. ScrollPosition will fallback to default value.');
      return -1;
    }
    let scrollState = this.appStore.getState()[this.stateBrunch] as ScrollState;
    return scrollState.scrollPosition;
  }

  init(scrollElement: HTMLElement, stateBrunch: keyof AppState): void {
    this.scrollElement = scrollElement;
    this.stateBrunch = stateBrunch;
    this.scrollPosition = this.currentScrollPosition;

    let offset = parseInt(window.getComputedStyle(this.scrollElement)
      .getPropertyValue('--scroll-offset'), 10);
    if (offset && !Number.isNaN(offset)) {
      this.scrollOffset = offset;
    }

    this.isInited = true;
  }

  destroy(): void {
    this.scrollElement = {} as HTMLElement;
    this.appConnector = null;
  }

  onStateUpdate(newState: CommonState): void {
    if (!this.isInited || newState.infiniteScroll === this.infiniteScroll) {
      return;
    }

    this.infiniteScroll = newState.infiniteScroll;
    switch (true) {
      case this.infiniteScroll === ScrollStateEnum.scrollBack && this.scrollPosition > 0:
        this.scrollTo(this.scrollPosition);
        break;
      case this.infiniteScroll === ScrollStateEnum.resetScroll:
        this.scrollTo(0);
        break;
      case this.infiniteScroll === ScrollStateEnum.scrollSave:
        const currentPosition = this.scrollElement.scrollTop;
        // should be more then scroll css offset otherwise scroll back feature not visible
        if (currentPosition + this.scrollOffset > this.scrollOffset) {
          this.scrollPosition = currentPosition + this.scrollOffset;
          this.emitScrollPosition();
        }
        break;
    }
  }

  listenScroll(): void {
    // todo: need better debounce, it works abruptly on low item per page (e.g. 2)
    if (this.scrollLock) {
      return;
    }
    this.scrollLock = true;

    setTimeout(() => {
      this.triggerNextPage();
      this.scrollLock = false;
    }, 300);
  }

  private scrollTo(position: number): void {
    setTimeout((() => {
      this.scrollElement.scrollTop = position;
    }), 100);
  }

  private triggerNextPage(): void {
    if (this.infiniteScroll === ScrollStateEnum.locked) {
      return;
    }

    const maxHeight = this.scrollElement.scrollHeight - this.scrollElement.offsetHeight;
    const currentPosition = this.scrollElement.scrollTop;
    if (maxHeight - currentPosition >= this.scrollOffset) {
      return;
    }

    this.appConnector.infiniteScroll = ScrollStateEnum.locked;
  }

  private emitScrollPosition(): void {
    this.dispatch(saveScrollPosition(this.scrollPosition));
  }
}
