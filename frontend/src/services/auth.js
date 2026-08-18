// =====================================================
// AUTHENTICATION HELPERS
// =====================================================


export const getToken = () => {
  return localStorage.getItem("jwt");
};


export const getUsername = () => {
  return localStorage.getItem("username");
};


export const getUserId = () => {
  return localStorage.getItem("userId");
};


export const getRoles = () => {

  const roles = localStorage.getItem("role");

  if (!roles) {
    return [];
  }

  try {
    return JSON.parse(roles);
  } catch {
    return [];
  }
};


export const hasRole = (role) => {

  const roles = getRoles();

  return roles.includes(role);
};


export const isLoggedIn = () => {
  return !!getToken();
};


export const logout = () => {

  localStorage.removeItem("jwt");
  localStorage.removeItem("username");
  localStorage.removeItem("userId");
  localStorage.removeItem("role");

  window.location.href = "/login";
};