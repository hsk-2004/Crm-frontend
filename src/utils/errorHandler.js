


export function handleApiError(error) {
  if (error.response) {
    
    return {
      status: error.response.status,
      message: error.response.data?.detail || 'An error occurred',
      data: error.response.data,
    };
  } else if (error.request) {
    
    return {
      status: null,
      message: 'No response from server',
      data: null,
    };
  } else {
    
    return {
      status: null,
      message: error.message,
      data: null,
    };
  }
}



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



export function isNetworkError(error) {
  return !error.response && error.request;
}



export function isServerError(error) {
  return error.response?.status >= 500;
}



export function isClientError(error) {
  return error.response?.status >= 400 && error.response?.status < 500;
}
