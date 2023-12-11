import { fetchUsersData } from 'api';

import { ErrorStore } from './errorStore';
import { SidebarStore } from './sidebarStore';
import { TableStore } from './tableStore';
import { UserStore } from './userStore';

export class RootStore {
  errorStore: ErrorStore;

  tableStore: TableStore;

  sidebarStore: SidebarStore;

  userStore: UserStore;

  fetchUsersData: typeof fetchUsersData;

  constructor() {
    this.errorStore = new ErrorStore(this);
    this.fetchUsersData = fetchUsersData;
    this.tableStore = new TableStore(this);
    this.sidebarStore = new SidebarStore(this);
    this.userStore = new UserStore(this);
  }
}
export const rootStore = new RootStore();
