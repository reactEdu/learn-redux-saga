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