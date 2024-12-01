// middleware/notFound.js
import ApiResponse from "../utils/ApiResponse.js";

export const notFound = (req, res, next) => {
  return res
    .status(404)
    .json(
      ApiResponse.error(`Resource not found at '${req.originalUrl}'.`, 404)
    );
};
