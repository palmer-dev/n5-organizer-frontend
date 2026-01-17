import {createFileRoute} from "@tanstack/react-router";

function Page() {
    return (
        <div
            className={"grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4"}>

            <h1 className={"text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight"}>Dashboard</h1>

            <div className={'flex flex-col flex-1 col-span-full'}>

            </div>
        </div>
    )
}


export const Route = createFileRoute('/app/dashboard/')({
    component: Page,
})