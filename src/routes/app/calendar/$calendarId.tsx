// src/routes/posts/$postId.tsx
import {createFileRoute} from '@tanstack/react-router'
import {useSuspenseQuery} from "@tanstack/react-query";
import AgendaViewer from "@/components/agenda";
import {agendaQueryOptions} from "@/features/agendas/agenda-query-options.ts";

const startOfToday = new Date();
startOfToday.setHours(0, 0, 0, 0);


const Page = () => {
    const {calendarId} = Route.useParams()

    const {data: agenda, isLoading, isError} = useSuspenseQuery(agendaQueryOptions(calendarId))

    if (isLoading) {
        return <div>Chargement..</div>
    }

    if (isError) {
        return <div>Erreur lors du chargement du calendrier</div>;
    }

    return (
        <main
            className={"grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4"}>

            <h1 className={"text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight"}>Agenda {agenda?.name}</h1>

            <AgendaViewer calendarId={calendarId}/>
        </main>
    )
}

export const Route = createFileRoute('/app/calendar/$calendarId')({
    component: Page,
})