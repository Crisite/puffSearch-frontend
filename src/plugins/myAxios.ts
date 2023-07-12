import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8102/api",
  timeout: 10000,
  headers: {},
});

export default instance;
