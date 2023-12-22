import axios from "../api/Axios";
import Swal from "sweetalert2";

export const axiosPrivate = axios.create({});

axiosPrivate.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const prevRequest = error?.config;
    if (error.response.status === 401 && !prevRequest?.sent) {
      try {
        prevRequest.sent = true;
        const refToken = await localStorage.getItem("admin-refToken");
        console.log("refToken admin", refToken);
        if (refToken) {
          const response = await axios.post(
            "/refresh-token",
            { refToken },
            { withCredentials: true }
          );
          console.log(response, "newwwwwwwwwwwwwwwww admin");
          if (response.data.success) {
            localStorage.setItem("admin-refToken", response.data.refreshToken);
          }
        } else {
          const refToken = await localStorage.getItem("refToken");
          console.log("refToken user", refToken);
          const response = await axios.post(
            "/refresh-token",
            { refToken },
            { withCredentials: true }
          );
          console.log(response, "newwwwwwwwwwwwwwwww user");
          if (response.data.success) {
            localStorage.setItem("refToken", response.data.refreshToken);
          }
        }
      } catch (error) {
        console.log(error, "qwerty");
        Swal.fire({
          title: error.response.data.message.name,
          text: error.message + " (Please login again...)",
        }).then(() => {
          // localStorage.removeItem('refToken')
          // localStorage.removeItem('admin-refToken')
          localStorage.clear();

          window.location.href = "/";
        });

        return Promise.reject(error);
      }
      return axios(error.config);
    }
    return Promise.reject(error);
  }
);
