/**
 * Build Query String
 * @param {Object} params
 * @returns {string}
 */
export function buildQueryString(params) {
  const sp = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    if (params[key] !== null && params[key] !== undefined) {
      sp.append(key, params[key]);
    }
  });
  return sp.toString();
}

/**
 * Parse Query String
 * @param {string} queryString
 * @returns {Object}
 */
export function parseQueryString(queryString) {
  const params = new URLSearchParams(queryString);
  const result = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

/**
 * Serialize Form Data
 * @param {Object} data
 * @returns {FormData}
 */
export function serializeFormData(data) {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });
  return formData;
}
