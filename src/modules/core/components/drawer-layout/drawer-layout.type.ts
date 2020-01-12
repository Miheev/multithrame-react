import { ReactNode } from 'react';

export interface DrawerLayoutProps {
  column: ReactNode;
  main: ReactNode;
  children: ReactNode;
  slideHandler: (fn: () => void) => void;
}

export interface DrawerLayoutState {
  sidebarToggle: boolean,
}
