import { combineReducers } from "redux";
import { getItem, setItem } from "../utils/asyncStorage";

const initialState = {
  userInfo: getItem("userInfo") ? getItem("userInfo") : null,
  loading: false,
  error: null,
  token: getItem("token") ? getItem("token") : null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_REQUEST":
    case "REGISTER_REQUEST":
      return { ...state, loading: true, error: null };
    case "LOGIN_SUCCESS":
      // setItem("token", action.payload.content.token);
      // setItem("userInfo", action.payload.content.userInfo);
      return { ...state, loading: false, token: action.payload.content.token, userInfo: action.payload.content.userInfo, error: null };
    case "REGISTER_SUCCESS":
      return { ...state, loading: false, userInfo: action.payload, error: null };
    case "LOGIN_FAILURE":
    case "REGISTER_FAILURE":
      console.log(action.payload);
      return { ...state, loading: false, error: action.payload };
    case "LOGOUT":
      return { ...state, loading: false, error: null, token: null, userInfo: null };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  user: userReducer,
});

export default rootReducer;
