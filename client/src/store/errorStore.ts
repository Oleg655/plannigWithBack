import { makeAutoObservable } from 'mobx';
import { ServerErrorI } from 'types';

import { RootStore } from './rootStore';

export class ErrorStore {
  rootStore: RootStore;

  errorStatus: boolean = false;

  errorBody: ServerErrorI;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  setError(error: ServerErrorI) {
    this.errorStatus = true;
    this.errorBody = { ...error };
  }
}
