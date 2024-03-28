import axios from "./Axios";

export const menuView = (tableID) => axios.get(`/menu-view/${tableID}`);
export const createOrder = (tableID, orderDetails) =>
  axios.post(`/create-order/${tableID}/order`, orderDetails);
export const updateOrderStatus = (orderID, status, time) =>
  axios.put(`/update-order-status/${orderID}`, { status, time });
export const getOrderDetails = () => axios.get(`/get-order-details`);
export const getOrderDetailsForManager = () =>
  axios.get(`/get-order-details-manager`);

export const getOrderDetailsToKitchen = () =>
  axios.get(`/get-order-details-to-kitchen`);
