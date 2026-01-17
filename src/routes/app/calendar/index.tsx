import {createFileRoute, Link} from "@tanstack/react-router";
import {useSuspenseQuery} from '@tanstack/react-query'
import {agendasQueryOptions} from "@/features/agendas/agendas-query-options.ts";


function Page() {
    const agendasQuery = useSuspenseQuery(agendasQueryOptions)
    const agendas = agendasQuery.data

    return (
        <div
            className={"grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4"}>
            <h1 className={"text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight"}>Calendrier</h1>

            <div className="col-span-full flex gap-4">
                {agendas.map((agenda, index) => (
                    <Link to={'/app/calendar/$calendarId'} params={{'calendarId': agenda.id}} key={index}>
                        {agenda.name}
                    </Link>
                ))}
            </div>
        </div>
    )
}


export const Route = createFileRoute('/app/calendar/')({
    component: Page,
})