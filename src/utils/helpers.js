


export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}



export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US').format(new Date(date));
}



export function formatDateTime(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}



export function truncateText(text, length = 50) {
  if (text.length > length) {
    return text.substring(0, length) + '...';
  }
  return text;
}



export function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}



export function snakeCaseToTitleCase(str) {
  return str
    .split('_')
    .map((word) => capitalizeFirstLetter(word))
    .join(' ');
}



export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}



export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
