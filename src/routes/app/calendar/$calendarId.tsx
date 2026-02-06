import {createFileRoute, Link} from "@tanstack/react-router";
import {useSuspenseQuery} from "@tanstack/react-query";
import AgendaViewer from "@/components/agenda";
import {agendaQueryOptions} from "@/features/agendas/agenda-query-options";
import type {AgendaId} from "@/types/IAgenda";
import {Skeleton} from "@/components/ui/skeleton";
import {ChevronLeft, CalendarDays} from "lucide-react";

const Page = () => {
    const {calendarId} = Route.useParams();

    const {data: agenda} = useSuspenseQuery(
        agendaQueryOptions(calendarId as AgendaId)
    );

    return (
        <main className="px-4 lg:px-6 space-y-6">
            {/* Header */}
            <header className="flex flex-col gap-2">
                <Link
                    to="/app/calendar"
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary w-fit"
                >
                    <ChevronLeft className="h-4 w-4"/>
                    Calendriers
                </Link>

                <div className="flex items-center gap-3">
                    <CalendarDays className="h-6 w-6 text-primary"/>
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        {agenda?.name}
                    </h1>
                </div>
            </header>

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
        <Skeleton className="h-6 w-48"/>
        <Skeleton className="h-[500px] w-full rounded-lg"/>
    </main>
);

/**
 * Error boundary
 */
const ErrorComponent = () => (
    <main className="px-4 lg:px-6">
        <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
            Erreur lors du chargement du calendrier
        </div>
    </main>
);

export const Route = createFileRoute("/app/calendar/$calendarId")({
    component: Page,
    pendingComponent: Loading,
    errorComponent: ErrorComponent,
});
