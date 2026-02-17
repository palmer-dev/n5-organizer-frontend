import {createFileRoute, Link} from "@tanstack/react-router";
import {useSuspenseQuery} from "@tanstack/react-query";
import AgendaViewer from "@/components/agenda";
import {agendaQueryOptions} from "@/features/agendas/agenda-query-options";
import type {AgendaId} from "@/types/IAgenda";
import {Skeleton} from "@/components/ui/skeleton";
import {ChevronLeft, CalendarDays, CalendarCheck, Clock, Calendar} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";

const Page = () => {
    const {calendarId} = Route.useParams();

    const {data: agenda} = useSuspenseQuery(
        agendaQueryOptions(calendarId as AgendaId)
    );

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <main className="px-4 lg:px-6 space-y-6">
            {/* Header amélioré */}
            <header className="space-y-4">
                <Link
                    to="/app/calendar"
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary w-fit transition-colors"
                >
                    <ChevronLeft className="h-4 w-4"/>
                    Retour aux calendriers
                </Link>

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                            <CalendarDays className="h-7 w-7 text-primary"/>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-3xl font-bold tracking-tight">
                                    {agenda?.name}
                                </h1>
                                <Badge variant="secondary" className="text-sm">
                                    {agenda?.type.toString()}
                                </Badge>
                            </div>
                            {agenda?.user && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Avatar className="h-6 w-6">
                                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                            {getInitials(agenda.user.fullName)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm">{agenda.user.fullName}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Section statistiques */}
            {agenda?.stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-5 rounded-full -mr-16 -mt-16"/>
                        <CardHeader className="relative pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Cette semaine
                                </CardTitle>
                                <div className="p-2 rounded-lg bg-blue-500/10">
                                    <CalendarCheck className="h-5 w-5 text-blue-600 dark:text-blue-400"/>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="relative">
                            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                {agenda.stats.appointmentsThisWeek ?? 0}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                rendez-vous planifiés
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 opacity-5 rounded-full -mr-16 -mt-16"/>
                        <CardHeader className="relative pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    En attente
                                </CardTitle>
                                <div className="p-2 rounded-lg bg-amber-500/10">
                                    <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400"/>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="relative">
                            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                                {agenda.stats.waitingValidation ?? 0}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                à valider
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300 sm:col-span-2 lg:col-span-1">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-5 rounded-full -mr-16 -mt-16"/>
                        <CardHeader className="relative pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Calendrier
                                </CardTitle>
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <Calendar className="h-5 w-5 text-primary"/>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="relative">
                            <p className="text-3xl font-bold">
                                {(agenda.stats.appointmentsThisWeek ?? 0) + (agenda.stats.waitingValidation ?? 0)}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                total des événements
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Contenu principal */}
            <AgendaViewer calendarId={calendarId as AgendaId}/>
        </main>
    );
};

/**
 * Fallback Suspense
 */
const Loading = () => (
    <main className="px-4 lg:px-6 space-y-6">
        {/* Header skeleton */}
        <header className="space-y-4">
            <Skeleton className="h-4 w-36"/>
            <div className="flex items-start gap-4">
                <Skeleton className="h-16 w-16 rounded-xl"/>
                <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-48"/>
                        <Skeleton className="h-6 w-20 rounded-full"/>
                    </div>
                    <Skeleton className="h-5 w-32"/>
                </div>
            </div>
        </header>

        {/* Stats skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({length: 3}).map((_, i) => (
                <Card key={i} className="relative overflow-hidden">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-24"/>
                            <Skeleton className="h-9 w-9 rounded-lg"/>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-9 w-16 mb-2"/>
                        <Skeleton className="h-3 w-32"/>
                    </CardContent>
                </Card>
            ))}
        </div>

        {/* AgendaViewer skeleton */}
        <section className="space-y-6">
            {/* Header AgendaViewer skeleton */}
            <div className="p-6 rounded-lg border bg-gradient-to-r from-primary/5 to-primary/10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2.5">
                            <Skeleton className="h-7 w-7 rounded-md"/>
                            <Skeleton className="h-6 w-56"/>
                        </div>
                        <Skeleton className="h-4 w-full max-w-2xl"/>
                        <Skeleton className="h-4 w-3/4 max-w-xl"/>
                    </div>
                    <Skeleton className="h-10 w-48 rounded-md"/>
                </div>
            </div>

            {/* Calendar skeleton */}
            <div className="rounded-xl border bg-card shadow-md overflow-hidden">
                <div className="p-4 sm:p-6">
                    {/* Toolbar */}
                    <div className="flex items-center justify-between mb-4">
                        <Skeleton className="h-8 w-32"/>
                        <div className="flex gap-2">
                            <Skeleton className="h-8 w-20"/>
                            <Skeleton className="h-8 w-20"/>
                            <Skeleton className="h-8 w-20"/>
                        </div>
                    </div>
                    {/* Calendar grid */}
                    <Skeleton className="h-[650px] w-full rounded-lg"/>
                </div>
            </div>
        </section>
    </main>
);

/**
 * Error boundary
 */
const ErrorComponent = () => (
    <main className="px-4 lg:px-6 flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-4 rounded-full bg-destructive/10 mb-4">
                    <CalendarDays className="h-12 w-12 text-destructive"/>
                </div>
                <h3 className="text-xl font-semibold mb-2">Calendrier introuvable</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                    Le calendrier que vous recherchez n'existe pas ou vous n'avez pas les permissions pour y accéder.
                </p>
                <Link to="/app/calendar">
                    <Badge variant="outline" className="cursor-pointer hover:bg-accent px-4 py-2">
                        <ChevronLeft className="h-4 w-4 mr-1"/>
                        Retour aux calendriers
                    </Badge>
                </Link>
            </CardContent>
        </Card>
    </main>
);

export const Route = createFileRoute("/app/calendar/$calendarId")({
    component: Page,
    pendingComponent: Loading,
    errorComponent: ErrorComponent,
});
