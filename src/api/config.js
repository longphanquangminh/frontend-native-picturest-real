// import axios from "axios";
import { getItem } from "../utils/asyncStorage";

export const BASE_URL = "https://picturest-backend-real-hope.onrender.com";

export const configHeaders = async () => {
  const token = getItem("token") ? await getItem("token") : null;
  console.log("tokenx: ", token);
  return {
    token,
  };
};

// export const https = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     ...configHeaders(),
//   },
// });
