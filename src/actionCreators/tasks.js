import {
  ADD_TASK,
  REMOVE_TASK,
  REMOVE_ALL_TASKS,
  FINISH_TASK,
  GET_TASKS_FAILURE,
  GET_TASKS_REQUEST,
  GET_TASKS_SUCCESS
} from "../types/tasks";

export const addTask = (id, timeStart) => ({
  type: ADD_TASK,
  payload: {
    id,
    timeStart
  }
});

export const finishTask = (obj) => ({
  type: FINISH_TASK,
  payload: {
    ...obj
  }
});

export const removeTask = (id) => ({
  type: REMOVE_TASK,
  id
});

export const removeAllTasks = () => ({
  type: REMOVE_ALL_TASKS
});

export const getTasksRequest = (id, timeStart) => ({
  type: GET_TASKS_REQUEST,
  payload: {
    id,
    timeStart
  }
});

export const getTasksSuccess = (payload) => ({
  type: GET_TASKS_SUCCESS,
  payload
});

export const getTasksFailure = (error) => ({
  type: GET_TASKS_FAILURE,
  error
});
