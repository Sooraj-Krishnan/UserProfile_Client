// import axios from "./Axios";

import { axiosPrivate } from "./AxiosPrivate";

export const createMenuCard = (details) =>
  axiosPrivate.post(`/create-menu-card`, details);

export const editMenuCard = (menuCardID, details) =>
  axiosPrivate.put(
    `/edit-menu-card/${menuCardID}`,
    details
  );

export const viewAllMenuCards = () =>
  axiosPrivate.get(`/all-menu-cards`);

export const createWaiter = (details) =>
  axiosPrivate.post(`/create-waiter`, details);

export const editWaiter = (waiterID, details) =>
  axiosPrivate.put(`/edit-waiter/${waiterID}`, details);

