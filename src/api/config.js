import axios from "axios";
import { getItem } from "../utils/asyncStorage";

export const BASE_URL_NO_PREFIX = "http://192.168.0.104:8080";
export const BASE_URL = `${BASE_URL_NO_PREFIX}/api/v1`;
export const BASE_URL_IMG = `${BASE_URL_NO_PREFIX}/public/imgs`;

const token = getItem("token") ? getItem("token") : null;

export const configHeaders = () => {
  return {
    token,
  };
};

export const https = axios.create({
  baseURL: BASE_URL,
  headers: {
    ...configHeaders(),
  },
});
