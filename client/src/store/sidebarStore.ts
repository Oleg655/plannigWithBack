import { makeAutoObservable } from 'mobx';

import { RootStore } from './rootStore';

export class SidebarStore {
  rootStore: RootStore;

  showSidebar: boolean;

  stages: any[];

  formData: any[];

  parameters: any[];

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }
}
