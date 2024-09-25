/**
 * Custom Errors
 */

export const AUTHENTICATION_ERROR_MESSAGE =
  "You must be logged in to view this content";

export const AuthenticationError = class AuthenticationError extends Error {
    constructor() {
        super(AUTHENTICATION_ERROR_MESSAGE);
        this.name = "AuthenticationError";
    }
};

export const MISSING_MQ_URL_ERROR_MESSAGE = 
  "Missing URL of Message Queue";


export const MissingMQURLError = class MissingMQURLError extends Error {
  constructor() {
      super(MISSING_MQ_URL_ERROR_MESSAGE);
      this.name = "MissingMQURLError";
  }
};