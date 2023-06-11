import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    const { status } = err.response;
    switch (status) {
      case 403:
        localStorage.removeItem("userStorage");
        window.location.replace("/login");
        break;
      default:
        break;
    }
    return Promise.reject(err);
  }
);
