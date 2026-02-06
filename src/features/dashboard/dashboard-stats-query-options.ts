import {queryOptions} from '@tanstack/react-query'
import {DashboardService} from "@/services/dashboard.service.ts";

export const dashboardStatsQueryOptions = () =>
    queryOptions({
        queryKey: ['dashboard-stats'],
        queryFn: () => new DashboardService().getStats(),
    })