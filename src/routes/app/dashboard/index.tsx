import {createFileRoute, useNavigate} from "@tanstack/react-router";

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {CalendarDays, Users, CheckCircle, Clock} from "lucide-react";
import {useSuspenseQuery} from "@tanstack/react-query";
import {dashboardStatsQueryOptions} from "@/features/dashboard/dashboard-stats-query-options.ts";
import {dashboardUpcomingQueryOptions} from "@/features/dashboard/dashboard-upcoming-query-options.ts";
import AppointmentStatusType from "@/types/AppointmentStatusType.ts";
import {agendasQueryOptions} from "@/features/agendas/agendas-query-options.ts";
import type {ReactNode} from "react";
import {DashboardSkeleton} from "@/components/dashboard/dashboard-skeleton";

interface StatCardProps {
    title: string;
    value: number;
    icon: ReactNode;
}

function StatCard({title, value, icon}: StatCardProps) {
    return (
        <Card>
            <CardHeader>
                <div className={"flex justify-between"}>
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <div className="text-primary">{icon}</div>
                </div>
                <p className="text-2xl font-bold">{value}</p>

            </CardHeader>

        </Card>
    );
}

function Page() {
    const navigate = useNavigate();

    const {data: agendaStats} = useSuspenseQuery(dashboardStatsQueryOptions());
    const {data: agendaUpcoming} = useSuspenseQuery(dashboardUpcomingQueryOptions());
    const {data: agendas} = useSuspenseQuery(agendasQueryOptions);

    // Mock data
    const stats = [
        {
            title: "RDV cette semaine",
            value: agendaStats?.appointmentsThisWeek ?? 0,
            icon: <CalendarDays className="w-6 h-6"/>
        },
        {
            title: "RDV à valider",
            value: agendaStats?.waitingValidation ?? 0,
            icon: <Clock className="w-6 h-6"/>
        },
        {
            title: "Collaborateurs actifs",
            value: agendaStats?.activeCollaborators ?? 0,
            icon: <Users className="w-6 h-6"/>
        },
        {
            title: "Calendriers principaux",
            value: agendaStats?.mainCalendars ?? 0,
            icon: <CheckCircle className="w-6 h-6"/>
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-6 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            <h1 className="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                Dashboard
            </h1>

            {/* Stats cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 col-span-full">
                {stats.map((s) => (
                    <StatCard key={s.title} {...s} />
                ))}
            </div>

            {/* Upcoming Appointments */}
            <div className="col-span-full lg:col-span-2 space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Prochains RDV</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {agendaUpcoming.map((a, i) => (
                            <div
                                key={i}
                                className="flex justify-between items-center p-2 border-b last:border-b-0"
                            >
                                <div>
                                    <p className="font-medium">{a.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {a.collaborator} • {a.time}
                                    </p>
                                </div>
                                <Badge variant={a.status.is(AppointmentStatusType.Validated) ? "default" : "secondary"}>
                                    {a.status.toString()}
                                </Badge>
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter>
                        <Button onClick={() => navigate({to: '/app/calendar'})} variant="outline" size="sm">
                            Voir tous les RDV
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            {/* Favorite Calendars */}
            <div className="col-span-full lg:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {agendas.map((c, i) => (
                    <Card key={i} className="group hover:shadow-md transition">
                        <CardHeader>
                            <CardTitle>{c.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{c.user?.fullName}</p>
                        </CardHeader>
                        <CardContent>
                            <p>{c.stats?.appointmentsThisWeek ?? 0} RDV cette semaine</p>
                        </CardContent>
                        <CardFooter>
                            <Button
                                onClick={() => navigate({to: '/app/calendar/$calendarId', params: {calendarId: c.id}})}
                                variant="outline" size="sm" className="w-full">
                                Ouvrir le calendrier
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}


export const Route = createFileRoute('/app/dashboard/')({
    component: Page,
    pendingComponent: DashboardSkeleton,
})