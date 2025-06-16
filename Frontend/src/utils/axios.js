import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "https://afterink-agency-dashboard.vercel.app"
    : "https://afterink-agency-dashboard.vercel.app";

const instance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default instance;
