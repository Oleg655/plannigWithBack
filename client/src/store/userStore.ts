import { fetchUsersData } from 'api';
import { makeAutoObservable, runInAction } from 'mobx';

import { ErrorStore } from './errorStore';
import { RootStore } from './rootStore';

export class UserStore {
  rootStore: RootStore;

  errorStore: ErrorStore;

  userInfo: any;

  fetchUsersData: typeof fetchUsersData;

  load: boolean = false;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
    this.errorStore = this.rootStore.errorStore;
    this.fetchUsersData = this.rootStore.fetchUsersData;
  }

  async getUserInfo() {
    try {
      this.load = true;
      const response = await this.fetchUsersData.getUserInfo();
      if (response.status === 200) {
        const data = await response.json();
        runInAction(() => {
          this.userInfo = { ...data };
        });
        // return data;
      }
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
    } catch (error) {
      this.errorStore.setError(error);
    } finally {
      this.load = false;
    }
  }
}
