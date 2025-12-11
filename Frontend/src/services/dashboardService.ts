import axiosClient from '../api/axiosClient';

export const dashboardService = {
    getStats: async () => {
        const res = await axiosClient.get('/dashboard/stats');
        return res.data;
    },
    getRevenueChart: async () => {
        const res = await axiosClient.get('/dashboard/revenue-chart');
        return res.data;
    }
};