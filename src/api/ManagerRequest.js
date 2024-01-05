// import axios from "./Axios";

import { axiosPrivate } from "./AxiosPrivate";

export const managerDashboard = () => axiosPrivate.get(`/manager-dashboard`);

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

export const assignTablesToWaiter = (waiterID, tableIDs) =>
  axiosPrivate.put(`/assign-tables/${waiterID}`, { tableIDs });

export const editWaiter = (waiterID, details) =>
  axiosPrivate.put(`/edit-waiter/${waiterID}`, details);

export const createKitchenStaff = (menuCardID, details) =>
  axiosPrivate.post(`/create-kitchen-staff/${menuCardID}`, details);

export const editKitchenStaff = (kitchenStaffID, details) =>
  axiosPrivate.put(`/edit-kitchen-staff/${kitchenStaffID}`, details);

export const viewAllKitchenStaff = () =>
  axiosPrivate.get(`/all-kitchen-staffs`);
