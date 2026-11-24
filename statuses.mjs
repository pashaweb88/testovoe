export const HttpStatus = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

export const Status = {
  READY: "ready",
  INVALID_INPUT: "invalid_input",
  MANUAL_REVIEW: "manual_review",
  NOT_FOUND: "not_found",
  SERVER_ERROR: "server_error",
};

export const AllowedTopics = new Set(["delivery", "pricing", "other"]);

export const MODEL_TIMEOUT_MS = 300;
