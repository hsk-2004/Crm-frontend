/**
 * Type Definitions (JSDoc format)
 *
 * @typedef {Object} User
 * @property {number} id
 * @property {string} email
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} phone_number
 * @property {string} profile_picture
 * @property {Date} created_at
 * @property {Date} updated_at
 *
 * @typedef {Object} Organization
 * @property {number} id
 * @property {string} name
 * @property {string} slug
 * @property {string} description
 * @property {string} website
 * @property {string} logo
 * @property {Date} created_at
 * @property {Date} updated_at
 *
 * @typedef {Object} Lead
 * @property {number} id
 * @property {number} organization
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} email
 * @property {string} phone
 * @property {string} company
 * @property {string} status
 * @property {string} source
 * @property {Date} created_at
 * @property {Date} updated_at
 *
 * @typedef {Object} Client
 * @property {number} id
 * @property {number} organization
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string} website
 * @property {number} account_manager
 * @property {Date} created_at
 * @property {Date} updated_at
 *
 * @typedef {Object} Team
 * @property {number} id
 * @property {number} organization
 * @property {string} name
 * @property {string} description
 * @property {Date} created_at
 * @property {Date} updated_at
 *
 * @typedef {Object} Subscription
 * @property {number} id
 * @property {number} organization
 * @property {number} plan
 * @property {string} status
 * @property {Date} start_date
 * @property {Date} end_date
 * @property {Date} created_at
 * @property {Date} updated_at
 *
 * @typedef {Object} AuthContextType
 * @property {User|null} user
 * @property {boolean} loading
 * @property {string|null} error
 * @property {boolean} isAuthenticated
 * @property {Function} login
 * @property {Function} logout
 * @property {Function} register
 * @property {Function} updateProfile
 */

export {};
