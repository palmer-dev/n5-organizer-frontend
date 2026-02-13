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
import {CalendarDays, Users, CheckCircle, Clock, ArrowRight, Calendar} from "lucide-react";
import {useSuspenseQuery} from "@tanstack/react-query";
import {dashboardStatsQueryOptions} from "@/features/dashboard/dashboard-stats-query-options.ts";
import {dashboardUpcomingQueryOptions} from "@/features/dashboard/dashboard-upcoming-query-options.ts";
import AppointmentStatusType from "@/types/AppointmentStatusType.ts";
import {agendasQueryOptions} from "@/features/agendas/agendas-query-options.ts";
import type {ReactNode} from "react";
import {DashboardSkeleton} from "@/components/dashboard/dashboard-skeleton";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import moment from "moment/min/moment-with-locales";
import {useAuthUser} from "@/hooks/use-auth-user.ts";

moment.locale("fr");

interface StatCardProps {
    title: string;
    value: number;
    icon: ReactNode;
    gradient: string;
}

function StatCard({title, value, icon, gradient}: StatCardProps) {
    return (
        <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className={`absolute top-0 right-0 w-32 h-32 ${gradient} opacity-10 rounded-full -mr-16 -mt-16`}/>
            <CardHeader className="relative">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className="text-3xl font-bold">{value}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${gradient} bg-opacity-10`}>
                        {icon}
                    </div>
                </div>
            </CardHeader>
        </Card>
    );
}

function Page() {
    const navigate = useNavigate();
    const {user} = useAuthUser();

    const {data: agendaStats} = useSuspenseQuery(dashboardStatsQueryOptions());
    const {data: agendaUpcoming} = useSuspenseQuery(dashboardUpcomingQueryOptions());
    const {data: agendas} = useSuspenseQuery(agendasQueryOptions);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Bonjour";
        if (hour < 18) return "Bon après-midi";
        return "Bonsoir";
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const stats = [
        {
            title: "RDV cette semaine",
            value: agendaStats?.appointmentsThisWeek ?? 0,
            icon: <CalendarDays className="w-5 h-5"/>,
            gradient: "bg-blue-500"
        },
        {
            title: "RDV à valider",
            value: agendaStats?.waitingValidation ?? 0,
            icon: <Clock className="w-5 h-5"/>,
            gradient: "bg-amber-500"
        },
        {
            title: "Collaborateurs actifs",
            value: agendaStats?.activeCollaborators ?? 0,
            icon: <Users className="w-5 h-5"/>,
            gradient: "bg-green-500"
        },
        {
            title: "Calendriers principaux",
            value: agendaStats?.mainCalendars ?? 0,
            icon: <CheckCircle className="w-5 h-5"/>,
            gradient: "bg-purple-500"
        },
    ];

    return (
        <div className="space-y-8 px-4 lg:px-6">
            {/* Header avec greeting personnalisé */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    {getGreeting()}, {user?.fullName || 'Utilisateur'} 👋
                </h1>
                <p className="text-muted-foreground">
                    Voici un aperçu de votre activité du {moment().format('dddd D MMMM YYYY')}
                </p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((s) => (
                    <StatCard key={s.title} {...s} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Appointments */}
                <Card className="lg:col-span-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-xl font-semibold">Prochains rendez-vous</CardTitle>
                        <Calendar className="h-5 w-5 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {agendaUpcoming.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <CalendarDays className="h-12 w-12 mx-auto mb-2 opacity-50"/>
                                <p>Aucun rendez-vous à venir</p>
                            </div>
                        ) : (
                            agendaUpcoming.map((a, i) => (
                                <div
                                    key={i}
                                    className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                                >
                                    <Avatar className="h-10 w-10 mt-0.5">
                                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                            {getInitials(a.collaborator)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="font-semibold text-sm truncate">{a.name}</p>
                                            <Badge
                                                variant={a.status.is(AppointmentStatusType.Validated) ? "default" : a.status.is(AppointmentStatusType.Pending) ? "outline" : "destructive"}
                                                className="shrink-0"
                                            >
                                                {a.status.toString()}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            <Users className="inline h-3 w-3 mr-1"/>
                                            {a.collaborator}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            <Clock className="inline h-3 w-3 mr-1"/>
                                            {a.time}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button
                            onClick={() => navigate({to: '/app/calendar'})}
                            variant="ghost"
                            size="sm"
                            className="w-full group"
                        >
                            Voir tous les rendez-vous
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"/>
                        </Button>
                    </CardFooter>
                </Card>

                {/* Favorite Calendars */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Vos calendriers</h2>
                        <Badge variant="secondary">{agendas.length}</Badge>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {agendas.map((c) => (
                            <Card
                                key={c.id}
                                className="group hover:shadow-md transition-all hover:border-primary/50 cursor-pointer"
                                onClick={() => navigate({to: '/app/calendar/$calendarId', params: {calendarId: c.id}})}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1 flex-1">
                                            <CardTitle className="text-base group-hover:text-primary transition-colors">
                                                {c.name}
                                            </CardTitle>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                <Users className="h-3 w-3"/>
                                                {c.user?.fullName}
                                            </p>
                                        </div>
                                        <ArrowRight
                                            className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1"/>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1.5 text-sm">
                                            <div className="h-2 w-2 rounded-full bg-blue-500"/>
                                            <span className="font-semibold">{c.stats?.appointmentsThisWeek ?? 0}</span>
                                            <span className="text-muted-foreground">RDV cette semaine</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}


export const Route = createFileRoute('/app/dashboard/')({
    component: Page,
    pendingComponent: DashboardSkeleton,
})