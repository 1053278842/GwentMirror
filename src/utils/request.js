import axios from "axios";
// 创建axios实例
const service = axios.create({
  timeout: 1000 * 80,
  // baseURL: "http://localhost:8848",
  baseURL: "/api",
  headers: {
    "Content-type": "application/json; charset=utf-8",
  },
});