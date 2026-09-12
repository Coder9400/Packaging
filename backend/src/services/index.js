/**
 * Service Layer Layer Entry Point
 * Business logic helper modules (e.g. email notifications, ESG metrics calculation)
 */

export const formatResponse = (data, message = 'Success') => {
  return {
    success: true,
    message,
    data,
  };
};
