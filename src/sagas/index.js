import { fork } from 'redux-saga/effects';
import { garbageRequestWatcher } from './garbage';

export default function*() {
  yield fork(garbageRequestWatcher);
}
