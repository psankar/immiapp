const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "http://5.75.232.227/api"
    : "http://localhost:8080";

export default BASE_URL;
