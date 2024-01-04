export const save = (key, data) => {
  sessionStorage.setItem(key, data);
};

export const get = (key) => {
  sessionStorage.setItem(key, data);
};

export const saveToken = (key) => {
  sessionStorage.setItem("token", key);
};

export const getToken = () => {
  return sessionStorage.getItem("token");
};

export const getUser = () => {
  return sessionStorage.getItem("user");
};
export const getRol = () => {
  return sessionStorage.getItem("rol");
};

export const borrarSesion = () => {
  sessionStorage.clear();
};

export const estaSesion = () => {
  var token = sessionStorage.getItem("external");
  return token && (token != "undefined" || token != null || token != "null");
};


