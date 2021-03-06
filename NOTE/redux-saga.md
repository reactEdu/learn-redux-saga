## 리덕스 사가 사용법
- 리덕스 사가 전용 액션과 액션 생성함수를 만든다.
- 액션 생성함수를 제외하고 사가에서 쓰는 함수들은 generator 함수 기반이다. (*과 yield 사용)
- 각 작업마다 리듀서를 만들듯이 각 counter의 사가인 counterSaga를 만들어 export한다.
- redux-saga의 effects로 특정작업을 처리하게 할수 있는데, 이걸로 다양한 방식의 비동기처리를 할 수 있다.
  - put(actionCreatorFn()) : dispatch함수 역할을 한다.
  - takeEvery(action, actionCreatorFn)   : action이 dispatch 될때마다 actionCreatorFn 호출
  - takeLatest(action, actionCreatorFn)  : 가장 마지막으로 action이 dispatch 된것만 actionCreatorFn 호출(ex. 버튼 여러번 눌러도 마지막 1번만 처리)
  - takeLeading(action, actionCreatorFn) : 가장 먼저 action이 dispatch 된것만 actionCreatorFn 호출

## redux-saga로 counter 구현

```javascript
import { delay, put, takeEvery, takeLatest, takeLeading } from 'redux-saga/effects';

const INCREASE = 'INCREASE';
const DECREASE = 'DECREASE';
const INCREASE_ASYNC = 'INCREASE_ASYNC';
const DECREASE_ASYNC = 'DECREASE_ASYNC';

export const increase = () => ({ type: INCREASE });
export const decrease = () => ({ type: DECREASE });
export const increaseAsync = () => ({ type: INCREASE_ASYNC });
export const decreaseAsync = () => ({ type: DECREASE_ASYNC });

function* increaseSaga() {
  yield delay(1000);
  yield put(increase());
}

function* decreaseSaga() {
  yield delay(1000);
  yield put(decrease());
}

// rootSaga에 등록하기 위해 export
export function* counterSaga() {
  yield takeEvery(INCREASE_ASYNC, increaseSaga);
  yield takeLeading(DECREASE_ASYNC, decreaseSaga);
}

// 리듀서 부분은 동일
```

## rootSaga 작성
- rootReducer처럼 module/index.js에 작성한다.
- redux saga는 generator 함수 기반이라는 것 유의

```javascript
import { combineReducers } from 'redux';
import counter, { counterSaga } from './counter';
import posts from './posts';
import { all } from 'redux-saga/effects';

const rootReducer = combineReducers({ counter, posts });

export function* rootSaga() {
  yield all([counterSaga()])
}

export default rootReducer;
```

## 리덕스 미들웨어 적용
- npm i redux-saga
- 리덕스사가 미들웨어는 redux-saga가 리턴한 함수를 호출한 결과값
- 미들웨어는 항상 applyMiddleware() 함수를 통해서 store 생성할때 주입

```javascript
import rootReducer, { rootSaga } from './modules';
import logger from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension'
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import createSagaMiddleware  from 'redux-saga';

const customHistory = createBrowserHistory();
const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootReducer, 
  composeWithDevTools(
    applyMiddleware(
      sagaMiddleware,
      logger
    )
  )
);

sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <Router history={customHistory}>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>
, document.getElementById('root'));
```
