import {createFileRoute, useNavigate} from "@tanstack/react-router";
import {useSuspenseQuery} from "@tanstack/react-query";
import {agendasQueryOptions} from "@/features/agendas/agendas-query-options";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {
    ArrowRight,
    CalendarDays,
    User,
    CalendarCheck,
    Clock,
} from "lucide-react";
import {CalendarsSkeleton} from "@/components/agenda/calendars-skeleton.tsx";

function Page() {
    const {data: agendas} = useSuspenseQuery(agendasQueryOptions);
    const navigate = useNavigate();

    return (
        <div className="px-4 lg:px-6 space-y-8">
            {/* Header amélioré */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Vos calendriers
                    </h1>
                    <Badge variant="secondary" className="text-base px-3 py-1">
                        {agendas.length} {agendas.length > 1 ? 'calendriers' : 'calendrier'}
                    </Badge>
                </div>
                <p className="text-muted-foreground">
                    Gérez et consultez tous vos calendriers en un seul endroit
                </p>
            </div>

            {/* État vide */}
            {agendas.length === 0 && (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="p-4 rounded-full bg-primary/10 mb-4">
                            <CalendarDays className="h-10 w-10 text-primary"/>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Aucun calendrier disponible</h3>
                        <p className="text-sm text-muted-foreground max-w-md">
                            Vous n'avez pas encore de calendrier. Contactez votre administrateur pour en créer un.
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Grille des calendriers */}
            <div className="grid grid-cols-1 gap-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
                {agendas.map((agenda) => (
                    <Card
                        key={`agenda-${agenda.id}`}
                        role="button"
                        tabIndex={0}
                        onClick={() =>
                            navigate({
                                to: "/app/calendar/$calendarId",
                                params: {calendarId: agenda.id},
                            })
                        }
                        className="
              group cursor-pointer
              transition-all duration-300
              hover:shadow-lg
              hover:border-primary/50
              hover:-translate-y-1
              focus-visible:ring-2 focus-visible:ring-primary
              flex flex-col
              relative overflow-hidden
            "
                    >
                        {/* Gradient décoratif */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-5 rounded-full -mr-16 -mt-16 transition-opacity group-hover:opacity-10"/>

                        <CardHeader className="space-y-4 relative">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="p-2.5 rounded-lg bg-primary/10 shrink-0">
                                        <CalendarDays className="h-5 w-5 text-primary"/>
                                    </div>
                                    <CardTitle className="text-lg leading-tight truncate group-hover:text-primary transition-colors">
                                        {agenda.name}
                                    </CardTitle>
                                </div>
                                <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1 shrink-0 ml-2"/>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground pl-[46px]">
                                <User className="h-4 w-4"/>
                                <span className="truncate">{agenda.user?.fullName ?? "Non assigné"}</span>
                            </div>
                        </CardHeader>

                        <CardContent className="flex-1 space-y-3 relative">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
                                    <div className="flex items-center gap-2">
                                        <CalendarCheck className="h-4 w-4 text-blue-600 dark:text-blue-400"/>
                                        <span className="text-sm text-muted-foreground">Cette semaine</span>
                                    </div>
                                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                        {agenda.stats?.appointmentsThisWeek ?? 0}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400"/>
                                        <span className="text-sm text-muted-foreground">En attente</span>
                                    </div>
                                    <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                                        {agenda.stats?.waitingValidation ?? 0}
                                    </span>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="pt-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                            >
                                Ouvrir le calendrier
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export const Route = createFileRoute("/app/calendar/")({
    component: Page,
    pendingComponent: CalendarsSkeleton
});
