// import axios from "./Axios";

import { axiosPrivate } from "./AxiosPrivate";

export const createMenuCard = (details) =>
  axiosPrivate.post(`/create-menu-card`, details);

export const editMenuCard = (menuCardID, details) =>
  axiosPrivate.put(`/edit-menu-card/${menuCardID}`, details);

export const viewAllMenuCards = () => axiosPrivate.get(`/all-menu-cards`);

export const createTable = (menuCardID, details) =>
  axiosPrivate.post(`/create-table/${menuCardID}`, details);

export const editTable = (tableID, details) =>
  axiosPrivate.put(`/edit-table/${tableID}`, details);

export const viewAllTables = () => axiosPrivate.get(`/all-tables`);

export const createWaiter = (menucardID, details) =>
  axiosPrivate.post(`/create-waiter/${menucardID}`, details);

export const viewAllWaiters = () => axiosPrivate.get(`/all-waiters`);

export const editWaiter = (waiterID, details) =>
  axiosPrivate.put(`/edit-waiter/${waiterID}`, details);
