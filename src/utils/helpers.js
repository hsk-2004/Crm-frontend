/**
 * Format Currency
 * @param {number} amount
 * @param {string} currency
 * @returns {string}
 */
export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format Date
 * @param {Date|string} date
 * @returns {string}
 */
export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US').format(new Date(date));
}

/**
 * Format DateTime
 * @param {Date|string} date
 * @returns {string}
 */
export function formatDateTime(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

/**
 * Truncate Text
 * @param {string} text
 * @param {number} length
 * @returns {string}
 */
export function truncateText(text, length = 50) {
  if (text.length > length) {
    return text.substring(0, length) + '...';
  }
  return text;
}

/**
 * Capitalize First Letter
 * @param {string} str
 * @returns {string}
 */
export function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert snake_case to Title Case
 * @param {string} str
 * @returns {string}
 */
export function snakeCaseToTitleCase(str) {
  return str
    .split('_')
    .map((word) => capitalizeFirstLetter(word))
    .join(' ');
}

/**
 * Validate Email
 * @param {string} email
 * @returns {boolean}
 */
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Sleep for given milliseconds
 * @param {number} ms
 * @returns {Promise}
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
