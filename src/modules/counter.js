import { delay, put, takeEvery, takeLeading } from 'redux-saga/effects'

const INCREASE = 'counter/INCREASE';
const DECREASE = 'counter/DECREASE';
const INCREASE_ASYNC = 'counter/INCREASE_ASYNC';
const DECREASE_ASYNC = 'counter/DECREASE_ASYNC';

export const increase = () => ({ type: INCREASE });
export const decrease = () => ({ type: DECREASE });

// saga는 action 생성함수로 처리
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

const initialState = 0;

export default function counter(state=initialState, action) {
  switch (action.type) {
    case INCREASE:
      return state+1;
    case DECREASE:
      return state-1;
    default:
      return state;
  }
}
