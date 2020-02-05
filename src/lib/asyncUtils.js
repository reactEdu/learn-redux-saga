import { call, put } from 'redux-saga/effects';

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

// 리듀서 함수를 반환
export const handleAsyncActions = (type, key, keepData) => {
  const [SUCCESS, ERROR] = [`${type}_SUCCESS`,`${type}_ERROR`];
  return (state, action) => {
    switch (action.type) {
      case type:
        return {
          ...state,
          [key]: reducerUtils.loading(keepData ? state[key].data : null), 
        } // 3번째 파라미터 keepData로 로딩 이전 값 유지 여부 결정
      case SUCCESS:
        return {
          ...state,
          [key]: reducerUtils.success(action.payload),
        }
      case ERROR:
        return {
          ...state,
          [key]: reducerUtils.error(action.payload),
        }
      default:
        return state
    }
  }
}

// id로 매칭하는 리듀서 함수를 반환
export const handleAsyncActionsById = (type, key, keepData) => {
  const [SUCCESS, ERROR] = [`${type}_SUCCESS`,`${type}_ERROR`];
  return (state, action) => {
    const id = action.meta; // post 안의 키 id를 가지고 상태를 바꾸기 위함
    switch (action.type) {
      case type:
        return {
          ...state,
          [key]: {
            ...state[key],
            [id]: reducerUtils.loading(
              keepData ? state[key][id] && state[key][id].data : null
              ), // && -> 처음 데이터가 없을때 방어코딩
          }
        } // 3번째 파라미터 keepData로 로딩 이전 값 유지 여부 결정
      case SUCCESS:
        return {
          ...state,
          [key]: {
            ...state[key],
            [id]: reducerUtils.success(action.payload),
          }
        }
      case ERROR:
        return {
          ...state,
          [key]: {
            ...state[key],
            [id]: reducerUtils.error(action.payload),
          }
        }
      default:
        return state
    }
  }
}

// 리듀서에서 사용하는 state 반환
export const reducerUtils = {
  initial: (data=null) => ({
    data,
    loading: false,
    error: null,
  }),
  loading: (prevState=null) => ({ // prevState는 state.posts.data를 의미
    data: prevState, // prevState: 요청이 들어왔을때 data 값 유지를 위함
    loading: true,
    error: null,
  }),
  success: (data) => ({ 
    data,
    loading: false,
    error: null,
  }),
  error: (error) => ({ 
    data: null,
    loading: false,
    error,
  }),
};