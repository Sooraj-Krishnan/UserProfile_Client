import axios from "./Axios";

export const menuView = (tableID) => axios.get(`/menu-view/${tableID}`);
