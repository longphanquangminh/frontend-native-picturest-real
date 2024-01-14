import { takeEvery, put, call } from "redux-saga/effects";
import axios from "axios";
import { BASE_URL } from "../api/config";

function* loginSaga(action) {
  try {
    yield put({ type: "LOGIN_REQUEST" });
    const response = yield call(() => axios.post(`${BASE_URL}/login`, action.payload));
    yield put({ type: "LOGIN_SUCCESS", payload: response.data });
  } catch (error) {
    yield put({ type: "LOGIN_FAILURE", payload: error.message });
  }
}

function* registerSaga(action) {
  try {
    yield put({ type: "REGISTER_REQUEST" });
    const response = yield call(() => axios.post(`${BASE_URL}/register`, action.payload));
    yield put({ type: "REGISTER_SUCCESS", payload: response.data });
  } catch (error) {
    yield put({ type: "REGISTER_FAILURE", payload: error.message });
  }
}

function* logoutSaga() {
  try {
    yield put({ type: "LOGOUT_OK" });
  } catch (error) {
    yield put({ type: "LOGOUT_FAILURE", payload: error.message });
  }
}

function* rootSaga() {
  yield takeEvery("LOGIN", loginSaga);
  yield takeEvery("REGISTER", registerSaga);
  yield takeEvery("LOGOUT", logoutSaga);
}

export default rootSaga;
