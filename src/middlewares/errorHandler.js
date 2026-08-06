// Middleware bat loi tap trung - dat CUOI CUNG trong server.js
// Bat ky loi nao goi next(err) trong controller se roi vao day
export default function errorHandler(err, req, res, next) {
  console.error("[Error]", err);

  const status = err.status || 500;
  const message = err.message || "Da co loi xay ra o server";

  res.status(status).json({ message });
}
