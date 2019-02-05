import { getTasksSuccess } from '../actionCreators/tasks';
import { GET_TASKS_REQUEST } from '../types/tasks';
import { takeEvery, call, put } from 'redux-saga/effects';
import { getData } from '../api';
import moment from 'moment';

// helpers
const uniqid = require('uniqid');

let timeStartTask = moment().set({ hour: 0, minute: 0, second: 0}).valueOf();

const endDay = moment().endOf('day').valueOf();

function* garbageRequestFlow() {
  
  try {
    const response = yield call(getData);
    const newResponse = response.map(elem => {
      const randomTasksTime = Math.floor(10 + Math.random() * (90 - 10)) * 60 * 1000;
      timeStartTask += (randomTasksTime + 1000);
      if (timeStartTask > endDay) {
        timeStartTask = moment().set({ hour: 0, minute: 0, second: 0}).valueOf()
      }
     
      return {
        name: elem.title,
        id: uniqid(),
        timeStart: timeStartTask,
        timeEnd: timeStartTask + randomTasksTime,
        isRunning: false
      }
    });
  
    yield put(getTasksSuccess(newResponse));
  } catch (error) { console.log(error)}
}

export function* garbageRequestWatcher() {
  yield takeEvery(GET_TASKS_REQUEST, garbageRequestFlow);
}
