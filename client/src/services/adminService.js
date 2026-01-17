import axios from "axios";

const API_URL = "http://localhost:5000/api/admin";

// Get auth token
const getAuthToken = () => {
    return sessionStorage.getItem("adminToken");
};

// Create axios instance with auth header
const axiosInstance = axios.create({
    baseURL: API_URL
});

axiosInstance.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Dashboard stats
export const getDashboardStats = async () => {
    const response = await axiosInstance.get("/stats");
    return response.data;
};

// Event management
export const createEvent = async (eventData) => {
    const response = await axiosInstance.post("/events", eventData);
    return response.data;
};

export const updateEvent = async (id, eventData) => {
    const response = await axiosInstance.put(`/events/${id}`, eventData);
    return response.data;
};

export const deleteEvent = async (id) => {
    const response = await axiosInstance.delete(`/events/${id}`);
    return response.data;
};

// Booking management
export const getAllBookings = async () => {
    const response = await axiosInstance.get("/bookings");
    return response.data;
};

export const cancelBooking = async (id) => {
    const response = await axiosInstance.delete(`/bookings/${id}`);
    return response.data;
};

// User management
export const getAllUsers = async () => {
    const response = await axiosInstance.get("/users");
    return response.data;
};

export default {
    getDashboardStats,
    createEvent,
    updateEvent,
    deleteEvent,
    getAllBookings,
    cancelBooking,
    getAllUsers
};
