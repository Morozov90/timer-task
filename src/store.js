import { createStore, compose, applyMiddleware } from 'redux';
import rootReducer from './reducers';
import createSagaMiddleware from 'redux-saga';
import sagas from './sagas';

const preloadedState = localStorage.getItem('state') ? JSON.parse(localStorage.getItem('state')) : undefined;

const createAppStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  
  
  const store = createStore(
    rootReducer,
    preloadedState,
    compose(
      applyMiddleware(sagaMiddleware),
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    ),
  );
  
  sagaMiddleware.run(sagas);
  
  return store;
};

export default createAppStore;
