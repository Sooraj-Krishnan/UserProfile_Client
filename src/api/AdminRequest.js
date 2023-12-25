import axios from "./Axios";

import { axiosPrivate } from "./AxiosPrivate";

/*-----------------------------Auth Routes -------------------------------*/

export const login = (loginData) => axios.post("/login", loginData);

export const forgotPassword = (mail) => axios.post(`/forgot_password`, mail);

export const updateNewPassword = (pass, token) =>
  axios.put(`/update_new_password`, { pass, token });

export const logout = (refToken) => axios.post("/logout", { refToken });

/*-----------------------------Other Routes -------------------------------*/

export const createManager = (details) =>
  axiosPrivate.post(`/create-manager`, details);

export const editManager = (managerID, details) =>
  axiosPrivate.put(`/edit-manager/${managerID}`, details);

export const viewManagers = () => axiosPrivate.get(`/view-managers`);

export const blockManager = (managersID) =>
  axiosPrivate.put(`/block-manager/${managersID}`);

export const deleteManager = (managersID) =>
  axiosPrivate.put(`/delete-manager/${managersID}`);
