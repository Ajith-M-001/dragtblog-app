class ApiResponse {
  constructor(statusCode, data, message = "Success", errors = null) {
    this.statusCode = statusCode;
    this.status = statusCode < 400 ? "success" : "error";
    this.message = message;
    this.data = data;
    this.errors = errors; // Include errors field for error responses
  }

  static success(data, message = "Success", statusCode = 200) {
    return new ApiResponse(statusCode, data, message);
  }

  static error(message = "Error", statusCode = 500, errors = null) {
    return new ApiResponse(statusCode, null, message, errors);
  }
}

export default ApiResponse;
