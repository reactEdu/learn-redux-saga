// thunk 함수 반환
export const createPromiseThunk= (type, promiseCreator) =>{
  const [SUCCESS, ERROR] = [`${type}_SUCCESS`,`${type}_ERROR`];

  const thunkCreator = param => async dispatch => {
    // 요청 시작
    dispatch({ type });
    try {
      // API 호출
      const payload = await promiseCreator(param);
      // 성공했을 때
      dispatch({ type: SUCCESS, payload });
    } catch (e) {
      // 실패했을 때
      dispatch({ type: ERROR, payload: e, error: true });
    }
  }

  return thunkCreator;
};

// id로 매칭하는 thunk 함수 반환
const defaultIdSelector = param => param; // id가 아닌 값도 param으로 처리하는 것을 위해 생성
export const createPromiseThunkByid= (type, promiseCreator, idSelector=defaultIdSelector) =>{
  const [SUCCESS, ERROR] = [`${type}_SUCCESS`,`${type}_ERROR`];

  return param => async dispatch => {
    const id = idSelector(param);
    dispatch({ type, meta: id });
    try {
      const payload = await promiseCreator(param);
      dispatch({ type: SUCCESS, payload, meta: id });
    } catch (e) {
      dispatch({ type: ERROR, payload: e, error: true, meta: id });
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