import axios from "axios";

// baseURL: "http://localhost:5000/",

const instance = axios.create({
  baseURL: "http://localhost:5000/",
});

instance.defaults.withCredentials = true;

export default instance;
