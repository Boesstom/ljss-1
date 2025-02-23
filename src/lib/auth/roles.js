// Authorized users and their roles
export const AUTHORIZED_USERS = [
  { email: 'admin@ljss.com', role: 'admin' },
  { email: 'cs@ljss.com', role: 'cs' },
  { email: 'manager@ljss.com', role: 'manager' }
];

// Function to get user role by email
export const getUserRoleByEmail = (email) => {
  const user = AUTHORIZED_USERS.find(user => user.email === email);
  return user ? user.role : null;
};

// Function to check if user has required role
export const hasRole = (userRole, requiredRole) => {
  return userRole === requiredRole;
};

// Function to check if email is authorized
export const isAuthorizedEmail = (email) => {
  return AUTHORIZED_USERS.some(user => user.email === email);
};