import {
  ADD_TASK,
  REMOVE_TASK,
  REMOVE_ALL_TASKS,
  FINISH_TASK,
  GET_TASKS_FAILURE,
  GET_TASKS_REQUEST,
  GET_TASKS_SUCCESS
} from "../types/tasks";

const initialState = {
  tasks: [],
  isLoading: false,
  isLoaded: false,
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TASK:
      return {
        ...state,
        currentTask: {
          id: action.payload.id,
          timeStart: action.payload.timeStart,
          isRunning: true
        },
        tasks: [ ...state.tasks ]
      };
    case FINISH_TASK:
      return {
        ...state,
        currentTask: undefined,
        tasks: [ ...state.tasks, { ...action.payload, isRunning: false } ]
      };
      
    case REMOVE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(elem => elem.id !== action.id)
      };
    case REMOVE_ALL_TASKS:
      return {...state, tasks: [] };
    case GET_TASKS_REQUEST:
      return { ...state, isLoading: true };
  
    case GET_TASKS_SUCCESS:
      return {
        tasks: action.payload,
        isLoading: false,
        isLoaded: true
      };
  
    case GET_TASKS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    default:
      return state;
  }
};
