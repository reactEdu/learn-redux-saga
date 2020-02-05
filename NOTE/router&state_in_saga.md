# redux-saga에서 라우터 연동
- 사가 내부에서 history를 사용해야 하는 경우 context에 등록해놓고 사용
- API를 호출하지 않는 일반 기능도 전체적인 프로세스는 같다.
  - 화면에서 액션생성 호출
  - watch 함수가 액션에 맞는 사가 함수 호출
  - 사가함수에서 기능 실행

```javascript
/** index.js **/
const sagaMiddleware = createSagaMiddleware({
  context: {
    history: customHistory
  }
});

/** modules/posts.js **/
// 액션명
const GO_TO_HOME = 'GO_TO_HOME';

// 액션생성 함수
export const goToHome = () => ({ type: GO_TO_HOME});

// 사가함수
function* goToHomeSaga() {
  const history = yield getContext('history');
  history.push('/');
}

// watch 함수
export function* postsSaga(){
  yield takeEvery(GET_POSTS, getPostsSaga);
  yield takeEvery(GET_POST, getPostSaga);
  yield takeEvery(GO_TO_HOME, goToHomeSaga);
}
```

# redux-saga에서 select로 현재 리덕스 상태 조회
- 현재 리덕스 상태 조회하는 이펙트 select
- 사가 함수내에서 현재 상태에 따라 분기처리 할때 사용

```javascript
// 액션명
const PRINT_STATE = 'PRINT_STATE';

// 액션생성 함수
export const printState = () => ({ type: PRINT_STATE});

// 사가함수
function* printStateSaga() {
  const state = yield select(state => state.posts);
  console.log(state)
}

// watch 함수
export function* postsSaga(){
  yield takeEvery(GET_POSTS, getPostsSaga);
  yield takeEvery(GET_POST, getPostSaga);
  yield takeEvery(GO_TO_HOME, goToHomeSaga);
  yield takeEvery(PRINT_STATE, printStateSaga);
}
```