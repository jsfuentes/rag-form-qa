//next.config.js rewrites /api to correct server url, so this entire file is kinda unnecessary
import { default as axiosBase } from "axios";
// import conf from "conf";

// const axiosProd = axiosBase.create({
//   baseURL: conf.get("SERVER_URL"),
//   // withCredentials: true
//   /* other custom settings */
// });

// export const axios = inDev ? axiosBase : axiosProd;
export const axios = axiosBase;
