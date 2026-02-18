/**
 * Handle API Errors
 * Normalizes error responses from API
 * @param {Object} error - Axios error object
 * @returns {Object} Normalized error object
 */
export function handleApiError(error) {
  if (error.response) {
    // Server responded with error status
    return {
      status: error.response.status,
      message: error.response.data?.detail || 'An error occurred',
      data: error.response.data,
    };
  } else if (error.request) {
    // Request made but no response
    return {
      status: null,
      message: 'No response from server',
      data: null,
    };
  } else {
    // Error in request setup
    return {
      status: null,
      message: error.message,
      data: null,
    };
  }
}

/**
 * Get Error Message
 * @param {Object} error
 * @returns {string}
 */
export function getErrorMessage(error) {
  if (typeof error === 'string') {
    return error;
  }
  if (error?.message) {
    return error.message;
  }
  if (error?.data?.detail) {
    return error.data.detail;
  }
  return 'An unexpected error occurred';
}

/**
 * Is Network Error
 * @param {Object} error
 * @returns {boolean}
 */
export function isNetworkError(error) {
  return !error.response && error.request;
}

/**
 * Is Server Error
 * @param {Object} error
 * @returns {boolean}
 */
export function isServerError(error) {
  return error.response?.status >= 500;
}

/**
 * Is Client Error
 * @param {Object} error
 * @returns {boolean}
 */
export function isClientError(error) {
  return error.response?.status >= 400 && error.response?.status < 500;
}
