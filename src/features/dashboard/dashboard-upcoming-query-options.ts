import {queryOptions} from '@tanstack/react-query'
import {DashboardService} from "@/services/dashboard.service.ts";

export const dashboardUpcomingQueryOptions = () =>
    queryOptions({
        queryKey: ['dashboard-upcoming'],
        queryFn: () => new DashboardService().getUpcoming(),
    })