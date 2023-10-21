const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://example.com"
    : "http://localhost:8080";

export default BASE_URL;
