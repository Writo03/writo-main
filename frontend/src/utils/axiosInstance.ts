import axios from "axios";

const axiosInstance = axios.create({
    baseURL : "http://localhost:8080/api/v1",
    headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Fetch here for fresh token
        "Content-Type": "application/json",
      },
})

export default axiosInstance