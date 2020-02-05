import * as postsAPI from '../api/posts';
import { reducerUtils, handleAsyncActions, handleAsyncActionsById, createPromiseSagaById } from '../lib/asyncUtils';
import { takeEvery, } from 'redux-saga/effects'
import { createPromiseSaga } from './../lib/asyncUtils';

const GET_POSTS = 'GET_POSTS';
const GET_POSTS_SUCCESS = 'GET_POSTS_SUCCESS';  
const GET_POSTS_ERROR = 'GET_POSTS_ERROR';

const GET_POST = 'GET_POST';
const GET_POST_SUCCESS = 'GET_POST_SUCCESS';
const GET_POST_ERROR = 'GET_POST_ERROR';

// 기존 데이터 잠깐 보이는것 해결하기 위한 액션
const CLEAR_POST = 'CLEAR_POST';

// 액션생성 함수
export const getPosts = () => ({ type: GET_POSTS });
export const getPost = (id) => ({ type: GET_POST, payload:id, meta: id });

// 사가함수
const getPostsSaga = createPromiseSaga(GET_POSTS, postsAPI.getPosts);
const getPostSaga = createPromiseSagaById(GET_POST, postsAPI.getPostById);

// watch 함수
export function* postsSaga(){
  yield takeEvery(GET_POSTS, getPostsSaga);
  yield takeEvery(GET_POST, getPostSaga);
}

export const goToHome = () => (dispatch, getState, {history}) => {
  history.push('/');
}

export const clearPost = () => ({ type: CLEAR_POST});

const initialState = {
  posts: reducerUtils.initial(),
  post: {},
}

// 인수 true는 로딩중에 데이터를 초기화하지 않음(기존 데이터 존재시 그걸로 로딩)
const getPostsReducer = handleAsyncActions(GET_POSTS, 'posts', true);
const getPostReducer = handleAsyncActionsById(GET_POST, 'post', true);

// post & posts 리듀서
export default function posts(state=initialState, action) {
  switch (action.type) {
    case GET_POSTS:
    case GET_POSTS_SUCCESS:
    case GET_POSTS_ERROR:
      return getPostsReducer(state, action);
    case GET_POST:
    case GET_POST_SUCCESS:
    case GET_POST_ERROR:
      return getPostReducer(state, action);
    case CLEAR_POST:
      return {
        ...state,
        post: reducerUtils.initial(),
      }
    default:
      return state
  }
}