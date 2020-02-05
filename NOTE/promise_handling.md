# redux-saga 프로미스 다루기
- redux-thunk와 비교
  - 요청 시작 dispatch -> 액션 생성함수
  - await ApiCallFn(param) -> yield call(ApiCallFn, param)
  - dispatch(액션객체) -> yield put(액션객체)

```javascript
/** redux-thunk **/
// 썽크 생성함수
const getPost = id => async dispatch => {
  // 요청 시작
  dispatch({ type: GET_POST, meta: id });
  try {
    // API 호출
    const payload = await postsAPI.getPostById(id);
    // 성공했을 때
    dispatch({ type: GET_POST_SUCCESS, payload, meta: id });
  } catch (e) {
    // 실패했을 때
    dispatch({ type: GET_POST_ERROR, payload: e, error: true, meta: id });
  }
}

/** redux-saga **/
// 액션 생성함수
const getPost = id => ({ type: GET_POST, payload:id, meta: id });
// 사가 함수
function* getPostSaga(action) {
  const id = action.payload;
  try {
    // API 호출
    const payload = yield call(postsAPI.getPostById, id);
    // 성공했을 때
    yield put({ type: GET_POST_SUCCESS, payload, meta: id });
  } catch (e) {
    // 실패했을 때
    yield put({ type: GET_POST_ERROR, payload: e, error: true, meta: id });
  }
}

dispatch(getPost(1));
```

## 실제 적용
- module posts에 적용하고 rootSaga에서 불러온다.

```javascript
/** modules/posts.js **/
// 액션생성 함수
export const getPosts = () => ({ type: GET_POSTS });
export const getPost = (id) => ({ type: GET_POST, payload:id, meta: id });

// 사가함수
function* getPostsSaga() {
  try {
    const payload = yield call(postsAPI.getPosts );
    yield put({ type: GET_POSTS_SUCCESS, payload});
  } catch (e) {
    yield put({ type: GET_POSTS_ERROR, payload: e, error: true});
  }
}
function* getPostSaga(action) { // action: 액션생성함수에서 반환한 액션
  const id = action.payload;
  try {
    const payload = yield call(postsAPI.getPostById, id);
    yield put({ type: GET_POST_SUCCESS, payload, meta: id });
  } catch (e) {
    yield put({ type: GET_POST_ERROR, payload: e, error: true, meta: id });
  }
}

// watch 함수
export function* postsSaga(){
  yield takeEvery(GET_POSTS, getPostsSaga);
  yield takeEvery(GET_POST, getPostSaga);
}

/** modules/index.js **/
export function* rootSaga() {
  yield all([counterSaga(), postsSaga()]);
}
```

##  redux-saga 프로미스 관련 saga 리팩토링
- createPromiseSaga,createPromiseSagaByid 유틸함수로 분리

```javascript
export const createPromiseSaga= (type, promiseCreator) =>{
  const [SUCCESS, ERROR] = [`${type}_SUCCESS`,`${type}_ERROR`];

  return function* saga(action) {
    try {
      const payload = yield call(promiseCreator, action.payload);
      yield put({ type: SUCCESS, payload });
    } catch (e) {
      yield put({ type: ERROR, payload: e, error: true });
    }
  }
}

// idSelector가 필요없음: action을 dispatch할때 id를 meta에 넣으면 됨
export const createPromiseSagaById= (type, promiseCreator) =>{
  const [SUCCESS, ERROR] = [`${type}_SUCCESS`,`${type}_ERROR`];

  return function* saga(action) {
    const id = action.meta;
    try {
      const payload = yield call(promiseCreator, action.payload);
      yield put({ type: SUCCESS, payload, meta: id });
    } catch (e) {
      yield put({ type: ERROR, payload: e, error: true, meta: id });
    }
  }
}

```

- 모듈의 사가함수에 방금 만든 유틸함수 적용

```javascript
// 사가함수
const getPostsSaga = createPromiseSaga(GET_POSTS, postsAPI.getPosts);
const getPostSaga = createPromiseSagaById(GET_POST, postsAPI.getPostById);
```