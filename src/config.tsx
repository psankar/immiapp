const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "http://immi.fun/api"
    : "http://localhost:8080";

export default BASE_URL;
