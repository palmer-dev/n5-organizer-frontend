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
        <div className="px-4 lg:px-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                    Calendriers
                </h1>
            </div>

            {agendas.length === 0 && (
                <Card className="flex flex-col items-center justify-center py-12 text-center">
                    <CalendarDays className="h-10 w-10 text-muted-foreground mb-4"/>
                    <p className="text-sm text-muted-foreground">
                        Aucun calendrier disponible pour le moment
                    </p>
                </Card>
            )}

            <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
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
              transition-all
              hover:shadow-md
              hover:-translate-y-0.5
              focus-visible:ring-2 focus-visible:ring-primary
              flex flex-col justify-between
            "
                    >
                        <CardHeader className="space-y-3">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2 text-primary">
                                    <CalendarDays className="h-5 w-5"/>
                                    <CardTitle className="text-lg leading-tight">
                                        {agenda.name}
                                    </CardTitle>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <User className="h-4 w-4"/>
                                <span>{agenda.user?.fullName ?? "—"}</span>
                            </div>
                        </CardHeader>

                        <CardContent className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className="gap-1">
                                <CalendarCheck className="h-3.5 w-3.5"/>
                                <span className="font-medium">
                  {agenda.stats?.appointmentsThisWeek ?? 0}
                </span>
                                cette semaine
                            </Badge>

                            <Badge
                                variant="outline"
                                className="gap-1 border-orange-300 text-orange-700"
                            >
                                <Clock className="h-3.5 w-3.5"/>
                                <span className="font-medium">
                  {agenda.stats?.waitingValidation ?? 0}
                </span>
                                en attente
                            </Badge>
                        </CardContent>

                        <CardFooter>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-between text-primary"
                            >
                                Ouvrir le calendrier
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1"/>
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
