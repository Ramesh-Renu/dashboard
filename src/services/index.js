import api from "BaseApp/API";
import { API } from "constant/service";

/** DASHBOARD */
export const getDashboard = params => api.POST(API.GET_DASHBOARD, params);
export const getDashboardCardListing = params => api.POST(API.GET_DASHBOARD_CARD_LIST, params);