import { takeEvery, put, call } from "redux-saga/effects";
import axios from "axios";

function* fetchDataSaga() {
  try {
    yield put({ type: "FETCH_DATA_REQUEST" });
    const response = yield call(() => axios.get("https://jsonplaceholder.typicode.com/posts/1"));
    yield put({ type: "FETCH_DATA_SUCCESS", payload: response.data });
  } catch (error) {
    yield put({ type: "FETCH_DATA_FAILURE", payload: error.message });
  }
}

function* rootSaga() {
  yield takeEvery("FETCH_DATA", fetchDataSaga);
}

export default rootSaga;
